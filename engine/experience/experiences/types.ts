/**
 * Experience types.
 * An Experience bundles state provider + behaviour defaults.
 * Users select Experiences in the CMS.
 */

import type { StoreApi } from 'zustand'
import type { ExperienceState } from '../modes/types'
import type { SerializableValue } from '../../schema/types'

/**
 * Configuration for a trigger that updates store state.
 */
export interface ExperienceTriggerConfig {
  /** Trigger type identifier (e.g., 'scroll-progress', 'intersection') */
  type: string
  /** Store field(s) to update */
  target: string | string[]
  /** Trigger-specific options */
  options?: Record<string, unknown>
}

/**
 * Behaviour defaults by section pattern or widget type.
 * Keys are pattern/type names, values are behaviour IDs.
 */
export interface BehaviourDefaults {
  /** Default behaviour for all sections (fallback) */
  section?: string
  /** Default behaviour per section pattern or widget type */
  [typeOrPattern: string]: string | undefined
}

/**
 * Page wrapper configuration for structural experiences.
 * Allows experiences like "slideshow" to wrap the entire page.
 */
export interface PageWrapper {
  /** Behaviour ID to wrap the page with (e.g., 'slide/container') */
  behaviourId: string
  /** Options passed to the behaviour */
  options?: Record<string, unknown>
}

/**
 * Experience-owned UI elements appended to the page.
 * These are separate from Preset chrome (which is content).
 * Example: slide indicators, navigation arrows for slideshow experience.
 */
export interface ExperienceChrome {
  /** Widget type to render */
  type: string
  /** Position: before sections, after sections, or overlay */
  position: 'before' | 'after' | 'overlay'
  /** Props passed to the widget - must be serializable for RSC boundary */
  props?: Record<string, SerializableValue>
}

/**
 * Structural constraints the experience imposes.
 * Used for validation and layout enforcement.
 */
export interface ExperienceConstraints {
  /** Require all sections to be full viewport height */
  fullViewportSections?: boolean
  /** Maximum visible sections at once (1 for slideshow) */
  maxVisibleSections?: number
  /** Section overflow handling */
  sectionOverflow?: 'visible' | 'hidden' | 'scroll'
}

// =============================================================================
// Presentation Model
// =============================================================================

/**
 * Presentation model types.
 * Controls how sections are visually arranged.
 */
export type PresentationModel =
  | 'stacking'    // Default: sections stack vertically, scroll to navigate
  | 'slideshow'   // One section visible at a time, discrete transitions
  | 'parallax'    // Layered depth effect, sections overlap
  | 'horizontal'  // Horizontal layout, scroll/swipe to navigate

/**
 * Presentation configuration.
 * Defines how sections are displayed and transitioned.
 */
export interface PresentationConfig {
  /** Presentation model type */
  model: PresentationModel

  /** Section visibility behavior */
  visibility: {
    /** How many sections can be visible simultaneously (1 = slideshow) */
    maxVisible: number
    /** Visibility overlap ratio (0 = no overlap, 0.5 = half overlap for parallax) */
    overlap: number
    /** Z-stacking direction ('forward' = later sections on top) */
    stackDirection: 'forward' | 'backward'
  }

  /** Transition configuration between sections */
  transition: {
    /** Behaviour ID for section transitions (e.g., 'transition/fade') */
    behaviourId: string
    /** Transition duration in milliseconds */
    duration: number
    /** Easing function name or cubic-bezier */
    easing: string
    /** Whether transitions can be interrupted by user input */
    interruptible: boolean
  }

  /** Layout constraints */
  layout: {
    /** Require sections to fill viewport height */
    fullViewport: boolean
    /** Section overflow handling */
    overflow: 'visible' | 'hidden' | 'scroll'
    /** Gap between sections (CSS value, e.g., '0', '-50vh') */
    gap: string
    /** Direction of section flow */
    direction: 'vertical' | 'horizontal'
  }
}

// =============================================================================
// Navigation Model
// =============================================================================

/**
 * Navigation input types.
 * Defines what user actions trigger navigation between sections.
 */
export type NavigationInput =
  | 'scroll'        // Continuous scroll (free or snap)
  | 'wheel'         // Discrete wheel events (for slideshow)
  | 'keyboard'      // Arrow keys, Page Up/Down
  | 'swipe'         // Touch swipe gestures
  | 'click'         // Click on navigation elements
  | 'programmatic'  // API calls (goToSection, etc.)

/**
 * Configuration for a navigation input.
 */
export interface NavigationInputConfig {
  /** Input type */
  type: NavigationInput
  /** Whether this input is enabled */
  enabled: boolean
  /** Input-specific options */
  options?: NavigationInputOptions
}

/**
 * Options for navigation inputs.
 */
export interface NavigationInputOptions {
  // Scroll/wheel options
  /** Scroll behavior: 'free' (continuous) or 'snap' (discrete) */
  behavior?: 'free' | 'snap'
  /** Threshold in pixels for snap detection */
  snapThreshold?: number
  /** Wheel sensitivity multiplier */
  wheelSensitivity?: number

  // Keyboard options
  /** Keys that trigger navigation */
  keys?: string[]
  /** Allow holding key for continuous navigation */
  repeat?: boolean

  // Swipe options
  /** Swipe direction */
  direction?: 'vertical' | 'horizontal' | 'both'
  /** Minimum swipe distance in pixels */
  threshold?: number
  /** Maximum swipe duration in milliseconds */
  maxDuration?: number
}

/**
 * Navigation configuration.
 * Defines how users move between sections.
 */
export interface NavigationConfig {
  /** Enabled navigation inputs (in priority order) */
  inputs: NavigationInputConfig[]

  /** Navigation behavior settings */
  behavior: {
    /** Loop back to start after last section */
    loop: boolean
    /** Allow navigating to non-adjacent sections (skip) */
    allowSkip: boolean
    /** Lock navigation during transitions */
    lockDuringTransition: boolean
    /** Debounce rapid navigation (ms) */
    debounce: number
  }

  /** Active section determination */
  activeSection: {
    /** Strategy for determining active section */
    strategy: 'intersection' | 'scroll-position' | 'manual'
    /** Intersection threshold (for 'intersection' strategy) */
    threshold?: number
    /** Offset from viewport top (for 'scroll-position' strategy) */
    offset?: number
  }

  /** Browser history integration */
  history: {
    /** Update URL hash on navigation */
    updateHash: boolean
    /** Restore position from hash on load */
    restoreFromHash: boolean
    /** Push to browser history stack */
    pushState: boolean
  }
}

// =============================================================================
// Page Transitions
// =============================================================================

/**
 * A transition task - anything that takes time.
 * Used in exit/entry stacks for page transitions.
 */
export type TransitionTask =
  | { type: 'duration'; duration: number }
  | { type: 'promise'; promise: Promise<void> }

/**
 * Page transition configuration.
 * Defines exit/entry animations when navigating between pages.
 */
export interface PageTransitionConfig {
  /** Default exit duration if no tasks registered (ms) */
  defaultExitDuration?: number
  /** Default entry duration if no tasks registered (ms) */
  defaultEntryDuration?: number
  /** Maximum wait time before forcing navigation (ms) */
  timeout?: number
  /** Skip transitions when user prefers reduced motion */
  respectReducedMotion?: boolean
}

// =============================================================================
// Experience Actions
// =============================================================================

/**
 * Programmatic actions exposed by the experience.
 * Used via useExperienceActions() hook.
 */
export interface ExperienceActions {
  /** Navigate to specific section by index */
  goToSection?: (index: number) => void
  /** Navigate to next section */
  nextSection?: () => void
  /** Navigate to previous section */
  previousSection?: () => void
  /** Lock/unlock navigation */
  setNavigationLock?: (locked: boolean) => void
}

/**
 * Experience definition.
 * Bundles state provider (what Mode did) + behaviour defaults.
 * Chrome structure stays in Preset; chrome behaviours come from behaviourDefaults.
 *
 * For structural experiences (slideshow, gallery), use:
 * - pageWrapper: wrap entire page in a behaviour
 * - experienceChrome: add navigation, indicators
 * - constraints: enforce structural rules
 * - presentation: control visual arrangement
 * - navigation: control user navigation inputs
 * - pageTransition: control page exit/entry animations
 */
export interface Experience {
  /** Unique identifier for the experience */
  id: string
  /** Human-readable name */
  name: string
  /** Description of what the experience does */
  description: string

  // State provider (absorbed from Mode)

  /** State fields the experience's store exposes */
  provides: string[]
  /** Function to create the Zustand store for this experience */
  createStore: () => StoreApi<ExperienceState>
  /** Triggers that update store state */
  triggers: ExperienceTriggerConfig[]

  // Behaviour defaults

  /** Default behaviours by section pattern or widget type */
  behaviourDefaults: BehaviourDefaults

  // Structural configuration (optional - for experiences like slideshow)

  /** Page-level behaviour wrapper (e.g., slide container) */
  pageWrapper?: PageWrapper
  /** Experience-owned UI elements (navigation, indicators) */
  experienceChrome?: ExperienceChrome[]
  /** Structural constraints the experience imposes */
  constraints?: ExperienceConstraints

  // Presentation and navigation (optional)

  /** Presentation model - how sections are visually arranged */
  presentation?: PresentationConfig
  /** Navigation model - how users move between sections */
  navigation?: NavigationConfig
  /** Page transition config - exit/entry animations between pages */
  pageTransition?: PageTransitionConfig
  /** Programmatic actions for external control */
  actions?: ExperienceActions

  /** Chrome items to hide by ID (regions: 'header', 'footer', 'sidebar'; overlays by key) */
  hideChrome?: string[]

  /** Section IDs to hide from rendering */
  hideSections?: string[]
}

// Re-export ExperienceState for convenience
export type { ExperienceState } from '../modes/types'

// Re-export provider types from parent
export type { ExperienceContextValue, ExperienceProviderProps } from '../types'
