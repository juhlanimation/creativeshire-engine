/**
 * Experience provider types.
 * Defines the context value and provider props.
 */
import type { StoreApi } from 'zustand'
import type { Experience, ExperienceState } from './experiences/types'

// Re-export Experience types
export type {
  Experience,
  ExperienceState,
  BehaviourAssignment,
  // State types
  NavigableExperienceState,
  InfiniteCarouselState,
  NavigationState,
  // Presentation & navigation
  PresentationModel,
  PresentationConfig,
  NavigationInput,
  NavigationInputConfig,
  NavigationConfig,
  PageTransitionConfig,
  TransitionTask,
  ExperienceActions,
} from './experiences/types'

export { createExperienceStore } from './experiences/createExperienceStore'

/**
 * Context value distributed by ExperienceProvider.
 */
export interface ExperienceContextValue {
  experience: Experience
  store: StoreApi<ExperienceState>
  /** Merged experience settings (schema defaults + dev overrides) */
  settings: Record<string, unknown>
}

/**
 * Props for ExperienceProvider component.
 */
export interface ExperienceProviderProps {
  experience: Experience
  store: StoreApi<ExperienceState>
  /** Merged experience settings */
  settings?: Record<string, unknown>
  children: React.ReactNode
}
