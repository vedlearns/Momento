import { useEffect, useState } from 'react';

/**
 * Returns the id of the section currently "in focus" (the last section whose top has passed
 * ~35% of the viewport height). Returns '' while the user is above the first section.
 *
 * `ids` must be in the same order the sections appear on the page, and should be a stable
 * reference (define it once at module level).
 */
export function useScrollSpy(ids: readonly string[]): string {
  const [active, setActive] = useState('');

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.35;
      let current = '';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
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
  }, [ids]);

  return active;
}
