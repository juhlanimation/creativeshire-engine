/**
 * Bishoy Gendi preset site-level defaults.
 * Experience and intro configuration.
 *
 * Currently uses simple experience (vertical scroll) for baseline rendering.
 * Will switch to infinite-carousel once all sections are verified.
 *
 * @see engine/experience/experiences/simple/index.ts
 */

import type { PresetExperienceConfig } from '../types'
import type { IntroConfig } from '../../intro/types'

/**
 * Experience configuration for Bishoy Gendi preset.
 * Simple vertical scroll for now — sections stack naturally.
 */
export const experienceConfig: PresetExperienceConfig = {
  id: 'simple',
}

/**
 * Intro configuration for Bishoy Gendi preset.
 * 4-phase choreographed sequence:
 * 1. mask-hold: SVG text mask visible on black (0-1.5s)
 * 2. background-fade: Background carousel fades in through text (1.5-4s)
 * 3. mask-fade: Text mask overlay fades out (4-6s)
 * 4. chrome-appear: Bio card + NavTimeline + scroll unlock (6-8.5s)
 * After 8.5s: Intro complete.
 */
export const introConfig: IntroConfig = {
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
    props: { text: '{{ content.intro.maskText }}', letterSpacing: '-0.02em' },
  },
}
