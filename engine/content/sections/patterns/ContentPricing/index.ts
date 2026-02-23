/**
 * Pricing section pattern - factory function for pricing/plan comparison.
 * Grid of pricing cards with feature lists and CTAs.
 *
 * Structure:
 * - Optional section header (subtitle)
 * - Grid of pricing cards
 *   - Plan name
 *   - Price + period
 *   - Description
 *   - Feature list with icons
 *   - CTA button
 * - Optional footer
 *
 * All visual styles live in styles.css via theme CSS variables.
 * Presets provide section-level `style` for backgrounds; cards use
 * CSS custom properties (--pricing-card-bg, --pricing-card-highlighted-bg)
 * set via inline style on the section.
 */

import type { SectionSchema, WidgetSchema, SerializableValue } from '../../../../schema'
import { applyMetaDefaults } from '../../../../schema/settings'
import type { TextElement } from '../../../widgets/primitives/Text/types'
import type { ContentPricingProps, PricingPlan, PricingIcons } from './types'
import { isBindingExpression } from '../utils'
import { meta } from './meta'

/** Resolved scale values for pricing card text elements. */
interface PricingScales {
  planName: TextElement
  price: TextElement
  period: TextElement
  description: TextElement
  badge: TextElement
  featureIcon: TextElement
  featureLabel: TextElement
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
 * Get feature icon CSS class modifier based on inclusion status.
 */
function getFeatureIconClass(included: boolean | 'partial'): string {
  if (included === 'partial') return 'pricing-card__feature-icon--partial'
  return included ? 'pricing-card__feature-icon--included' : 'pricing-card__feature-icon--excluded'
}

/**
 * Build feature list widgets for a plan.
 */
function buildFeatureWidgets(
  features: PricingFeature[],
  icons: PricingIcons,
  planId: string,
  scales: PricingScales
): WidgetSchema[] {
  return features.map((feature, index) => ({
    id: `${planId}-feature-${index}`,
    type: 'Flex',
    props: {
      direction: 'row',
      align: 'start',
      gap: 'var(--spacing-sm, 0.75rem)'
    },
    widgets: [
      {
        id: `${planId}-feature-${index}-icon`,
        type: 'Text',
        props: {
          content: getFeatureIcon(feature.included, icons),
          as: scales.featureIcon
        },
        className: `pricing-card__feature-icon ${getFeatureIconClass(feature.included)}`
      },
      {
        id: `${planId}-feature-${index}-label`,
        type: 'Text',
        props: {
          content: feature.label,
          as: scales.featureLabel
        },
        className: `pricing-card__feature-label${feature.included ? '' : ' pricing-card__feature-label--excluded'}`
      }
    ]
  }))
}

import type { PricingFeature } from './types'

/**
 * Build a single pricing card widget.
 */
function buildPricingCard(
  plan: PricingPlan,
  icons: PricingIcons,
  sectionId: string,
  cardShadow: boolean,
  scales: PricingScales
): WidgetSchema {
  const cardId = `${sectionId}-plan-${plan.id}`
  const isHighlighted = plan.highlighted ?? false

  // Build className for the card
  const cardClasses = [
    'pricing-card',
    isHighlighted && 'pricing-card--highlighted',
    cardShadow && 'pricing-card--shadow',
  ].filter(Boolean).join(' ')

  const cardWidgets: WidgetSchema[] = []

  // Badge (if present)
  if (plan.badge) {
    cardWidgets.push({
      id: `${cardId}-badge`,
      type: 'Text',
      props: {
        content: plan.badge,
        as: scales.badge
      },
      className: 'pricing-card__badge'
    })
  }

  // Plan name
  cardWidgets.push({
    id: `${cardId}-name`,
    type: 'Text',
    props: {
      content: plan.name,
      as: scales.planName
    },
    className: 'pricing-card__name'
  })

  // Price row
  const priceWidgets: WidgetSchema[] = [
    {
      id: `${cardId}-price`,
      type: 'Text',
      props: {
        content: plan.price,
        as: scales.price
      },
      className: 'pricing-card__price'
    }
  ]

  if (plan.period) {
    priceWidgets.push({
      id: `${cardId}-period`,
      type: 'Text',
      props: {
        content: plan.period,
        as: scales.period
      },
      className: 'pricing-card__period'
    })
  }

  cardWidgets.push({
    id: `${cardId}-price-row`,
    type: 'Flex',
    props: {
      direction: 'row',
      align: 'baseline',
      gap: 'var(--spacing-xs, 0.25rem)'
    },
    className: 'pricing-card__price-row',
    widgets: priceWidgets
  })

  // Description
  if (plan.description) {
    cardWidgets.push({
      id: `${cardId}-description`,
      type: 'Text',
      props: {
        content: plan.description,
        as: scales.description
      },
      className: 'pricing-card__description'
    })
  }

  // Features list
  cardWidgets.push({
    id: `${cardId}-features`,
    type: 'Flex',
    props: {
      direction: 'column',
      gap: 'var(--spacing-sm, 0.75rem)'
    },
    className: 'pricing-card__features',
    widgets: buildFeatureWidgets(plan.features, icons, cardId, scales)
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
      className: 'pricing-card__cta-button'
    }

    if (plan.ctaHref) {
      cardWidgets.push({
        id: `${cardId}-cta-link`,
        type: 'Link',
        props: {
          href: plan.ctaHref
        },
        className: 'pricing-card__cta',
        widgets: [ctaWidget]
      })
    } else {
      cardWidgets.push({
        ...ctaWidget,
        className: 'pricing-card__cta pricing-card__cta-button'
      })
    }
  }

  return {
    id: cardId,
    type: 'Flex',
    props: {
      direction: 'column'
    },
    className: cardClasses,
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
export function createContentPricingSection(rawProps: ContentPricingProps): SectionSchema {
  const props = applyMetaDefaults(meta, rawProps)
  const sectionId = props.id ?? 'pricing'

  const icons: PricingIcons = {
    included: props.icons?.included ?? '✓',
    excluded: props.icons?.excluded ?? '×',
    partial: props.icons?.partial ?? '+'
  }

  const cardShadow = props.cardShadow as boolean

  // Resolve text scales
  const subtitleScale = props.subtitleScale as string
  const footerScale = props.footerScale as string
  const scales: PricingScales = {
    planName: props.planNameScale as TextElement,
    price: props.priceScale as TextElement,
    period: props.periodScale as TextElement,
    description: props.descriptionScale as TextElement,
    badge: props.badgeScale as TextElement,
    featureIcon: props.featureIconScale as TextElement,
    featureLabel: props.featureLabelScale as TextElement,
  }

  // Check if using binding expression
  const isBinding = isBindingExpression(props.plans)

  // Main widgets array
  const widgets: WidgetSchema[] = []

  // Section header
  if (props.subtitle) {
    widgets.push({
      id: `${sectionId}-header`,
      type: 'Flex',
      props: {
        direction: 'column',
        align: 'center'
      },
      className: 'pricing-section__header',
      widgets: [
        {
          id: `${sectionId}-subtitle`,
          type: 'Text',
          props: {
            content: props.subtitle,
            as: subtitleScale
          },
          className: 'pricing-section__subtitle'
        }
      ]
    })
  }

  // Plans grid — custom widgets override auto-generated grid
  if (props.planWidgets) {
    widgets.push(...props.planWidgets)
  } else if (isBinding) {
    // Dynamic binding - use PricingGrid widget
    widgets.push({
      id: `${sectionId}-plans`,
      type: 'PricingGrid',
      props: {
        plans: props.plans as SerializableValue,
        columns: props.columns,
        gap: props.gap as string,
        icons: icons as SerializableValue,
        cardShadow,
      },
    })
  } else {
    // Static array - build card widgets
    const plans = props.plans as PricingPlan[]
    const columns = props.columns as number

    widgets.push({
      id: `${sectionId}-plans-grid`,
      type: 'Grid',
      props: {
        columns,
        gap: props.gap as string
      },
      style: {
        alignItems: 'stretch'
      },
      widgets: plans.map(plan =>
        buildPricingCard(plan, icons, sectionId, cardShadow, scales)
      )
    })
  }

  // Footer text
  if (props.footerText) {
    widgets.push({
      id: `${sectionId}-footer`,
      type: 'Text',
      props: {
        content: props.footerText,
        as: footerScale
      },
      className: 'pricing-section__footer'
    })
  }

  // Extra widgets (e.g. contact sub-section)
  if (props.extraWidgets) {
    widgets.push(...props.extraWidgets)
  }

  // Build section inline style — only card custom properties + preset overrides
  const sectionStyle: Record<string, string | undefined> = {}

  // Card background custom properties (consumed by .pricing-card CSS)
  if (props.cardBackgroundColor) {
    sectionStyle['--pricing-card-bg'] = props.cardBackgroundColor
  }
  if (props.highlightedCardBackgroundColor) {
    sectionStyle['--pricing-card-highlighted-bg'] = props.highlightedCardBackgroundColor
  }

  return {
    id: sectionId,
    patternId: 'ContentPricing',
    label: props.label ?? 'Pricing',
    constrained: props.constrained,
    colorMode: props.colorMode,
    layout: {
      type: 'flex',
      direction: 'column',
      ...(props.constrained ? {} : { align: 'center' as const }),
    },
    style: {
      ...sectionStyle,
      ...props.style,
    },
    className: props.className ?? 'pricing-section',
    paddingTop: props.paddingTop,
    paddingBottom: props.paddingBottom,
    paddingLeft: props.paddingLeft,
    paddingRight: props.paddingRight,
    sectionHeight: props.sectionHeight,
    widgets
  }
}
