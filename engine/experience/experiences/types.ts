/**
 * Experience types.
 * An Experience bundles state provider + behaviour defaults.
 * Users select Experiences in the CMS.
 */

import type { ComponentType } from 'react'
import type { SerializableValue } from '../../schema/types'
import type { SettingsConfig } from '../../schema/settings'
import type { ExperienceCategory } from './registry'

// =============================================================================
// Experience State Types
// =============================================================================

/**
 * State managed by the experience store.
 * Updated by drivers, consumed by behaviours.
 */
export interface ExperienceState {
  scrollProgress: number
  viewportHeight: number
  isScrolling: boolean
  /** User prefers reduced motion (a11y) */
  prefersReducedMotion: boolean
  /** Section visibility ratios (0-1) keyed by section ID */
  sectionVisibilities: Record<string, number>
  /** Cursor X position in viewport pixels */
  cursorX: number
  /** Cursor Y position in viewport pixels */
  cursorY: number
}

/**
 * Navigation state for experiences with section navigation.
 * Used by slideshow, horizontal scroll, and other navigable experiences.
 */
export interface NavigationState {
  /** Currently active section index (0-based) */
  activeSection: number
  /** Previous active section index */
  previousSection: number
  /** Total number of navigable sections */
  totalSections: number
  /** Whether a transition is in progress */
  isTransitioning: boolean
  /** Transition progress (0-1) */
  transitionProgress: number
  /** Direction of current transition */
  transitionDirection: 'forward' | 'backward' | null
  /** Last navigation input that caused the transition */
  lastInputType: string | null
  /** Whether navigation is currently locked */
  isLocked: boolean
}

/**
 * Combined state for navigable experiences.
 * Extends base ExperienceState with navigation capabilities.
 */
export interface NavigableExperienceState extends ExperienceState, NavigationState {}

/**
 * State for infinite carousel experiences.
 * Uses continuous scroll progress with momentum physics.
 */
export interface InfiniteCarouselState extends NavigableExperienceState {
  /** Scroll velocity in sections per frame (decays with friction) */
  velocity: number
  /** Target section for snap animation (-1 when free-scrolling) */
  snapTarget: number
  /** Whether currently snapping to a section */
  isSnapping: boolean
  /** Experience phase: 'intro' for initial animation, 'ready' for interaction */
  phase: 'intro' | 'ready'
  /** Whether user has looped through all sections (enables backward scroll at start) */
  hasLooped: boolean
  /** Section IDs in order (for NavTimeline labels) */
  sectionIds: string[]
  /**
   * Progress through the clip/transition phase (0-1).
   * For tall sections, this is 0 during internal scroll and 0-1 during clip.
   * NavTimeline uses this for pointer animation instead of raw scrollProgress.
   */
  clipProgress: number
  /** Indices of sections marked as pinned (stay visible behind next section) */
  pinnedSections: number[]
}

/**
 * A single behaviour assignment with per-behaviour options.
 * Used in sectionBehaviours and widgetBehaviours arrays.
 */
export interface BehaviourAssignment {
  /** Behaviour ID (e.g., 'scroll/fade', 'visibility/fade-in') */
  behaviour: string
  /** Options passed to this behaviour's compute function */
  options?: Record<string, unknown>
  /** Section-level trait: CSS position:sticky pinning */
  pinned?: boolean
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
  | 'stacking'           // Default: sections stack vertically, scroll to navigate
  | 'slideshow'          // One section visible at a time, discrete transitions
  | 'parallax'           // Layered depth effect, sections overlap
  | 'horizontal'         // Horizontal layout, scroll/swipe to navigate
  | 'infinite-carousel'  // Transform-based infinite vertical scroll with momentum
  | 'cover-scroll'       // First section is backdrop, rest scroll over it

/**
 * Presentation configuration.
 * Defines how sections are displayed and transitioned.
 */
export interface PresentationConfig {
  /** Presentation model type */
  model: PresentationModel

  /** Whether this presentation model takes over page-level scrolling.
   *  When true, SmoothScrollProvider is disabled regardless of theme config. */
  ownsPageScroll?: boolean

  /** Override the theme's smooth scroll config for this experience.
   *  Merged on top of theme.smoothScroll — e.g., force Lenis for CSS sticky compatibility. */
  smoothScrollOverride?: import('../../schema').SmoothScrollConfig

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
 *
 * Tasks use factory functions for lazy execution - the animation
 * only starts when execute() is called, not when registered.
 */
export type TransitionTask =
  | { type: 'duration'; duration: number }
  | { type: 'promise'; factory: () => Promise<void> }

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
 * A pattern: curated collection of behaviours + structural config.
 * The engine auto-derives the store from the presentation model.
 *
 * For structural experiences (slideshow, gallery), use:
 * - experienceChrome: add navigation, indicators
 * - constraints: enforce structural rules
 * - presentation: control visual arrangement
 * - navigation: control user navigation inputs
 */
export interface Experience {
  /** Unique identifier for the experience */
  id: string
  /** Human-readable name */
  name: string
  /** Description of what the experience does */
  description: string

  // Meta fields (for CMS UI)

  /** Icon identifier for CMS UI */
  icon?: string
  /** Searchable tags */
  tags?: string[]
  /** Category for grouping in CMS */
  category?: ExperienceCategory
  /** Configurable settings for this experience */
  settings?: SettingsConfig<unknown>

  // Behaviour assignments

  /** Per-section behaviour assignments. Keys are section IDs, '*' = fallback. */
  sectionBehaviours: Record<string, BehaviourAssignment[]>
  /** Default behaviours by widget type. Keys are widget type names. */
  widgetBehaviours?: Record<string, BehaviourAssignment[]>

  // Structural configuration (optional - for experiences like slideshow)

  /** Experience-owned UI elements (navigation, indicators) */
  experienceChrome?: ExperienceChrome[]
  /** Structural constraints the experience imposes */
  constraints?: ExperienceConstraints

  // Presentation and navigation (optional)

  /** Presentation model - how sections are visually arranged */
  presentation?: PresentationConfig
  /** Navigation model - how users move between sections */
  navigation?: NavigationConfig
  /** Programmatic actions for external control */
  actions?: ExperienceActions

  /** Runtime controller(s) to render when this experience is active.
   *  Controllers handle experience-specific logic (navigation, physics, etc.)
   *  They read from useExperience() hook — no props needed. */
  controller?: ComponentType | ComponentType[]

  /** Chrome items to hide by ID (regions: 'header', 'footer', 'sidebar'; overlays by key) */
  hideChrome?: string[]

  /** Section IDs to hide from rendering */
  hideSections?: string[]

  /**
   * Bare mode - disables ALL behaviours including schema-level ones.
   * Used for testing/preview to see raw layout without animations.
   * When true, SectionRenderer ignores behaviour prop and uses 'none'.
   */
  bareMode?: boolean
}

// Re-export provider types from parent
export type { ExperienceContextValue, ExperienceProviderProps } from '../types'
