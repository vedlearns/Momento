import Reveal from '../../../shared/components/ui/Reveal';
import { CONTINUE_WATCHING, LIBRARY_SECTION, TOP_ALBUMS } from '../data/content';
import type { Moment } from '../types';
import ContentRail from './ContentRail';
import MomentCard from './MomentCard';

interface LibraryPreviewProps {
  savedIds: ReadonlySet<string>;
  onOpen: (moment: Moment) => void;
  onToggleSave: (moment: Moment) => void;
}

/**
 * "A peek inside" – two interactive rails with sample media, so visitors can feel the product.
 * Add or remove rails by adding another <ContentRail> and a data array in content.ts.
 */
export default function LibraryPreview({ savedIds, onOpen, onToggleSave }: LibraryPreviewProps) {
  return (
    <section id="library" className="library" aria-labelledby="library-title">
      <Reveal className="section-intro">
        <p className="eyebrow">{LIBRARY_SECTION.eyebrow}</p>
        <h2 id="library-title">{LIBRARY_SECTION.title}</h2>
        <p>{LIBRARY_SECTION.description}</p>
      </Reveal>

      <div className="rails-wrap">
        <ContentRail title="Continue watching">
          {CONTINUE_WATCHING.map((moment) => (
            <MomentCard
              key={moment.id}
              moment={moment}
              saved={savedIds.has(moment.id)}
              onOpen={onOpen}
              onToggleSave={onToggleSave}
            />
          ))}
        </ContentRail>

        <ContentRail title="Your most-viewed albums" ranked>
          {TOP_ALBUMS.map((moment, index) => (
            <MomentCard
              key={moment.id}
              moment={moment}
              rank={index + 1}
              saved={savedIds.has(moment.id)}
              onOpen={onOpen}
              onToggleSave={onToggleSave}
            />
          ))}
        </ContentRail>
      </div>

      <p className="sample-note">{LIBRARY_SECTION.note}</p>
    </section>
  );
}
