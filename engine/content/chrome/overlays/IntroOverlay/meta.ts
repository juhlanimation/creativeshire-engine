/**
 * IntroOverlay chrome overlay metadata for platform UI.
 */

import { defineMeta } from '../../../../schema/meta'
import type { IntroOverlayProps } from './types'

export const meta = defineMeta<IntroOverlayProps>({
  id: 'IntroOverlay',
  name: 'Intro Overlay',
  description: 'Full-screen overlay for intro sequences with text mask cutout',
  category: 'overlay',
  icon: 'layers',
  tags: ['chrome', 'overlay', 'intro', 'mask'],
  component: true,

  settings: {
    text: {
      type: 'text',
      label: 'Mask Text',
      default: '',
      description: 'Text to display as mask cutout',
      bindable: true,
    },
    maskColor: {
      type: 'color',
      label: 'Mask Color',
      default: '#000000',
      description: 'Background color of the overlay mask',
    },
    fontSize: {
      type: 'text',
      label: 'Font Size',
      default: '25vw',
      description: 'Font size for mask text (CSS value)',
    },
    fontWeight: {
      type: 'number',
      label: 'Font Weight',
      default: 900,
      description: 'Font weight for mask text',
    },
    fontFamily: {
      type: 'text',
      label: 'Font Family',
      default: 'var(--font-title)',
      description: 'Font family for mask text (CSS value)',
      advanced: true,
    },
    letterSpacing: {
      type: 'text',
      label: 'Letter Spacing',
      default: '',
      description: 'Letter spacing (CSS value, e.g. -0.02em)',
      advanced: true,
    },
    bgFadeStep: {
      type: 'number',
      label: 'Background Fade Step',
      default: 1,
      description: 'Step at which background fades, revealing content through text',
      advanced: true,
    },
    overlayFadeStep: {
      type: 'number',
      label: 'Overlay Fade Step',
      default: 2,
      description: 'Step at which the overlay mask fades out',
      advanced: true,
    },
  },
})
