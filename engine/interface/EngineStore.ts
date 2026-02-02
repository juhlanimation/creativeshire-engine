/**
 * Engine state store using Zustand.
 * Manages schema state with validation-on-write pattern.
 */

import { createStore, type StoreApi } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type {
  EngineState,
  EngineInput,
  EngineEvents,
  ValidationResult,
  WidgetPath,
  EngineError,
  EngineStateSnapshot,
  ConstraintViolation,
} from './types'
import { DEFAULT_CONSTRAINTS } from './types'
import type { SiteSchema, PageSchema, SectionSchema, WidgetSchema } from '../schema'
import {
  validateSectionLimit,
  validateNestingDepth,
  validateWidgetType,
  validateSectionExists,
  validateSectionOrder,
} from './validation'

// =============================================================================
// Store Factory
// =============================================================================

/**
 * Create the engine Zustand store.
 * Uses immer for immutable updates with mutable syntax.
 */
export function createEngineStore(
  input: EngineInput,
  events?: EngineEvents
): StoreApi<EngineState> {
  return createStore<EngineState>()(
    immer((set, get) => ({
      // -----------------------------------------------------------------------
      // Initial state from input
      // -----------------------------------------------------------------------
      site: input.site,
      page: input.page,
      // Support both `id` (new) and `mode` (deprecated) for backward compatibility
      experienceId: input.experienceId ?? input.site.experience?.id ?? input.site.experience?.mode ?? 'stacking',
      isPreview: input.isPreview ?? false,
      isReady: false,
      lastError: null,

      // -----------------------------------------------------------------------
      // Site-level updates
      // -----------------------------------------------------------------------
      updateSite: (changes: Partial<SiteSchema>) => {
        set((state) => {
          Object.assign(state.site, changes)
        })
        events?.onStateChange?.(createSnapshot(get()))
      },

      // -----------------------------------------------------------------------
      // Page-level updates
      // -----------------------------------------------------------------------
      updatePage: (changes: Partial<PageSchema>) => {
        set((state) => {
          Object.assign(state.page, changes)
        })
        events?.onStateChange?.(createSnapshot(get()))
      },

      // -----------------------------------------------------------------------
      // Section updates with validation
      // -----------------------------------------------------------------------
      updateSection: (sectionId: string, changes: Partial<SectionSchema>): ValidationResult => {
        const state = get()

        // Validate section exists
        const existsResult = validateSectionExists(sectionId, state.page.sections)
        if (!existsResult.valid) {
          emitError(events, existsResult.error as EngineError)
          return existsResult
        }

        const sectionIndex = state.page.sections.findIndex((s) => s.id === sectionId)

        // Validate widget nesting if widgets are being updated
        if (changes.widgets) {
          const nestingResult = validateNestingDepth(
            changes.widgets,
            DEFAULT_CONSTRAINTS.maxWidgetNesting
          )
          if (!nestingResult.valid) {
            events?.onConstraintViolation?.(nestingResult.error as ConstraintViolation)
            return nestingResult
          }
        }

        // Apply update
        set((state) => {
          const section = state.page.sections[sectionIndex]
          Object.assign(section, changes)
        })

        events?.onStateChange?.(createSnapshot(get()))
        return { valid: true }
      },

      // -----------------------------------------------------------------------
      // Widget updates with path navigation
      // -----------------------------------------------------------------------
      updateWidget: (path: WidgetPath, changes: Partial<WidgetSchema>): ValidationResult => {
        const state = get()

        // Validate section exists
        const existsResult = validateSectionExists(path.sectionId, state.page.sections)
        if (!existsResult.valid) {
          return existsResult
        }

        // Validate widget type if being changed
        if (changes.type) {
          const typeResult = validateWidgetType(changes.type)
          if (!typeResult.valid) {
            events?.onConstraintViolation?.(typeResult.error as ConstraintViolation)
            return typeResult
          }
        }

        const sectionIndex = state.page.sections.findIndex((s) => s.id === path.sectionId)

        set((state) => {
          let current: WidgetSchema | undefined
          let parent: { widgets?: WidgetSchema[] } = state.page.sections[sectionIndex]

          // Navigate to widget
          for (const index of path.widgetIndices) {
            if (!parent.widgets || !parent.widgets[index]) {
              return // Widget not found
            }
            current = parent.widgets[index]
            parent = current
          }

          if (current) {
            Object.assign(current, changes)
          }
        })

        events?.onStateChange?.(createSnapshot(get()))
        return { valid: true }
      },

      // -----------------------------------------------------------------------
      // Experience mode change
      // -----------------------------------------------------------------------
      setExperience: (experienceId: string) => {
        set((state) => {
          state.experienceId = experienceId
        })
        events?.onStateChange?.(createSnapshot(get()))
      },

      // -----------------------------------------------------------------------
      // Section reordering
      // -----------------------------------------------------------------------
      reorderSections: (order: string[]): ValidationResult => {
        const state = get()

        // Validate all IDs exist
        const orderResult = validateSectionOrder(order, state.page.sections)
        if (!orderResult.valid) {
          return orderResult
        }

        const sectionMap = new Map(state.page.sections.map((s) => [s.id, s]))

        set((state) => {
          state.page.sections = order.map((id) => sectionMap.get(id)!)
        })

        events?.onStateChange?.(createSnapshot(get()))
        return { valid: true }
      },

      // -----------------------------------------------------------------------
      // Add section with validation
      // -----------------------------------------------------------------------
      addSection: (section: SectionSchema, position?: number): ValidationResult => {
        const state = get()

        // Validate section limit
        const limitResult = validateSectionLimit(
          state.page.sections.length + 1,
          DEFAULT_CONSTRAINTS.maxSections
        )
        if (!limitResult.valid) {
          events?.onConstraintViolation?.(limitResult.error as ConstraintViolation)
          return limitResult
        }

        // Validate widget nesting
        if (section.widgets) {
          const nestingResult = validateNestingDepth(
            section.widgets,
            DEFAULT_CONSTRAINTS.maxWidgetNesting
          )
          if (!nestingResult.valid) {
            events?.onConstraintViolation?.(nestingResult.error as ConstraintViolation)
            return nestingResult
          }
        }

        set((state) => {
          if (position !== undefined && position >= 0 && position < state.page.sections.length) {
            state.page.sections.splice(position, 0, section)
          } else {
            state.page.sections.push(section)
          }
        })

        events?.onStateChange?.(createSnapshot(get()))
        return { valid: true }
      },

      // -----------------------------------------------------------------------
      // Remove section
      // -----------------------------------------------------------------------
      removeSection: (sectionId: string): ValidationResult => {
        const state = get()

        const existsResult = validateSectionExists(sectionId, state.page.sections)
        if (!existsResult.valid) {
          return existsResult
        }

        const index = state.page.sections.findIndex((s) => s.id === sectionId)

        set((state) => {
          state.page.sections.splice(index, 1)
        })

        events?.onStateChange?.(createSnapshot(get()))
        return { valid: true }
      },

      // -----------------------------------------------------------------------
      // Status updates
      // -----------------------------------------------------------------------
      setReady: (ready: boolean) => {
        set((state) => {
          state.isReady = ready
        })
        if (ready) {
          events?.onReady?.()
        }
      },

      setError: (error: EngineError | null) => {
        set((state) => {
          state.lastError = error
        })
        if (error) {
          events?.onError?.(error)
        }
      },
    }))
  )
}

// =============================================================================
// Helpers
// =============================================================================

/**
 * Create a read-only snapshot of state.
 */
function createSnapshot(state: EngineState): EngineStateSnapshot {
  return {
    site: state.site,
    page: state.page,
    experienceId: state.experienceId,
    isPreview: state.isPreview,
    isReady: state.isReady,
    sectionCount: state.page.sections.length,
    widgetCount: countWidgets(state.page.sections),
  }
}

/**
 * Count total widgets in sections.
 */
function countWidgets(sections: SectionSchema[]): number {
  let count = 0
  for (const section of sections) {
    if (section.widgets) {
      count += countWidgetsRecursive(section.widgets)
    }
  }
  return count
}

/**
 * Recursively count widgets.
 */
function countWidgetsRecursive(widgets: WidgetSchema[]): number {
  let count = widgets.length
  for (const widget of widgets) {
    if (widget.widgets) {
      count += countWidgetsRecursive(widget.widgets)
    }
  }
  return count
}

/**
 * Emit error event.
 */
function emitError(events: EngineEvents | undefined, error: EngineError): void {
  events?.onError?.(error)
}

// =============================================================================
// Export snapshot creator for external use
// =============================================================================

export { createSnapshot }
