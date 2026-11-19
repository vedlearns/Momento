import { useCallback, useMemo, useState } from 'react';
import { ImagePlus } from 'lucide-react';
import { useToast } from '../../shared/components/ui/Toast';
import DetailModal from '../../shared/components/common/DetailModal';
import ContentRail from '../../shared/components/common/ContentRail';
import MomentCard from '../../shared/components/common/MomentCard';
import SearchResults from '../../shared/components/common/SearchResults';
import { useLibrarySearch } from '../../shared/hooks/useLibrarySearch';
import type { Moment } from '../../shared/types/types';
import HomeHero from './components/HomeHero';
import HomeNavbar from './components/HomeNavbar';
import StorageStrip from './components/StorageStrip';
import UploadModal from './components/UploadModal';
import { ALL_HOME_MOMENTS, FEATURED, RAILS, type HomeTab, type RailConfig } from './data/homeData';

/**
 * Signed-in home (route "/home"). Owns the page state – active tab, favourites, open card, upload
 * dialog, search – and arranges: top bar → hero → storage strip → rails.
 * Data comes from ./data/homeData.ts until the media/album APIs exist.
 */
export default function HomePage() {
  const [tab, setTab] = useState<HomeTab>('all');
  const [selected, setSelected] = useState<Moment | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [savedIds, setSavedIds] = useState<ReadonlySet<string>>(() => new Set());
  const { showToast } = useToast();
  const search = useLibrarySearch(ALL_HOME_MOMENTS);
  const closeSearch = search.close;

  const openMoment = useCallback((m: Moment) => { closeSearch(); setSelected(m); }, [closeSearch]);

  const toggleSave = useCallback((m: Moment) => {
    const willSave = !savedIds.has(m.id);
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (next.has(m.id)) next.delete(m.id); else next.add(m.id);
      return next;
    });
    showToast(willSave ? `“${m.title}” added to favourites` : `“${m.title}” removed from favourites`);
  }, [savedIds, showToast]);

  // Rails for the current tab; a "Your favourites" rail appears once something is hearted.
  const rails = useMemo<RailConfig[]>(() => {
    const favourites = ALL_HOME_MOMENTS.filter((m) => savedIds.has(m.id));
    const all = favourites.length ? [{ id: 'favourites', title: 'Your favourites', items: favourites }, ...RAILS] : RAILS;
    return all
      .map((rail) => ({ ...rail, items: tab === 'all' ? rail.items : rail.items.filter((m) => m.kind === tab) }))
      .filter((rail) => rail.items.length > 0);
  }, [tab, savedIds]);

  return (
    <div className="app-shell">
      <div className="ambient-glow" aria-hidden="true" />
      <HomeNavbar tab={tab} onTab={setTab} search={search} onUpload={() => setUploadOpen(true)} />

      {search.query.trim() !== '' && <SearchResults query={search.query} results={search.results} onSelect={openMoment} />}

      <main className="home-main">
        {tab === 'all' && <HomeHero moment={FEATURED} onOpen={openMoment} />}
        {tab === 'all' && <StorageStrip onUpload={() => setUploadOpen(true)} />}

        <div className="rails-wrap">
          {rails.map((rail) => (
            <ContentRail key={rail.id} title={rail.title} ranked={rail.ranked}>
              {rail.items.map((m, index) => (
                <MomentCard key={m.id} moment={m} rank={rail.ranked ? index + 1 : undefined} saved={savedIds.has(m.id)} onOpen={openMoment} onToggleSave={toggleSave} />
              ))}
            </ContentRail>
          ))}

          {rails.length === 0 && (
            <div className="empty-collection">
              <span><ImagePlus size={26} aria-hidden="true" /></span>
              <h2>Nothing here yet</h2>
              <p>Upload something and it will show up in this tab.</p>
              <button type="button" className="button button-primary" onClick={() => setUploadOpen(true)}>Upload files</button>
            </div>
          )}
        </div>
      </main>

      <footer className="site-footer">
        <small>© {new Date().getFullYear()} Momento. Your library is private by default.</small>
      </footer>

      {selected && (
        <DetailModal key={selected.id} moment={selected} saved={savedIds.has(selected.id)} onToggleSave={toggleSave} onClose={() => setSelected(null)} />
      )}
      {uploadOpen && <UploadModal onClose={() => setUploadOpen(false)} />}
    </div>
  );
}
