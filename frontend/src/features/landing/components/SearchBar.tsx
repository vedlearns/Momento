import { useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import type { LibrarySearch } from '../../../shared/hooks/useLibrarySearch';

interface SearchBarProps {
  /** State object from useLibrarySearch(). */
  search: LibrarySearch;
}

/**
 * Icon button that expands into a search input (styles: `.search-box` in index.css).
 * Press Escape or click the icon again to close it.
 */
export default function SearchBar({ search }: SearchBarProps) {
  const { open, query, setQuery, toggle, close } = search;
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the input as soon as the box expands.
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  return (
    <div className={`search-box${open ? ' search-expanded' : ''}`} role="search">
      <button
        type="button"
        className="icon-button"
        aria-label={open ? 'Close search' : 'Open search'}
        aria-expanded={open}
        onClick={toggle}
      >
        <Search size={17} aria-hidden="true" />
      </button>
      {open && (
        <input
          ref={inputRef}
          type="search"
          value={query}
          placeholder="Search the sample library…"
          aria-label="Search the sample library"
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') close();
          }}
        />
      )}
    </div>
  );
}
