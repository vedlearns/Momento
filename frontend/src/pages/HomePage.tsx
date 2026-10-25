import { useMemo, useState } from "react"
import type { Movie } from '../types/types'

export default function HomePage() {

  const [saved, setSaved] = useState<Movie[]>([])
  const [selected, setSelected] = useState<Movie | null>(null)
  const [modalMode, setModalMode] = useState<'details' | 'play' | null>(null)
  const [notice, setNotice] = useState('')
  const savedIds = saved.map((movie) => movie.id)
//   const allMovies = useMemo(() => [featured, ...catalogue, ...continueWatching, ...kidsAndFamily], [])
//   const searchResults = useMemo(() => {
//     const normalized = query.trim().toLowerCase()
//     if (!normalized) return []
//     return allMovies.filter((movie, index, list) => list.findIndex((item) => item.title === movie.title) === index && `${movie.title} ${movie.genre} ${movie.description}`.toLowerCase().includes(normalized))
//   }, [allMovies, query])
  const toggleSaved = (movie: Movie) => setSaved((current) => current.some((item) => item.id === movie.id) ? current.filter((item) => item.id !== movie.id) : [...current, movie])
  const openDetails = (movie: Movie) => { setSelected(movie); setModalMode('details') }
  const playMovie = (movie: Movie) => { setSelected(movie); setModalMode('play') }
  const notify = (message: string) => { setNotice(message); window.setTimeout(() => setNotice(''), 2600) }
  // const shownSaved = activeNav === 'My List' ? saved : null
//   const heroStyle = { backgroundImage: `linear-gradient(90deg, rgba(8,9,12,.97) 0%, rgba(8,9,12,.72) 35%, rgba(8,9,12,.12) 76%), linear-gradient(0deg, #08090c 0%, transparent 46%), url("${featured.backdrop}")` }

  return (
    <div className="app-shell">
        

      {/* {searchOpen && query.trim() && <div className="search-results"><div className="search-results-heading"><span>Search results</span><small>{searchResults.length} titles</small></div>{searchResults.length ? <div className="search-grid">{searchResults.map((movie) => <button key={movie.id} onClick={() => { openDetails(movie); setSearchOpen(false); setQuery('') }}><img src={movie.image} alt="" /><span><b>{movie.title}</b><small>{movie.year} · {movie.genre}</small></span></button>)}</div> : <p className="empty-state">No titles found. Try a different search.</p>}</div>} */}

      <main id="home">
        {/* {!shownSaved && activeNav === 'Home' && !searchOpen && <section className="hero" style={heroStyle}>
          <div className="hero-content"><span className="hero-kicker"><Clapperboard size={13} /> featured.eyebrow</span><h1>NIGHT<br />SHIFT<span className="hero-period">.</span></h1>
            <div className="hero-meta"><span className="match-score">featured.match % Match</span><span>featured.year </span><span className="maturity"> featured.rating </span><span> featured.seasons </span><span>4K UHD</span></div>
            <p className="hero-description">featured.description</p>
            <div className="hero-actions"><button className="button button-primary" onClick={() => playMovie(featured)}><Play size={17} fill="currentColor" /> Play</button><button className="button button-secondary" onClick={() => openDetails(featured)}><Info size={18} /> More Info</button><button className={`hero-list-button ${savedIds.includes(featured.id) ? 'is-saved' : ''}`} onClick={() => toggleSaved(featured)}>{savedIds.includes(featured.id) ? <Check size={17} /> : '+'} <span>{savedIds.includes(featured.id) ? 'In My List' : 'My List'}</span></button></div>
          </div>
          <div className="hero-bottom"><div className="hero-rating"><span className="sound-wave">♫</span><span>Original Series</span></div><div className="hero-vertical-rating">16+</div></div>
          <div className="hero-gradient-orb" />
        </section>}

        {shownSaved ? <section className="page-section"><div className="page-title"><span className="eyebrow">YOUR COLLECTION</span><h1>My List</h1><p>Your saved stories, all in one place.</p></div>{saved.length ? <div className="saved-grid">{saved.map((movie) => <button key={movie.id} className="saved-card" onClick={() => openDetails(movie)}><img src={movie.image} alt="" /><span><b>{movie.title}</b><small>{movie.year} · {movie.genre}</small></span></button>)}</div> : <div className="empty-collection"><span><Shield size={25} /></span><h2>Your list is waiting</h2><p>Save movies and series you want to watch later.</p><button className="button button-primary" onClick={() => setActiveNav('Home')}>Explore titles</button></div>}</section> : activeNav === 'Home' ? <div className="rails-wrap">
          <ContentRail title="Made for your moments" movies={trending} onSelect={openDetails} onPlay={playMovie} savedIds={savedIds} onToggleSaved={toggleSaved} />
          <ContentRail title="Continue watching" movies={continueWatching} onSelect={openDetails} onPlay={playMovie} savedIds={savedIds} onToggleSaved={toggleSaved} progress />
          <ContentRail title="Top 10 in India today" movies={topTen} onSelect={openDetails} onPlay={playMovie} savedIds={savedIds} onToggleSaved={toggleSaved} ranked />
          <ContentRail title="Put the Kids to Bed & Binge" movies={kidsAndFamily} onSelect={openDetails} onPlay={playMovie} savedIds={savedIds} onToggleSaved={toggleSaved} />
          <ContentRail title="Because you watched Night Shift" movies={catalogue.slice(0, 6)} onSelect={openDetails} onPlay={playMovie} savedIds={savedIds} onToggleSaved={toggleSaved} />
        </div> : <section className="page-section"><div className="page-title"><span className="eyebrow">EXPLORE MOMENTO</span><h1>{activeNav}</h1><p>{activeNav === 'Browse by Languages' ? 'Choose a language and discover your next favourite story.' : `Find your next favourite ${activeNav.toLowerCase()} to get lost in.`}</p></div>{activeNav === 'Browse by Languages' && <div className="language-list">{['English', 'Hindi', 'Tamil', 'Telugu', 'Korean', 'Japanese', 'Spanish', 'French'].map((language) => <button key={language} onClick={() => notify(`${language} catalogue filter will be connected to the API.`)}>{language}<span>↗</span></button>)}</div>}<div className="browse-grid">{(activeNav === 'Movies' ? catalogue.filter((m) => m.seasons === undefined) : activeNav === 'Series' ? [featured, ...catalogue.filter((m) => m.seasons)] : activeNav === 'New & Popular' ? trending : catalogue).map((movie) => <button key={movie.id} className="browse-card" onClick={() => openDetails(movie)}><img src={movie.image} alt="" /><span><b>{movie.title}</b><small>{movie.year} · {movie.genre}</small></span></button>)}</div></section>} */}
      </main>

    </div>
  )
}