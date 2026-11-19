/**
 * ALL the copy and sample data for the landing page lives in this file.
 * Edit text, add/remove features, change plans or FAQs here – the components just render it.
 */
import {
  FolderOpen,
  History,
  Images,
  CirclePlay,
  ShieldCheck,
  Share2,
  Upload,
} from 'lucide-react';
import type {
  FaqItem,
  Feature,
  Moment,
  NavLinkItem,
  Plan,
  ShareExpiry,
  Stat,
  Step,
} from '../../../shared/types/types';

/* --------------------------------------------------------------------------
   Navigation  (order must match the order of the sections on the page)
   -------------------------------------------------------------------------- */
export const NAV_LINKS: NavLinkItem[] = [
  { id: 'features', label: 'Features', href: '#features' },
  { id: 'how-it-works', label: 'How it works', href: '#how-it-works' },
  { id: 'sharing', label: 'Sharing', href: '#sharing' },
  { id: 'plans', label: 'Plans', href: '#plans' },
  { id: 'faq', label: 'FAQ', href: '#faq' },
];

/** Section ids tracked by the scroll-spy (derived from NAV_LINKS, stable reference). */
export const SECTION_IDS: string[] = NAV_LINKS.map((link) => link.id);

/* --------------------------------------------------------------------------
   Poster artwork – CSS gradients so no image files are needed.
   To use real images later, change `Moment.gradient` to `url(...)` or switch
   MomentCard to an <img>.
   -------------------------------------------------------------------------- */
const art = (from: string, via: string, to: string): string =>
  `radial-gradient(circle at 24% 18%, rgba(255,255,255,.28), transparent 46%), linear-gradient(135deg, ${from} 0%, ${via} 55%, ${to} 100%)`;

export const GRADIENTS = {
  sunset: art('#ff9a3c', '#f22c46', '#5b1250'),
  crimson: art('#f22c46', '#8b224f', '#241047'),
  ocean: art('#29c4e6', '#3b5bdb', '#2a1b6b'),
  forest: art('#34d399', '#0f766e', '#0b2f3a'),
  violet: art('#c084fc', '#7c3aed', '#2e1065'),
  amber: art('#fbbf24', '#ea580c', '#7c2d12'),
  rose: art('#f472b6', '#be185d', '#4a0d2e'),
  steel: art('#7dd3fc', '#475569', '#0f172a'),
} as const;

/** Layered background behind the hero. Tweak the colours/positions to taste. */
export const HERO_BACKGROUND =
  'radial-gradient(ellipse at 78% 38%, rgba(242,44,70,.38), transparent 52%), radial-gradient(ellipse at 18% 100%, rgba(124,58,237,.28), transparent 55%), linear-gradient(135deg, #150b16 0%, #0b0c12 60%)';

/* --------------------------------------------------------------------------
   Hero
   -------------------------------------------------------------------------- */
export const HERO = {
  kicker: 'YOUR PRIVATE STREAMING LIBRARY',
  title: 'Your memories, beautifully kept',
  description:
    'Momento is a private home for your photos and videos. Browse them like your own streaming service, organise them into albums and share only what you choose.',
  primaryCta: 'Create your free library',
  secondaryCta: 'Watch preview',
  tertiaryCta: 'See features',
} as const;

/* --------------------------------------------------------------------------
   Library preview (sample data – clearly labelled as sample in the UI)
   -------------------------------------------------------------------------- */
export const CONTINUE_WATCHING: Moment[] = [
  {
    id: 'goa-day-3',
    title: 'Goa Trip · Day 3',
    kind: 'video',
    subtitle: 'Resume from 05:08',
    meta: '12:48 · 1080p',
    year: 2026,
    progress: 40,
    gradient: GRADIENTS.sunset,
    description: 'Beach sunrise, scooter rides and a very long lunch. Pick up exactly where you stopped watching.',
  },
  {
    id: 'diwali-home',
    title: 'Diwali at Home',
    kind: 'video',
    subtitle: 'Resume from 05:55',
    meta: '08:21 · 1080p',
    year: 2025,
    progress: 72,
    shared: true,
    gradient: GRADIENTS.amber,
    description: 'Lamps, sweets and the whole family on one roof. Shared with relatives through a private link.',
  },
  {
    id: 'sunday-cricket',
    title: 'Sunday Cricket',
    kind: 'video',
    subtitle: 'Resume from 00:46',
    meta: '05:03 · 720p',
    year: 2026,
    progress: 15,
    gradient: GRADIENTS.forest,
    description: 'The weekend match, from the first over to the last-ball finish.',
  },
  {
    id: 'ladakh-road',
    title: 'Ladakh Road Trip',
    kind: 'video',
    subtitle: 'Resume from 12:34',
    meta: '21:37 · 4K',
    year: 2024,
    progress: 58,
    gradient: GRADIENTS.ocean,
    description: 'Mountain passes, thin air and a playlist that never got old.',
  },
  {
    id: 'moms-birthday',
    title: "Mom's Birthday",
    kind: 'video',
    subtitle: 'Resume from 02:53',
    meta: '03:12 · 1080p',
    year: 2026,
    progress: 90,
    shared: true,
    gradient: GRADIENTS.rose,
    description: 'The surprise, the cake and the happy tears. Almost finished – a minute left to watch.',
  },
  {
    id: 'monsoon-walks',
    title: 'Monsoon Walks',
    kind: 'video',
    subtitle: 'Resume from 00:41',
    meta: '02:44 · 1080p',
    year: 2025,
    progress: 25,
    gradient: GRADIENTS.steel,
    description: 'Wet streets, hot chai and the first rain of the season.',
  },
];

export const TOP_ALBUMS: Moment[] = [
  {
    id: 'album-family',
    title: 'Family',
    kind: 'album',
    subtitle: 'Shared with 4 people',
    meta: '248 items',
    year: 2026,
    shared: true,
    gradient: GRADIENTS.crimson,
    description: 'Everyone, everywhere, all in one album. A photo can live here and in other albums at the same time.',
  },
  {
    id: 'album-travel',
    title: 'Travel 2026',
    kind: 'album',
    subtitle: 'Private',
    meta: '612 items',
    year: 2026,
    gradient: GRADIENTS.ocean,
    description: 'Every trip of the year, in the order you took them.',
  },
  {
    id: 'album-friends',
    title: 'Friends',
    kind: 'album',
    subtitle: 'Private',
    meta: '189 items',
    year: 2025,
    gradient: GRADIENTS.violet,
    description: 'Late nights, group selfies and inside jokes.',
  },
  {
    id: 'album-food',
    title: 'Food & Chai',
    kind: 'album',
    subtitle: 'Private',
    meta: '97 items',
    year: 2025,
    gradient: GRADIENTS.amber,
    description: 'Every plate worth remembering.',
  },
  {
    id: 'album-pets',
    title: 'Pets',
    kind: 'album',
    subtitle: 'Shared with 2 people',
    meta: '143 items',
    year: 2024,
    shared: true,
    gradient: GRADIENTS.forest,
    description: 'Zoomies, naps and thousands of tail wags.',
  },
];

export const ALL_MOMENTS: Moment[] = [...CONTINUE_WATCHING, ...TOP_ALBUMS];

/** The video opened by the hero's "Watch preview" button. */
export const HERO_MOMENT: Moment = CONTINUE_WATCHING[0];

export const LIBRARY_SECTION = {
  eyebrow: 'A PEEK INSIDE',
  title: 'Your library, laid out like a cinema',
  description: 'Continue where you stopped, jump back into an album, favourite what you love. Try the cards below.',
  note: 'Sample content for illustration. In the real app these come from your own uploads.',
} as const;

/* --------------------------------------------------------------------------
   Stats strip
   -------------------------------------------------------------------------- */
export const STATS: Stat[] = [
  { value: 'Private', label: 'by default' },
  { value: 'Photos + video', label: 'in one library' },
  { value: 'Adaptive', label: 'HLS video streaming' },
  { value: 'Your rules', label: 'view or download' },
];

/* --------------------------------------------------------------------------
   Features
   -------------------------------------------------------------------------- */
export const FEATURES_SECTION = {
  eyebrow: 'FEATURES',
  title: 'Google Photos meets a home cinema',
  description: 'Everything you need to keep, find, watch and share the moments that matter.',
} as const;

export const FEATURES: Feature[] = [
  {
    icon: Images,
    title: 'Photos and videos together',
    description: 'Upload originals and browse them in a fast, responsive grid with thumbnails.',
  },
  {
    icon: FolderOpen,
    title: 'Albums, not folders',
    description: 'One photo can live in many albums. Organise freely without duplicating files.',
  },
  {
    icon: CirclePlay,
    title: 'Stream like a pro',
    description: 'Adaptive HLS playback adjusts quality to your connection for smooth viewing.',
  },
  {
    icon: History,
    title: 'Pick up where you left off',
    description: 'Momento remembers your playback position, so every video resumes instantly.',
  },
  {
    icon: Share2,
    title: 'Share with control',
    description: 'Share media or whole albums with people or private links, with expiry and revoke.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure by design',
    description: 'Private cloud storage, short-lived access links and ownership checks on every request.',
  },
];

/* --------------------------------------------------------------------------
   How it works
   -------------------------------------------------------------------------- */
export const HOW_SECTION = {
  eyebrow: 'HOW IT WORKS',
  title: 'From upload to watch party in 3 steps',
} as const;

export const STEPS: Step[] = [
  {
    icon: Upload,
    title: 'Upload',
    description: 'Drop in photos and videos. They go straight to private cloud storage.',
  },
  {
    icon: FolderOpen,
    title: 'Organise',
    description: 'Group media into albums, pick covers and search by title or type.',
  },
  {
    icon: Share2,
    title: 'Watch & share',
    description: 'Stream videos, resume anytime and share with exactly who you want.',
  },
];

/* --------------------------------------------------------------------------
   Sharing demo
   -------------------------------------------------------------------------- */
export const SHARING_SECTION = {
  eyebrow: 'PRIVATE SHARING',
  title: 'Share it. Control it. Take it back.',
  description:
    'Send a private link to anyone – no account needed to view. Decide whether they can only watch or also download, set an expiry and revoke access whenever you like.',
  bullets: [
    'Share with registered users or via private link',
    'View-only or view + download permissions',
    'Expiry dates and one-click revoke',
  ],
} as const;

/** Fake link shown in the demo. Swap `momento.example` for your real domain. */
export const DEMO_SHARE_URL = 'https://momento.example/s/k9Xf2aQ7pL';

export const EXPIRY_OPTIONS: { value: ShareExpiry; label: string; summary: string }[] = [
  { value: '7d', label: '7 days', summary: 'Expires in 7 days' },
  { value: '30d', label: '30 days', summary: 'Expires in 30 days' },
  { value: 'never', label: 'Never', summary: 'Never expires' },
];

/* --------------------------------------------------------------------------
   Plans  (placeholders – no real prices yet. When Razorpay is wired up,
   replace `price` with the value from your subscription_plans table.)
   -------------------------------------------------------------------------- */
export const PLANS_SECTION = {
  eyebrow: 'PLANS',
  title: 'Start free, grow when you need to',
  description: 'Storage tiers are planned. Final sizes and pricing will be announced before launch.',
} as const;

export const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 'Starter',
    tagline: 'Limited storage',
    features: ['Photos and videos', 'Albums', 'Private link sharing'],
    cta: { label: 'Get started', kind: 'route', to: '/register' },
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 'More space',
    tagline: 'Increased storage',
    features: ['Everything in Free', 'Larger library', 'Longer share expiry'],
    cta: { label: 'Notify me', kind: 'anchor', to: '#waitlist' },
    featured: true,
    badge: 'Coming soon',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 'Most space',
    tagline: 'Highest storage + extras',
    features: ['Everything in Basic', 'Highest storage', 'Premium features'],
    cta: { label: 'Notify me', kind: 'anchor', to: '#waitlist' },
    badge: 'Coming soon',
  },
];

/* --------------------------------------------------------------------------
   FAQ
   -------------------------------------------------------------------------- */
export const FAQ_SECTION = {
  eyebrow: 'FAQ',
  title: 'Good questions',
} as const;

export const FAQS: FaqItem[] = [
  {
    id: 'netflix',
    question: 'Is Momento like Netflix?',
    answer:
      'The browsing and viewing experience is inspired by it, but the library is yours. There are no shows or movies, only the photos and videos you upload.',
  },
  {
    id: 'privacy',
    question: 'Who can see my media?',
    answer:
      'Only you, until you share. Files live in private cloud storage and are served through temporary, access-controlled links.',
  },
  {
    id: 'albums',
    question: 'Can I put the same photo in multiple albums?',
    answer:
      'Yes. Albums are references, so one item can appear in as many albums as you like without using extra storage.',
  },
  {
    id: 'downloads',
    question: 'Can people download what I share?',
    answer:
      'Only if you allow it. Every share is either view-only or view + download, and you can set an expiry or revoke it at any time.',
  },
  {
    id: 'availability',
    question: 'Is it available yet?',
    answer:
      'Momento is under active development. Features are being released step by step, so what you see here is the direction, not the finished product.',
  },
];

/* --------------------------------------------------------------------------
   Final call-to-action + waitlist
   -------------------------------------------------------------------------- */
export const CTA = {
  title: 'Give your memories a proper home',
  description: 'Get a single email when Momento opens its doors – no spam, ever.',
  alt: 'Want to look around first?',
  altLink: 'Create a free account',
} as const;

/* --------------------------------------------------------------------------
   Footer
   -------------------------------------------------------------------------- */
export const FOOTER = {
  tagline: 'Your memories, beautifully kept.',
} as const;
