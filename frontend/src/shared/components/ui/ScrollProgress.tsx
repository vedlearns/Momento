import { useScrollProgress } from '../../hooks/useScrollProgress';

/** Thin accent-coloured bar at the very top of the window showing how far the page is scrolled. */
export default function ScrollProgress() {
  const { progress } = useScrollProgress();
  return (
    <div className="scroll-progress" aria-hidden="true">
      <span style={{ transform: `scaleX(${progress})` }} />
    </div>
  );
}
