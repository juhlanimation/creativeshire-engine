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
    props: { text: 'HELLO' },
  },
}

registerIntro(meta, config)

export { meta, config }
