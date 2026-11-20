/** Sample data for the signed-in home page. Replace with TanStack Query calls once the media/album APIs exist. */
import { CONTINUE_WATCHING, GRADIENTS, TOP_ALBUMS } from '../../landing/data/content';
import type { Moment, MomentKind } from '../../../shared/types/types';

export type HomeTab = 'all' | MomentKind;

export const HOME_TABS: { id: HomeTab; label: string }[] = [
  { id: 'all', label: 'Home' },
  { id: 'video', label: 'Videos' },
  { id: 'photo', label: 'Photos' },
  { id: 'album', label: 'Albums' },
];

export const USER = { name: 'Demo user', email: 'demo@example.com' };
export const STORAGE = { usedGb: 3.4, totalGb: 5, plan: 'Free' };

export const RECENTLY_ADDED: Moment[] = [
  { id: 'hampi-ruins', title: 'Hampi Ruins', kind: 'photo', subtitle: 'Added today', meta: '42 photos', year: 2026, gradient: GRADIENTS.amber, description: 'Boulders, temples and golden-hour light across the old capital.' },
  { id: 'new-cafe', title: 'New Café Find', kind: 'photo', subtitle: 'Added yesterday', meta: '9 photos', year: 2026, gradient: GRADIENTS.rose, description: 'A tiny corner café with the best filter coffee in town.' },
  { id: 'rooftop-night', title: 'Rooftop Night', kind: 'video', subtitle: 'Added 2 days ago', meta: '04:10 · 1080p', year: 2026, gradient: GRADIENTS.violet, description: 'Fairy lights, old songs and a very loud speaker.' },
  { id: 'lake-morning', title: 'Lake Morning', kind: 'video', subtitle: 'Added last week', meta: '06:32 · 4K', year: 2026, gradient: GRADIENTS.ocean, description: 'Mist on the water and the first boats of the day.' },
  { id: 'old-neighbourhood', title: 'Old Neighbourhood', kind: 'photo', subtitle: 'Added last week', meta: '27 photos', year: 2023, gradient: GRADIENTS.steel, description: 'Lanes you grew up in, photographed one more time.' },
];

export const SHARED_WITH_ME: Moment[] = [
  { id: 'cousins-wedding', title: "Cousin's Wedding", kind: 'album', subtitle: 'Shared by Riya', meta: '312 items', year: 2026, shared: true, gradient: GRADIENTS.crimson, description: 'Every ceremony from mehendi to vidaai, shared with view and download access.' },
  { id: 'college-reunion', title: 'College Reunion', kind: 'album', subtitle: 'Shared by Kabir', meta: '86 items', year: 2025, shared: true, gradient: GRADIENTS.forest, description: 'Ten years on, same terrible jokes.' },
  { id: 'trek-clips', title: 'Trek Highlights', kind: 'video', subtitle: 'Shared by Meera', meta: '09:15 · 1080p', year: 2025, shared: true, gradient: GRADIENTS.sunset, description: 'Four days, one summit and a lot of blisters. View-only link.' },
];

export interface RailConfig { id: string; title: string; items: Moment[]; ranked?: boolean }

export const RAILS: RailConfig[] = [
  { id: 'continue', title: 'Continue watching', items: CONTINUE_WATCHING },
  { id: 'recent', title: 'Recently added', items: RECENTLY_ADDED },
  { id: 'albums', title: 'Your most-viewed albums', items: TOP_ALBUMS, ranked: true },
  { id: 'shared', title: 'Shared with you', items: SHARED_WITH_ME },
];

// Create a Map to store unique Moment objects.
//
// string = The key will be a string (Moment ID).
// Moment = The value will be a Moment object.
//
// Map automatically keeps keys unique.
// If the same ID is added again, its previous value gets replaced.
const unique = new Map<string, Moment>();
// This line is doing two loops (one inside another) to collect all moments from every rail and store them in a Map without duplicate IDs.
RAILS.forEach((rail) => rail.items.forEach((m) => unique.set(m.id, m)));
// Get all Moment objects from the Map using values().
//
// The spread operator (...) converts those values into an array.
//
// Moment[] means this variable is an array of Moment objects.
//
// export allows us to use this array in other files.
export const ALL_HOME_MOMENTS: Moment[] = [...unique.values()];
export const FEATURED: Moment = CONTINUE_WATCHING[0];
