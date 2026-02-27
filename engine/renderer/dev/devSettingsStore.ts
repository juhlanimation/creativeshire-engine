/**
 * Dev-only Zustand store for live settings editing.
 * Holds experience-level and behaviour-level setting overrides.
 * Tree-shaken in production via NODE_ENV checks.
 */

import { createStore, useStore } from 'zustand'
import type { BehaviourAssignment } from '../../experience/compositions/types'

// =============================================================================
// Types
// =============================================================================

interface DevSettingsState {
  /** Behaviour-level option overrides: { [behaviourId]: { [optionKey]: value } } */
  behaviourSettings: Record<string, Record<string, unknown>>
  /** Section pinned overrides: sectionId → boolean */
  sectionPinned: Record<string, boolean>
  /** Section behaviour assignment overrides (multi-behaviour): sectionId → BehaviourAssignment[] */
  sectionBehaviourAssignments: Record<string, BehaviourAssignment[]>
  /** Chrome behaviour assignment overrides: regionId → BehaviourAssignment[] */
  chromeBehaviourAssignments: Record<string, BehaviourAssignment[]>

  // Actions
  setBehaviourSetting: (behaviourId: string, key: string, value: unknown) => void
  setSectionPinned: (sectionId: string, pinned: boolean | null) => void
  setSectionBehaviourAssignments: (sectionId: string, assignments: BehaviourAssignment[] | null) => void
  setChromeBehaviourAssignments: (regionId: string, assignments: BehaviourAssignment[] | null) => void
  resetBehaviourSettings: (behaviourId?: string) => void
  resetSectionBehaviours: () => void
  resetChromeBehaviours: () => void
  resetAll: () => void
}

// =============================================================================
// Store (singleton)
// =============================================================================

export const devSettingsStore = createStore<DevSettingsState>((set) => ({
  behaviourSettings: {},
  sectionPinned: {},
  sectionBehaviourAssignments: {},
  chromeBehaviourAssignments: {},

  setBehaviourSetting: (behaviourId, key, value) =>
    set((state) => ({
      behaviourSettings: {
        ...state.behaviourSettings,
        [behaviourId]: {
          ...state.behaviourSettings[behaviourId],
          [key]: value,
        },
      },
    })),

  setSectionPinned: (sectionId, pinned) =>
    set((state) => {
      if (pinned === null) {
        const next = { ...state.sectionPinned }
        delete next[sectionId]
        return { sectionPinned: next }
      }
      return {
        sectionPinned: { ...state.sectionPinned, [sectionId]: pinned },
      }
    }),

  setSectionBehaviourAssignments: (sectionId, assignments) =>
    set((state) => {
      if (assignments === null) {
        const next = { ...state.sectionBehaviourAssignments }
        delete next[sectionId]
        return { sectionBehaviourAssignments: next }
      }
      return {
        sectionBehaviourAssignments: {
          ...state.sectionBehaviourAssignments,
          [sectionId]: assignments,
        },
      }
    }),

  setChromeBehaviourAssignments: (regionId, assignments) =>
    set((state) => {
      if (assignments === null) {
        const next = { ...state.chromeBehaviourAssignments }
        delete next[regionId]
        return { chromeBehaviourAssignments: next }
      }
      return {
        chromeBehaviourAssignments: {
          ...state.chromeBehaviourAssignments,
          [regionId]: assignments,
        },
      }
    }),

  resetBehaviourSettings: (behaviourId) =>
    set((state) => {
      if (!behaviourId) return { behaviourSettings: {} }
      const next = { ...state.behaviourSettings }
      delete next[behaviourId]
      return { behaviourSettings: next }
    }),

  resetSectionBehaviours: () =>
    set({ sectionPinned: {}, sectionBehaviourAssignments: {} }),

  resetChromeBehaviours: () =>
    set({ chromeBehaviourAssignments: {} }),

  resetAll: () => set({
    behaviourSettings: {},
    sectionPinned: {},
    sectionBehaviourAssignments: {},
    chromeBehaviourAssignments: {},
  }),
}))

// =============================================================================
// Hooks (dev-only — return undefined/empty in production for tree-shaking)
// =============================================================================

/**
 * Subscribe to the full dev settings state.
 * Returns undefined in production.
 */
export function useDevSettings(): DevSettingsState | undefined {
  if (process.env.NODE_ENV !== 'development') return undefined
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useStore(devSettingsStore)
}

/**
 * Subscribe to behaviour-level option overrides for a specific behaviour.
 * Returns undefined in production or when no overrides exist.
 */
export function useDevBehaviourOptions(
  behaviourId: string | null | undefined,
): Record<string, unknown> | undefined {
  if (process.env.NODE_ENV !== 'development') return undefined
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useStore(devSettingsStore, (s) =>
    behaviourId ? s.behaviourSettings[behaviourId] : undefined,
  )
}

/**
 * Subscribe to the dev pinned override for a specific section.
 * Returns the overridden pinned state, or undefined if none set.
 */
export function useDevSectionPinned(
  sectionId: string,
): boolean | undefined {
  if (process.env.NODE_ENV !== 'development') return undefined
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useStore(devSettingsStore, (s) =>
    s.sectionPinned[sectionId] !== undefined ? s.sectionPinned[sectionId] : undefined,
  )
}

/**
 * Subscribe to multi-behaviour assignment overrides for a specific section.
 * Returns the assignments array, or undefined if none set.
 */
export function useDevSectionBehaviourAssignments(
  sectionId: string,
): BehaviourAssignment[] | undefined {
  if (process.env.NODE_ENV !== 'development') return undefined
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useStore(devSettingsStore, (s) =>
    s.sectionBehaviourAssignments[sectionId],
  )
}

/**
 * Subscribe to chrome behaviour assignment overrides for a specific region.
 * Returns the assignments array, or undefined if none set.
 */
export function useDevChromeBehaviourAssignments(
  regionId: string,
): BehaviourAssignment[] | undefined {
  if (process.env.NODE_ENV !== 'development') return undefined
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useStore(devSettingsStore, (s) =>
    s.chromeBehaviourAssignments[regionId],
  )
}

export type { DevSettingsState }
