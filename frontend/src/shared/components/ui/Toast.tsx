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
 * App-wide toast notifications.
 *
 * 1. Wrap your app once:   <ToastProvider><App /></ToastProvider>
 * 2. Anywhere below it:    const { showToast } = useToast(); showToast('Saved!');
 *
 * Styling lives in `.toast` (index.css).
 */

const TOAST_DURATION_MS = 2800;

interface ToastContextValue {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const showToast = useCallback((next: string) => {
    setMessage(next);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMessage(null), TOAST_DURATION_MS);
  }, []);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* The live region stays mounted so screen readers announce new messages. */}
      <div aria-live="polite">
        {message && (
          <div className="toast" role="status">
            <Check size={16} aria-hidden="true" />
            <span>{message}</span>
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside <ToastProvider>');
  return context;
}
