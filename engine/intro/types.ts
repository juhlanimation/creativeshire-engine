/**
 * Intro types - state, config, and pattern definitions.
 * Intro sequences run before Experience takes over.
 */

import type { SettingsConfig } from '../schema/settings'

// =============================================================================
// Phase Lifecycle
// =============================================================================

/**
 * Intro phase lifecycle states.
 * - locked: Scroll is locked, intro is running
 * - revealing: Intro completed trigger, content revealing
 * - ready: Intro complete, normal interaction enabled
 */
export type IntroPhase = 'locked' | 'revealing' | 'ready'

// =============================================================================
// Intro State
// =============================================================================

/**
 * Intro state managed by IntroProvider.
 */
export interface IntroState {
  /** Current lifecycle phase */
  phase: IntroPhase

  /** Video currentTime (for video-gate pattern) */
  videoTime: number
  /** Timer elapsed milliseconds (for timed pattern) */
  timerElapsed: number

  /** Reveal animation progress 0-1 */
  revealProgress: number

  /** Current step index for sequence patterns (0-based) */
  currentStep: number
  /** Progress within current step (0-1) */
  stepProgress: number

  /** Whether scroll is currently locked */
  isScrollLocked: boolean
  /** Whether chrome (header/footer) is visible */
  chromeVisible: boolean
  /** Whether intro has completed (persists after phase becomes 'ready') */
  introCompleted: boolean
}

// =============================================================================
// Configuration
// =============================================================================

/**
 * Intro configuration in site/page schema.
 */
export interface IntroConfig {
  /** Intro pattern ID */
  pattern: 'video-gate' | 'timed' | 'scroll-reveal' | 'sequence-timed'
  /** Pattern-specific settings */
  settings?: Record<string, unknown>
  /** Overlay component rendered during intro (covers viewport) */
  overlay?: {
    component: string
    props?: Record<string, unknown>
  }
}

// =============================================================================
// Triggers
// =============================================================================

/**
 * Trigger configuration for intro patterns.
 */
export interface IntroTriggerConfig {
  /** Trigger type */
  type: 'video-time' | 'timer' | 'scroll' | 'visibility' | 'sequence'
  /** Trigger-specific options */
  options?: Record<string, unknown>
}

// =============================================================================
// Sequence Step Configuration
// =============================================================================

/**
 * Configuration for a single step in a sequence intro.
 */
export interface SequenceStepConfig {
  /** Unique identifier for this step */
  id: string
  /** Absolute time in ms when this step starts */
  at: number
  /** Duration of this step in ms */
  duration: number
  /** Actions to perform when this step starts */
  actions?: {
    setChromeVisible?: boolean
    setScrollLocked?: boolean
  }
}

// =============================================================================
// Pattern Meta (CMS listing)
// =============================================================================

/** Intro pattern category for CMS organization */
export type IntroCategory = 'gate' | 'reveal' | 'sequence'

/**
 * Intro pattern metadata for CMS listing.
 * Contains only the fields needed for discovery/display.
 */
export interface IntroPatternMeta<T = unknown> {
  /** Unique identifier */
  id: string
  /** Human-readable name */
  name: string
  /** Description */
  description: string
  /** Icon identifier for CMS UI */
  icon?: string
  /** Searchable tags */
  tags?: string[]
  /** Category for grouping in CMS */
  category?: IntroCategory
  /** CMS-configurable settings */
  settings?: SettingsConfig<T>
  /** Preview image URL */
  preview?: string
  /** Documentation URL */
  docs?: string
}

// =============================================================================
// Compiled Intro Meta (CMS listing for full intro configs)
// =============================================================================

/**
 * Metadata for a compiled intro (pattern + settings + overlay bundled together).
 * Used by DevIntroSwitcher and CMS to list available intros.
 */
export interface IntroMeta {
  /** Unique identifier (e.g., 'cinematic-text-mask') */
  id: string
  /** Human-readable name (e.g., 'Cinematic Text Mask') */
  name: string
  /** Description for CMS display */
  description: string
  /** Icon identifier for CMS UI */
  icon?: string
  /** Category for grouping in CMS */
  category?: IntroCategory
}

// =============================================================================
// Patterns
// =============================================================================

/**
 * Intro pattern definition.
 * Extends meta with runtime fields.
 */
export interface IntroPattern extends IntroPatternMeta {
  /** What triggers completion */
  triggers: IntroTriggerConfig[]

  /** Reveal animation duration (ms) */
  revealDuration: number

  /** Whether to hide chrome during intro */
  hideChrome: boolean
}

// =============================================================================
// Actions
// =============================================================================

/**
 * Actions for intro store.
 */
export interface IntroActions {
  /** Set current phase */
  setPhase: (phase: IntroPhase) => void
  /** Update video time */
  setVideoTime: (time: number) => void
  /** Update timer elapsed */
  setTimerElapsed: (elapsed: number) => void
  /** Update reveal progress */
  setRevealProgress: (progress: number) => void
  /** Set current step index */
  setCurrentStep: (step: number) => void
  /** Set progress within current step (0-1) */
  setStepProgress: (progress: number) => void
  /** Set scroll lock state */
  setScrollLocked: (locked: boolean) => void
  /** Set chrome visibility */
  setChromeVisible: (visible: boolean) => void
  /** Mark intro as completed */
  completeIntro: () => void
}
