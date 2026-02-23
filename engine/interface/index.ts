/**
 * Interface layer barrel exports.
 */

// Provider and hooks
export { EngineProvider, useEngineController, useEngineState, useEngineStore } from './EngineProvider'

// Container context for contained/preview mode
export {
  ContainerProvider,
  useContainer,
  useIsContained,
  useBreakpoint,
  type ContainerMode,
  type ContainerConfig,
  type ContainerProviderProps,
} from './ContainerContext'

// Store factory
export { createEngineStore, createSnapshot } from './EngineStore'

// Validators
export * from './validation'

// Section discovery API
export {
  getAvailableSections,
  getSectionsGroupedByCategory,
  canAddSection,
  createSectionFromPattern,
  type SectionAvailability,
} from './discovery'

// Chrome pattern discovery API
export {
  getAvailableChromePatterns,
  getAvailableOverlayPatterns,
  getChromePatternsBySlotGrouped,
  createChromeFromPattern,
  type ChromePatternAvailability,
} from './discovery'

// Action discovery API
export {
  getAvailableActions,
  getWidgetTriggers,
  getWidgetsWithTriggers,
  resolveActionDependencies,
  getSectionActionIds,
  type ActionAvailability,
  type WidgetTriggerInfo,
  type ActionDependencyResult,
} from './discovery'

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
