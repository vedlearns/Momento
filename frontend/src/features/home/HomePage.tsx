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

// Importing data and TypeScript types used by this page.
// ALL_HOME_MOMENTS = all available moments.
// FEATURED = the featured moment shown in the hero.
// RAILS = configuration for different content sections.
// HomeTab and RailConfig = TypeScript types.
import {
  ALL_HOME_MOMENTS,
  FEATURED,
  RAILS,
  type HomeTab,
  type RailConfig
} from './data/homeData';

/**
 * This is the main HomePage component.
 *
 * It manages:
 * 1. Which tab is currently selected.
 * 2. Which moment is currently opened.
 * 3. Whether the upload modal is open.
 * 4. Which moments are saved as favourites.
 * 5. Searching through the media library.
 *
 * It also brings together all the smaller components
 * to build the complete home page.
 */

export default function HomePage() {

  // STATE 1: Active tab.
  //
  // tab = stores the currently selected tab.
  // setTab = function used to change the selected tab.
  //
  // HomeTab is a TypeScript type.
  // It restricts tab to only the allowed tab values.
  // Initial value is 'all'.

  const [tab, setTab] = useState<HomeTab>('all');


  // STATE 2: Currently selected moment.
  //
  // Moment | null means:
  // - Moment = a moment object is selected.
  // - null = no moment is currently selected.
  //
  // Initially null because no detail modal is open.

  const [selected, setSelected] = useState<Moment | null>(null);


  // STATE 3: Upload modal visibility.
  //
  // false = upload modal is closed.
  // true = upload modal is open.
  //
  // Initially, the upload modal is closed.

  const [uploadOpen, setUploadOpen] = useState(false);


  // STATE 4: Favourite moments.
  //
  // Set is a JavaScript data structure that stores unique values.
  // Here, we store the IDs of moments that the user has favourited.
  //
  // ReadonlySet<string> means:
  // - Set = collection of unique values.
  // - string = each value is a string (moment ID).
  // - Readonly = this state value should not be modified directly.
  //
  // new Set() creates an empty set.
  // Initially, the user has no favourites.

  //  () => new Set()  , This is called a lazy initializer. React receives a function that creates the initial Set.
  // It is useful when creating the initial state involves expensive calculations because 
  // React only uses the initializer to obtain the initial state, rather than recreating that initial value on every render.

  /*
  Means:
  Create a React state variable named savedIds.
  Its value will be a Set containing unique strings.
  The initial value will be an empty Set.
  The Set is read-only from the TypeScript perspective.
  Use setSavedIds whenever you want to update it.
  */

  const [savedIds, setSavedIds] = useState<ReadonlySet<string>>(
    () => new Set()
  );


  // Calling our custom toast hook.
  //
  // showToast is a function that displays a notification.
  // We will use it when a moment is added to or removed from favourites.

  const { showToast } = useToast();


  // Calling our custom search hook.
  //
  // We pass ALL_HOME_MOMENTS to it.
  // This hook handles searching through all available moments.
  //
  // search contains the search-related data and functions.
  // For example: search.query, search.results, search.close.

  const search = useLibrarySearch(ALL_HOME_MOMENTS);


  // Extracting the close function from the search object.
  //
  // Instead of writing search.close everywhere,
  // we can simply use closeSearch.

  const closeSearch = search.close;


  // FUNCTION 1: Open a moment.
  //
  // useCallback remembers this function between renders
  // unless one of its dependencies changes.
  //
  // When called:
  // 1. Close the search results.
  // 2. Store the clicked moment in selected state.
  //
  // Changing selected will cause React to render the DetailModal.

  const openMoment = useCallback(
    (m: Moment) => {
      // First, close the search bar and clear its search text.
      closeSearch();
      // Second, store the clicked moment in selected state.
      // This tells React which moment's details should be displayed.
      setSelected(m);
    },
    [closeSearch]
  );


  // FUNCTION 2: Add or remove a moment from favourites.
  //
  // This function is called when the user clicks the heart icon.
  //
  // m = the moment that the user clicked.

  const toggleSave = useCallback((m: Moment) => {

    // Check whether this moment is already saved.
    //
    // If it is NOT saved, willSave becomes true.
    // If it IS saved, willSave becomes false.

    const willSave = !savedIds.has(m.id);


    // Update the favourites state.
    //
    // React gives us the previous state through prev.
    // We create a NEW Set instead of modifying the old one.
    //
    // This is important because React detects state changes
    // using the new state reference.

    setSavedIds((prev) => {

      // Create a copy of the previous favourites.
      const next = new Set(prev);

      // If the moment already exists, remove it.
      // Otherwise, add it.

      if (next.has(m.id)) {
        next.delete(m.id);
      } else {
        next.add(m.id);
      }

      // Return the updated Set to React.
      return next;
    });


    // Show a notification depending on what happened.
    //
    // If willSave is true:
    // Show "added to favourites".
    //
    // Otherwise:
    // Show "removed from favourites".

    showToast(
      willSave
        ? `“${m.title}” added to favourites`
        : `“${m.title}” removed from favourites`
    );

  }, [savedIds, showToast]);


  // MEMOIZATION: Calculate the content rails.
  //
  // useMemo remembers the calculated result.
  // It recalculates only when tab or savedIds changes.
  //
  // RailConfig[] tells TypeScript that the result
  // should be an array of RailConfig objects.

  const rails = useMemo<RailConfig[]>(() => {

    // STEP 1: Find all moments that the user has favourited.
    //
    // filter() creates a new array containing only
    // the moments whose IDs exist in savedIds.

    const favourites = ALL_HOME_MOMENTS.filter(
      (m) => savedIds.has(m.id)
    );


    // STEP 2: Create the complete list of rails.
    //
    // If the user has favourites:
    // Add a "Your favourites" section at the beginning.
    //
    // If there are no favourites:
    // Just use the original RAILS.

    const all = favourites.length
      ? [
          {
            id: 'favourites',
            title: 'Your favourites',
            items: favourites
          },
          ...RAILS
        ]
      : RAILS;


    // STEP 3: Filter the rails according to the selected tab.
    //
    // map() goes through every rail and creates an updated rail.
    //
    // If tab is 'all':
    // Show all items in that rail.
    //
    // Otherwise:
    // Only show moments whose kind matches the selected tab.

    return all

      .map((rail) => ({
        ...rail,

        items:
          tab === 'all'
            ? rail.items
            : rail.items.filter((m) => m.kind === tab)
      }))


      // STEP 4: Remove empty rails.
      //
      // If a rail has no moments after filtering,
      // we don't need to display that section.
      //
      // So we keep only rails that have at least one item.

      .filter((rail) => rail.items.length > 0);


    // Dependencies:
    // Recalculate rails when the selected tab changes
    // or when the favourites collection changes.

  }, [tab, savedIds]);


  // RETURN: Everything that should appear on the screen.
  //
  // JSX describes the UI that React renders.

  return (

    // Main wrapper for the entire application page.
    <div className="app-shell">

      {/* Decorative background glow. */}
      <div className="ambient-glow" aria-hidden="true" />


      {/* NAVBAR
          Pass the current tab and setTab function.
          Navbar can use setTab to change the active tab.
          Also pass search functionality and upload button action. */}

      <HomeNavbar
        tab={tab}
        onTab={setTab}
        search={search}
        onUpload={() => setUploadOpen(true)}
      />


      {/* SEARCH RESULTS
          Only display SearchResults when the search query
          contains something other than whitespace.
          
          onSelect calls openMoment when a result is clicked. */}

      {search.query.trim() !== '' && (
        <SearchResults
          query={search.query}
          results={search.results}
          onSelect={openMoment}
        />
      )}


      {/* MAIN CONTENT OF THE HOME PAGE. */}

      <main className="home-main">


        {/* HERO SECTION
            Show the featured moment only when the 'all' tab is selected. */}

        {tab === 'all' && (
          <HomeHero
            moment={FEATURED}
            onOpen={openMoment}
          />
        )}


        {/* STORAGE SECTION
            Also show this only on the 'all' tab.
            Clicking upload opens the upload modal. */}

        {tab === 'all' && (
          <StorageStrip
            onUpload={() => setUploadOpen(true)}
          />
        )}


        {/* CONTENT RAILS
            This wrapper contains all the horizontal content sections. */}

        <div className="rails-wrap">


          {/* LOOP THROUGH EVERY RAIL.
              rails.map() creates one ContentRail component
              for every rail in the rails array. */}

          {rails.map((rail) => (

            // One content section, such as:
            // Your favourites, Recent moments, etc.

            <ContentRail
              key={rail.id}
              title={rail.title}
              ranked={rail.ranked}
            >

              {/* LOOP THROUGH EVERY MOMENT INSIDE THIS RAIL.
                  Each moment gets its own MomentCard component. */}

              {rail.items.map((m, index) => (

                <MomentCard
                  key={m.id}

                  // The actual moment data.
                  moment={m}

                  // If this rail is ranked, show its position.
                  // Otherwise, rank will be undefined.

                  rank={
                    rail.ranked
                      ? index + 1
                      : undefined
                  }

                  // Check whether this moment is saved.
                  // This controls the favourite/heart state.

                  saved={savedIds.has(m.id)}

                  // Open the detail modal when clicked.
                  onOpen={openMoment}

                  // Add or remove this moment from favourites.
                  onToggleSave={toggleSave}
                />

              ))}

            </ContentRail>

          ))}


          {/* EMPTY STATE
              If there are no rails to display,
              show a message asking the user to upload files. */}

          {rails.length === 0 && (

            <div className="empty-collection">

              {/* ImagePlus icon from lucide-react. */}
              <span>
                <ImagePlus size={26} aria-hidden="true" />
              </span>

              <h2>Nothing here yet</h2>

              <p>
                Upload something and it will show up in this tab.
              </p>

              {/* Clicking this button opens the upload modal. */}

              <button
                type="button"
                className="button button-primary"
                onClick={() => setUploadOpen(true)}
              >
                Upload files
              </button>

            </div>
          )}

        </div>

      </main>


      {/* FOOTER
          Displays copyright information.
          getFullYear() automatically gets the current year. */}

      <footer className="site-footer">
        <small>
          © {new Date().getFullYear()} Momento ST.
          Your library is private by default.
        </small>
      </footer>


      {/* DETAIL MODAL
          Only render this component if selected is not null.
          
          When a moment is clicked:
          selected gets that moment object.
          React then renders this modal.

          When the close button is clicked:
          setSelected(null) closes the modal. */}

      {selected && (

        <DetailModal
          key={selected.id}
          moment={selected}
          saved={savedIds.has(selected.id)}
          onToggleSave={toggleSave}
          onClose={() => setSelected(null)}
        />

      )}


      {/* UPLOAD MODAL
          Only render when uploadOpen is true.
          
          onClose changes uploadOpen back to false,
          which closes the modal. */}

      {uploadOpen && (
        <UploadModal
          onClose={() => setUploadOpen(false)}
        />
      )}

    </div>
  );
}
