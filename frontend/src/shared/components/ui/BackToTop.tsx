import { ArrowUp } from 'lucide-react';
import { useScrollProgress } from '../../hooks/useScrollProgress';

/** Show the button after the user has scrolled this many pixels. */
const SHOW_AFTER_PX = 600;

/**
 * Round "back to top" button. `.floating-explore` (index.css) only displays it on small screens;
 * on desktop the footer link does the job.
 */
export default function BackToTop() {
  const { y } = useScrollProgress();
  if (y < SHOW_AFTER_PX) return null;

  return (
    <button
      type="button"
      className="floating-explore"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <ArrowUp size={18} aria-hidden="true" />
    </button>
  );
}
