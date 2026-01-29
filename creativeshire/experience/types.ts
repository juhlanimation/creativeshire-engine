/**
 * Experience provider types.
 * Defines the context value, mode, and state interfaces.
 */
import type { StoreApi } from 'zustand'

/**
 * State managed by the experience store.
 * Updated by drivers, consumed by behaviours.
 */
export interface ExperienceState {
  scrollProgress: number
  viewportHeight: number
  isScrolling: boolean
  /** Section visibility ratios (0-1) keyed by section ID */
  sectionVisibilities: Record<string, number>
}

/**
 * Mode configuration that defines default behaviours.
 */
export interface Mode {
  id: string
  defaults: {
    section?: string
    widget?: string
  }
  createStore: () => StoreApi<ExperienceState>
}

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
