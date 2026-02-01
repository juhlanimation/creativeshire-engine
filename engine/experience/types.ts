/**
 * Experience provider types.
 * Defines the context value and provider props.
 * Mode types are re-exported from their canonical source in modes/types.ts.
 */
import type { StoreApi } from 'zustand'
import type { ExperienceState, Mode } from './modes/types'

// Re-export Mode types from canonical source
export type {
  Mode,
  ModeState,
  ModeOptions,
  ModeTriggerConfig,
  ModeOptionConfig,
  ModeDefaults,
  ExperienceState,
} from './modes/types'

/**
 * Context value distributed by ExperienceProvider.
 */
export interface ExperienceContextValue {
  mode: Mode
  store: StoreApi<ExperienceState>
}

/**
 * Props for ExperienceProvider component.
 */
export interface ExperienceProviderProps {
  mode: Mode
  store: StoreApi<ExperienceState>
  children: React.ReactNode
}
