import { useState } from "react";
import { useEffect, useRef } from "react";
import {
  Bell,
  ChevronDown,
  CircleHelp,
  Menu,
  Search,
  Settings,
  UserRound,
  X,
} from "lucide-react";

const navItems = ["Home", "Series", "Movies", "Latest", "My Favorites"];

export function Header() {
  const [activeNav, setActiveNav] = useState("Home"); // For Navbar Items , to set them active and use in desktop
  const [mobileMenu, setMobileMenu] = useState(false); // For Hamburger menu
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  // For automatic closing of search bar and profile , do not change until necessary
  const bodyRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!searchOpen && !profileOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (bodyRef.current && !bodyRef.current.contains(event.target as Node)) {
        if (searchOpen) {
          setSearchOpen(false);
          setQuery("");
        }
        if (profileOpen) {
          setProfileOpen(false);
        }
      }
    }

    // This line detects any click anywhere on the webpage and execute handleClickOutside
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up function for handleClickOutside
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchOpen, profileOpen]);

  return (
    <header className="topbar">
      {/* Momento Logo section */}
      <a
        className="wordmark"
        href="#home"
        onClick={() => {
          setActiveNav("Home");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        aria-label="Momento home"
      >
        <span className="brand-symbol">M</span>
        <span>MOMENTO</span>
      </a>

      {/* Hamburger section */}
      <button
        className="mobile-menu-button icon-button"
        onClick={() => setMobileMenu(!mobileMenu)}
        aria-label="Toggle navigation"
      >
        {mobileMenu ? <X /> : <Menu />}
      </button>

      {/* Navbar items section , better not to change the css */}
      <nav
        className={`main-nav ${mobileMenu ? "nav-open" : ""}`}
        aria-label="Main navigation"
      >
        {navItems.map((item) => (
          <button
            key={item}
            className={activeNav === item ? "nav-link active" : "nav-link"}
            onClick={() => {
              setActiveNav(item);
              setMobileMenu(false);
            }}
          >
            {item}
          </button>
        ))}
      </nav>

      {/*Search bar section */}

      <div className="topbar-tools">
        <div
          ref={bodyRef}
          className={`search-box ${searchOpen ? "search-expanded" : ""}`}
        >
          {searchOpen && (
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Titles, genres..."
              aria-label="Search titles"
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setSearchOpen(false);
                  setQuery("");
                }
              }}
            />
          )}
          <button
            className="icon-button"
            aria-label={searchOpen ? "Close search" : "Search"}
            onClick={() => {
              setSearchOpen(!searchOpen);
              if (searchOpen) setQuery("");
            }}
          >
            <Search size={19} />
          </button>
        </div>

        {/* Notification Section */}
        <button
          className="icon-button notification-button"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <i />
        </button>

        {/* Profile Section */}
        <div ref={bodyRef} className="profile-wrap">
          <button
            className="profile-button"
            onClick={() => setProfileOpen(!profileOpen)}
            aria-label="Open profile menu"
          >
            <span>V</span>
            <ChevronDown size={14} />
          </button>
          {profileOpen && (
            <div className="profile-menu">
              <div className="profile-identity">
                <span>V</span>
                <div>
                  <b>Ved's profile</b>
                  <small>Streaming member</small>
                </div>
              </div>
              <button>
                <UserRound size={15} /> Manage Profiles
              </button>
              <button>
                <Settings size={15} /> Account Settings
              </button>
              <button>
                <CircleHelp size={15} /> Help Centre
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
