/**
 * Experience layer barrel export.
 */

export { ExperienceProvider, useExperience } from './ExperienceProvider'
export { SmoothScrollProvider, useSmoothScroll } from './SmoothScrollProvider'
export type {
  ExperienceState,
  Mode,
  ExperienceContextValue,
  ExperienceProviderProps,
} from './types'

// Mask effects (GSAP-powered reveal animations)
export { RevealTransition, useGsapReveal } from './effects/mask'
export type { RevealType, UseGsapRevealOptions, RevealTransitionProps } from './effects/mask'
