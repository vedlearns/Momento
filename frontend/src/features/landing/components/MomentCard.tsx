import { Heart, Play } from 'lucide-react';
import type { Moment } from '../types';
import { KIND_ICON, KIND_LABEL } from '../utils/kind';

interface MomentCardProps {
  moment: Moment;
  /** When set, the card is drawn as a "ranked" card with a big number (1–5). */
  rank?: number;
  saved: boolean;
  onOpen: (moment: Moment) => void;
  onToggleSave: (moment: Moment) => void;
}

/**
 * One poster card inside a rail. Styles: `.moment-card`, `.poster-button`, `.card-details`… in index.css.
 *
 * Replace the gradient `<div className="poster-art">` with an <img> when you have real thumbnails
 * (`.poster-button img` is already styled in index.css).
 */
export default function MomentCard({ moment, rank, saved, onOpen, onToggleSave }: MomentCardProps) {
  const KindIcon = KIND_ICON[moment.kind];

  return (
    <article className={`moment-card${rank ? ' moment-card-ranked' : ''}`}>
      {rank && (
        <span className="rank-number" aria-hidden="true">
          {rank}
        </span>
      )}

      <button
        type="button"
        className="poster-button"
        aria-label={`Open ${moment.title}`}
        onClick={() => onOpen(moment)}
      >
        <div className="poster-art" style={{ background: moment.gradient }} />
        <span className="poster-shade" />
        {moment.shared && <span className="top-badge">SHARED</span>}
        <span className="kind-chip" aria-hidden="true">
          <KindIcon size={13} />
        </span>
        <span className="poster-caption">
          <strong>{moment.title}</strong>
          <small>
            {KIND_LABEL[moment.kind]}
            <span>•</span>
            {moment.year}
          </small>
        </span>
      </button>

      {moment.progress !== undefined && (
        <div className="progress-track" role="img" aria-label={`${moment.progress}% watched`}>
          <span style={{ width: `${moment.progress}%` }} />
        </div>
      )}

      <div className="card-details">
        <div>
          <strong>{moment.subtitle}</strong>
          <span>{moment.meta}</span>
        </div>
        <div className="card-actions">
          <button type="button" aria-label={`Play ${moment.title}`} onClick={() => onOpen(moment)}>
            <Play size={12} fill="currentColor" aria-hidden="true" />
          </button>
          <button
            type="button"
            className={saved ? 'is-saved' : undefined}
            aria-pressed={saved}
            aria-label={saved ? `Remove ${moment.title} from favourites` : `Add ${moment.title} to favourites`}
            onClick={() => onToggleSave(moment)}
          >
            <Heart size={12} fill={saved ? 'currentColor' : 'none'} aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}
