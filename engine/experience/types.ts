/**
 * Experience provider types.
 * Defines the context value and provider props.
 */
import type { StoreApi } from 'zustand'
import type { Experience, ExperienceState } from './compositions/types'

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
} from './compositions/types'

export { createExperienceStore } from './compositions/createExperienceStore'

/**
 * Context value distributed by ExperienceProvider.
 */
export interface ExperienceContextValue {
  experience: Experience
  store: StoreApi<ExperienceState>
}

/**
 * Props for ExperienceProvider component.
 */
export interface ExperienceProviderProps {
  experience: Experience
  store: StoreApi<ExperienceState>
  children: React.ReactNode
}
