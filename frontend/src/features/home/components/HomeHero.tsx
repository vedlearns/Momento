import { Info, Play } from 'lucide-react';
import type { Moment } from '../../../shared/types/types';

interface HomeHeroProps {
  moment: Moment;
  onOpen: (moment: Moment) => void;
}

/** "Pick up where you left off" banner. Uses `.hero*` from index.css and `.hero-title` from landing.css. */
export default function HomeHero({ moment, onOpen }: HomeHeroProps) {
  return (
    <section className="hero home-hero" style={{ backgroundImage: `linear-gradient(90deg, #08090c 0%, rgba(8,9,12,.55) 45%, rgba(8,9,12,0) 100%), ${moment.gradient}` }} aria-labelledby="home-hero-title">
      <div className="hero-content">
        <p className="hero-kicker">PICK UP WHERE YOU LEFT OFF</p>
        <h1 id="home-hero-title" className="hero-title">{moment.title}</h1>
        <div className="hero-meta">
          <span className="match-score">{moment.progress}% watched</span>
          <span>{moment.year}</span>
          <span className="maturity">{moment.meta.split('·')[1]?.trim() ?? 'HD'}</span>
          <span>{moment.subtitle}</span>
        </div>
        <p className="hero-description">{moment.description}</p>
        <div className="hero-actions">
          <button type="button" className="button button-primary" onClick={() => onOpen(moment)}>
            <Play size={14} fill="currentColor" aria-hidden="true" /> Resume
          </button>
          <button type="button" className="button button-secondary" onClick={() => onOpen(moment)}>
            <Info size={14} aria-hidden="true" /> More info
          </button>
        </div>
      </div>
      <div className="hero-bottom home-hero-progress" aria-hidden="true">
        <div className="progress-track"><span style={{ width: `${moment.progress ?? 0}%` }} /></div>
      </div>
    </section>
  );
}
