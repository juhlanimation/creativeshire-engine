/**
 * Dev Contract Inspector Zustand store.
 * Manages active preset, active tab, and hidden field overrides.
 * Persists hidden overrides to localStorage.
 */

import { createStore, useStore } from 'zustand'
import type { ContentContract, ContentSourceField } from '../../../engine/presets/types'

// =============================================================================
// Types
// =============================================================================

export type DashboardTab = 'contract' | 'widgets' | 'chrome' | 'behaviours' | 'sections'

interface DevContractState {
  /** Currently selected preset ID */
  activePresetId: string | null
  /** Currently active tab */
  activeTab: DashboardTab
  /** Hidden overrides: { [presetId]: { [fieldPath]: boolean } } */
  hiddenOverrides: Record<string, Record<string, boolean>>

  // Actions
  setActivePresetId: (id: string) => void
  setActiveTab: (tab: DashboardTab) => void
  toggleHidden: (presetId: string, fieldPath: string) => void
  resetOverrides: (presetId: string) => void
}

// =============================================================================
// localStorage persistence
// =============================================================================

const STORAGE_KEY = 'dev-contract-hidden-overrides'

function loadOverrides(): Record<string, Record<string, boolean>> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveOverrides(overrides: Record<string, Record<string, boolean>>): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides))
  } catch {
    // Ignore quota errors
  }
}

// =============================================================================
// Store
// =============================================================================

export const devContractStore = createStore<DevContractState>((set) => ({
  activePresetId: null,
  activeTab: 'contract',
  hiddenOverrides: loadOverrides(),

  setActivePresetId: (id) => set({ activePresetId: id }),

  setActiveTab: (tab) => set({ activeTab: tab }),

  toggleHidden: (presetId, fieldPath) =>
    set((state) => {
      const presetOverrides = { ...state.hiddenOverrides[presetId] }
      if (presetOverrides[fieldPath] !== undefined) {
        delete presetOverrides[fieldPath]
      } else {
        // Toggle: if original was hidden, override to visible (false), and vice versa
        presetOverrides[fieldPath] = true
      }
      const next = { ...state.hiddenOverrides, [presetId]: presetOverrides }
      // Clean up empty preset entries
      if (Object.keys(presetOverrides).length === 0) {
        delete next[presetId]
      }
      saveOverrides(next)
      return { hiddenOverrides: next }
    }),

  resetOverrides: (presetId) =>
    set((state) => {
      const next = { ...state.hiddenOverrides }
      delete next[presetId]
      saveOverrides(next)
      return { hiddenOverrides: next }
    }),
}))

// =============================================================================
// Hooks
// =============================================================================

export function useDevContract(): DevContractState {
  return useStore(devContractStore)
}

export function useActivePresetId(): string | null {
  return useStore(devContractStore, (s) => s.activePresetId)
}

export function useActiveTab(): DashboardTab {
  return useStore(devContractStore, (s) => s.activeTab)
}

// =============================================================================
// Helpers
// =============================================================================

/**
 * Apply hidden overrides to a contract, returning a new contract with
 * overridden hidden values. Never mutates the original.
 */
export function applyHiddenOverrides(
  contract: ContentContract,
  overrides: Record<string, boolean>,
): ContentContract {
  if (Object.keys(overrides).length === 0) return contract

  function applyToField(field: ContentSourceField, parentPath: string): ContentSourceField {
    const fullPath = parentPath ? `${parentPath}.${field.path}` : field.path
    const override = overrides[fullPath]
    const newHidden = override !== undefined ? override : field.hidden

    const result: ContentSourceField = { ...field }
    if (newHidden !== undefined && newHidden !== field.hidden) {
      result.hidden = newHidden
    }

    if (field.itemFields) {
      result.itemFields = field.itemFields.map((f) => applyToField(f, fullPath))
    }

    return result
  }

  return {
    ...contract,
    sourceFields: contract.sourceFields.map((f) => applyToField(f, '')),
  }
}
