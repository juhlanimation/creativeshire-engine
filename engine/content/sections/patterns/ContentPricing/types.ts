/**
 * Pricing section props.
 * Feature comparison cards with pricing tiers.
 *
 * Visual styling handled by CSS classes in styles.css using theme variables.
 * Card backgrounds configurable via --pricing-card-bg / --pricing-card-highlighted-bg
 * custom properties, set on the section wrapper.
 */

import type { WidgetSchema } from '../../../../schema'
import type { TextElement } from '../../../widgets/primitives/Text/types'
import type { BaseSectionProps } from '../base'

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
 * Props for the createContentPricingSection factory.
 */
export interface ContentPricingProps extends BaseSectionProps {
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
  /** Show card shadows */
  cardShadow?: boolean

  // === Icons ===
  /** Custom icons for feature indicators */
  icons?: PricingIcons

  // === Styles (how to display - from preset) ===
  /**
   * Card background color — sets --pricing-card-bg custom property.
   * Defaults to theme surface via CSS.
   */
  cardBackgroundColor?: string
  /**
   * Highlighted card background color — sets --pricing-card-highlighted-bg.
   * Defaults to theme secondary surface via CSS.
   */
  highlightedCardBackgroundColor?: string
  /** Custom plan widgets that replace the auto-generated plans grid */
  planWidgets?: WidgetSchema[]
  /** Additional widgets appended after plans grid (e.g. contact sub-section) */
  extraWidgets?: WidgetSchema[]

  // === Typography scale ===
  /** Scale for section title (default: 'h2') */
  titleScale?: TextElement
  /** Scale for section subtitle (default: 'p') */
  subtitleScale?: TextElement
  /** Scale for plan name (default: 'h3') */
  planNameScale?: TextElement
  /** Scale for price text (default: 'span') */
  priceScale?: TextElement
  /** Scale for plan description (default: 'p') */
  descriptionScale?: TextElement
  /** Scale for footer text (default: 'p') */
  footerScale?: TextElement
  /** Scale for badge text (default: 'span') */
  badgeScale?: TextElement
  /** Scale for period text (default: 'span') */
  periodScale?: TextElement
  /** Scale for feature label text (default: 'span') */
  featureLabelScale?: TextElement
  /** Scale for feature icon text (default: 'span') */
  featureIconScale?: TextElement
}
