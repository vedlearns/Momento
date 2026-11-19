import Reveal from '../../../shared/components/ui/Reveal';
import { HOW_SECTION, STEPS } from '../data/content';

/** Numbered 3-step explainer. Edit the steps in data/content.ts → STEPS. */
export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section section-alt" aria-labelledby="how-title">
      <div className="section-inner">
        <Reveal className="section-intro">
          <p className="eyebrow">{HOW_SECTION.eyebrow}</p>
          <h2 id="how-title">{HOW_SECTION.title}</h2>
        </Reveal>

        <div className="steps">
          {STEPS.map(({ icon: Icon, title, description }, index) => (
            <Reveal key={title} delay={index * 100}>
              <article className="step-card">
                <span className="step-number" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="feature-icon">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
