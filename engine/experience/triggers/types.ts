/**
 * Trigger types.
 * Triggers observe browser events and write values to the experience store.
 *
 * Architecture:
 * Browser Event → Trigger → Store → BehaviourWrapper → CSS Variables
 *
 * Container-aware:
 * Triggers support both fullpage and contained modes. In contained mode
 * (e.g., CMS canvas preview), triggers observe the container element
 * instead of window/document.
 */

import type { StoreApi } from 'zustand'
import type { RefObject } from 'react'
import type { ExperienceState } from '../types'
import type { ContainerMode } from '../../interface/ContainerContext'

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
  /** Container mode for contained rendering */
  containerMode?: ContainerMode
  /** Container element ref for contained mode */
  containerRef?: RefObject<HTMLElement | null>
}
