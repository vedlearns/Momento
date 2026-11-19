import { useCallback, useState } from 'react';
import BackToTop from '../../shared/components/ui/BackToTop';
import ScrollProgress from '../../shared/components/ui/ScrollProgress';
import { useToast } from '../../shared/components/ui/Toast';
import { useScrollSpy } from '../../shared/hooks/useScrollSpy';
import DetailModal from '../../shared/components/common/DetailModal';
import Faq from './components/Faq';
import Features from './components/Features';
import FinalCta from './components/FinalCta';
import Footer from './components/Footer';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import LibraryPreview from './components/LibraryPreview';
import Navbar from './components/Navbar';
import Plans from './components/Plans';
import SearchResults from '../../shared/components/common/SearchResults';
import SharingDemo from './components/SharingDemo';
import StatsStrip from './components/StatsStrip';
import { ALL_MOMENTS, HERO_MOMENT, SECTION_IDS } from './data/content';
import { useLibrarySearch } from '../../shared/hooks/useLibrarySearch';
import type { Moment } from '../../shared/types/types';

/**
 * The public landing page (route "/").
 *
 * This component only owns the page-level state – which sample card is open, which are
 * "favourited", and the search box – and arranges the sections in order.
 * To reorder sections, move the JSX lines in <main>. To add one, create a component in
 * ./components, give it an `id`, and (if it should appear in the nav) add it to NAV_LINKS.
 */
export default function LandingPage() {
  const [selected, setSelected] = useState<Moment | null>(null);
  const [savedIds, setSavedIds] = useState<ReadonlySet<string>>(() => new Set());

  const { showToast } = useToast();
  const activeSection = useScrollSpy(SECTION_IDS);
  const search = useLibrarySearch(ALL_MOMENTS);
  const closeSearch = search.close;

  const openMoment = useCallback(
    (moment: Moment) => {
      closeSearch();
      setSelected(moment);
    },
    [closeSearch],
  );

  const toggleSave = useCallback(
    (moment: Moment) => {
      const willSave = !savedIds.has(moment.id);
      setSavedIds((previous) => {
        const next = new Set(previous);
        if (next.has(moment.id)) next.delete(moment.id);
        else next.add(moment.id);
        return next;
      });
      showToast(
        willSave ? `“${moment.title}” added to favourites (demo)` : `“${moment.title}” removed from favourites`,
      );
    },
    [savedIds, showToast],
  );

  return (
    <div id="top" className="app-shell">
      <ScrollProgress />
      <div className="ambient-glow" aria-hidden="true" />

      <Navbar activeSection={activeSection} search={search} />

      {search.query.trim() !== '' && (
        <SearchResults query={search.query} results={search.results} onSelect={openMoment} />
      )}

      <main>
        <Hero onPreview={() => openMoment(HERO_MOMENT)} />
        <LibraryPreview savedIds={savedIds} onOpen={openMoment} onToggleSave={toggleSave} />
        <StatsStrip />
        <Features />
        <HowItWorks />
        <SharingDemo />
        <Plans />
        <Faq />
        <FinalCta />
      </main>

      <Footer />
      <BackToTop />

      {selected && (
        <DetailModal
          key={selected.id}
          moment={selected}
          saved={savedIds.has(selected.id)}
          onToggleSave={toggleSave}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
