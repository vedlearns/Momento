import { useState } from 'react';
import { Plus } from 'lucide-react';
import Reveal from '../../../shared/components/ui/Reveal';
import { FAQ_SECTION, FAQS } from '../data/content';

/** Accordion – one answer open at a time. Edit questions in data/content.ts → FAQS. */
export default function Faq() {
  // Which question is open. Start with the first one open; use `null` to start with all closed.
  const [openId, setOpenId] = useState<string | null>(FAQS[0]?.id ?? null);

  return (
    <section id="faq" className="section" aria-labelledby="faq-title">
      <div className="section-inner">
        <Reveal className="section-intro">
          <p className="eyebrow">{FAQ_SECTION.eyebrow}</p>
          <h2 id="faq-title">{FAQ_SECTION.title}</h2>
        </Reveal>

        <Reveal>
          <div className="faq-list">
            {FAQS.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div key={item.id} className={`faq-item${isOpen ? ' is-open' : ''}`}>
                  <h3 className="faq-heading">
                    <button
                      type="button"
                      id={`faq-question-${item.id}`}
                      className="faq-question"
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${item.id}`}
                      onClick={() => setOpenId(isOpen ? null : item.id)}
                    >
                      <span>{item.question}</span>
                      <Plus className="faq-icon" size={18} aria-hidden="true" />
                    </button>
                  </h3>
                  <div
                    id={`faq-answer-${item.id}`}
                    role="region"
                    aria-labelledby={`faq-question-${item.id}`}
                    className="faq-answer"
                  >
                    <div>
                      <p>{item.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
