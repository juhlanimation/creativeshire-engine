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

// Transitions (generic reveal animations)
export { RevealTransition, useGsapReveal } from './transitions'
export type { RevealType, UseGsapRevealOptions, RevealTransitionProps } from './transitions'
