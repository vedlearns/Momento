import { useState, type FormEvent } from 'react';
import { CheckCircle2, Loader2, Mail } from 'lucide-react';
import { isValidEmail } from '../utils/validation';
import { joinWaitlist } from '../api/waitlist';

type Status = 'idle' | 'loading' | 'success' | 'error';

/**
 * Email capture form: validates, shows a spinner, then a success message.
 * Talks to the backend through api/waitlist.ts (a local mock until VITE_API_BASE_URL is set).
 */
export default function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === 'loading') return;

    if (!isValidEmail(email)) {
      setStatus('error');
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');
    try {
      await joinWaitlist(email.trim());
      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again in a moment.');
    }
  };

  if (status === 'success') {
    return (
      <div className="waitlist-success" role="status">
        <CheckCircle2 size={20} aria-hidden="true" />
        <span>
          You’re on the list. We’ll email <b>{email.trim()}</b> when Momento opens up.
        </span>
      </div>
    );
  }

  const hasError = status === 'error';

  return (
    <form className="waitlist-form" onSubmit={handleSubmit} noValidate>
      <label htmlFor="waitlist-email" className="sr-only">
        Email address
      </label>
      <div className="waitlist-row">
        <Mail size={16} aria-hidden="true" />
        <input
          id="waitlist-email"
          className="waitlist-input"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          disabled={status === 'loading'}
          aria-invalid={hasError}
          aria-describedby="waitlist-message"
          onChange={(event) => {
            setEmail(event.target.value);
            if (hasError) setStatus('idle');
          }}
        />
        <button type="submit" className="button button-primary" disabled={status === 'loading'}>
          {status === 'loading' ? <Loader2 className="spin" size={15} aria-label="Sending" /> : 'Notify me'}
        </button>
      </div>
      <p
        id="waitlist-message"
        className={`form-message${hasError ? ' is-error' : ''}`}
        role={hasError ? 'alert' : undefined}
      >
        {hasError ? errorMessage : 'No spam. One email when we launch.'}
      </p>
    </form>
  );
}
