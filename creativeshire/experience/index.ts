/**
 * Experience layer barrel export.
 */

export { ExperienceProvider, useExperience } from './ExperienceProvider'
export { SmoothScrollProvider, useSmoothScroll } from './SmoothScrollProvider'
export { TriggerInitializer } from './TriggerInitializer'
export type {
  ExperienceState,
  Mode,
  ExperienceContextValue,
  ExperienceProviderProps,
} from './types'

// Triggers (write browser events to store)
export {
  useScrollProgress,
  useIntersection,
  usePrefersReducedMotion,
  useViewport,
} from './triggers'
export type { TriggerConfig, TriggerProps } from './triggers'

// Drivers (apply CSS vars at 60fps, bypass React)
export { useScrollFadeDriver } from './drivers'
export type { UseScrollFadeDriverOptions, DriverConfig, ElementDriverProps } from './drivers'

// Mask effects (GSAP-powered reveal animations)
export { RevealTransition, useGsapReveal } from './effects/mask'
export type { RevealType, UseGsapRevealOptions, RevealTransitionProps } from './effects/mask'
