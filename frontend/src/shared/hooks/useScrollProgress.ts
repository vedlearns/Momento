import { useEffect, useState } from 'react';

interface ScrollState {
  /** Pixels scrolled from the top. */
  y: number;
  /** 0 → 1, how far down the page the user is. */
  progress: number;
}

/** Tracks window scroll position (throttled with requestAnimationFrame). */
export function useScrollProgress(): ScrollState {
  const [state, setState] = useState<ScrollState>({ y: 0, progress: 0 });

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setState({ y, progress: max > 0 ? Math.min(1, y / max) : 0 });
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return state;
}
