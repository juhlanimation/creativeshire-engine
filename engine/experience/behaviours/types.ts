/**
 * Behaviour type definitions.
 * Behaviours transform runtime state into CSS variables for animation.
 */

import type { CSSVariables, BehaviourState, OptionConfig } from '../../schema/experience'

/**
 * Behaviour definition.
 * Computes CSS variables from runtime state.
 */
export interface Behaviour {
  /** Unique behaviour identifier */
  id: string
  /** Human-readable name for UI display */
  name?: string
  /** Required behaviours that must run first */
  requires?: string[]
  /** Compute CSS variables from state and options */
  compute: (state: BehaviourState, options?: Record<string, unknown>) => CSSVariables
  /** Optional CSS template for static styles */
  cssTemplate?: string
  /** Option configuration for UI controls */
  optionConfig?: Record<string, OptionConfig>
}

/**
 * Behaviour registry type.
 * Maps behaviour IDs to behaviour definitions.
 */
export type BehaviourRegistry = Record<string, Behaviour>
