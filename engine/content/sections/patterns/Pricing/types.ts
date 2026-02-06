/**
 * Pricing section props.
 * Feature comparison cards with pricing tiers.
 */

import type { CSSProperties } from 'react'

/**
 * Feature item with comparison indicator.
 */
export interface PricingFeature {
  /** Feature name/description */
  label: string
  /** Included status: true = check, false = x, 'partial' = plus/limited */
  included: boolean | 'partial'
  /** Optional tooltip/explanation */
  tooltip?: string
}

/**
 * Individual pricing plan/tier.
 */
export interface PricingPlan {
  /** Unique identifier */
  id: string
  /** Plan name (e.g., "Basic", "Pro", "Enterprise") */
  name: string
  /** Price display (e.g., "$99/mo", "Contact us", "Free") */
  price: string
  /** Optional price period (e.g., "/month", "/year") */
  period?: string
  /** Plan description */
  description?: string
  /** Features list with inclusion status */
  features: PricingFeature[]
  /** CTA button text */
  ctaText?: string
  /** CTA button link */
  ctaHref?: string
  /** Highlight this plan (recommended/popular) */
  highlighted?: boolean
  /** Badge text (e.g., "Most Popular", "Best Value") */
  badge?: string
}

/**
 * Text style configuration for pricing elements.
 */
export interface PricingTextStyles {
  /** Style for plan name */
  planName?: CSSProperties
  /** Style for price */
  price?: CSSProperties
  /** Style for price period */
  period?: CSSProperties
  /** Style for description */
  description?: CSSProperties
  /** Style for feature text */
  feature?: CSSProperties
  /** Style for CTA button */
  cta?: CSSProperties
  /** Style for badge */
  badge?: CSSProperties
  /** Style for section title */
  sectionTitle?: CSSProperties
  /** Style for section subtitle */
  sectionSubtitle?: CSSProperties
}

/**
 * Default styles used when not overridden by preset.
 */
export const DEFAULT_PRICING_STYLES: PricingTextStyles = {
  planName: {
    fontFamily: 'var(--font-display, Inter, system-ui, sans-serif)',
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'var(--text-primary, #000)'
  },
  price: {
    fontFamily: 'var(--font-display, Inter, system-ui, sans-serif)',
    fontSize: '3rem',
    fontWeight: 800,
    color: 'var(--text-primary, #000)'
  },
  period: {
    fontFamily: 'var(--font-paragraph, Plus Jakarta Sans, system-ui, sans-serif)',
    fontSize: '1rem',
    fontWeight: 400,
    color: 'var(--text-secondary, #666)'
  },
  description: {
    fontFamily: 'var(--font-paragraph, Plus Jakarta Sans, system-ui, sans-serif)',
    fontSize: '0.875rem',
    fontWeight: 400,
    color: 'var(--text-secondary, #666)',
    lineHeight: 1.6
  },
  feature: {
    fontFamily: 'var(--font-paragraph, Plus Jakarta Sans, system-ui, sans-serif)',
    fontSize: '0.875rem',
    fontWeight: 400,
    color: 'var(--text-primary, #000)'
  },
  cta: {
    fontFamily: 'var(--font-paragraph, Plus Jakarta Sans, system-ui, sans-serif)',
    fontSize: '0.875rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  badge: {
    fontFamily: 'var(--font-paragraph, Plus Jakarta Sans, system-ui, sans-serif)',
    fontSize: '0.75rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'white',
    backgroundColor: 'var(--accent, #9933FF)',
    padding: '0.25rem 0.75rem',
    borderRadius: '999px'
  },
  sectionTitle: {
    fontFamily: 'var(--font-display, Inter, system-ui, sans-serif)',
    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
    fontWeight: 700,
    color: 'var(--text-primary, #000)',
    textAlign: 'center'
  },
  sectionSubtitle: {
    fontFamily: 'var(--font-paragraph, Plus Jakarta Sans, system-ui, sans-serif)',
    fontSize: '1.125rem',
    fontWeight: 400,
    color: 'var(--text-secondary, #666)',
    textAlign: 'center',
    maxWidth: '40ch',
    marginInline: 'auto'
  }
}

/**
 * Feature icon configuration.
 */
export interface PricingIcons {
  /** Icon for included feature (default: checkmark) */
  included?: string
  /** Icon for excluded feature (default: x/cross) */
  excluded?: string
  /** Icon for partial/limited feature (default: plus) */
  partial?: string
}

/**
 * Props for the createPricingSection factory.
 */
export interface PricingProps {
  /** Section ID override (default: 'pricing') */
  id?: string

  // === Content (what to display) ===
  /** Section title */
  title?: string
  /** Section subtitle/description */
  subtitle?: string
  /** Array of pricing plans - supports binding expressions */
  plans: PricingPlan[] | string
  /** Footer text (e.g., "All prices in USD") */
  footerText?: string

  // === Layout ===
  /** Number of columns (default: auto based on plan count) */
  columns?: number
  /** Gap between cards */
  gap?: string | number
  /** Card border radius */
  cardRadius?: string | number
  /** Show card shadows */
  cardShadow?: boolean

  // === Icons ===
  /** Custom icons for feature indicators */
  icons?: PricingIcons

  // === Styles (how to display - from preset) ===
  /** Text style configuration - overrides defaults */
  styles?: PricingTextStyles
  /** Background color */
  backgroundColor?: string
  /** Card background color */
  cardBackgroundColor?: string
  /** Highlighted card background color */
  highlightedCardBackgroundColor?: string
}
