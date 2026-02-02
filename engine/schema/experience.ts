/**
 * Experience layer types - behaviours, CSS variables, and configuration.
 * Behaviours transform runtime state into CSS variables for animation.
 */

import type { SettingConfig } from './settings'

/**
 * CSS variables record - all keys must be --prefixed.
 * Behaviours WRITE these, widgets READ them via CSS.
 */
export type CSSVariables = Record<`--${string}`, string | number>

/**
 * Runtime state passed to behaviour compute functions.
 */
export interface BehaviourState {
  /** Global scroll progress 0-1 */
  scrollProgress: number
  /** Scroll speed and direction */
  scrollVelocity: number
  /** Progress within current section 0-1 */
  sectionProgress: number
  /** Intersection ratio of section */
  sectionVisibility: number
  /** Position in section list */
  sectionIndex: number
  /** Total section count */
  totalSections: number
  /** Section currently active */
  isActive: boolean
  /** Mode-specific state (extensible) */
  [key: string]: unknown
}

/**
 * Configuration for behaviour options displayed in UI.
 * @deprecated Use SettingConfig from './settings' instead.
 * Kept as alias for backward compatibility with existing behaviours.
 */
export type OptionConfig = SettingConfig

/**
 * Behaviour configuration - either a behaviour ID string or full config object.
 */
export type BehaviourConfig =
  | string
  | {
      id: string
      options?: Record<string, string | number | boolean>
      variables?: CSSVariables
    }

/**
 * Experience configuration for a site.
 * References an experience by ID. Behaviour defaults live in the Experience definition.
 */
export interface ExperienceConfig {
  /** Experience ID (e.g., 'stacking', 'cinematic-portfolio') */
  id: string
  /**
   * @deprecated Use `id` instead. Kept for backward compatibility.
   * If both are provided, `id` takes precedence.
   */
  mode?: string
}
