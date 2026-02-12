/**
 * Experience layer types - behaviours, CSS variables, and configuration.
 * Behaviours transform runtime state into CSS variables for animation.
 */

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

  // Hover/press state (local interaction)
  /** Whether element is hovered */
  isHovered: boolean
  /** Whether element is pressed */
  isPressed: boolean

  // User preferences
  /** User prefers reduced motion */
  prefersReducedMotion: boolean

  // Intro state (optional - present when IntroProvider is active)
  /** Intro phase: 'locked' | 'revealing' | 'ready' */
  introPhase?: 'locked' | 'revealing' | 'ready'
  /** Intro reveal progress 0-1 */
  introProgress?: number
  /** Whether intro is locking scroll */
  isIntroLocked?: boolean

  /** Mode-specific state (extensible) */
  [key: string]: unknown
}

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
 * `sectionBehaviours` allows the preset/schema to override per-section behaviour assignments.
 */
export interface ExperienceConfig {
  /** Experience ID (e.g., 'stacking', 'cinematic-portfolio') */
  id: string
  /** Experience-specific settings from CMS */
  settings?: Record<string, unknown>
  /** Per-section behaviour overrides. Keys are section IDs. */
  sectionBehaviours?: Record<string, import('../experience/experiences/types').BehaviourAssignment[]>
}
