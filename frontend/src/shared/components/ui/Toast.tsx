
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { Check } from 'lucide-react';

/**
 * TOAST NOTIFICATION SYSTEM
 *
 * A toast is a small popup message that appears temporarily
 * on the screen, for example: "Saved successfully!"
 *
 * This system allows us to show toast messages from anywhere
 * inside our React application.
 *
 * HOW TO USE:
 *
 * 1. Wrap your app with ToastProvider:
 *    <ToastProvider>
 *      <App />
 *    </ToastProvider>
 *
 * 2. Use the useToast hook in any child component:
 *    const { showToast } = useToast();
 *
 * 3. Show a message:
 *    showToast('Saved successfully!');
 *
 * The toast automatically disappears after 2.8 seconds.
 */

// How long the toast message should stay visible (in milliseconds).
// 2800 milliseconds = 2.8 seconds.
const TOAST_DURATION_MS = 2800;


// Defines the structure of the data that our Toast Context will provide.
// It contains one function called showToast.
// This function accepts a message (string) and returns nothing (void).
interface ToastContextValue {
  showToast: (message: string) => void;
}


// Create a React Context to share the showToast function
// with all components inside ToastProvider.
//
// null is the default value because no provider is available initially.
const ToastContext = createContext<ToastContextValue | null>(null);


// ToastProvider is a wrapper component that manages toast notifications.
//
// Any component placed inside ToastProvider can use the useToast hook
// to display a toast message.
export function ToastProvider({ children }: { children: ReactNode }) {

  // Stores the current toast message.
  //
  // null means no toast is currently visible.
  // A string means a toast message should be displayed.
  const [message, setMessage] = useState<string | null>(null);


  // useRef stores the timer ID.
  //
  // We use useRef because we want to remember the timer ID
  // without causing the component to re-render whenever it changes.
  //
  // The timer ID helps us cancel an existing timeout when
  // a new toast message is displayed.
  const timer = useRef<number | undefined>(undefined);


  // Function to display a toast message.
  //
  // useCallback remembers this function between renders
  // so that React doesn't create a new function unnecessarily.
  const showToast = useCallback((next: string) => {

    // Update the message state.
    // This makes the toast appear on the screen.
    setMessage(next);


    // Clear any previously running timer.
    //
    // Example:
    // If a new toast appears before the previous one disappears,
    // we cancel the old timer so the new message gets its full duration.
    window.clearTimeout(timer.current);


    // Start a new timer.
    //
    // After 2800 milliseconds, set the message to null.
    // This automatically hides the toast.
    timer.current = window.setTimeout(() => {
      setMessage(null);
    }, TOAST_DURATION_MS);

  }, []);


  // useEffect runs when the component is mounted.
  //
  // The returned cleanup function runs when ToastProvider
  // is removed from the application.
  //
  // We clear the timer during cleanup to prevent an old timer
  // from running after the component has been removed.
  useEffect(() => {

    return () => {
      window.clearTimeout(timer.current);
    };

  }, []);


  // useMemo remembers the context value object.
  //
  // Instead of creating a new object on every render,
  // React reuses the previous object as long as showToast
  // has not changed.
  //
  // This helps avoid unnecessary updates in context consumers.
  const value = useMemo(() => ({
    showToast
  }), [showToast]);


  // Provide the showToast function to all child components.
  return (
    <ToastContext.Provider value={value}>

      {/* 
        children represents the rest of our application.
        All components inside this provider can access showToast.
      */}
      {children}


      {/*
        This is an accessibility feature.

        aria-live="polite" tells screen readers to announce
        new messages when they appear without interrupting
        whatever the user is currently doing.
      */}
      <div aria-live="polite">

        {/*
          Only display the toast when message is not null.

          If message is null, nothing is displayed.
          If message contains text, the toast appears.
        */}
        {message && (

          // The toast popup.
          // The "toast" class contains its visual styling in index.css.
          <div className="toast" role="status">

            {/*
              Display a checkmark icon to indicate success.

              size={16} sets the icon size to 16 pixels.
              aria-hidden="true" hides this decorative icon
              from screen readers.
            */}
            <Check size={16} aria-hidden="true" />

            {/* Display the actual toast message. */}
            <span>{message}</span>

          </div>
        )}

      </div>

    </ToastContext.Provider>
  );
}


// Custom hook to access the Toast Context.
//
// Instead of importing and using ToastContext directly
// in every component, we can simply call useToast().
export function useToast(): ToastContextValue {

  // Get the value provided by ToastProvider.
  const context = useContext(ToastContext);


  // Check whether this component is inside ToastProvider.
  //
  // If context is null, it means the component is being used
  // outside ToastProvider.
  //
  // Throw an error to help developers identify the problem.
  if (!context) {
    throw new Error('useToast must be used inside <ToastProvider>');
  }


  // Return the context value.
  //
  // This gives the component access to showToast().
  return context;
}
