import { useState } from 'react';
import { Check, Copy, Link2, X } from 'lucide-react';
import Reveal from '../../../shared/components/ui/Reveal';
import { useToast } from '../../../shared/components/ui/Toast';
import { useCopyToClipboard } from '../../../shared/hooks/useCopyToClipboard';
import { DEMO_SHARE_URL, EXPIRY_OPTIONS, GRADIENTS, SHARING_SECTION } from '../data/content';
import type { ShareExpiry, SharePermission } from '../types';

/** Chip showing one thing a visitor can (✓) or cannot (✕) do. */
function PermissionChip({ label, allowed }: { label: string; allowed: boolean }) {
  return (
    <span className={`perm-chip${allowed ? ' is-on' : ''}`}>
      {allowed ? <Check size={13} aria-hidden="true" /> : <X size={13} aria-hidden="true" />}
      {label}
    </span>
  );
}

/**
 * Interactive mock of the "private link" share dialog – copy the link, switch
 * view/download, pick an expiry and revoke the link. Nothing is saved; it only shows the idea.
 *
 * This mirrors your `shares` table (LINK type, VIEW/DOWNLOAD permission, expiry, revoked flag),
 * so it can later be replaced by a real dialog that calls the Sharing API.
 */
export default function SharingDemo() {
  const [permission, setPermission] = useState<SharePermission>('view');
  const [expiry, setExpiry] = useState<ShareExpiry>('7d');
  const [active, setActive] = useState(true);

  const { copied, copy } = useCopyToClipboard();
  const { showToast } = useToast();

  const expirySummary = EXPIRY_OPTIONS.find((option) => option.value === expiry)?.summary ?? '';

  const handleCopy = async () => {
    const ok = await copy(DEMO_SHARE_URL);
    showToast(ok ? 'Demo link copied to your clipboard' : 'Could not copy – your browser blocked clipboard access');
  };

  return (
    <section id="sharing" className="section" aria-labelledby="sharing-title">
      <div className="share-layout">
        {/* ---- Left: copy ---- */}
        <Reveal className="share-copy">
          <p className="eyebrow">{SHARING_SECTION.eyebrow}</p>
          <h2 id="sharing-title">{SHARING_SECTION.title}</h2>
          <p>{SHARING_SECTION.description}</p>
          <ul className="check-list">
            {SHARING_SECTION.bullets.map((bullet) => (
              <li key={bullet}>
                <Check size={16} aria-hidden="true" />
                {bullet}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* ---- Right: interactive panel ---- */}
        <Reveal delay={100}>
          <div className="share-panel" role="group" aria-label="Sharing demo">
            <div className="share-panel-title">
              <i className="share-thumb" style={{ background: GRADIENTS.sunset }} aria-hidden="true" />
              <div>
                <b>Share “Goa Trip” album</b>
                <small>Demo only – nothing is saved</small>
              </div>
            </div>

            {/* Link + copy */}
            <div className="share-link-row">
              <Link2 size={15} aria-hidden="true" />
              <span className={`share-link${active ? '' : ' is-revoked'}`}>{DEMO_SHARE_URL}</span>
              <button
                type="button"
                className="button button-accent button-sm"
                onClick={handleCopy}
                disabled={!active}
              >
                {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>

            {/* Permission: VIEW or DOWNLOAD */}
            <div>
              <span id="permission-label" className="field-label">
                Permission
              </span>
              <div className="segmented" role="radiogroup" aria-labelledby="permission-label">
                <button
                  type="button"
                  role="radio"
                  aria-checked={permission === 'view'}
                  onClick={() => setPermission('view')}
                >
                  View only
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={permission === 'download'}
                  onClick={() => setPermission('download')}
                >
                  View + download
                </button>
              </div>
            </div>

            {/* Expiry */}
            <div>
              <label htmlFor="share-expiry" className="field-label">
                Link expires
              </label>
              <select
                id="share-expiry"
                className="demo-select"
                value={expiry}
                disabled={!active}
                onChange={(event) => setExpiry(event.target.value as ShareExpiry)}
              >
                {EXPIRY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Revoke switch */}
            <div className="switch-row">
              <div>
                <b>Link active</b>
                <small>{active ? expirySummary : 'Revoked – nobody can open this link'}</small>
              </div>
              <button
                type="button"
                role="switch"
                className="switch"
                aria-checked={active}
                aria-label="Link active"
                onClick={() => setActive((value) => !value)}
              />
            </div>

            {/* What a visitor can do – reacts to the controls above */}
            <div>
              <span className="field-label">What a visitor can do</span>
              <div className="visitor-can" aria-live="polite">
                <PermissionChip label="View" allowed={active} />
                <PermissionChip label="Download" allowed={active && permission === 'download'} />
                <PermissionChip label="No account needed" allowed={active} />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
