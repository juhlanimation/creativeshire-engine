/**
 * Transition schema types.
 * Defines page transition configuration for site and page levels.
 */

/** Site-level: default transition for all page navigations */
export interface TransitionConfig {
  /** Registered page transition ID (e.g., 'fade') */
  id: string
  /** Override transition settings */
  settings?: Record<string, unknown>
}

/**
 * Page-level transition override.
 * This page is the "from" route — when navigating AWAY from this page, these transitions apply.
 */
export interface PageTransitionOverride {
  /** Default transition when leaving this page (overrides site default) */
  default?: TransitionConfig
  /** Per-destination overrides — each can use a different transition type */
  routes?: PageTransitionRoute[]
}

/** A specific from->to route transition */
export interface PageTransitionRoute {
  /** Target page ID */
  to: string
  /** Registered transition ID for this route */
  id: string
  /** Override transition settings for this route */
  settings?: Record<string, unknown>
}
