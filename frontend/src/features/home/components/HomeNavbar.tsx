import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, LogOut, Menu, Settings, Upload, X } from 'lucide-react';
import { HOME_TABS, USER, type HomeTab } from '../data/homeData';
import type { LibrarySearch } from '../../../shared/hooks/useLibrarySearch';
import { useToast } from '../../../shared/components/ui/Toast';
import { useEscapeKey } from '../../../shared/hooks/useEscapeKey';
import SearchBar from '../../landing/components/SearchBar';

interface HomeNavbarProps {
  tab: HomeTab;
  onTab: (tab: HomeTab) => void;
  search: LibrarySearch;
  onUpload: () => void;
}

/** Signed-in top bar. Re-uses `.topbar`, `.main-nav`, `.profile-*` from index.css. */
export default function HomeNavbar({ tab, onTab, search, onUpload }: HomeNavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const closeMenus = useCallback(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, []);
  useEscapeKey(closeMenus, menuOpen || profileOpen);

  // Close the profile menu when clicking anywhere outside it.
  useEffect(() => {
    if (!profileOpen) return;
    const onDown = (event: MouseEvent) => {
      if (!profileRef.current?.contains(event.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [profileOpen]);

  const pick = (id: HomeTab) => {
    onTab(id);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="topbar">
      <button type="button" className="icon-button mobile-menu-button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="home-nav" onClick={() => setMenuOpen((o) => !o)}>
        {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
      </button>

      <Link to="/home" className="wordmark" onClick={() => pick('all')}>
        <span className="brand-symbol">M</span>
        MOMENTO
      </Link>

      <nav id="home-nav" aria-label="Library" className={`main-nav${menuOpen ? ' nav-open' : ''}`}>
        {HOME_TABS.map((item) => (
          <button key={item.id} type="button" className={`nav-link${tab === item.id ? ' active' : ''}`} aria-current={tab === item.id ? 'page' : undefined} onClick={() => pick(item.id)}>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="topbar-tools">
        <SearchBar search={search} />
        <button type="button" className="button button-accent button-sm home-upload" onClick={onUpload}>
          <Upload size={14} aria-hidden="true" />
          <span>Upload</span>
        </button>
        <button type="button" className="icon-button notification-button" aria-label="Notifications" onClick={() => showToast('You’re all caught up')}>
          <Bell size={17} aria-hidden="true" />
          <i />
        </button>

        <div className="profile-wrap" ref={profileRef}>
          <button type="button" className="profile-button" aria-haspopup="menu" aria-expanded={profileOpen} aria-label="Account menu" onClick={() => setProfileOpen((o) => !o)}>
            <span>{USER.name.charAt(0)}</span>
            <ChevronDown size={14} aria-hidden="true" />
          </button>
          {profileOpen && (
            <div className="profile-menu" role="menu">
              <div className="profile-identity">
                <span>{USER.name.charAt(0)}</span>
                <div>
                  <b>{USER.name}</b>
                  <small>{USER.email}</small>
                </div>
              </div>
              <button type="button" role="menuitem" onClick={() => { setProfileOpen(false); showToast('Settings arrive with the profile module'); }}>
                <Settings size={14} aria-hidden="true" /> Settings
              </button>
              <button type="button" role="menuitem" onClick={() => navigate('/')}>
                <LogOut size={14} aria-hidden="true" /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
