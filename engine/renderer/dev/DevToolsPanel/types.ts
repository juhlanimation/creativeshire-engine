/**
 * Shared types for the unified DevToolsPanel.
 */

import type { SettingsConfig } from '../../../schema/settings'

/** Tab configuration for a dev tools category */
export interface DevToolsTabConfig {
  /** Unique tab identifier */
  id: string
  /** Display name */
  label: string
  /** Emoji icon */
  icon: string
  /** RGB triplet for --dt-accent (e.g., '59,130,246') */
  color: string
  /** Header title when tab is open */
  headerTitle: string
  /** URL query param name */
  urlParam: string
  /** How switching works: 'live' updates via CustomEvent, 'reload' reloads the page */
  mode: 'live' | 'reload'
  /** CustomEvent name for live mode */
  eventName?: string
  /** Show a "None" option at top of list */
  allowNone?: boolean
  /** Label for the none option (e.g., 'No Intro') */
  noneLabel?: string
  /** Description for the none option */
  noneDescription?: string
  /** Footer message (e.g., 'Switching reloads the page') */
  footerMessage?: string
  /** Get all items for this tab */
  getItems: () => DevToolsItem[]
  /** Get current override from URL */
  getOverride: () => string | null
  /** Set override (either URL + reload or URL + CustomEvent) */
  setOverride: (id: string | null) => void
}

/** An item in a dev tools tab list */
export interface DevToolsItem {
  id: string
  name: string
  description?: string
  settings?: SettingsConfig<Record<string, unknown>>
}
