import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Images, Play, X } from 'lucide-react';
import { useEscapeKey } from '../../../shared/hooks/useEscapeKey';
import { useLockBodyScroll } from '../../../shared/hooks/useLockBodyScroll';
import type { Moment } from '../types';
import { KIND_LABEL } from '../utils/kind';

interface DetailModalProps {
  moment: Moment;
  saved: boolean;
  onToggleSave: (moment: Moment) => void;
  onClose: () => void;
}

type View = 'details' | 'player';

/**
 * Pop-up shown when a card is clicked. Two views:
 *   - details: artwork, description, play + favourite buttons
 *   - player:  placeholder where the real HLS player will go
 *
 * Accessible: role="dialog", Escape closes, focus is moved inside and trapped, focus returns to
 * the opener on close, and the page behind does not scroll. Render it with `key={moment.id}` so
 * it resets to the details view for each item.
 *
 * Styles: `.modal-backdrop`, `.detail-modal`, `.modal-art`, `.player-placeholder`… in index.css.
 */
export default function DetailModal({ moment, saved, onToggleSave, onClose }: DetailModalProps) {
  const [view, setView] = useState<View>('details');
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEscapeKey(onClose);
  useLockBodyScroll(true);

  // Move focus into the dialog on open, give it back to the opener on close.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    return () => opener?.focus?.();
  }, []);

  // Keep Tab / Shift+Tab inside the dialog.
  const trapFocus = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab') return;
    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
    );
    if (!focusable || focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  // Close when the dark backdrop (not the dialog itself) is clicked.
  const handleBackdropMouseDown = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose();
  };

  const isVideo = moment.kind === 'video';

  return (
    <div className="modal-backdrop" onMouseDown={handleBackdropMouseDown}>
      <div
        ref={dialogRef}
        className="detail-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="moment-dialog-title"
        onKeyDown={trapFocus}
      >
        <button
          ref={closeButtonRef}
          type="button"
          className="icon-button modal-close"
          aria-label="Close"
          onClick={onClose}
        >
          <X size={18} aria-hidden="true" />
        </button>

        {view === 'details' ? (
          <>
            <div
              className="modal-art"
              style={{ backgroundImage: `linear-gradient(0deg, #121319 0%, rgba(18,19,25,0) 65%), ${moment.gradient}` }}
            >
              <span className="original-pill">SAMPLE · {KIND_LABEL[moment.kind].toUpperCase()}</span>
              <h2 id="moment-dialog-title">{moment.title}</h2>
            </div>

            <div className="modal-copy">
              <div className="modal-actions">
                <button type="button" className="button button-primary" onClick={() => setView('player')}>
                  {isVideo ? <Play size={14} fill="currentColor" aria-hidden="true" /> : <Images size={14} aria-hidden="true" />}
                  {isVideo ? 'Play' : 'Open album'}
                </button>
                <button
                  type="button"
                  className={`round-action${saved ? ' is-saved' : ''}`}
                  aria-pressed={saved}
                  aria-label={saved ? 'Remove from favourites' : 'Add to favourites'}
                  onClick={() => onToggleSave(moment)}
                >
                  <Heart size={18} fill={saved ? 'currentColor' : 'none'} aria-hidden="true" />
                </button>
              </div>

              <div className="meta-line">
                <span className="match-score">100% yours</span>
                <span>{moment.year}</span>
                <span>{moment.meta}</span>
                <span className="maturity">{isVideo ? 'HD' : 'ALBUM'}</span>
              </div>

              <p className="modal-description">{moment.description}</p>
              <p className="modal-footnote">
                <b>Sample content.</b> In the real app this opens your own {isVideo ? 'video' : 'album'}.
              </p>
            </div>
          </>
        ) : (
          <div
            className="player-placeholder"
            style={{ backgroundImage: `linear-gradient(0deg, rgba(18,19,25,.82) 0%, rgba(18,19,25,.35) 100%), ${moment.gradient}` }}
          >
            <div className="player-message">
              <span className="brand-mark">M</span>
              <h2 id="moment-dialog-title">{isVideo ? 'Playback lives in the app' : 'Albums open in the app'}</h2>
              <p>This is where the HLS player for “{moment.title}” will appear.</p>
              <small>Create a free library to be first in line.</small>
              <div className="modal-actions" style={{ marginTop: 10 }}>
                <Link to="/register" className="button button-primary" onClick={onClose}>
                  Create your library
                </Link>
                <button type="button" className="button button-secondary" onClick={() => setView('details')}>
                  Back
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
