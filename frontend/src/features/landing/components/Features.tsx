import Reveal from '../../../shared/components/ui/Reveal';
import { FEATURES, FEATURES_SECTION } from '../data/content';

/** Grid of feature cards. Add/remove cards in data/content.ts → FEATURES (icons come from lucide-react). */
export default function Features() {
  return (
    <section id="features" className="section" aria-labelledby="features-title">
      <div className="section-inner">
        <Reveal className="section-intro">
          <p className="eyebrow">{FEATURES_SECTION.eyebrow}</p>
          <h2 id="features-title">{FEATURES_SECTION.title}</h2>
          <p>{FEATURES_SECTION.description}</p>
        </Reveal>

        <div className="feature-grid">
          {FEATURES.map(({ icon: Icon, title, description }, index) => (
            <Reveal key={title} delay={(index % 3) * 80}>
              <article className="feature-card">
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
