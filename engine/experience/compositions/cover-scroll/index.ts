/**
 * Cover Scroll experience.
 * Any section marked `pinned: true` sticks at the viewport top (position: sticky)
 * while subsequent sections scroll over it. Supports multiple pinned sections.
 *
 * Forces Lenis smooth scroll provider — CSS sticky doesn't work inside
 * GSAP ScrollSmoother's transform context.
 *
 * Behaviours (like scroll/cover-progress) work normally — no bareMode.
 */

import type { ExperienceComposition } from '../types'

export const coverScrollComposition: ExperienceComposition = {
  id: 'cover-scroll',
  name: 'Cover Scroll',
  description:
    'Pinned sections stick at the viewport top while remaining sections scroll over them. Mark any section as pinned for the cover effect.',
  icon: 'layers',
  tags: ['scroll-driven', 'cover', 'hero', 'backdrop'],
  category: 'scroll-driven',

  sectionBehaviours: {},

  presentation: {
    model: 'cover-scroll',
    // Lenis required: CSS position:sticky doesn't work inside GSAP ScrollSmoother's
    // transform context. Lenis uses native scroll with interpolation — sticky works.
    ownsPageScroll: false,
    smoothScrollOverride: { provider: 'lenis' },
    visibility: {
      maxVisible: Infinity,
      overlap: 0,
      stackDirection: 'forward',
    },
    transition: {
      behaviourId: 'none',
      duration: 0,
      easing: 'linear',
      interruptible: true,
    },
    layout: {
      fullViewport: false,
      overflow: 'visible',
      gap: '0',
      direction: 'vertical',
    },
  },
}
