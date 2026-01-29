/**
 * Mode types for the Experience layer.
 * Canonical source for Mode interface and related types.
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
  /** User prefers reduced motion (a11y) */
  prefersReducedMotion: boolean
  /** Section visibility ratios (0-1) keyed by section ID */
  sectionVisibilities: Record<string, number>
}

/**
 * Mode-specific state fields (extensible).
 * Each mode defines its own state shape.
 */
export interface ModeState {
  [key: string]: unknown
}

/**
 * Options passed to mode's createStore function.
 */
export interface ModeOptions {
  [key: string]: unknown
}

/**
 * Configuration for a mode trigger that updates store state.
 * Used in mode definitions to specify which triggers should be initialized.
 */
export interface ModeTriggerConfig {
  /** Trigger type identifier (e.g., 'scroll-progress', 'intersection') */
  type: string
  /** Store field to update */
  target: string
  /** Trigger-specific options */
  options?: Record<string, unknown>
}

/**
 * Configuration for mode options displayed in UI.
 */
export interface ModeOptionConfig {
  type: 'number' | 'boolean' | 'string' | 'select'
  default: unknown
  label: string
  description?: string
  min?: number
  max?: number
  options?: { label: string; value: unknown }[]
}

/**
 * Default behaviour assignments for a mode.
 * Specifies which behaviours apply to sections and widget types.
 */
export interface ModeDefaults {
  /** Default page transition behaviour */
  page?: string
  /** Default behaviour for all sections */
  section: string
  /** Default behaviour per widget type (e.g., Image: 'depth-layer') */
  [widgetType: string]: string | undefined
}

/**
 * Mode configuration that defines animation capabilities and default behaviours.
 * A mode bundles state shape, triggers, and behaviour defaults.
 */
export interface Mode {
  /** Unique identifier for the mode */
  id: string
  /** Human-readable name */
  name: string
  /** Description of what the mode does */
  description: string
  /** State fields the mode's store exposes */
  provides: string[]
  /** Function to create the Zustand store for this mode */
  createStore: (options?: ModeOptions) => StoreApi<ExperienceState>
  /** Event listeners that update store fields */
  triggers: ModeTriggerConfig[]
  /** Default behaviour assignments for sections and widgets */
  defaults: ModeDefaults
  /** Mode-specific configuration options */
  options?: Record<string, ModeOptionConfig>
}
