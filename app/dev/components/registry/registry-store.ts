/**
 * Registry detail store — manages master-detail navigation and preview state.
 */

import { createStore, useStore } from 'zustand'

// =============================================================================
// Types
// =============================================================================

export interface DetailStackEntry {
  kind: 'widget' | 'section' | 'chrome' | 'behaviour'
  id: string
  label: string
}

interface RegistryDetailState {
  /** Stack of detail views. Last entry = current view. */
  detailStack: DetailStackEntry[]
  /** Preview setting overrides, keyed by `${kind}:${id}` */
  previewValues: Record<string, Record<string, unknown>>

  /** Select from the left list (replaces stack with single entry) */
  select: (entry: DetailStackEntry) => void
  /** Drill into a used widget (appends to stack) */
  pushDetail: (entry: DetailStackEntry) => void
  /** Go back one level */
  popDetail: () => void
  /** Jump to a breadcrumb index */
  popToIndex: (index: number) => void
  /** Clear selection (e.g. on sub-tab switch) */
  clearSelection: () => void
  /** Update a single preview value */
  setPreviewValue: (kind: string, id: string, key: string, value: unknown) => void
}

// =============================================================================
// Store
// =============================================================================

export const registryDetailStore = createStore<RegistryDetailState>((set) => ({
  detailStack: [],
  previewValues: {},

  select: (entry) =>
    set({ detailStack: [entry] }),

  pushDetail: (entry) =>
    set((state) => ({ detailStack: [...state.detailStack, entry] })),

  popDetail: () =>
    set((state) => ({
      detailStack: state.detailStack.slice(0, -1),
    })),

  popToIndex: (index) =>
    set((state) => ({
      detailStack: state.detailStack.slice(0, index + 1),
    })),

  clearSelection: () =>
    set({ detailStack: [] }),

  setPreviewValue: (kind, id, key, value) =>
    set((state) => {
      const storeKey = `${kind}:${id}`
      return {
        previewValues: {
          ...state.previewValues,
          [storeKey]: {
            ...state.previewValues[storeKey],
            [key]: value,
          },
        },
      }
    }),
}))

// =============================================================================
// Hooks
// =============================================================================

export function useRegistryDetail(): RegistryDetailState {
  return useStore(registryDetailStore)
}

export function useDetailStack(): DetailStackEntry[] {
  return useStore(registryDetailStore, (s) => s.detailStack)
}

export function useCurrentDetail(): DetailStackEntry | null {
  return useStore(registryDetailStore, (s) =>
    s.detailStack.length > 0 ? s.detailStack[s.detailStack.length - 1] : null,
  )
}

const EMPTY: Record<string, unknown> = {}

export function usePreviewValues(kind: string, id: string): Record<string, unknown> {
  return useStore(registryDetailStore, (s) => s.previewValues[`${kind}:${id}`] ?? EMPTY)
}
