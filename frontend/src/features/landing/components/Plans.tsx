import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import Reveal from '../../../shared/components/ui/Reveal';
import { PLANS, PLANS_SECTION } from '../data/content';
import type { PlanCta } from '../types';

/** The call-to-action under a plan: a router link for pages, a plain anchor for #sections. */
function PlanButton({ cta, featured }: { cta: PlanCta; featured?: boolean }) {
  const className = `button ${featured ? 'button-accent' : 'button-outline'}`;
  return cta.kind === 'route' ? (
    <Link to={cta.to} className={className}>
      {cta.label}
    </Link>
  ) : (
    <a href={cta.to} className={className}>
      {cta.label}
    </a>
  );
}

/**
 * Three plan cards. For now they are placeholders (no prices). When the payment phase is done,
 * load plans from the API (subscription_plans) and let the buttons start a Razorpay checkout.
 */
export default function Plans() {
  return (
    <section id="plans" className="section section-alt" aria-labelledby="plans-title">
      <div className="section-inner">
        <Reveal className="section-intro">
          <p className="eyebrow">{PLANS_SECTION.eyebrow}</p>
          <h2 id="plans-title">{PLANS_SECTION.title}</h2>
          <p>{PLANS_SECTION.description}</p>
        </Reveal>

        <div className="plan-grid">
          {PLANS.map((plan, index) => (
            <Reveal key={plan.id} delay={index * 100}>
              <article className={`plan-card${plan.featured ? ' is-featured' : ''}`}>
                {plan.badge && <span className="plan-badge">{plan.badge}</span>}
                <h3>{plan.name}</h3>
                <p className="plan-price">{plan.price}</p>
                <p className="plan-tagline">{plan.tagline}</p>
                <ul className="plan-features">
                  {plan.features.map((feature) => (
                    <li key={feature}>
                      <Check size={15} aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <PlanButton cta={plan.cta} featured={plan.featured} />
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
