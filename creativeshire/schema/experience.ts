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
  /** Mode-specific state (extensible) */
  [key: string]: unknown
}

/**
 * Configuration for behaviour options displayed in UI.
 */
export interface OptionConfig {
  type: 'range' | 'select' | 'toggle' | 'color'
  label: string
  default: string | number | boolean
  min?: number
  max?: number
  step?: number
  choices?: { value: string; label: string }[]
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
 * Defines the default mode, available modes, and global behaviour settings.
 */
export interface ExperienceConfig {
  /** Default experience mode */
  mode: string
  /** Available experience modes */
  modes?: string[]
  /** Global behaviour options */
  behaviourDefaults?: Record<string, Record<string, string | number | boolean>>
}
