import { Link } from 'react-router-dom';
import { ArrowRight, AudioLines, Lock, Play } from 'lucide-react';
import { HERO, HERO_BACKGROUND } from '../data/content';
import HeroCollage from './HeroCollage';

interface HeroProps {
  /** Called when "Watch preview" is clicked (the page opens the sample video modal). */
  onPreview: () => void;
}

/**
 * Big opening banner. Base styles (`.hero`, `.hero-content`, `.hero-meta`, `.button`…) are in
 * index.css; the smaller landing headline + floating collage are in landing.css.
 * Edit the words in data/content.ts → HERO, and the background in HERO_BACKGROUND.
 */
export default function Hero({ onPreview }: HeroProps) {
  return (
    <section className="hero" style={{ backgroundImage: HERO_BACKGROUND }} aria-labelledby="hero-title">
      <div className="hero-gradient-orb" aria-hidden="true" />
      <HeroCollage />

      <div className="hero-content">
        <p className="hero-kicker">
          <Lock size={12} aria-hidden="true" />
          {HERO.kicker}
        </p>

        <h1 id="hero-title" className="hero-title">
          {HERO.title}
          <span className="hero-period">.</span>
        </h1>

        <div className="hero-meta">
          <span className="match-score">100% yours</span>
          <span>Photos + video</span>
          <span className="maturity">HLS</span>
          <span>Private by default</span>
        </div>

        <p className="hero-description">{HERO.description}</p>

        <div className="hero-actions">
          <Link to="/register" className="button button-primary">
            {HERO.primaryCta}
          </Link>
          <button type="button" className="button button-secondary" onClick={onPreview}>
            <Play size={14} fill="currentColor" aria-hidden="true" />
            {HERO.secondaryCta}
          </button>
          <a href="#features" className="hero-list-button">
            {HERO.tertiaryCta}
            <ArrowRight size={14} aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="hero-bottom" aria-hidden="true">
        <div className="hero-rating">
          <span className="sound-wave">
            <AudioLines size={13} />
          </span>
          Adaptive streaming
        </div>
        <div className="hero-vertical-rating">Early access</div>
      </div>
    </section>
  );
}
