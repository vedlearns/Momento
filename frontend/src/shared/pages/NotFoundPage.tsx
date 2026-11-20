import { Link } from 'react-router-dom';
import { SearchX } from 'lucide-react';

/** Shown for any URL that matches no route. */
export default function NotFoundPage() {
  return (
    <div className="app-shell">
      <main className="page-section">
        <div className="empty-collection">
          <span>
            <SearchX size={26} aria-hidden="true" />
          </span>
          <h2>That page doesn’t exist</h2>
          <p>The link may be broken or the page may have moved.</p>
          <Link to="/" className="button button-primary">
            Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
