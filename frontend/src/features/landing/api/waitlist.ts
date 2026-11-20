/**
 * Waitlist API client.
 *
 * ──────────────────────────────────────────────────────────────────────────
 *  BACKEND CONTRACT (does not exist yet – add it to your Spring Boot app)
 *    POST {VITE_API_BASE_URL}/api/v1/waitlist
 *    Body:     { "email": "user@example.com" }
 *    Success:  any 2xx (201 Created recommended; make it idempotent so a repeated
 *              email also returns 2xx instead of an error)
 *    Failure:  any non-2xx → the form shows a generic error message
 *
 *  Remember to enable CORS for your frontend origin and to add rate limiting.
 * ──────────────────────────────────────────────────────────────────────────
 *
 *  While VITE_API_BASE_URL is NOT set, a local mock is used: it waits a moment and stores the
 *  email in localStorage so the form is fully demoable without a backend.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const MOCK_STORAGE_KEY = 'momentostreaming.waitlist.mock';
const MOCK_DELAY_MS = 700;

export async function joinWaitlist(email: string): Promise<void> {
  if (!API_BASE_URL) {
    await new Promise((resolve) => window.setTimeout(resolve, MOCK_DELAY_MS));
    try {
      const saved = JSON.parse(localStorage.getItem(MOCK_STORAGE_KEY) ?? '[]') as string[];
      if (!saved.includes(email)) {
        saved.push(email);
        localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(saved));
      }
    } catch {
      // localStorage can be unavailable (private mode); the mock still "succeeds".
    }
    return;
  }

  const response = await fetch(`${API_BASE_URL}/api/v1/waitlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error(`Waitlist request failed with status ${response.status}`);
  }
}
