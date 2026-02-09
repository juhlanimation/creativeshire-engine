/**
 * TextMask widget metadata for platform UI.
 */

import { defineMeta } from '../../../../schema/meta'
import type { TextMaskProps } from './types'

export const meta = defineMeta<TextMaskProps>({
  id: 'TextMask',
  name: 'Text Mask',
  description: 'SVG text cutout mask that reveals background through letter shapes',
  category: 'interactive',
  icon: 'text',
  tags: ['mask', 'text', 'svg', 'cutout', 'intro'],
  component: true,

  settings: {
    text: {
      type: 'text',
      label: 'Text',
      default: 'TEXT',
      description: 'Text to display as mask cutout',
      bindable: true,
      validation: { required: true },
    },
    fontSize: {
      type: 'text',
      label: 'Font Size',
      default: '25vw',
      description: 'Font size (CSS value)',
    },
    fontWeight: {
      type: 'number',
      label: 'Font Weight',
      default: 900,
      description: 'Font weight',
    },
    fontFamily: {
      type: 'text',
      label: 'Font Family',
      default: 'var(--font-title)',
      description: 'Font family (CSS value)',
      advanced: true,
    },
    maskColor: {
      type: 'color',
      label: 'Mask Color',
      default: '#000000',
      description: 'Background color of the mask fill',
    },
    letterSpacing: {
      type: 'text',
      label: 'Letter Spacing',
      default: '',
      description: 'Letter spacing (CSS value, e.g. -0.02em)',
      advanced: true,
    },
    maxWidth: {
      type: 'number',
      label: 'Max Width',
      default: 2400,
      description: 'Maximum SVG width in pixels',
      advanced: true,
    },
  },
})
