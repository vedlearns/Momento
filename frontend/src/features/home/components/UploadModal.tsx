import { useEffect, useRef, useState, type DragEvent } from 'react';
import { CheckCircle2, FileVideo, ImageIcon, UploadCloud, X } from 'lucide-react';
import { useToast } from '../../../../../../momento-landing-home/momento-landing/src/components/ui/Toast';
import { useEscapeKey } from '../../../../../../momento-landing-home/momento-landing/src/hooks/useEscapeKey';
import { useLockBodyScroll } from '../../../../../../momento-landing-home/momento-landing/src/hooks/useLockBodyScroll';

interface UploadItem { id: string; name: string; isVideo: boolean; progress: number }

/**
 * Drag-and-drop upload dialog. The progress is simulated; replace `addFiles` with a call that asks
 * the backend for an S3 presigned URL and PUTs each file to it.
 */
export default function UploadModal({ onClose }: { onClose: () => void }) {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  useEscapeKey(onClose);
  useLockBodyScroll(true);

  const running = items.some((i) => i.progress < 100);
  useEffect(() => {
    if (!running) return;
    const t = window.setTimeout(() => {
      setItems((prev) => prev.map((i) => (i.progress >= 100 ? i : { ...i, progress: Math.min(100, i.progress + 8 + Math.random() * 14) })));
    }, 220);
    return () => window.clearTimeout(t);
  }, [items, running]);

  const addFiles = (files: FileList | null) => {
    if (!files) return;
    const accepted = Array.from(files).filter((f) => f.type.startsWith('image/') || f.type.startsWith('video/'));
    if (accepted.length < files.length) showToast('Only photos and videos can be uploaded');
    setItems((prev) => [
      ...prev,
      ...accepted.map((f, n) => ({ id: `${Date.now()}-${n}-${f.name}`, name: f.name, isVideo: f.type.startsWith('video/'), progress: 0 })),
    ]);
  };

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setDragging(false);
    addFiles(event.dataTransfer.files);
  };

  const finish = () => {
    showToast(`${items.length} ${items.length === 1 ? 'file' : 'files'} added (demo – nothing is stored)`);
    onClose();
  };

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="detail-modal upload-modal" role="dialog" aria-modal="true" aria-labelledby="upload-title">
        <button type="button" className="icon-button modal-close" aria-label="Close" onClick={onClose}>
          <X size={18} aria-hidden="true" />
        </button>
        <h2 id="upload-title">Upload to your library</h2>
        <p className="upload-sub">Photos and videos are stored privately. Videos are prepared for streaming after upload.</p>

        <label className={`dropzone${dragging ? ' is-dragging' : ''}`} onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={onDrop}>
          <UploadCloud size={28} aria-hidden="true" />
          <b>Drop files here or click to browse</b>
          <small>JPG, PNG, HEIC, MP4, MOV</small>
          <input ref={inputRef} type="file" multiple accept="image/*,video/*" className="sr-only" onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} />
        </label>

        {items.length > 0 && (
          <ul className="upload-list">
            {items.map((item) => {
              const done = item.progress >= 100;
              return (
                <li key={item.id}>
                  {item.isVideo ? <FileVideo size={16} aria-hidden="true" /> : <ImageIcon size={16} aria-hidden="true" />}
                  <div>
                    <span>{item.name}</span>
                    <div className="progress-track"><span style={{ width: `${item.progress}%` }} /></div>
                  </div>
                  {done ? <CheckCircle2 size={16} className="upload-done" aria-label="Uploaded" /> : <small>{Math.round(item.progress)}%</small>}
                </li>
              );
            })}
          </ul>
        )}

        <div className="modal-actions upload-actions">
          <button type="button" className="button button-accent" disabled={items.length === 0 || running} onClick={finish}>
            {running ? 'Uploading…' : 'Done'}
          </button>
          <button type="button" className="button button-secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
