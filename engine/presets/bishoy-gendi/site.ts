/**
 * Bishoy Gendi preset site-level defaults.
 * Experience and intro configuration.
 *
 * Uses infinite-carousel experience for momentum-based vertical scrolling
 * with snap-to-section behavior.
 *
 * @see engine/experience/experiences/infinite-carousel/index.ts
 */

import type { PresetExperienceConfig } from '../types'
import type { IntroConfig } from '../../intro/types'

/**
 * Experience configuration for Bishoy Gendi preset.
 * Infinite carousel — momentum-based vertical scroll with snap.
 */
export const experienceConfig: PresetExperienceConfig = {
  id: 'infinite-carousel',
  sectionBehaviours: {
    showreel: [{ behaviour: 'none', pinned: true }],
  },
}

/**
 * Intro configuration for Bishoy Gendi preset.
 * 4-phase choreographed sequence:
 * 1. mask-hold: SVG text mask visible on black (0-1.5s)
 * 2. background-fade: Background carousel fades in through text (1.5-4s)
 * 3. mask-fade: Text mask overlay fades out (4-6s)
 * 4. chrome-appear: About card + NavTimeline + scroll unlock (6-8.5s)
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
