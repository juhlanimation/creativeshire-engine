/**
 * Intro types - state, config, and action definitions.
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
// Sequence Step Configuration
// =============================================================================

/**
 * A timed setting change within an effect.
 * At the specified time offset, the listed settings are applied to the parent effect.
 * Optional transition duration controls how long the change takes.
 */
export interface EffectKeyframe {
  /** Time offset from effect start (ms) */
  at: number
  /** Settings to apply at this keyframe */
  settings: Record<string, unknown>
  /** Transition duration — how long the change takes (ms). Instant if omitted. */
  duration?: number
}

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
  /** Per-effect settings (displayed in timeline editor when selected) */
  settings?: Record<string, unknown>
  /** Timed setting changes within this effect */
  keyframes?: EffectKeyframe[]
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
  category?: 'gate' | 'reveal' | 'sequence'
  /** CMS-configurable settings for this intro */
  settings?: SettingsConfig<Record<string, unknown>>
}

// =============================================================================
// Preset Intro Reference
// =============================================================================

/**
 * Compact intro reference stored in presets.
 * References a registered sequence by ID, with optional settings overrides.
 * Resolved to a full IntroConfig at runtime via resolvePresetIntro().
 */
export interface PresetIntroConfig {
  /** Reference to a registered intro sequence by ID */
  sequence: string
  /** Settings overrides (shallow-merged into base config.settings) */
  settings?: Record<string, unknown>
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
