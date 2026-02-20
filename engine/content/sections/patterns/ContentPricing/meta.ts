/**
 * Pricing section pattern metadata for platform UI.
 */

import { defineSectionMeta } from '../../../../schema/meta'
import { textScaleSetting } from '../../../../schema/settings-helpers'
import type { ContentPricingProps } from './types'

export const meta = defineSectionMeta<ContentPricingProps>({
  id: 'ContentPricing',
  name: 'Content Pricing',
  description: 'Feature comparison cards with pricing tiers',
  category: 'section',
  sectionCategory: 'content',
  unique: false,
  icon: 'credit-card',
  tags: ['pricing', 'plans', 'comparison', 'features', 'conversion', 'cards'],
  component: false, // Factory function
  ownedFields: ['layout', 'className'],

  settings: {
    title: {
      type: 'text',
      label: 'Section Title',
      default: 'Pricing',
      description: 'Section heading',
      validation: { maxLength: 100 },
      group: 'Content',
    },
    subtitle: {
      type: 'text',
      label: 'Subtitle',
      default: '',
      description: 'Optional subtitle below title',
      validation: { maxLength: 150 },
      group: 'Content',
    },
    plans: {
      type: 'custom',
      label: 'Pricing Plans',
      default: [],
      description: 'Array of pricing plan objects',
      validation: { required: true },
      group: 'Content',
    },
    footerText: {
      type: 'text',
      label: 'Footer Text',
      default: '',
      description: 'Optional footer text (e.g., "All prices in USD")',
      validation: { maxLength: 150 },
      group: 'Content',
    },
    columns: {
      type: 'range',
      label: 'Columns',
      default: 3,
      min: 1,
      max: 4,
      step: 1,
      description: 'Number of columns in grid',
      group: 'Layout',
    },
    gap: {
      type: 'text',
      label: 'Card Gap',
      default: '2rem',
      description: 'Gap between cards (CSS value)',
      validation: { maxLength: 50 },
      group: 'Layout',
    },
    cardShadow: {
      type: 'toggle',
      label: 'Card Shadow',
      default: true,
      description: 'Show shadow on cards',
      group: 'Styling',
    },
    cardBackgroundColor: {
      type: 'color',
      label: 'Card Background',
      default: '#ffffff',
      description: 'Default card background color',
      group: 'Styling',
    },
    highlightedCardBackgroundColor: {
      type: 'color',
      label: 'Highlighted Card Background',
      default: '#fafafa',
      description: 'Background for highlighted/featured plans',
      group: 'Styling',
    },

    // Typography — main
    titleScale: textScaleSetting('Title Scale', 'h2'),
    subtitleScale: textScaleSetting('Subtitle Scale', 'body'),
    planNameScale: textScaleSetting('Plan Name Scale', 'h3'),
    priceScale: textScaleSetting('Price Scale', 'body'),
    descriptionScale: textScaleSetting('Description Scale', 'body'),
    footerScale: textScaleSetting('Footer Scale', 'body'),

    // Typography — advanced
    badgeScale: textScaleSetting('Badge Scale', 'small', { advanced: true }),
    periodScale: textScaleSetting('Period Scale', 'small', { advanced: true }),
    featureLabelScale: textScaleSetting('Feature Label Scale', 'small', { advanced: true }),
    featureIconScale: textScaleSetting('Feature Icon Scale', 'small', { advanced: true }),
  },
})
