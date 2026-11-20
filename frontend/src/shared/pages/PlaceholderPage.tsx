import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
  description: string;
  /** Adds a button to the demo home page until real authentication exists. */
  showDemoLink?: boolean;
}

/**
 * Stand-in for pages you have not built yet (login, register, privacy, terms) so the landing
 * page's buttons never lead to a 404. In your real app, replace the matching <Route> element
 * in App.tsx with the real page and delete what you no longer need.
 */
export default function PlaceholderPage({ title, description, showDemoLink = false }: PlaceholderPageProps) {
  return (
    <div className="app-shell">
      <main className="page-section">
        <div className="page-title">
          <p className="eyebrow">COMING SOON</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <Link to="/" className="button button-primary">
          <ArrowLeft size={14} aria-hidden="true" />
          Back to home
        </Link>
        {showDemoLink && (
          <Link to="/home" className="button button-accent" style={{ marginLeft: 10 }}>
            Preview the signed-in home (demo)
          </Link>
        )}
      </main>
    </div>
  );
}
