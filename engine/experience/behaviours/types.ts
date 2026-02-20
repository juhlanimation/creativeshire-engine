/**
 * Behaviour type definitions.
 * Behaviours transform runtime state into CSS variables for animation.
 */

import type { CSSVariables, BehaviourState } from '../../schema/experience'
import type { SettingsConfig } from '../../schema/settings'

/**
 * Behaviour trigger categories.
 * Matches the folder structure under behaviours/.
 */
export type BehaviourCategory =
  | 'scroll'
  | 'hover'
  | 'visibility'
  | 'animation'
  | 'interaction'
  | 'video'
  | 'intro'

/**
 * Lightweight metadata for listing without loading full behaviour.
 * Used for CMS UI, behaviour selection dropdowns, etc.
 */
export interface BehaviourMeta<T = unknown> {
  /** Unique behaviour identifier (e.g., 'scroll/fade') */
  id: string
  /** Human-readable name */
  name: string
  /** Short description for CMS display */
  description: string
  /** Icon identifier for CMS UI */
  icon?: string
  /** Searchable tags */
  tags?: string[]
  /** Category matching trigger folder */
  category: BehaviourCategory
  /** Configurable settings for this behaviour */
  settings?: SettingsConfig<T>
}

/**
 * Minimum opacity to force browser pre-rasterization.
 * 0.001 * 255 ≈ 0.255 which rounds to 0 in 8-bit color — truly invisible,
 * but bypasses the browser's "skip paint at opacity 0" optimization.
 */
export const MIN_PAINT_OPACITY = 0.001

/**
 * Behaviour definition.
 * Computes CSS variables from runtime state.
 */
export interface Behaviour<T = unknown> {
  /** Unique behaviour identifier */
  id: string
  /** Human-readable name for UI display */
  name?: string
  /** Short description for CMS display */
  description?: string
  /** Icon identifier for CMS UI */
  icon?: string
  /** Searchable tags */
  tags?: string[]
  /** Category matching trigger folder */
  category?: BehaviourCategory
  /** Required state keys that must be available */
  requires?: string[]
  /** Compute CSS variables from state and options. Element is the registered DOM element (provided by ScrollDriver). */
  compute: (state: BehaviourState, options?: Record<string, unknown>, element?: HTMLElement) => CSSVariables
  /** Optional CSS template for static styles */
  cssTemplate?: string
  /** Configurable settings for CMS UI */
  settings?: SettingsConfig<T>
  /**
   * Force browser to pre-rasterize content by clamping opacity variables
   * to MIN_PAINT_OPACITY instead of 0. Prevents first-frame jank when
   * sections transition from invisible to visible.
   */
  prerasterize?: boolean
}
