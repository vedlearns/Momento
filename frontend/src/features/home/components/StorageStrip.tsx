import { Link } from 'react-router-dom';
import { Upload } from 'lucide-react';
import { STORAGE, USER } from '../../../../../../momento-landing-home/momento-landing/src/features/home/data/homeData';

/** Greeting + storage meter. The meter will later read the user's plan from the subscription module. */
export default function StorageStrip({ onUpload }: { onUpload: () => void }) {
  const percent = Math.min(100, (STORAGE.usedGb / STORAGE.totalGb) * 100);
  return (
    <section className="home-strip" aria-label="Storage">
      <div>
        <h2>Welcome back, {USER.name}</h2>
        <p>Everything here is private until you share it.</p>
      </div>
      <div className="storage">
        <div className="storage-head">
          <b>{STORAGE.usedGb} GB of {STORAGE.totalGb} GB used</b>
          <span>{STORAGE.plan} plan</span>
        </div>
        <div className="storage-bar" role="progressbar" aria-label="Storage used" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(percent)}>
          <span style={{ width: `${percent}%` }} />
        </div>
        <Link to="/#plans" className="storage-link">Get more storage</Link>
      </div>
      <button type="button" className="button button-outline" onClick={onUpload}>
        <Upload size={14} aria-hidden="true" /> Upload photos &amp; videos
      </button>
    </section>
  );
}
