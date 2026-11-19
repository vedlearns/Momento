import { Link } from 'react-router-dom';
import Reveal from '../../../shared/components/ui/Reveal';
import { CTA } from '../data/content';
import WaitlistForm from './WaitlistForm';

/** Big closing banner with the waitlist form. The `id="waitlist"` is where the plan buttons jump to. */
export default function FinalCta() {
  return (
    <section id="waitlist" className="cta-section" aria-labelledby="cta-title">
      <Reveal>
        <div className="cta-card">
          <h2 id="cta-title">{CTA.title}</h2>
          <p>{CTA.description}</p>
          <WaitlistForm />
          <p className="cta-alt">
            {CTA.alt} <Link to="/register">{CTA.altLink}</Link>
          </p>
        </div>
      </Reveal>
    </section>
  );
}
