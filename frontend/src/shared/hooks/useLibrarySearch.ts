import { useCallback, useMemo, useState } from 'react';
import type { Moment } from '../types/types';

/**
 * State + filtering for the top-bar search of the sample library.
 *
 * When the real search exists (PostgreSQL full-text search behind your API), keep this hook's
 * return shape and replace the `results` calculation with a TanStack Query call.
 */
export function useLibrarySearch(items: readonly Moment[]) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return [];
    return items.filter((item) =>
      [item.title, item.kind, item.subtitle, item.description].some((field) =>
        field.toLowerCase().includes(needle),
      ),
    );
  }, [items, query]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
  }, []);

  const toggle = useCallback(() => {
    if (open) close();
    else setOpen(true);
  }, [open, close]);

  return { open, query, setQuery, results, close, toggle };
}

export type LibrarySearch = ReturnType<typeof useLibrarySearch>;
