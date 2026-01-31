/**
 * Interface layer barrel exports.
 */

// Provider and hooks
export { EngineProvider, useEngineController, useEngineState, useEngineStore } from './EngineProvider'

// Store factory
export { createEngineStore, createSnapshot } from './EngineStore'

// Validators
export * from './validation'

// Types
export type {
  EngineInput,
  EngineState,
  EngineController,
  EngineEvents,
  EngineError,
  EngineErrorCode,
  EngineStateSnapshot,
  EngineConstraints,
  ShellConfig,
  ValidationResult,
  ConstraintViolation,
  ConstraintType,
  WidgetPath,
} from './types'

export { DEFAULT_CONSTRAINTS } from './types'
