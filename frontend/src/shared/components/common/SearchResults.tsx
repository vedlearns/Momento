import type { Moment } from '../../types/types';
import { KIND_LABEL } from '../../../features/landing/utils/kind';

interface SearchResultsProps {
  query: string;
  results: Moment[];
  onSelect: (moment: Moment) => void;
}

/** Full-width results panel that drops down under the top bar (styles: `.search-results`). */
export default function SearchResults({ query, results, onSelect }: SearchResultsProps) {
  return (
    <section className="search-results" aria-label="Search results">
      <div className="search-results-heading">
        <span>Results for “{query.trim()}”</span>
        <small>{results.length} found</small>
      </div>

      {results.length > 0 ? (
        <div className="search-grid">
          {results.map((moment) => (
            <button key={moment.id} type="button" onClick={() => onSelect(moment)}>
              <i className="search-thumb" style={{ background: moment.gradient }} aria-hidden="true" />
              <span>
                <b>{moment.title}</b>
                <small>
                  {KIND_LABEL[moment.kind]} · {moment.year}
                </small>
              </span>
            </button>
          ))}
        </div>
      ) : (
        <p className="empty-state">Nothing matches that yet. Try “trip”, “family” or “video”.</p>
      )}
    </section>
  );
}
