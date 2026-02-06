/**
 * Pricing section pattern - factory function for pricing/plan comparison.
 * Grid of pricing cards with feature lists and CTAs.
 *
 * Structure:
 * - Section header (title + subtitle)
 * - Grid of pricing cards
 *   - Plan name
 *   - Price + period
 *   - Description
 *   - Feature list with icons
 *   - CTA button
 * - Optional footer
 *
 * Styling is configurable via props.styles, with sensible defaults.
 * Presets define site-specific styles; content comes from site data.
 */

import type { CSSProperties } from 'react'
import type { SectionSchema, WidgetSchema, SerializableValue } from '../../../../schema'
import type { PricingProps, PricingPlan, PricingFeature, PricingIcons } from './types'
import { DEFAULT_PRICING_STYLES } from './types'
import { isBindingExpression } from '../utils'

/**
 * Merge two style objects.
 */
function mergeStyles(base?: CSSProperties, override?: CSSProperties): CSSProperties {
  if (!override) return base ?? {}
  if (!base) return override
  return { ...base, ...override }
}

/**
 * Get feature icon based on inclusion status.
 */
function getFeatureIcon(included: boolean | 'partial', icons: PricingIcons): string {
  if (included === 'partial') {
    return icons.partial ?? '+'
  }
  return included ? (icons.included ?? '✓') : (icons.excluded ?? '×')
}

/**
 * Get feature icon color based on inclusion status.
 */
function getFeatureIconColor(included: boolean | 'partial'): string {
  if (included === 'partial') {
    return 'var(--text-secondary, #666)'
  }
  return included ? 'var(--success, #22c55e)' : 'var(--error, #ef4444)'
}

/**
 * Build feature list widgets for a plan.
 */
function buildFeatureWidgets(
  features: PricingFeature[],
  featureStyle: CSSProperties,
  icons: PricingIcons,
  planId: string
): WidgetSchema[] {
  return features.map((feature, index) => ({
    id: `${planId}-feature-${index}`,
    type: 'Flex',
    props: {
      direction: 'row',
      align: 'start',
      gap: '0.75rem'
    },
    widgets: [
      {
        id: `${planId}-feature-${index}-icon`,
        type: 'Text',
        props: {
          content: getFeatureIcon(feature.included, icons),
          as: 'span'
        },
        style: {
          fontSize: '1rem',
          color: getFeatureIconColor(feature.included),
          fontWeight: 600,
          flexShrink: 0,
          width: '1.25rem',
          textAlign: 'center'
        }
      },
      {
        id: `${planId}-feature-${index}-label`,
        type: 'Text',
        props: {
          content: feature.label,
          as: 'span'
        },
        style: {
          ...featureStyle,
          opacity: feature.included ? 1 : 0.5
        }
      }
    ]
  }))
}

/**
 * Build a single pricing card widget.
 */
function buildPricingCard(
  plan: PricingPlan,
  styles: Required<Pick<typeof DEFAULT_PRICING_STYLES,
    'planName' | 'price' | 'period' | 'description' | 'feature' | 'cta' | 'badge'>>,
  icons: PricingIcons,
  sectionId: string,
  cardBg: string,
  highlightedCardBg: string,
  cardRadius: string | number,
  cardShadow: boolean
): WidgetSchema {
  const cardId = `${sectionId}-plan-${plan.id}`
  const isHighlighted = plan.highlighted ?? false

  const cardWidgets: WidgetSchema[] = []

  // Badge (if present)
  if (plan.badge) {
    cardWidgets.push({
      id: `${cardId}-badge`,
      type: 'Text',
      props: {
        content: plan.badge,
        as: 'span'
      },
      style: {
        ...styles.badge,
        position: 'absolute',
        top: '-0.75rem',
        left: '50%',
        transform: 'translateX(-50%)',
        whiteSpace: 'nowrap'
      }
    })
  }

  // Plan name
  cardWidgets.push({
    id: `${cardId}-name`,
    type: 'Text',
    props: {
      content: plan.name,
      as: 'h3'
    },
    style: styles.planName
  })

  // Price row
  const priceWidgets: WidgetSchema[] = [
    {
      id: `${cardId}-price`,
      type: 'Text',
      props: {
        content: plan.price,
        as: 'span'
      },
      style: styles.price
    }
  ]

  if (plan.period) {
    priceWidgets.push({
      id: `${cardId}-period`,
      type: 'Text',
      props: {
        content: plan.period,
        as: 'span'
      },
      style: {
        ...styles.period,
        alignSelf: 'flex-end',
        marginBottom: '0.5rem'
      }
    })
  }

  cardWidgets.push({
    id: `${cardId}-price-row`,
    type: 'Flex',
    props: {
      direction: 'row',
      align: 'baseline',
      gap: '0.25rem'
    },
    style: { marginTop: '1rem' },
    widgets: priceWidgets
  })

  // Description
  if (plan.description) {
    cardWidgets.push({
      id: `${cardId}-description`,
      type: 'Text',
      props: {
        content: plan.description,
        as: 'p'
      },
      style: {
        ...styles.description,
        marginTop: '0.75rem'
      }
    })
  }

  // Features list
  cardWidgets.push({
    id: `${cardId}-features`,
    type: 'Flex',
    props: {
      direction: 'column',
      gap: '0.75rem'
    },
    style: {
      marginTop: '1.5rem',
      paddingTop: '1.5rem',
      borderTop: '1px solid var(--border, rgba(0,0,0,0.1))'
    },
    widgets: buildFeatureWidgets(plan.features, styles.feature, icons, cardId)
  })

  // CTA button
  if (plan.ctaText) {
    const ctaWidget: WidgetSchema = {
      id: `${cardId}-cta`,
      type: 'Button',
      props: {
        label: plan.ctaText,
        variant: isHighlighted ? 'primary' : 'secondary'
      },
      style: {
        ...styles.cta,
        marginTop: 'auto',
        paddingTop: '1.5rem',
        width: '100%'
      }
    }

    if (plan.ctaHref) {
      cardWidgets.push({
        id: `${cardId}-cta-link`,
        type: 'Link',
        props: {
          href: plan.ctaHref
        },
        style: { marginTop: 'auto', paddingTop: '1.5rem' },
        widgets: [ctaWidget]
      })
    } else {
      cardWidgets.push(ctaWidget)
    }
  }

  return {
    id: cardId,
    type: 'Flex',
    props: {
      direction: 'column'
    },
    style: {
      position: 'relative',
      padding: '2rem',
      backgroundColor: isHighlighted ? highlightedCardBg : cardBg,
      borderRadius: typeof cardRadius === 'number' ? `${cardRadius}px` : cardRadius,
      boxShadow: cardShadow
        ? isHighlighted
          ? '0 20px 40px rgba(0,0,0,0.15)'
          : '0 4px 20px rgba(0,0,0,0.08)'
        : 'none',
      border: isHighlighted
        ? '2px solid var(--accent, #9933FF)'
        : '1px solid var(--border, rgba(0,0,0,0.1))',
      transform: isHighlighted ? 'scale(1.02)' : 'none',
      zIndex: isHighlighted ? 1 : 0
    },
    behaviour: 'hover/scale',
    widgets: cardWidgets
  }
}

/**
 * Creates a Pricing section schema with plan comparison cards.
 *
 * @param props - Pricing section configuration (content + optional styles)
 * @returns SectionSchema for the pricing section
 */
export function createPricingSection(props: PricingProps): SectionSchema {
  const sectionId = props.id ?? 'pricing'

  // Merge provided styles with defaults
  const styles = {
    planName: mergeStyles(DEFAULT_PRICING_STYLES.planName, props.styles?.planName),
    price: mergeStyles(DEFAULT_PRICING_STYLES.price, props.styles?.price),
    period: mergeStyles(DEFAULT_PRICING_STYLES.period, props.styles?.period),
    description: mergeStyles(DEFAULT_PRICING_STYLES.description, props.styles?.description),
    feature: mergeStyles(DEFAULT_PRICING_STYLES.feature, props.styles?.feature),
    cta: mergeStyles(DEFAULT_PRICING_STYLES.cta, props.styles?.cta),
    badge: mergeStyles(DEFAULT_PRICING_STYLES.badge, props.styles?.badge),
    sectionTitle: mergeStyles(DEFAULT_PRICING_STYLES.sectionTitle, props.styles?.sectionTitle),
    sectionSubtitle: mergeStyles(DEFAULT_PRICING_STYLES.sectionSubtitle, props.styles?.sectionSubtitle)
  }

  const icons: PricingIcons = {
    included: props.icons?.included ?? '✓',
    excluded: props.icons?.excluded ?? '×',
    partial: props.icons?.partial ?? '+'
  }

  const cardBg = props.cardBackgroundColor ?? 'white'
  const highlightedCardBg = props.highlightedCardBackgroundColor ?? 'var(--surface-elevated, #fafafa)'
  const cardRadius = props.cardRadius ?? '1rem'
  const cardShadow = props.cardShadow ?? true

  // Check if using binding expression
  const isBinding = isBindingExpression(props.plans)

  // Main widgets array
  const widgets: WidgetSchema[] = []

  // Section header
  if (props.title || props.subtitle) {
    const headerWidgets: WidgetSchema[] = []

    if (props.title) {
      headerWidgets.push({
        id: `${sectionId}-title`,
        type: 'Text',
        props: {
          content: props.title,
          as: 'h2'
        },
        style: styles.sectionTitle
      })
    }

    if (props.subtitle) {
      headerWidgets.push({
        id: `${sectionId}-subtitle`,
        type: 'Text',
        props: {
          content: props.subtitle,
          as: 'p'
        },
        style: {
          ...styles.sectionSubtitle,
          marginTop: '1rem'
        }
      })
    }

    widgets.push({
      id: `${sectionId}-header`,
      type: 'Flex',
      props: {
        direction: 'column',
        align: 'center'
      },
      style: { marginBottom: '3rem' },
      widgets: headerWidgets
    })
  }

  // Plans grid
  if (isBinding) {
    // Dynamic binding - use PricingGrid widget
    widgets.push({
      id: `${sectionId}-plans`,
      type: 'PricingGrid',
      props: {
        plans: props.plans as SerializableValue,
        columns: props.columns,
        gap: props.gap ?? '2rem',
        icons: icons as SerializableValue,
        cardBackgroundColor: cardBg,
        highlightedCardBackgroundColor: highlightedCardBg,
        cardRadius,
        cardShadow,
        styles: styles as unknown as SerializableValue,
      },
    })
  } else {
    // Static array - build card widgets
    const plans = props.plans as PricingPlan[]
    const columns = props.columns ?? Math.min(plans.length, 3)

    widgets.push({
      id: `${sectionId}-plans-grid`,
      type: 'Grid',
      props: {
        columns,
        gap: props.gap ?? '2rem'
      },
      style: {
        alignItems: 'stretch'
      },
      widgets: plans.map(plan =>
        buildPricingCard(plan, styles, icons, sectionId, cardBg, highlightedCardBg, cardRadius, cardShadow)
      )
    })
  }

  // Footer
  if (props.footerText) {
    widgets.push({
      id: `${sectionId}-footer`,
      type: 'Text',
      props: {
        content: props.footerText,
        as: 'p'
      },
      style: {
        ...styles.description,
        textAlign: 'center',
        marginTop: '2rem'
      }
    })
  }

  return {
    id: sectionId,
    layout: {
      type: 'flex',
      direction: 'column'
    },
    style: {
      backgroundColor: props.backgroundColor ?? 'var(--surface, #fff)',
      padding: 'var(--section-padding, 4rem 2rem)'
    },
    className: 'pricing-section',
    widgets
  }
}
