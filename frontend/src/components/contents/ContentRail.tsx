// This is the component that creates the horizontal moment rows in Momento,
// like “New ,” “Popular ,” or “Continue ”

import { ChevronLeft, ChevronRight, Play, Plus } from "lucide-react";
import { useRef } from "react";
import type { Moment } from "../../types/types";

type Props = {
  title: string;
  moments: Moment[];
  onSelect: (moment: Moment) => void;
  onPlay: (moment: Moment) => void;
  savedIds: string[];
  onToggleSaved: (moment: Moment) => void;
  progress?: boolean;
};

export default function ContentRail({
  title,
  moments,
  onSelect,
  onPlay,
  savedIds,
  onToggleSaved,
  // ranked = false,
  progress = false,
}: Props) 
{
  // creating a referencing element so that JS can scroll moment cards left and right 
  const rail = useRef<HTMLDivElement>(null);
  // Function for scrolling
  const scroll = (direction: number) =>
    rail.current?.scrollBy({
      left: direction * Math.max(rail.current.clientWidth * 0.82, 280),
      behavior: "smooth",
    });

  return (
    // Different sections for viewing
    <section className="content-section">
      <div className="section-heading">
        <h2>{title}</h2>
        <div className="rail-controls">
       
        {/* Left button */} 
          <button
            aria-label={`Scroll ${title} left`}
            onClick={() => scroll(-1)}
          >
            <ChevronLeft size={18} />
          </button>

           {/* Right button */} 
          <button
            aria-label={`Scroll ${title} right`}
            onClick={() => scroll(1)}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Content array row */}
      <div className={`content-rail `} ref={rail}>
        {moments.map((moment) => (
          <article
            className={`moment-card `}
            key={moment.id}
          >

            {/* Title */}
            <button
              className="poster-button"
              onClick={() => onSelect(moment)}
              aria-label={`View ${moment.title} details`}
            >

          {/* Poster Img */}
              <img src={moment.image} alt="" loading="lazy" />
              <span className="poster-shade" />
              {moment.badge && <span className="top-badge">{moment.badge}</span>}
              <span className="poster-caption">
                <strong>{moment.title}</strong>
                <small>
                  {moment.year} <span>•</span> {moment.genre}
                </small>
              </span>
            </button>

          {/* Progress bar */}
            {progress && (
              <div className="progress-track">
                <span style={{ width: `${moment.progress ?? 0}%` }} />
              </div>
            )}
            <div className="card-details">
              <div>
                <strong>{moment.title}</strong>
                <span>
                  {moment.match ?? 90}% Match · {moment.rating}
                </span>
              </div>
            {/* Play button  */}
              <div className="card-actions">
                <button
                  aria-label={`Play ${moment.title}`}
                  onClick={() => onPlay(moment)}
                >
                  <Play size={14} fill="currentColor" />
                </button>

                {/* Add to list button  */}
                <button
                  className={savedIds.includes(moment.id) ? "is-saved" : ""}
                  aria-label={`Add ${moment.title} to My List`}
                  onClick={() => onToggleSaved(moment)}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
