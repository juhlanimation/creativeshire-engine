/**
 * Container layout widget metadata for platform UI.
 */

import { defineMeta } from '../../../../schema/meta'
import type { ContainerProps } from './types'

export const meta = defineMeta<ContainerProps>({
  id: 'Container',
  name: 'Container',
  description: 'Max-width wrapper for constraining content width',
  category: 'layout',
  icon: 'container',
  tags: ['container', 'layout', 'wrapper', 'responsive'],
  component: true,

  settings: {
    maxWidth: {
      type: 'text',
      label: 'Max Width',
      default: '1200px',
      description: 'Maximum width (px number or CSS value)',
      bindable: true,
      validation: { maxLength: 50 },
    },
    padding: {
      type: 'spacing',
      label: 'Horizontal Padding',
      default: '1rem',
      description: 'Left and right padding',
      bindable: true,
      validation: { min: 0, max: 500 },
    },
    center: {
      type: 'toggle',
      label: 'Center',
      default: true,
      description: 'Center the container horizontally',
      bindable: true,
    },
  },
})
