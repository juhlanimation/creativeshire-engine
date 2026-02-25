/**
 * Page transition types.
 * Defines how page-level transitions are configured and registered.
 */

import type { SettingsConfig } from '../../schema/settings'

/** Page transition category for CMS organization */
export type PageTransitionCategory = 'fade' | 'directional' | 'none'

/**
 * Lightweight metadata for listing without loading full transition.
 */
export interface PageTransitionMeta<T = unknown> {
  /** Unique transition identifier */
  id: string
  /** Human-readable name */
  name: string
  /** Short description for CMS display */
  description: string
  /** Icon identifier for CMS UI */
  icon?: string
  /** Searchable tags */
  tags?: string[]
  /** Category for grouping in CMS */
  category?: PageTransitionCategory
  /** Configurable settings for this transition */
  settings?: SettingsConfig<T>
  /** Preview image URL */
  preview?: string
  /** Documentation URL */
  docs?: string
}

/**
 * Full page transition definition.
 * Extends meta with runtime configuration.
 */
export interface PageTransition extends PageTransitionMeta {
  /** Default timing values */
  defaults: {
    /** Exit animation duration (ms) */
    exitDuration: number
    /** Entry animation duration (ms) */
    entryDuration: number
    /** Maximum wait time before forcing navigation (ms) */
    timeout: number
  }
  /** Skip transitions when user prefers reduced motion */
  respectReducedMotion?: boolean
  /** CSS class applied during exit phase */
  exitClass: string
  /** CSS class applied during entry phase */
  entryClass: string
  /** Effect primitive ID for exit animation (overrides exitClass when set) */
  exitEffect?: string
  /** Effect primitive ID for entry animation (overrides entryClass when set) */
  entryEffect?: string
  /** Which realization to use for effect primitives (default: 'css') */
  effectMode?: 'gsap' | 'css'
}
