import { useState } from "react";
import type { Moment } from "../types/types";
import { Check, Clapperboard, Info, Play} from "lucide-react";
import {
  catalogue,
  continueWatching,
  featured,
  kidsAndFamily,
  topTen,
  trending,
} from "../data/catalogue";
import ContentRail from "../components/contents/ContentRail";
import Modal from "../components/contents/Modal";

export default function HomePage() {

   // Stores the currently active navigation item.
  const [activeNav, setActiveNav] = useState("Home");

   // Stores the movies/series that the user has added to My List.
  const [saved, setSaved] = useState<Moment[]>([]);
  
   // Stores the movie/series currently selected for details or playback.
  const [selected, setSelected] = useState<Moment | null>(null);

 // Stores which modal should be displayed: details, play, or no modal.
  const [modalMode, setModalMode] = useState<"details" | "play" | null>(null);
 
  // This makes it easy to check whether a particular item is saved.
  const savedIds = saved.map((moment) => moment.id);

  // Adds an item to My List if it isn't saved, or removes it if it is already saved.
  const toggleSaved = (moment: Moment) =>
    setSaved((current) =>
      current.some((item) => item.id === moment.id)
        ? current.filter((item) => item.id !== moment.id)
        : [...current, moment],
    );

     // Selects a movie/series and opens its details modal.
  const openDetails = (moment: Moment) => {
    setSelected(moment);
    setModalMode("details");
  };

   // Selects a movie/series and opens the playback modal.
  const playMoment = (moment: Moment) => {
    setSelected(moment);
    setModalMode("play");
  };

  // Builds the hero banner's background using gradient overlays and the featured backdrop image.
  const heroStyle = {
    backgroundImage: `linear-gradient(90deg, rgba(8,9,12,.97) 0%, rgba(8,9,12,.72) 35%, rgba(8,9,12,.12) 76%), linear-gradient(0deg, #08090c 0%, transparent 46%), url("${featured.backdrop}")`,
  };

  return (
    <div className="app-shell">
      <main id="home">
        {/* Top Hero Banner */}
        {activeNav === "Home" && (
          <section className="hero" style={heroStyle}>
            <div className="hero-content">
              <span className="hero-kicker">
                <Clapperboard size={13} /> {featured.eyebrow}
              </span>
              <h1>
                NIGHT
                <br />
                SHIFT<span className="hero-period">.</span>
              </h1>
              <div className="hero-meta">
                <span className="match-score">{featured.match}% Match</span>
                <span>{featured.year}</span>
                <span className="maturity">{featured.rating}</span>
                <span>{featured.seasons}</span>
                <span>4K UHD</span>
              </div>
              <p className="hero-description">{featured.description}</p>
              <div className="hero-actions">
                <button
                  className="button button-primary"
                  onClick={() => playMoment(featured)}
                >
                  <Play size={17} fill="currentColor" /> Play
                </button>
                <button
                  className="button button-secondary"
                  onClick={() => openDetails(featured)}
                >
                  <Info size={18} /> More Info
                </button>
                <button
                  className={`hero-list-button ${savedIds.includes(featured.id) ? "is-saved" : ""}`}
                  onClick={() => toggleSaved(featured)}
                >
                  {savedIds.includes(featured.id) ? <Check size={17} /> : "+"}{" "}
                  <span>
                    {savedIds.includes(featured.id) ? "In My List" : "My List"}
                  </span>
                </button>
              </div>
            </div>
            <div className="hero-bottom">
              <div className="hero-rating">
                <span className="sound-wave">♫</span>
                <span>Original Series</span>
              </div>
              <div className="hero-vertical-rating">16+</div>
            </div>
            <div className="hero-gradient-orb" />
          </section>
        )}

        {/* Horizontal content section*/}
        <div className="rails-wrap">
          <ContentRail
            title="Made for your moments"
            moments={trending}
            onSelect={openDetails}
            onPlay={playMoment}
            savedIds={savedIds}
            onToggleSaved={toggleSaved}
          />
          <ContentRail
            title="Continue watching"
            moments={continueWatching}
            onSelect={openDetails}
            onPlay={playMoment}
            savedIds={savedIds}
            onToggleSaved={toggleSaved}
            progress
          />
          <ContentRail
            title="Top 10 in India today"
            moments={topTen}
            onSelect={openDetails}
            onPlay={playMoment}
            savedIds={savedIds}
            onToggleSaved={toggleSaved}
          />
          <ContentRail
            title="Put the Kids to Bed & Binge"
            moments={kidsAndFamily}
            onSelect={openDetails}
            onPlay={playMoment}
            savedIds={savedIds}
            onToggleSaved={toggleSaved}
          />
          <ContentRail
            title="Because you watched Night Shift"
            moments={catalogue.slice(0, 6)}
            onSelect={openDetails}
            onPlay={playMoment}
            savedIds={savedIds}
            onToggleSaved={toggleSaved}
          />
        </div>
      </main>

       <Modal
        moment={selected}
        mode={modalMode}
        onClose={() => setModalMode(null)}
        onPlay={playMoment}
        saved={selected ? savedIds.includes(selected.id) : false}
        onToggleSaved={toggleSaved}
      />
    </div>
  );
}
