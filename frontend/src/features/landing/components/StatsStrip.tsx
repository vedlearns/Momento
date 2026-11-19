import Reveal from '../../../shared/components/ui/Reveal';
import { STATS } from '../data/content';

/** Four short facts in a row. Edit the numbers/words in data/content.ts → STATS. */
export default function StatsStrip() {
  return (
    <Reveal className="stats-strip">
      {STATS.map((stat) => (
        <div key={stat.value} className="stat">
          <b>{stat.value}</b>
          <span>{stat.label}</span>
        </div>
      ))}
    </Reveal>
  );
}
