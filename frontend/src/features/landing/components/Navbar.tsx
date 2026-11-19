import { useCallback, useState, type MouseEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useEscapeKey } from '../../../shared/hooks/useEscapeKey';
import { NAV_LINKS } from '../data/content';
import type { LibrarySearch } from '../../../shared/hooks/useLibrarySearch';
import SearchBar from './SearchBar';

interface NavbarProps {
  /** id of the section currently in view (from useScrollSpy) – gets the red underline. */
  activeSection: string;
  search: LibrarySearch;
}

/**
 * Sticky top bar. Layout/styling: `.topbar`, `.main-nav`, `.nav-link` in index.css.
 *
 * - Desktop: wordmark · section links · search · Log in · Get started
 * - Mobile (≤850px): hamburger opens the links as a dropdown
 */
export default function Navbar({ activeSection, search }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  useEscapeKey(closeMenu, menuOpen);

  // Clicking the logo while already on "/" smooth-scrolls to the top instead of doing nothing.
  const handleLogoClick = (event: MouseEvent<HTMLAnchorElement>) => {
    closeMenu();
    if (pathname === '/') {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="topbar">
      <button
        type="button"
        className="icon-button mobile-menu-button"
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        aria-controls="primary-nav"
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
      </button>

      <Link to="/" className="wordmark" onClick={handleLogoClick}>
        <span className="brand-symbol">M</span>
        MOMENTO
      </Link>

      <nav id="primary-nav" aria-label="Primary" className={`main-nav${menuOpen ? ' nav-open' : ''}`}>
        {NAV_LINKS.map((link) => (
          <a
            key={link.id}
            href={link.href}
            className={`nav-link${activeSection === link.id ? ' active' : ''}`}
            aria-current={activeSection === link.id ? 'true' : undefined}
            onClick={closeMenu}
          >
            {link.label}
          </a>
        ))}
        {/* Only visible on very small screens, where the "Log in" button is hidden from the bar. */}
        <Link to="/login" className="nav-link nav-mobile-only" onClick={closeMenu}>
          Log in
        </Link>
      </nav>

      <div className="topbar-tools">
        <SearchBar search={search} />
        <Link to="/login" className="button button-ghost button-sm topbar-login">
          Log in
        </Link>
        <Link to="/register" className="button button-accent button-sm">
          Get started
        </Link>
      </div>
    </header>
  );
}
