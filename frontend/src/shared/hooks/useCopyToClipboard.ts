import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Copies text to the clipboard.
 * `copied` is true for `resetMs` after a successful copy (use it to flip a button label).
 * `copy()` resolves to `false` when the browser blocks clipboard access (e.g. plain http).
 */
export function useCopyToClipboard(resetMs = 1800) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setCopied(false), resetMs);
        return true;
      } catch {
        return false;
      }
    },
    [resetMs],
  );

  return { copied, copy };
}
