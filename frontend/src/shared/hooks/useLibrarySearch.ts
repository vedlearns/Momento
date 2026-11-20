import { useCallback, useMemo, useState } from 'react';
import type { Moment } from '../types/types';

/**
 * State + filtering for the top-bar search of the sample library.
 *
 * When the real search exists (PostgreSQL full-text search behind your API), keep this hook's
 * return shape and replace the `results` calculation with a TanStack Query call.
 */

// Create a custom hook called useLibrarySearch.
// items = Array of Moment objects that we want to search.
export function useLibrarySearch(items: readonly Moment[]) {

  // Stores whether the search bar is open or closed.
  // false = closed
  // true = open
  const [open, setOpen] = useState(false);


  // Stores the text entered by the user in the search input.
  // Initially, the search input is empty.
  const [query, setQuery] = useState('');


  // Calculate the search results.
  //
  // useMemo remembers the previous results.
  // It recalculates them only when items or query changes.
  const results = useMemo(() => {

    // Remove extra spaces from the beginning and end.
    // Convert the search text to lowercase.
    //
    // Example:
    // "  MOVIE " becomes "movie"
    const needle = query.trim().toLowerCase();


    // If the search input is empty,
    // return an empty array because there is nothing to search.
    if (!needle) return [];


    // Go through every Moment in the items array.
    // Keep only the moments that match the search text.
    return items.filter((item) =>

      // Check these four properties of each Moment:
      // title, kind, subtitle and description.
      //
      // .some() returns true if at least ONE field matches.
      [
        item.title,
        item.kind,
        item.subtitle,
        item.description
      ].some((field) =>

        // Convert the field to lowercase.
        // Check whether it contains the user's search text.
        field.toLowerCase().includes(needle)

      )

    );

  }, [items, query]);
  // Recalculate results whenever items or query changes.


  // Function to close the search bar and clear the search.
  //
  // useCallback remembers this function between renders.
  const close = useCallback(() => {

    // Set search bar to closed.
    setOpen(false);

    // Clear the search input.
    setQuery('');

  }, []);


  // Function to open or close the search bar.
  const toggle = useCallback(() => {

    // If the search bar is already open,
    // call close() to close it and clear the search.
    if (open) close();

    // Otherwise, open the search bar.
    else setOpen(true);

  }, [open, close]);
  // Recreate this function if open or close changes.


  // Return everything that other components need.
  //
  // A component using this hook can access:
  // open    = Whether search is open.
  // query   = Text entered by the user.
  // setQuery = Function to update search text.
  // results = Matching search results.
  // close   = Function to close and clear search.
  // toggle  = Function to open or close search.

  //  example - {
  //   open: true,
  //   query: "batman",
  //   setQuery: function,
  //   results: [
  //     { id: "1", title: "Batman" }
  //   ],
  //   close: function,
  //   toggle: function
  // }

  // how it will be used in other components , eg -
  // const search = useLibrarySearch(items);
  // <button onClick={search.toggle}>
  //   Search
  // </button>

  return {
    open,
    query,
    setQuery,
    results,
    close,
    toggle
  };

}


// Automatically create a TypeScript type from the return value
// of useLibrarySearch.
//
// This means we don't have to manually write the type
// of open, query, results, close, toggle, etc.
export type LibrarySearch = ReturnType<typeof useLibrarySearch>;