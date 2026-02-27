/**
 * Pricing section pattern metadata for platform UI.
 */

import { defineSectionMeta } from '../../../../schema/meta'
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
      hidden: true,
    },
    cardShadow: {
      type: 'toggle',
      label: 'Card Shadow',
      default: true,
      description: 'Show shadow on cards',
      group: 'Style',
    },
    cardBackgroundColor: {
      type: 'color',
      label: 'Card Background',
      default: '#ffffff',
      description: 'Default card background color',
      group: 'Style',
    },
    highlightedCardBackgroundColor: {
      type: 'color',
      label: 'Highlighted Card Background',
      default: '#fafafa',
      description: 'Background for highlighted/featured plans',
      group: 'Style',
    },
  },
})
