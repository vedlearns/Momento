// This component displays a popup with a moment's details or 
// a playback preview when someone clicks a moment in Momento.

import { X } from "lucide-react";
import type { Moment } from "../../types/types";

type Props = {
  moment: Moment | null;
  mode: "details" | "play" | null;
  onClose: () => void;
  onPlay: (moment: Moment) => void;
  saved: boolean;
  onToggleSaved: (moment: Moment) => void;
};

export default function Modal({
  moment,
  mode,
  onClose,
  onPlay,
  saved,
  onToggleSaved,
}: Props) 
{

  if (!moment || !mode) return null;
  return (
    <div
      className="modal-backdrop"
      role="presentation"

      //  Closes the Modal if clicked on the background
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="detail-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${moment.title} details`}
      >

        {/* Close button   */}
        <button
          className="icon-button modal-close"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X size={20} />
        </button>

        {/* Playback preview (when play)  */}
        {mode === "play" ? (
          <div
            className="player-placeholder"
            style={{
              backgroundImage: `linear-gradient(0deg, #07080b 0%, transparent 80%), url("${moment.backdrop ?? moment.image}")`,
            }}
          >
            <div className="player-message">
              <span className="brand-mark">M</span>
              <h2>{moment.title}</h2>
              <p>Playback preview</p>
              <small>
                Connect the Momento video service to stream this title.
              </small>
            </div>
          </div>
        ) : 
        
        // Details preview or displays modal-art, with the artwork,
        (
          <div
            className="modal-art"
            style={{
              backgroundImage: `linear-gradient(0deg, #101115 0%, rgba(16,17,21,.1) 80%), url("${moment.backdrop ?? moment.image}")`,
            }}
          >
            <span className="original-pill">MOMENTO ORIGINAL</span>
            <h2>{moment.title}</h2>
          </div>
        )}
        <div className="modal-copy">
          <div className="modal-actions">
          
          {/* Play Button */}
            <button
              className="button button-primary"
              onClick={() => onPlay(moment)}
            >
              <span className="play-triangle">▶</span>{" "}
              {mode === "play" ? "Play again" : "Play now"}
            </button>

            {/* Save button */}
            <button
              className={`round-action ${saved ? "is-saved" : ""}`}
              onClick={() => onToggleSaved(moment)}
              aria-label={saved ? "Remove from My List" : "Add to My List"}
            >
              {saved ? "✓" : "+"}
            </button>
          </div>

          {/* Match score  */}
          <div className="meta-line">
            <span className="match-score">{moment.match ?? 92}% Match</span>
            <span>{moment.year}</span>
            <span className="maturity">{moment.rating}</span>
            <span>{moment.seasons ?? "Feature"}</span>
            <span>{moment.genre}</span>
          </div>
          <p className="modal-description">{moment.description}</p>
          <p className="modal-footnote">
            <b>About this title:</b> A Momento pick for your next great watch.
          </p>
        </div>
      </section>
    </div>
  );
}
