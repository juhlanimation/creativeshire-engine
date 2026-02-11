/**
 * HeroVideo interactive widget metadata for platform UI.
 */

import { defineMeta } from '../../../../schema/meta'
import type { HeroVideoProps } from './types'

export const meta = defineMeta<HeroVideoProps>({
  id: 'HeroVideo',
  name: 'Hero Video',
  description: 'Full-screen video hero with intro timing, text reveal, and scroll cover progress',
  category: 'interactive',
  icon: 'video',
  tags: ['hero', 'video', 'fullscreen', 'interactive'],
  component: true,

  settings: {
    src: {
      type: 'video',
      label: 'Video Source',
      default: '',
      description: 'Video file URL for the hero background',
      validation: { required: true },
      bindable: true,
    },
    title: {
      type: 'text',
      label: 'Title',
      default: '',
      description: 'Large brand title text',
      validation: { required: true, maxLength: 100 },
      bindable: true,
    },
    tagline: {
      type: 'text',
      label: 'Tagline',
      default: '',
      description: 'Subtitle below title (e.g., "DRØM • DEL • SKAB")',
      validation: { maxLength: 100 },
      bindable: true,
    },
    loopStartTime: {
      type: 'number',
      label: 'Loop Start Time',
      default: 0,
      description: 'Seconds to restart from after video ends (custom loop point)',
      min: 0,
      max: 3600,
      advanced: true,
    },
    textRevealTime: {
      type: 'number',
      label: 'Text Reveal Time',
      default: 0,
      description: 'Seconds when overlay text appears (0 = immediate)',
      min: 0,
      max: 60,
      advanced: true,
    },
    scrollIndicatorText: {
      type: 'text',
      label: 'Scroll Indicator Text',
      default: '(SCROLL)',
      description: 'Text shown at bottom on desktop (arrow shown on touch devices)',
      validation: { maxLength: 100 },
      bindable: true,
    },
    externalReveal: {
      type: 'toggle',
      label: 'External Reveal',
      default: false,
      description: 'Text/scroll-indicator visibility follows external CSS variable instead of textRevealTime',
      advanced: true,
    },
  },
})
