/**
 * Cinematic Text Mask intro.
 *
 * A sequence-timed intro with 4 steps:
 * 1. mask-hold: Text mask holds on screen
 * 2. background-fade: Background fades revealing content through text
 * 3. mask-fade: Overlay mask fades out
 * 4. chrome-appear: Header/footer appear, scroll unlocks
 *
 * Uses the IntroOverlay chrome component for the visual layer.
 */

import { registerIntro } from '../registry'
import type { IntroMeta } from '../types'
import type { IntroConfig } from '../types'

const meta: IntroMeta = {
  id: 'cinematic-text-mask',
  name: 'Cinematic Text Mask',
  description: 'Full-screen text mask that reveals content through letter cutouts, then fades away',
  icon: '🎬',
  category: 'sequence',
  settings: {
    text: {
      type: 'text',
      label: 'Mask Text',
      default: 'HELLO',
      description: 'Text displayed as the mask cutout',
      bindable: true,
    },
    maskColor: {
      type: 'color',
      label: 'Mask Color',
      default: '#000000',
      description: 'Background color of the mask overlay',
    },
    fontFamily: {
      type: 'select',
      label: 'Text Type',
      default: 'title',
      description: 'Font family for the mask text',
      choices: [
        { value: 'title', label: 'Title Font' },
        { value: 'paragraph', label: 'Paragraph Font' },
        { value: 'system', label: 'System Font' },
      ],
    },
    holdDuration: {
      type: 'number',
      label: 'Hold Duration',
      default: 1500,
      description: 'How long the text mask holds before fading (ms)',
    },
    fadeDuration: {
      type: 'number',
      label: 'Background Fade Duration',
      default: 2500,
      description: 'Duration of background fade revealing content (ms)',
    },
    maskFadeDuration: {
      type: 'number',
      label: 'Mask Fade Duration',
      default: 2000,
      description: 'Duration of mask overlay fade out (ms)',
    },
    chromeAppearDuration: {
      type: 'number',
      label: 'Chrome Appear Duration',
      default: 2500,
      description: 'Duration of header/footer appearance (ms)',
    },
  },
}

const config: IntroConfig = {
  pattern: 'sequence-timed',
  settings: {
    contentFadeStep: 1,
    steps: [
      { id: 'mask-hold', at: 0, duration: 1500 },
      { id: 'background-fade', at: 1500, duration: 2500 },
      { id: 'mask-fade', at: 4000, duration: 2000 },
      { id: 'chrome-appear', at: 6000, duration: 2500, actions: { setChromeVisible: true, setScrollLocked: false } },
    ],
  },
  overlay: {
    component: 'IntroOverlay',
    props: {
      text: 'HELLO',
      maskColor: 'black',
      fontSize: '25cqw',
      fontWeight: 900,
      letterSpacing: '-0.02em',
      bgFadeStep: 1,
      overlayFadeStep: 2,
    },
  },
}

registerIntro(meta, config)

export { meta, config }
