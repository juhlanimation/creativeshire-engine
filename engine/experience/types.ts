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

// Re-export Mode types for backward compatibility (deprecated)
export type {
  Mode,
  ModeState,
  ModeOptions,
  ModeTriggerConfig,
  ModeOptionConfig,
  ModeDefaults,
} from './modes/types'

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
