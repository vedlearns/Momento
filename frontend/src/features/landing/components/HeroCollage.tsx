import { Play } from 'lucide-react';
import { GRADIENTS } from '../data/content';

/**
 * Decorative floating tiles on the right side of the hero (hidden below 850px).
 * Purely visual – hidden from screen readers. Positions/rotation: `.collage-tile.t1…t4` in landing.css.
 */
export default function HeroCollage() {
  return (
    <div className="hero-collage" aria-hidden="true">
      <div className="collage-tile t1" style={{ background: GRADIENTS.sunset }}>
        <span className="collage-play">
          <Play size={20} fill="currentColor" />
        </span>
        <div className="collage-caption">
          <strong>Goa Trip · Day 3</strong>
          <small>Resume from 05:08</small>
          <div className="progress-track">
            <span style={{ width: '40%' }} />
          </div>
        </div>
      </div>
      <div className="collage-tile t2" style={{ background: GRADIENTS.ocean }} />
      <div className="collage-tile t3" style={{ background: GRADIENTS.violet }} />
      <div className="collage-tile t4" style={{ background: GRADIENTS.forest }}>
        <span className="collage-chip">Family · 248 items</span>
      </div>
    </div>
  );
}
