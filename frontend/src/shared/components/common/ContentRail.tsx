import { useRef, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ContentRailProps {
  title: string;
  /** Draws the rail with extra top room for the big rank numbers. */
  ranked?: boolean;
  children: ReactNode;
}

/**
 * A titled, horizontally scrolling row of cards (the "Netflix rail").
 * The arrow buttons scroll by roughly one screen; touch/trackpad scrolling works as usual.
 */
export default function ContentRail({ title, ranked = false, children }: ContentRailProps) {
  const railRef = useRef<HTMLDivElement>(null);

  const scrollByPage = (direction: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * rail.clientWidth * 0.85, behavior: 'smooth' });
  };

  return (
    <section className="content-section" aria-label={title}>
      <div className="section-heading">
        <h2>{title}</h2>
        <div className="rail-controls">
          <button type="button" aria-label={`Scroll ${title} left`} onClick={() => scrollByPage(-1)}>
            <ChevronLeft size={16} aria-hidden="true" />
          </button>
          <button type="button" aria-label={`Scroll ${title} right`} onClick={() => scrollByPage(1)}>
            <ChevronRight size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
      <div ref={railRef} className={`content-rail${ranked ? ' ranked-rail' : ''}`}>
        {children}
      </div>
    </section>
  );
}
