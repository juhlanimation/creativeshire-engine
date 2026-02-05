/**
 * TransitionLink widget metadata.
 */

import { defineMeta } from '../../../../schema/meta'
import type { TransitionLinkProps } from './types'

export const meta = defineMeta<TransitionLinkProps>({
  id: 'TransitionLink',
  name: 'Transition Link',
  description: 'A link that triggers page fade transitions before navigation.',
  category: 'interactive',
  icon: 'link',
  tags: ['navigation', 'link', 'transition'],
  component: true,

  settings: {
    href: {
      type: 'text',
      label: 'URL',
      default: '/',
      description: 'Target navigation URL',
      validation: { required: true },
      bindable: true,
    },
    duration: {
      type: 'number',
      label: 'Duration',
      default: 400,
      description: 'Transition duration in milliseconds',
      validation: { min: 0, max: 2000 },
    },
    skipTransition: {
      type: 'toggle',
      label: 'Skip Transition',
      default: false,
      description: 'Disable transition animation',
    },
  },
})
