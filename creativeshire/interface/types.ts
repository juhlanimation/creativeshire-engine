/**
 * Interface layer type definitions.
 * Defines the contract between platform and engine.
 */

import type { SiteSchema, PageSchema, SectionSchema, WidgetSchema, ThemeSchema, ChromeSchema } from '../schema'

// =============================================================================
// Engine Input
// =============================================================================

/**
 * Input from platform to engine.
 * All data must be JSON-serializable (RSC boundary).
 */
export interface EngineInput {
  /** Complete site schema */
  site: SiteSchema

  /** Current page to render */
  page: PageSchema

  /** Selected experience mode ID */
  experienceId?: string

  /** Enable preview mode (draft content, edit UI) */
  isPreview?: boolean

  /** Shell configuration (for platform wrapper mode) */
  shell?: ShellConfig

  /** Event callbacks */
  events?: EngineEvents
}

/**
 * Shell configuration for platform wrapper.
 * Platform passes this to indicate shell mode is active.
 */
export interface ShellConfig {
  /** Whether shell is enabled */
  enabled: boolean

  /** Position of shell sidebar */
  position: 'left' | 'right'

  /** Width of shell sidebar */
  width: number | string

  /** Responsive behavior */
  responsive?: {
    /** Breakpoint below which shell collapses */
    collapseBelow?: 'sm' | 'md' | 'lg' | 'xl'
    /** Behavior when collapsed */
    collapsedMode?: 'hidden' | 'drawer'
  }
}

// =============================================================================
// Engine State
// =============================================================================

/**
 * Internal engine state managed by Zustand.
 */
export interface EngineState {
  // Core state
  site: SiteSchema
  page: PageSchema
  experienceId: string
  isPreview: boolean

  // Status
  isReady: boolean
  lastError: EngineError | null

  // Actions
  updateSite: (changes: Partial<SiteSchema>) => void
  updatePage: (changes: Partial<PageSchema>) => void
  updateSection: (sectionId: string, changes: Partial<SectionSchema>) => ValidationResult
  updateWidget: (path: WidgetPath, changes: Partial<WidgetSchema>) => ValidationResult
  setExperience: (experienceId: string) => void
  reorderSections: (order: string[]) => ValidationResult
  addSection: (section: SectionSchema, position?: number) => ValidationResult
  removeSection: (sectionId: string) => ValidationResult
  setReady: (ready: boolean) => void
  setError: (error: EngineError | null) => void
}

// =============================================================================
// Controller
// =============================================================================

/**
 * Controller interface exposed to platform.
 * Methods return validation results for optimistic UI.
 */
export interface EngineController {
  // Section operations
  updateSection: (sectionId: string, changes: Partial<SectionSchema>) => ValidationResult
  reorderSections: (order: string[]) => ValidationResult
  addSection: (section: SectionSchema, position?: number) => ValidationResult
  removeSection: (sectionId: string) => ValidationResult

  // Widget operations
  updateWidget: (path: WidgetPath, changes: Partial<WidgetSchema>) => ValidationResult
  addWidget: (sectionId: string, widget: WidgetSchema, position?: number) => ValidationResult
  removeWidget: (path: WidgetPath) => ValidationResult

  // Experience operations
  setExperience: (experienceId: string) => void

  // Site operations
  updateTheme: (changes: Partial<ThemeSchema>) => void
  updateChrome: (changes: Partial<ChromeSchema>) => void

  // State queries
  getState: () => EngineStateSnapshot
  subscribe: (listener: (state: EngineStateSnapshot) => void) => () => void
}

// =============================================================================
// Path Types
// =============================================================================

/**
 * Path to a widget in the schema tree.
 * Enables deep updates without full tree traversal.
 */
export interface WidgetPath {
  /** Section containing the widget */
  sectionId: string

  /** Array of indices for nested widgets */
  widgetIndices: number[]
}

// =============================================================================
// Validation
// =============================================================================

/**
 * Result of a validation check.
 */
export interface ValidationResult {
  /** Whether the operation was valid */
  valid: boolean

  /** Error details if invalid */
  error?: ConstraintViolation | EngineError
}

/**
 * Constraint violation details.
 */
export interface ConstraintViolation {
  /** Type of constraint violated */
  type: ConstraintType

  /** Human-readable message */
  message: string

  /** Path to the violating element */
  path: string[]

  /** Current value that violated constraint */
  value?: unknown

  /** Constraint limit that was exceeded */
  limit?: number
}

/**
 * Constraint types.
 */
export type ConstraintType =
  | 'section-limit'
  | 'nesting-depth'
  | 'unknown-widget'
  | 'invalid-schema'
  | 'not-found'

// =============================================================================
// Errors
// =============================================================================

/**
 * Engine error details.
 */
export interface EngineError {
  /** Error code */
  code: EngineErrorCode

  /** Human-readable message */
  message: string

  /** Additional context */
  context?: Record<string, unknown>

  /** Stack trace (development only) */
  stack?: string
}

/**
 * Engine error codes.
 */
export type EngineErrorCode =
  | 'RENDER_ERROR'
  | 'BEHAVIOUR_ERROR'
  | 'VALIDATION_ERROR'
  | 'UNKNOWN_WIDGET'
  | 'UNKNOWN_BEHAVIOUR'
  | 'INITIALIZATION_ERROR'

// =============================================================================
// Events
// =============================================================================

/**
 * Event callbacks from engine to platform.
 */
export interface EngineEvents {
  /** Engine initialized and ready */
  onReady?: () => void

  /** Error occurred during render or animation */
  onError?: (error: EngineError) => void

  /** Schema constraint violated */
  onConstraintViolation?: (violation: ConstraintViolation) => void

  /** Schema state changed */
  onStateChange?: (snapshot: EngineStateSnapshot) => void
}

// =============================================================================
// State Snapshot
// =============================================================================

/**
 * Read-only snapshot of engine state.
 * Safe to pass across RSC boundary.
 */
export interface EngineStateSnapshot {
  site: SiteSchema
  page: PageSchema
  experienceId: string
  isPreview: boolean
  isReady: boolean
  sectionCount: number
  widgetCount: number
}

// =============================================================================
// Constraints
// =============================================================================

/**
 * Constraint configuration.
 */
export interface EngineConstraints {
  /** Maximum sections per page */
  maxSections: number

  /** Maximum widget nesting depth */
  maxWidgetNesting: number

  /** Maximum widgets per section */
  maxWidgetsPerSection: number
}

/**
 * Default constraint values.
 */
export const DEFAULT_CONSTRAINTS: EngineConstraints = {
  maxSections: 20,
  maxWidgetNesting: 3,
  maxWidgetsPerSection: 50,
}
