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

// L2 Hooks (imperative control)
export { useVisibilityPlayback } from './hooks'

// Transitions (generic reveal animations)
export { RevealTransition } from './transitions'
export type { RevealType, RevealOptions, RevealTransitionProps } from './transitions'
