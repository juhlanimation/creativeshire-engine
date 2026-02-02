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
  ExperienceTriggerConfig,
  BehaviourDefaults,
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
