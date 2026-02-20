/**
 * Visibility override store — tracks per-widget CMS hidden/visible toggles.
 * Persists to localStorage so overrides survive page reloads.
 */

import { createStore, useStore } from 'zustand'

const STORAGE_KEY = 'engine:dev:visibility-overrides'

// =============================================================================
// Types
// =============================================================================

/** widgetType → settingKey → hidden */
type OverrideMap = Record<string, Record<string, boolean>>

interface VisibilityState {
  overrides: OverrideMap
  /** Toggle a single setting's hidden state (flips effective = override ?? metaDefault) */
  toggleHidden: (componentId: string, settingKey: string, metaDefault: boolean) => void
  /** Resolve effective hidden state: override > meta default */
  getEffectiveHidden: (componentId: string, settingKey: string, metaDefault: boolean) => boolean
  /** Export all overrides as JSON for content-contract settingOverrides */
  exportOverrides: () => OverrideMap
}

// =============================================================================
// Hydrate from localStorage
// =============================================================================

function loadOverrides(): OverrideMap {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as OverrideMap) : {}
  } catch {
    return {}
  }
}

function persistOverrides(overrides: OverrideMap) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides))
  } catch {
    // Storage full or unavailable — ignore
  }
}

// =============================================================================
// Store
// =============================================================================

export const visibilityStore = createStore<VisibilityState>((set, get) => ({
  overrides: loadOverrides(),

  toggleHidden: (componentId, settingKey, metaDefault) =>
    set((state) => {
      const componentOverrides = { ...state.overrides[componentId] }
      const effective = componentOverrides[settingKey] ?? metaDefault
      componentOverrides[settingKey] = !effective
      const next: OverrideMap = {
        ...state.overrides,
        [componentId]: componentOverrides,
      }
      persistOverrides(next)
      return { overrides: next }
    }),

  getEffectiveHidden: (componentId, settingKey, metaDefault) => {
    const override = get().overrides[componentId]?.[settingKey]
    return override ?? metaDefault
  },

  exportOverrides: () => get().overrides,
}))

// =============================================================================
// Hooks
// =============================================================================

export function useVisibilityStore() {
  return useStore(visibilityStore)
}

export function useVisibilityOverrides(componentId: string) {
  return useStore(visibilityStore, (s) => s.overrides[componentId])
}
