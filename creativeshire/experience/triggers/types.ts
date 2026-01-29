/**
 * Trigger types.
 * Triggers observe browser events and write values to the experience store.
 *
 * Architecture:
 * Browser Event → Trigger → Store → BehaviourWrapper → CSS Variables
 */

import type { StoreApi } from 'zustand'
import type { ExperienceState } from '../types'

/**
 * Configuration for a trigger.
 * Triggers are hooks that update the experience store based on browser events.
 */
export interface TriggerConfig {
  /** Unique identifier for the trigger */
  id: string
  /** Human-readable description */
  description: string
  /** Store keys this trigger updates */
  updates: (keyof ExperienceState)[]
}

/**
 * Props passed to trigger hooks.
 */
export interface TriggerProps {
  store: StoreApi<ExperienceState>
}
