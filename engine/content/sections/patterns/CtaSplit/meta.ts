import { defineSectionMeta } from '../../../../schema/meta'
import type { CtaSplitProps } from './types'

export const meta = defineSectionMeta<CtaSplitProps>({
  id: 'CtaSplit',
  name: 'CTA Split',
  description: 'Call-to-action section with split layout — featured (with images) or compact.',
  category: 'section',
  sectionCategory: 'contact',
  unique: false,
  icon: 'contact',
  tags: ['cta', 'contact', 'email', 'split'],
  component: false,
  ownedFields: ['layout', 'className'],
  settings: {
    layout: {
      type: 'select',
      label: 'Layout',
      default: 'featured',
      choices: [
        { value: 'featured', label: 'Featured (with images)' },
        { value: 'compact', label: 'Compact (text only)' },
      ],
    },
    blendMode: {
      type: 'select',
      label: 'Image Blend Mode',
      default: 'screen',
      choices: [
        { value: 'screen', label: 'Screen' },
        { value: 'multiply', label: 'Multiply' },
        { value: 'normal', label: 'Normal' },
      ],
      group: 'Style',
    },
  },
})
