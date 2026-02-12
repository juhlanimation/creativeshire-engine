/**
 * Dev-only Zustand store for live settings editing.
 * Holds experience-level and behaviour-level setting overrides.
 * Tree-shaken in production via NODE_ENV checks.
 */

import { createStore, useStore } from 'zustand'

// =============================================================================
// Types
// =============================================================================

interface DevSettingsState {
  /** Experience-level setting overrides: { [settingKey]: value } */
  experienceSettings: Record<string, unknown>
  /** Behaviour-level option overrides: { [behaviourId]: { [optionKey]: value } } */
  behaviourSettings: Record<string, Record<string, unknown>>
  /** Section behaviour assignment overrides: sectionId → behaviourId */
  sectionBehaviours: Record<string, string>
  /** Per-section behaviour options: sectionId → { optionKey: value } */
  sectionBehaviourOptions: Record<string, Record<string, unknown>>
  /** Section pinned overrides: sectionId → boolean */
  sectionPinned: Record<string, boolean>

  // Actions
  setExperienceSetting: (key: string, value: unknown) => void
  setBehaviourSetting: (behaviourId: string, key: string, value: unknown) => void
  setSectionBehaviour: (sectionId: string, behaviourId: string | null) => void
  setSectionBehaviourOption: (sectionId: string, key: string, value: unknown) => void
  setSectionPinned: (sectionId: string, pinned: boolean | null) => void
  resetExperienceSettings: () => void
  resetBehaviourSettings: (behaviourId?: string) => void
  resetSectionBehaviours: () => void
  resetAll: () => void
}

// =============================================================================
// Store (singleton)
// =============================================================================

export const devSettingsStore = createStore<DevSettingsState>((set) => ({
  experienceSettings: {},
  behaviourSettings: {},
  sectionBehaviours: {},
  sectionBehaviourOptions: {},
  sectionPinned: {},

  setExperienceSetting: (key, value) =>
    set((state) => ({
      experienceSettings: { ...state.experienceSettings, [key]: value },
    })),

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

  setSectionBehaviour: (sectionId, behaviourId) =>
    set((state) => {
      if (behaviourId === null) {
        const next = { ...state.sectionBehaviours }
        delete next[sectionId]
        // Also clear section options when removing assignment
        const nextOpts = { ...state.sectionBehaviourOptions }
        delete nextOpts[sectionId]
        return { sectionBehaviours: next, sectionBehaviourOptions: nextOpts }
      }
      return {
        sectionBehaviours: { ...state.sectionBehaviours, [sectionId]: behaviourId },
        // Clear options when switching behaviours
        sectionBehaviourOptions: {
          ...state.sectionBehaviourOptions,
          [sectionId]: {},
        },
      }
    }),

  setSectionBehaviourOption: (sectionId, key, value) =>
    set((state) => ({
      sectionBehaviourOptions: {
        ...state.sectionBehaviourOptions,
        [sectionId]: {
          ...state.sectionBehaviourOptions[sectionId],
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

  resetExperienceSettings: () => set({ experienceSettings: {} }),

  resetBehaviourSettings: (behaviourId) =>
    set((state) => {
      if (!behaviourId) return { behaviourSettings: {} }
      const next = { ...state.behaviourSettings }
      delete next[behaviourId]
      return { behaviourSettings: next }
    }),

  resetSectionBehaviours: () =>
    set({ sectionBehaviours: {}, sectionBehaviourOptions: {}, sectionPinned: {} }),

  resetAll: () => set({
    experienceSettings: {},
    behaviourSettings: {},
    sectionBehaviours: {},
    sectionBehaviourOptions: {},
    sectionPinned: {},
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
 * Subscribe to experience-level setting overrides only.
 * Returns undefined in production.
 */
export function useDevExperienceSettings(): Record<string, unknown> | undefined {
  if (process.env.NODE_ENV !== 'development') return undefined
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useStore(devSettingsStore, (s) => s.experienceSettings)
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
 * Subscribe to the dev behaviour override for a specific section.
 * Returns the overridden behaviour ID, or undefined if none set.
 */
export function useDevSectionBehaviour(
  sectionId: string,
): string | undefined {
  if (process.env.NODE_ENV !== 'development') return undefined
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useStore(devSettingsStore, (s) =>
    s.sectionBehaviours[sectionId],
  )
}

/**
 * Subscribe to per-section behaviour option overrides.
 * Returns the options record, or undefined if none set.
 */
export function useDevSectionBehaviourOptions(
  sectionId: string,
): Record<string, unknown> | undefined {
  if (process.env.NODE_ENV !== 'development') return undefined
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useStore(devSettingsStore, (s) =>
    s.sectionBehaviourOptions[sectionId],
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

export type { DevSettingsState }
