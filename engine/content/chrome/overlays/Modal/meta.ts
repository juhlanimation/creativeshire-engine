/**
 * Modal overlay component metadata for platform UI.
 */

import { defineMeta } from '../../../../schema/meta'
import type { ModalProps } from './types'

export const meta = defineMeta<ModalProps>({
  id: 'Modal',
  name: 'Modal',
  description: 'GSAP-powered modal container with wipe and expand transitions',
  category: 'overlay',
  icon: 'modal',
  tags: ['chrome', 'overlay', 'modal', 'animation'],
  component: true,

  settings: {
    id: {
      type: 'text',
      label: 'Modal ID',
      default: 'modal',
      description: 'Unique identifier for the modal',
      validation: { required: true, maxLength: 100 },
    },
  },
})
