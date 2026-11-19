import { Link } from 'react-router-dom';
import { FOOTER } from '../data/content';

/** Page footer (styles: `.site-footer`, `.footer-brand`, `.footer-links` in index.css). */
export default function Footer() {
  return (
    <footer className="site-footer">
      <a href="#top" className="footer-brand">
        <span className="brand-symbol">M</span>
        MOMENTO
      </a>
      <p>{FOOTER.tagline}</p>

      <nav className="footer-links" aria-label="Footer">
        <a href="#features">Features</a>
        <a href="#plans">Plans</a>
        <a href="#faq">FAQ</a>
        <Link to="/privacy">Privacy</Link>
        <Link to="/terms">Terms</Link>
        <a href="#top">Back to top ↑</a>
      </nav>

      <small>© {new Date().getFullYear()} Momento. All rights reserved.</small>
    </footer>
  );
}
