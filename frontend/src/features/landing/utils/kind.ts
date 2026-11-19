import { Film, Images, Image, type LucideIcon } from 'lucide-react';
import type { MomentKind } from '../types';

/** Human-readable label for each kind of media. */
export const KIND_LABEL: Record<MomentKind, string> = {
  video: 'Video',
  photo: 'Photo',
  album: 'Album',
};

/** Small icon shown in the corner of a poster. */
export const KIND_ICON: Record<MomentKind, LucideIcon> = {
  video: Film,
  photo: Image,
  album: Images,
};
