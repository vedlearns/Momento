import type { LucideIcon } from 'lucide-react';

/** A link in the top navigation. `id` must match the `id` of the section it points to. */
/**
 * Represents a navigation link in the landing page header.
 * Each link points to a particular section of the page.
 */
export interface NavLinkItem {
  id: string;
  label: string;
  href: string;
}

/**
 * Represents a statistic displayed on the landing page.
 * Example: "100% Private Storage".
 */
export interface Stat {
  value: string;
  label: string;
}

/**
 * Represents a feature card displayed on the landing page.
 * Contains an icon, heading, and a short explanation of the feature.
 */
export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

/**
 * Represents one step in the "How it works" section.
 * Explains a stage of the user's journey through Momento.
 */
export interface Step {
  icon: LucideIcon;
  title: string;
  description: string;
}

/**
 * Defines the call-to-action (CTA) button behavior for a pricing plan.
 * A route navigates to another application page.
 * An anchor navigates to a section on the current page.
 */
export interface PlanCta {
  label: string;
  /** 'route' → client-side <Link to=...>, 'anchor' → plain <a href="#...">. */
  kind: 'route' | 'anchor';
  to: string;
}

/**
 * Represents a subscription plan displayed on the landing page.
 * Includes its price, features, description, and CTA configuration.
 */
export interface Plan {
  id: string;
  name: string;
  /** Displayed price. Replace with the actual price when payments are implemented. */
  price: string;
  tagline: string;
  /** List of benefits included in this subscription plan. */
  features: string[];
  /** Defines what happens when the user clicks the plan's CTA. */
  cta: PlanCta;
  /** Whether this plan should receive special visual highlighting. */
  featured?: boolean;
  /** Optional badge displayed on the plan card, e.g. "MOST POPULAR". */
  badge?: string;
}

/**
 * Represents one FAQ entry on the landing page.
 * Contains a question and its corresponding answer.
 */
export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

/**
 * Defines the supported categories of items in Momento's media library.
 * An item can be a video, photo, or album.
 */
export type MomentKind = 'video' | 'photo' | 'album';

/**
 * Represents a sample media item or album displayed in the landing page's
 * library preview section.
 *
 * This is currently presentation/demo data, not the actual backend entity.
 * Later, real API responses will be mapped to the appropriate frontend models.
 */
export interface Moment {
  id: string;
  title: string;
  kind: MomentKind;
  /** Short line under the title, e.g. "Resume from 05:08". */
  subtitle: string;
  /** Small grey line, e.g. "12:48 · 1080p" or "248 items". */
  meta: string;
  year: number;
  description: string;
  /** CSS `background` value used instead of an image (see GRADIENTS in content.ts). */
  gradient: string;
  /** 0–100. Only for videos that were partly watched. */
  progress?: number;
  /** Shows a "SHARED" badge on the poster. */
  shared?: boolean;
}

/* ---- Sharing demo ---- */
export type SharePermission = 'view' | 'download';
export type ShareExpiry = '7d' | '30d' | 'never';
