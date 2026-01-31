'use client'

/**
 * EngineProvider - root provider for the engine interface layer.
 * Wraps ExperienceProvider and provides controller access to platform.
 */

import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react'
import { useStore, type StoreApi } from 'zustand'
import { createEngineStore, createSnapshot } from './EngineStore'
import { ExperienceProvider } from '../experience/ExperienceProvider'
import { getMode } from '../experience/modes'
import type {
  EngineInput,
  EngineState,
  EngineController,
  EngineStateSnapshot,
  ValidationResult,
  WidgetPath,
} from './types'
import type { SectionSchema, WidgetSchema, ThemeSchema, ChromeSchema } from '../schema'

// =============================================================================
// Context
// =============================================================================

interface EngineContextValue {
  store: StoreApi<EngineState>
  controller: EngineController
}

const EngineContext = createContext<EngineContextValue | null>(null)

// =============================================================================
// Provider Props
// =============================================================================

interface EngineProviderProps {
  /** Input configuration from platform */
  input: EngineInput
  /** Child components (SiteRenderer, etc.) */
  children: ReactNode
}

// =============================================================================
// Provider Component
// =============================================================================

/**
 * EngineProvider - root provider for the engine.
 * Wraps ExperienceProvider and provides controller access.
 */
export function EngineProvider({ input, children }: EngineProviderProps) {
  // Create store with events
  const store = useMemo(
    () => createEngineStore(input, input.events),
    // Only recreate if site/page IDs change
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [input.site.id, input.page.id]
  )

  // Create controller from store
  const controller = useMemo<EngineController>(
    () => createController(store),
    [store]
  )

  // Get experience mode
  const experienceId = useStore(store, (s) => s.experienceId)
  const mode = useMemo(() => getMode(experienceId), [experienceId])
  const experienceStore = useMemo(() => mode?.createStore() ?? null, [mode])

  // Mark ready after initial render
  useEffect(() => {
    store.getState().setReady(true)
  }, [store])

  // Handle unknown mode
  if (!mode || !experienceStore) {
    return (
      <div data-error="unknown-mode" className="p-4 text-red-500">
        Error: Unknown experience mode &quot;{experienceId}&quot;
      </div>
    )
  }

  return (
    <EngineContext.Provider value={{ store, controller }}>
      <ExperienceProvider mode={mode} store={experienceStore}>
        {children}
      </ExperienceProvider>
    </EngineContext.Provider>
  )
}

// =============================================================================
// Controller Factory
// =============================================================================

/**
 * Create controller from store.
 */
function createController(store: StoreApi<EngineState>): EngineController {
  return {
    // Section operations
    updateSection: (sectionId: string, changes: Partial<SectionSchema>): ValidationResult => {
      return store.getState().updateSection(sectionId, changes)
    },

    reorderSections: (order: string[]): ValidationResult => {
      return store.getState().reorderSections(order)
    },

    addSection: (section: SectionSchema, position?: number): ValidationResult => {
      return store.getState().addSection(section, position)
    },

    removeSection: (sectionId: string): ValidationResult => {
      return store.getState().removeSection(sectionId)
    },

    // Widget operations
    updateWidget: (path: WidgetPath, changes: Partial<WidgetSchema>): ValidationResult => {
      return store.getState().updateWidget(path, changes)
    },

    addWidget: (
      sectionId: string,
      widget: WidgetSchema,
      position?: number
    ): ValidationResult => {
      const state = store.getState()
      const section = state.page.sections.find((s) => s.id === sectionId)
      if (!section) {
        return {
          valid: false,
          error: {
            type: 'not-found',
            message: `Section not found: ${sectionId}`,
            path: ['section', sectionId],
          },
        }
      }
      const newWidgets = [...(section.widgets || [])]
      if (position !== undefined && position >= 0 && position < newWidgets.length) {
        newWidgets.splice(position, 0, widget)
      } else {
        newWidgets.push(widget)
      }
      return state.updateSection(sectionId, { widgets: newWidgets })
    },

    removeWidget: (path: WidgetPath): ValidationResult => {
      const state = store.getState()
      const section = state.page.sections.find((s) => s.id === path.sectionId)
      if (!section) {
        return {
          valid: false,
          error: {
            type: 'not-found',
            message: `Section not found: ${path.sectionId}`,
            path: ['section', path.sectionId],
          },
        }
      }
      const newWidgets = removeWidgetAtPath([...(section.widgets || [])], path.widgetIndices)
      return state.updateSection(path.sectionId, { widgets: newWidgets })
    },

    // Experience operations
    setExperience: (experienceId: string): void => {
      store.getState().setExperience(experienceId)
    },

    // Site operations
    updateTheme: (changes: Partial<ThemeSchema>): void => {
      const state = store.getState()
      state.updateSite({ theme: { ...state.site.theme, ...changes } })
    },

    updateChrome: (changes: Partial<ChromeSchema>): void => {
      const state = store.getState()
      state.updateSite({ chrome: { ...state.site.chrome, ...changes } })
    },

    // State queries
    getState: (): EngineStateSnapshot => {
      return createSnapshot(store.getState())
    },

    subscribe: (listener: (state: EngineStateSnapshot) => void): (() => void) => {
      return store.subscribe((state) => listener(createSnapshot(state)))
    },
  }
}

// =============================================================================
// Helpers
// =============================================================================

/**
 * Remove widget at path from widget tree.
 */
function removeWidgetAtPath(widgets: WidgetSchema[], indices: number[]): WidgetSchema[] {
  if (indices.length === 0) return widgets
  if (indices.length === 1) {
    const newWidgets = [...widgets]
    newWidgets.splice(indices[0], 1)
    return newWidgets
  }
  const [first, ...rest] = indices
  const newWidgets = [...widgets]
  if (newWidgets[first]?.widgets) {
    newWidgets[first] = {
      ...newWidgets[first],
      widgets: removeWidgetAtPath(newWidgets[first].widgets!, rest),
    }
  }
  return newWidgets
}

// =============================================================================
// Hooks
// =============================================================================

/**
 * Hook to access engine controller.
 * Use in platform UI to control engine.
 */
export function useEngineController(): EngineController {
  const context = useContext(EngineContext)
  if (!context) {
    throw new Error('useEngineController must be used within EngineProvider')
  }
  return context.controller
}

/**
 * Hook to access engine state with selector.
 * Use selector for optimal re-renders.
 */
export function useEngineState<T>(selector: (state: EngineState) => T): T {
  const context = useContext(EngineContext)
  if (!context) {
    throw new Error('useEngineState must be used within EngineProvider')
  }
  return useStore(context.store, selector)
}

/**
 * Hook to access full engine store.
 * Advanced use only - prefer useEngineState with selector.
 */
export function useEngineStore(): StoreApi<EngineState> {
  const context = useContext(EngineContext)
  if (!context) {
    throw new Error('useEngineStore must be used within EngineProvider')
  }
  return context.store
}
