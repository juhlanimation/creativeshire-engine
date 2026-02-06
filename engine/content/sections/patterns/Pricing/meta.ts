/**
 * Pricing section pattern metadata for platform UI.
 */

import { defineSectionMeta } from '../../../../schema/meta'
import type { PricingProps } from './types'

export const meta = defineSectionMeta<PricingProps>({
  id: 'Pricing',
  name: 'Pricing Section',
  description: 'Feature comparison cards with pricing tiers',
  category: 'section',
  sectionCategory: 'content',
  unique: false,
  icon: 'credit-card',
  tags: ['pricing', 'plans', 'comparison', 'features', 'conversion', 'cards'],
  component: false, // Factory function

  settings: {
    title: {
      type: 'text',
      label: 'Section Title',
      default: 'Pricing',
      description: 'Section heading',
      group: 'Content',
    },
    subtitle: {
      type: 'text',
      label: 'Subtitle',
      default: '',
      description: 'Optional subtitle below title',
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
      group: 'Layout',
    },
    cardRadius: {
      type: 'text',
      label: 'Card Border Radius',
      default: '1rem',
      description: 'Card corner radius (CSS value)',
      group: 'Styling',
    },
    cardShadow: {
      type: 'toggle',
      label: 'Card Shadow',
      default: true,
      description: 'Show shadow on cards',
      group: 'Styling',
    },
    backgroundColor: {
      type: 'color',
      label: 'Background Color',
      default: '#ffffff',
      description: 'Section background color',
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
  },
})
