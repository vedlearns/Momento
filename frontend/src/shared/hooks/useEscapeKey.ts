import { useEffect } from 'react';

/**
 * Calls `onEscape` when the Escape key is pressed.
 * Pass `enabled = false` to temporarily turn the listener off (e.g. while a dialog is closed).
 */
export function useEscapeKey(onEscape: () => void, enabled = true): void {
  useEffect(() => {
    if (!enabled) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onEscape();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onEscape, enabled]);
}
