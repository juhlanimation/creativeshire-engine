/**
 * Authoring store for the /dev preset authoring tool.
 * In-memory state for composing and editing presets.
 * Phase 2: full CRUD with server action persistence.
 */

import { useMemo } from 'react'
import { createStore, useStore } from 'zustand'
import { getPreset, getPresetMeta, getAllPresetMetas, getPresetContentContract } from '../../../engine/presets/registry'
import type { SitePreset, PresetRegionConfig, PresetOverlayConfig, PresetExperienceConfig } from '../../../engine/presets/types'
import { createChromeFromPattern } from '../../../engine/interface/discovery'
import { getChromePattern } from '../../../engine/content/chrome/pattern-registry'
import { collectSectionActions } from '../../../engine/content/actions/scanner'
import { resolveRequiredOverlays } from '../../../engine/content/actions/resolver'
import { getSectionPattern } from '../../../engine/content/sections/registry'
import type { PresetIntroConfig, SequenceStepConfig } from '../../../engine/intro/types'
import type { TransitionConfig } from '../../../engine/schema/transition'
import type { BehaviourAssignment } from '../../../engine/experience/experiences/types'
import type { PageSchema } from '../../../engine/schema/page'
import type { SectionSchema } from '../../../engine/schema/section'
import type { WidgetSchema } from '../../../engine/schema/widget'
import type { ContentContract } from '../../../engine/presets/types'
import { savePreset as savePresetAction } from '../actions/savePreset'
import { saveContract as saveContractAction } from '../actions/saveContract'
import { createPreset as createPresetAction } from '../actions/createPreset'
import { deletePreset as deletePresetAction } from '../actions/deletePreset'
import { generateContractFromPreset } from '../utils/generateContract'

// =============================================================================
// Types
// =============================================================================

export type AuthoringTab = 'defaults' | 'preset' | 'registry'
export type PresetSubTab = 'l1-content' | 'l2-experience' | 'contract'
export type RegistrySubTab = 'widgets' | 'chrome' | 'behaviours' | 'sections'

interface AuthoringState {
  /** Currently selected preset ID */
  activePresetId: string | null
  /** Working copy of the preset (in-memory) */
  preset: SitePreset | null
  /** Whether the working copy differs from the original */
  isDirty: boolean
  /** Active page in the L1 content tab */
  activePageId: string | null
  /** Active main tab */
  activeTab: AuthoringTab
  /** Active sub-tab within Preset tab */
  presetSubTab: PresetSubTab
  /** Active sub-tab within Registry */
  registrySubTab: RegistrySubTab
  /** Whether a save/create/delete operation is in progress */
  isSaving: boolean
  /** Tracks which chrome pattern ID is active per slot (header/footer/cursor) */
  chromePatternIds: Record<string, string>
  /** Auto-generated contract from preset bindings */
  generatedContract: ContentContract | null
  /** Overlay keys auto-injected by action resolution (for UI badges) */
  autoInjectedOverlays: Set<string>

  // ── Preset CRUD ──

  /** Load a preset from the registry into the working copy */
  loadPreset: (id: string) => void
  /** Create a new preset via server action */
  createPreset: (id: string, name: string) => Promise<{ ok: boolean; error?: string }>
  /** Save preset to disk via server action */
  savePreset: () => Promise<{ ok: boolean; error?: string }>
  /** Delete preset via server action */
  deletePreset: () => Promise<{ ok: boolean; error?: string }>
  /** Rename preset (display name — does not change ID) */
  renamePreset: (name: string) => void

  // ── UI Navigation ──

  setActiveTab: (tab: AuthoringTab) => void
  setPresetSubTab: (tab: PresetSubTab) => void
  setRegistrySubTab: (tab: RegistrySubTab) => void
  setActivePageId: (id: string | null) => void

  // ── L1 Content Actions ──

  addPage: (id: string, slug: string) => void
  removePage: (id: string) => void
  renamePage: (oldId: string, newId: string) => void
  reorderPages: (from: number, to: number) => void
  setPageSlug: (pageId: string, slug: string) => void
  addSection: (pageId: string, section: SectionSchema) => void
  addSectionWithOverlays: (pageId: string, section: SectionSchema) => Promise<void>
  removeSection: (pageId: string, sectionIndex: number) => void
  reorderSections: (pageId: string, from: number, to: number) => void
  setChromeRegion: (regionId: 'header' | 'footer', config: PresetRegionConfig | 'hidden') => void
  setChromeRegionFromPattern: (regionId: 'header' | 'footer', patternId: string) => Promise<void>
  addChromeOverlay: (id: string, config: PresetOverlayConfig) => void
  addChromeOverlayFromPattern: (key: string, patternId: string) => Promise<void>
  removeChromeOverlay: (id: string) => void
  /** Set or clear an action for a widget trigger event */
  setWidgetTrigger: (pageId: string, sectionIndex: number, widgetPath: string[], event: string, actionId: string | string[] | null) => void

  // ── L2 Experience Actions ──

  setExperience: (config: PresetExperienceConfig) => void
  setIntro: (config: PresetIntroConfig | undefined) => void
  setIntroSettings: (key: string, value: unknown) => void
  setIntroSteps: (steps: SequenceStepConfig[]) => void
  setTransition: (config: TransitionConfig | undefined) => void
  setSectionBehaviours: (sectionId: string, assignments: BehaviourAssignment[]) => void
  setChromeBehaviours: (regionId: string, assignments: BehaviourAssignment[]) => void
}

// =============================================================================
// Helpers
// =============================================================================

/** Deep clone a preset to avoid reference mutations */
function clonePreset(preset: SitePreset): SitePreset {
  return JSON.parse(JSON.stringify(preset))
}

/**
 * Detect which chrome pattern created a region/overlay config.
 * Matches root widget IDs or component names against known patterns.
 */
function detectChromePatternIds(preset: SitePreset): Record<string, string> {
  const ids: Record<string, string> = {}
  const { regions } = preset.chrome

  // Region patterns — match by root widget ID
  const regionMap: Record<string, Array<{ rootId: string; patternId: string }>> = {
    header: [
      { rootId: 'minimal-nav', patternId: 'MinimalNav' },
      { rootId: 'centered-nav', patternId: 'CenteredNav' },
      { rootId: 'fixed-nav', patternId: 'FixedNav' },
      { rootId: 'floating-contact', patternId: 'FloatingContact' },
    ],
    footer: [
      { rootId: 'contact-footer', patternId: 'ContactFooter' },
      { rootId: 'brand-footer', patternId: 'BrandFooter' },
    ],
  }

  for (const [slot, matchers] of Object.entries(regionMap)) {
    const config = regions[slot as keyof typeof regions]
    if (!config || config === 'hidden') continue
    for (const m of matchers) {
      if (config.widgets?.[0]?.id === m.rootId) {
        ids[slot] = m.patternId
        break
      }
    }
  }

  return ids
}

/**
 * Compute locked overlay IDs from active sections' requiredOverlays.
 * Sections declare which chrome pattern IDs they require.
 * Derives overlay keys from pattern IDs (camelCase: 'VideoModal' → 'videoModal').
 */
function computeLockedOverlayIds(preset: SitePreset): Set<string> {
  const locked = new Set<string>()
  for (const page of Object.values(preset.pages)) {
    for (const section of page.sections) {
      if (!section.patternId) continue
      const entry = getSectionPattern(section.patternId)
      if (!entry?.meta.requiredOverlays) continue
      for (const patternId of entry.meta.requiredOverlays) {
        // Derive overlay key: same convention as action resolver
        const key = patternId.charAt(0).toLowerCase() + patternId.slice(1)
        locked.add(key)
      }
    }
  }
  return locked
}

/** Update the working preset immutably, mark dirty, regenerate contract */
function updatePreset(
  state: AuthoringState,
  updater: (preset: SitePreset) => SitePreset,
): Partial<AuthoringState> {
  if (!state.preset) return {}
  const updated = updater(state.preset)
  return {
    preset: updated,
    isDirty: true,
    generatedContract: generateContractFromPreset(updated, state.generatedContract ?? undefined),
  }
}

// =============================================================================
// Store
// =============================================================================

export const devAuthoringStore = createStore<AuthoringState>((set, get) => ({
  activePresetId: null,
  preset: null,
  isDirty: false,
  activePageId: null,
  activeTab: 'preset',
  presetSubTab: 'l1-content',
  registrySubTab: 'widgets',
  isSaving: false,
  chromePatternIds: {},
  generatedContract: null,
  autoInjectedOverlays: new Set<string>(),

  // ── Preset CRUD ──

  loadPreset: (id) => {
    const original = getPreset(id)
    if (!original) return
    const clone = clonePreset(original)
    // Seed preset name from registry meta if not already stored
    if (!clone.name) {
      const meta = getPresetMeta(id)
      if (meta) clone.name = meta.name
    }
    const firstPageId = Object.keys(original.pages)[0] ?? null
    const existingContract = getPresetContentContract(id)
    set({
      activePresetId: id,
      preset: clone,
      isDirty: false,
      activePageId: firstPageId,
      chromePatternIds: detectChromePatternIds(original),
      autoInjectedOverlays: new Set<string>(),
      generatedContract: generateContractFromPreset(clone, existingContract),
    })
  },

  createPreset: async (id, name) => {
    set({ isSaving: true })
    const result = await createPresetAction(id, name)
    set({ isSaving: false })
    if (!result.ok) return result
    // After scaffolding, set up in-memory state for the new preset
    const newPreset: SitePreset = {
      chrome: { regions: { header: 'hidden', footer: 'hidden' } },
      pages: { home: { id: 'home', slug: '/', sections: [] } },
    }
    set({
      activePresetId: id,
      preset: newPreset,
      isDirty: false,
      activePageId: 'home',
    })
    return { ok: true }
  },

  savePreset: async () => {
    const { activePresetId, preset, generatedContract } = get()
    if (!activePresetId || !preset) return { ok: false, error: 'No preset selected.' }
    set({ isSaving: true })
    const result = await savePresetAction(activePresetId, preset)
    if (result.ok && generatedContract) {
      await saveContractAction(activePresetId, generatedContract)
    }
    set({ isSaving: false })
    if (result.ok) {
      set({ isDirty: false })
    }
    return result
  },

  deletePreset: async () => {
    const { activePresetId } = get()
    if (!activePresetId) return { ok: false, error: 'No preset selected.' }
    set({ isSaving: true })
    const result = await deletePresetAction(activePresetId)
    set({ isSaving: false })
    if (result.ok) {
      // Switch to another preset if available
      const remaining = getAllPresetMetas().filter((m) => m.id !== activePresetId)
      if (remaining.length > 0) {
        get().loadPreset(remaining[0].id)
      } else {
        set({ activePresetId: null, preset: null, isDirty: false, activePageId: null })
      }
    }
    return result
  },

  renamePreset: (name) =>
    set((state) =>
      updatePreset(state, (preset) => ({
        ...preset,
        name,
      })),
    ),

  // ── UI Navigation ──

  setActiveTab: (tab) => set({ activeTab: tab }),
  setPresetSubTab: (tab) => set({ presetSubTab: tab }),
  setRegistrySubTab: (tab) => set({ registrySubTab: tab }),
  setActivePageId: (id) => set({ activePageId: id }),

  // ── L1 Content Actions ──

  addPage: (id, slug) =>
    set((state) =>
      updatePreset(state, (preset) => ({
        ...preset,
        pages: {
          ...preset.pages,
          [id]: {
            id,
            slug,
            sections: [],
          } satisfies PageSchema,
        },
      })),
    ),

  removePage: (id) =>
    set((state) =>
      updatePreset(state, (preset) => {
        const { [id]: _, ...rest } = preset.pages
        return { ...preset, pages: rest }
      }),
    ),

  renamePage: (oldId, newId) =>
    set((state) => {
      if (!state.preset || !state.preset.pages[oldId] || oldId === newId) return {}
      if (state.preset.pages[newId]) return {} // target ID already exists
      // Rebuild pages preserving order
      const entries = Object.entries(state.preset.pages).map(([k, v]) =>
        k === oldId ? [newId, { ...v, id: newId }] as const : [k, v] as const,
      )
      return {
        ...updatePreset(state, (preset) => ({
          ...preset,
          pages: Object.fromEntries(entries),
        })),
        // Follow the rename if this page was active
        activePageId: state.activePageId === oldId ? newId : state.activePageId,
      }
    }),

  reorderPages: (from, to) =>
    set((state) =>
      updatePreset(state, (preset) => {
        const entries = Object.entries(preset.pages)
        const [moved] = entries.splice(from, 1)
        entries.splice(to, 0, moved)
        return { ...preset, pages: Object.fromEntries(entries) }
      }),
    ),

  setPageSlug: (pageId, slug) =>
    set((state) =>
      updatePreset(state, (preset) => {
        const page = preset.pages[pageId]
        if (!page) return preset
        return {
          ...preset,
          pages: {
            ...preset.pages,
            [pageId]: { ...page, slug },
          },
        }
      }),
    ),

  addSection: (pageId, section) =>
    set((state) =>
      updatePreset(state, (preset) => {
        const page = preset.pages[pageId]
        if (!page) return preset
        return {
          ...preset,
          pages: {
            ...preset.pages,
            [pageId]: {
              ...page,
              sections: [...page.sections, section],
            },
          },
        }
      }),
    ),

  addSectionWithOverlays: async (pageId, section) => {
    // 1. Add section synchronously
    get().addSection(pageId, section)

    // 2. Scan for required actions
    const actions = collectSectionActions(section)
    if (actions.size === 0) return

    // 3. Resolve missing overlays
    const existingKeys = Object.keys(get().preset?.chrome.overlays ?? {})
    const toAdd = resolveRequiredOverlays(actions, existingKeys)
    if (toAdd.length === 0) return

    // 4. Add each missing overlay
    for (const { key, patternId } of toAdd) {
      await get().addChromeOverlayFromPattern(key, patternId)
    }

    // 5. Track auto-injected keys for UI badges
    set((state) => {
      const next = new Set(state.autoInjectedOverlays)
      for (const { key } of toAdd) next.add(key)
      return { autoInjectedOverlays: next }
    })
  },

  removeSection: (pageId, sectionIndex) =>
    set((state) =>
      updatePreset(state, (preset) => {
        const page = preset.pages[pageId]
        if (!page) return preset
        return {
          ...preset,
          pages: {
            ...preset.pages,
            [pageId]: {
              ...page,
              sections: page.sections.filter((_, i) => i !== sectionIndex),
            },
          },
        }
      }),
    ),

  reorderSections: (pageId, from, to) =>
    set((state) =>
      updatePreset(state, (preset) => {
        const page = preset.pages[pageId]
        if (!page) return preset
        const sections = [...page.sections]
        const [moved] = sections.splice(from, 1)
        sections.splice(to, 0, moved)
        return {
          ...preset,
          pages: {
            ...preset.pages,
            [pageId]: { ...page, sections },
          },
        }
      }),
    ),

  setChromeRegion: (regionId, config) =>
    set((state) => {
      const { [regionId]: _, ...restIds } = state.chromePatternIds
      return {
        ...updatePreset(state, (preset) => ({
          ...preset,
          chrome: {
            ...preset.chrome,
            regions: {
              ...preset.chrome.regions,
              [regionId]: config,
            },
          },
        })),
        chromePatternIds: config === 'hidden' ? restIds : state.chromePatternIds,
      }
    }),

  setChromeRegionFromPattern: async (regionId, patternId) => {
    const entry = getChromePattern(patternId)
    if (!entry) return
    // Build binding expressions so the contract auto-generates
    const props: Record<string, unknown> = {}
    if (entry.meta.settings) {
      for (const key of Object.keys(entry.meta.settings)) {
        props[key] = `{{ content.${regionId}.${key} }}`
      }
    }
    const config = await createChromeFromPattern(patternId, props)
    set((state) => ({
      ...updatePreset(state, (preset) => ({
        ...preset,
        chrome: {
          ...preset.chrome,
          regions: {
            ...preset.chrome.regions,
            [regionId]: config as PresetRegionConfig,
          },
        },
      })),
      chromePatternIds: { ...state.chromePatternIds, [regionId]: patternId },
    }))
  },

  addChromeOverlay: (id, config) =>
    set((state) =>
      updatePreset(state, (preset) => ({
        ...preset,
        chrome: {
          ...preset.chrome,
          overlays: {
            ...preset.chrome.overlays,
            [id]: config,
          },
        },
      })),
    ),

  addChromeOverlayFromPattern: async (key, patternId) => {
    const entry = getChromePattern(patternId)
    if (!entry) return
    // Build binding expressions so the contract auto-generates
    const props: Record<string, unknown> = {}
    if (entry.meta.settings) {
      for (const k of Object.keys(entry.meta.settings)) {
        props[k] = `{{ content.${key}.${k} }}`
      }
    }
    const config = await createChromeFromPattern(patternId, props)
    set((state) =>
      updatePreset(state, (preset) => ({
        ...preset,
        chrome: {
          ...preset.chrome,
          overlays: {
            ...preset.chrome.overlays,
            [key]: config as PresetOverlayConfig,
          },
        },
      })),
    )
  },

  removeChromeOverlay: (id) =>
    set((state) => {
      if (!state.preset) return {}
      // Refuse to remove overlays locked by section requiredOverlays
      const locked = computeLockedOverlayIds(state.preset)
      if (locked.has(id)) return {}

      return updatePreset(state, (preset) => {
        const { [id]: _, ...rest } = preset.chrome.overlays ?? {}
        return {
          ...preset,
          chrome: {
            ...preset.chrome,
            overlays: Object.keys(rest).length > 0 ? rest : undefined,
          },
        }
      })
    }),

  setWidgetTrigger: (pageId, sectionIndex, widgetPath, event, actionId) =>
    set((state) =>
      updatePreset(state, (preset) => {
        const page = preset.pages[pageId]
        if (!page || sectionIndex >= page.sections.length) return preset

        const section = { ...page.sections[sectionIndex] }
        const widgets = [...section.widgets]

        // Walk widget path to find the target
        function findAndUpdate(ws: WidgetSchema[], pathIdx: number): WidgetSchema[] {
          return ws.map((w) => {
            const wid = w.id ?? `${w.type}-${pathIdx}`
            if (wid !== widgetPath[pathIdx]) return w
            // Last segment — this is the target widget
            if (pathIdx === widgetPath.length - 1) {
              const on = { ...w.on }
              if (actionId === null) {
                delete on[event]
              } else {
                on[event] = actionId
              }
              return { ...w, on: Object.keys(on).length > 0 ? on : undefined }
            }
            // Intermediate — recurse into children
            if (w.widgets) {
              return { ...w, widgets: findAndUpdate([...w.widgets], pathIdx + 1) }
            }
            return w
          })
        }

        section.widgets = findAndUpdate(widgets, 0)
        const sections = [...page.sections]
        sections[sectionIndex] = section

        return {
          ...preset,
          pages: {
            ...preset.pages,
            [pageId]: { ...page, sections },
          },
        }
      }),
    ),

  // ── L2 Experience Actions ──

  setExperience: (config) =>
    set((state) =>
      updatePreset(state, (preset) => ({
        ...preset,
        experience: config,
      })),
    ),

  setIntro: (config) =>
    set((state) =>
      updatePreset(state, (preset) => {
        if (!preset.experience) return preset
        return {
          ...preset,
          experience: {
            ...preset.experience,
            intro: config,
          },
        }
      }),
    ),

  setIntroSettings: (key, value) =>
    set((state) =>
      updatePreset(state, (preset) => {
        if (!preset.experience?.intro) return preset
        return {
          ...preset,
          experience: {
            ...preset.experience,
            intro: {
              ...preset.experience.intro,
              settings: {
                ...preset.experience.intro.settings,
                [key]: value,
              },
            },
          },
        }
      }),
    ),

  setIntroSteps: (steps) =>
    set((state) =>
      updatePreset(state, (preset) => {
        if (!preset.experience?.intro) return preset
        return {
          ...preset,
          experience: {
            ...preset.experience,
            intro: {
              ...preset.experience.intro,
              settings: {
                ...preset.experience.intro.settings,
                steps,
              },
            },
          },
        }
      }),
    ),

  setTransition: (config) =>
    set((state) =>
      updatePreset(state, (preset) => ({
        ...preset,
        transition: config,
      })),
    ),

  setSectionBehaviours: (sectionId, assignments) =>
    set((state) =>
      updatePreset(state, (preset) => {
        if (!preset.experience) return preset
        return {
          ...preset,
          experience: {
            ...preset.experience,
            sectionBehaviours: {
              ...preset.experience.sectionBehaviours,
              [sectionId]: assignments,
            },
          },
        }
      }),
    ),

  setChromeBehaviours: (regionId, assignments) =>
    set((state) => {
      // Chrome behaviours live on the experience definition, not preset directly.
      // For now store in experience.sectionBehaviours with a chrome: prefix convention.
      if (!state.preset?.experience) return {}
      return updatePreset(state, (preset) => ({
        ...preset,
        experience: {
          ...preset.experience!,
          sectionBehaviours: {
            ...preset.experience!.sectionBehaviours,
            [`chrome:${regionId}`]: assignments,
          },
        },
      }))
    }),
}))

// =============================================================================
// Hooks
// =============================================================================

export function useAuthoring(): AuthoringState {
  return useStore(devAuthoringStore)
}

export function useAuthoringPreset(): SitePreset | null {
  return useStore(devAuthoringStore, (s) => s.preset)
}

export function useActivePresetId(): string | null {
  return useStore(devAuthoringStore, (s) => s.activePresetId)
}

export function useActiveTab(): AuthoringTab {
  return useStore(devAuthoringStore, (s) => s.activeTab)
}

export function usePresetSubTab(): PresetSubTab {
  return useStore(devAuthoringStore, (s) => s.presetSubTab)
}

export function useRegistrySubTab(): RegistrySubTab {
  return useStore(devAuthoringStore, (s) => s.registrySubTab)
}

export function useGeneratedContract(): ContentContract | null {
  return useStore(devAuthoringStore, (s) => s.generatedContract)
}

const EMPTY_SET = new Set<string>()

export function useLockedOverlayIds(): Set<string> {
  const preset = useStore(devAuthoringStore, (s) => s.preset)
  return useMemo(() => {
    if (!preset) return EMPTY_SET
    return computeLockedOverlayIds(preset)
  }, [preset])
}
