/**
 * Icon widget metadata for platform UI.
 */

import { defineMeta } from '@/engine/schema/meta'
import type { IconProps } from './types'

export const meta = defineMeta<IconProps>({
  id: 'Icon',
  name: 'Icon',
  description: 'Displays an SVG icon from the icon set',
  category: 'primitive',
  icon: 'icon',
  tags: ['visual', 'symbol', 'svg'],
  component: true,

  settings: {
    name: {
      type: 'icon',
      label: 'Icon',
      default: '',
      description: 'Icon name from the icon set',
      validation: { required: true },
    },
    size: {
      type: 'number',
      label: 'Size',
      default: 24,
      description: 'Icon size in pixels',
      min: 8,
      max: 256,
      step: 4,
    },
    color: {
      type: 'color',
      label: 'Color',
      default: 'currentColor',
      description: 'Icon color (CSS color value)',
    },
    decorative: {
      type: 'toggle',
      label: 'Decorative',
      default: true,
      description: 'Hide from screen readers (use for purely visual icons)',
    },
    label: {
      type: 'text',
      label: 'Accessible Label',
      default: '',
      description: 'Screen reader label (required if not decorative)',
      condition: 'decorative === false',
    },
  },
})
