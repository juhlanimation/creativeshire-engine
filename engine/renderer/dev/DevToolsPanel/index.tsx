'use client'

/**
 * DevToolsPanel - unified tabbed dev tools panel.
 * Consolidates experience, intro, transition, and preset switchers.
 *
 * Two modes:
 * 1. Minimized bar — row of icon buttons at bottom-right
 * 2. Expanded panel — tab bar + item list + optional settings
 *
 * Only renders in development mode, not in iframes.
 */

import { useState, useCallback, useMemo, useSyncExternalStore, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { useStore } from 'zustand'
import { useSiteContainer } from '../../SiteContainerContext'
import { TAB_CONFIGS } from './tabs'
import { SettingsEditor } from './SettingsEditor'
import { devSettingsStore, useDevExperienceSettings } from '../devSettingsStore'
import { getBehaviour, getAllBehaviourMetas } from '../../../experience/behaviours'
import { getExperience, useExperience } from '../../../experience'
import { useIntro } from '../../../intro'
import type { BehaviourAssignment } from '../../../experience/experiences/types'
import { capitalize } from '../../utils'
import type { SectionSchema, WidgetSchema } from '../../../schema'
import type { DevToolsTabConfig } from './types'
import './styles.css'

// SSR-safe subscription
const subscribeNoop = () => () => {}

/** Look up experience definition for sectionBehaviours. Returns null if not found. */
function getExperienceForSectionBehaviours(id: string) {
  return getExperience(id) ?? null
}

interface DevToolsPanelProps {
  /** Current IDs from schema, keyed by tab id */
  currentIds: Record<string, string>
  /** Page sections for extracting behaviour settings */
  sections?: SectionSchema[]
}

interface PanelState {
  expanded: boolean
  activeTabId: string
  showSettings: string | null // item id showing settings
}

export function DevToolsPanel({ currentIds, sections }: DevToolsPanelProps) {
  const shouldShow = useSyncExternalStore(
    subscribeNoop,
    () => process.env.NODE_ENV === 'development'
      && typeof window !== 'undefined'
      && window.self === window.top,
    () => false,
  )

  const { siteContainer } = useSiteContainer()

  if (!shouldShow || !siteContainer) return null

  return createPortal(
    <DevToolsPanelInner currentIds={currentIds} sections={sections} />,
    siteContainer,
  )
}

function DevToolsPanelInner({ currentIds, sections }: DevToolsPanelProps) {
  // Merged experience from context (includes preset sectionBehaviours)
  const { experience: contextExperience } = useExperience()

  const [state, setState] = useState<PanelState>({
    expanded: false,
    activeTabId: 'experience',
    showSettings: null,
  })

  // Read overrides once on mount (not reactive — tabs handle their own reactivity)
  const [overrides, setOverrides] = useState<Record<string, string | null>>(() => {
    const result: Record<string, string | null> = {}
    for (const tab of TAB_CONFIGS) {
      result[tab.id] = tab.getOverride()
    }
    return result
  })

  const activeTab = useMemo(
    () => TAB_CONFIGS.find((t) => t.id === state.activeTabId) ?? TAB_CONFIGS[0],
    [state.activeTabId],
  )

  const items = useMemo(() => activeTab.getItems(), [activeTab])

  const activeOverride = overrides[activeTab.id]
  const currentId = currentIds[activeTab.id] ?? ''
  const activeId = activeOverride ?? currentId

  // Dev settings for live editing
  const devExperienceSettings = useDevExperienceSettings() ?? {}

  // Build experience settings values (defaults + dev overrides)
  const experienceSettingsValues = useMemo(() => {
    const item = items.find((i) => i.id === activeId)
    if (!item?.settings) return {}
    const defaults: Record<string, unknown> = {}
    for (const [key, config] of Object.entries(item.settings) as [string, { default: unknown } | undefined][]) {
      if (config) defaults[key] = config.default
    }
    return { ...defaults, ...devExperienceSettings }
  }, [items, activeId, devExperienceSettings])

  // Check if any section behaviour overrides exist (for reset button)
  const hasSectionBehaviourOverrides = useStore(
    devSettingsStore,
    (s) => Object.keys(s.sectionBehaviourAssignments).length > 0 || Object.keys(s.sectionPinned).length > 0,
  )

  // Check if any widget behaviour overrides exist (for reset button)
  const hasWidgetBehaviourOverrides = useStore(
    devSettingsStore,
    (s) => Object.keys(s.widgetBehaviourAssignments).length > 0,
  )

  // Get intro context for display
  const introContext = useIntro()

  const handleExpand = useCallback((tabId: string) => {
    setState((s) => ({
      ...s,
      expanded: true,
      activeTabId: tabId,
      showSettings: null,
    }))
  }, [])

  const handleMinimize = useCallback(() => {
    setState((s) => ({ ...s, expanded: false, showSettings: null }))
  }, [])

  const handleTabSwitch = useCallback((tabId: string) => {
    setState((s) => ({ ...s, activeTabId: tabId, showSettings: null }))
  }, [])

  const handleSelect = useCallback((tab: DevToolsTabConfig, id: string | null) => {
    // Update local override state
    setOverrides((prev) => ({ ...prev, [tab.id]: id }))
    // Apply the override (live or reload)
    tab.setOverride(id)
    if (tab.mode === 'live') {
      setState((s) => ({ ...s, showSettings: null }))
    }
    // For reload mode, the page will reload so no need to update state
  }, [])

  const handleToggleSettings = useCallback((itemId: string) => {
    setState((s) => ({
      ...s,
      showSettings: s.showSettings === itemId ? null : itemId,
    }))
  }, [])

  if (!state.expanded) {
    return (
      <MinimizedBar
        overrides={overrides}
        onExpand={handleExpand}
      />
    )
  }

  // Find the item with settings currently being shown
  const settingsItem = state.showSettings
    ? items.find((i) => i.id === state.showSettings)
    : null

  return (
    <div
      className="dt-panel"
      style={{ '--dt-accent': activeTab.color } as React.CSSProperties}
    >
      {/* Tab bar */}
      <div className="dt-panel__tabs">
        {TAB_CONFIGS.map((tab) => (
          <button
            key={tab.id}
            className={`dt-panel__tab ${tab.id === state.activeTabId ? 'dt-panel__tab--active' : ''}`}
            onClick={() => handleTabSwitch(tab.id)}
            title={tab.label}
            style={tab.id === state.activeTabId ? { '--dt-tab-color': tab.color } as React.CSSProperties : undefined}
          >
            <span className="dt-panel__tab-icon">{tab.icon}</span>
            {overrides[tab.id] && <span className="dt-panel__tab-dot" style={{ background: `rgb(${tab.color})` }} />}
          </button>
        ))}
        <button
          className="dt-panel__minimize"
          onClick={handleMinimize}
          title="Minimize"
        >
          _
        </button>
      </div>

      {/* Header */}
      <div className="dt-panel__header">
        <span>{activeTab.headerTitle}</span>
        {activeOverride && (
          <button
            className="dt-panel__reset"
            onClick={() => handleSelect(activeTab, null)}
            title="Reset to schema default"
          >
            Reset
          </button>
        )}
        {state.activeTabId === 'experience' && Object.keys(devExperienceSettings).length > 0 && (
          <button
            className="dt-panel__reset"
            onClick={() => devSettingsStore.getState().resetExperienceSettings()}
            title="Reset setting overrides"
          >
            Reset Settings
          </button>
        )}
        {state.activeTabId === 'experience' && hasSectionBehaviourOverrides && (
          <button
            className="dt-panel__reset"
            onClick={() => devSettingsStore.getState().resetSectionBehaviours()}
            title="Reset section behaviour assignments"
          >
            Reset Sec. Behaviours
          </button>
        )}
        {state.activeTabId === 'experience' && hasWidgetBehaviourOverrides && (
          <button
            className="dt-panel__reset"
            onClick={() => devSettingsStore.getState().resetWidgetBehaviours()}
            title="Reset widget behaviour assignments"
          >
            Reset Wgt. Behaviours
          </button>
        )}
      </div>

      {/* Item list */}
      <div className="dt-panel__items">
        {/* "None" option for tabs that support it */}
        {activeTab.allowNone && (
          <ItemButton
            id="none"
            name={activeTab.noneLabel ?? 'None'}
            description={activeTab.noneDescription}
            isActive={activeId === 'none'}
            isDefault={currentId === 'none' && !activeOverride}
            onSelect={() => handleSelect(activeTab, 'none')}
          />
        )}

        {items.map((item) => (
          <ItemButton
            key={item.id}
            id={item.id}
            name={item.name}
            description={item.description}
            isActive={item.id === activeId}
            isDefault={item.id === currentId && !activeOverride}
            hasSettings={
              state.activeTabId !== 'experience'
              && !!item.settings && Object.keys(item.settings).length > 0
            }
            showingSettings={state.showSettings === item.id}
            onSelect={() => handleSelect(activeTab, item.id)}
            onToggleSettings={() => handleToggleSettings(item.id)}
          />
        ))}
      </div>

      {/* Experience tab: always show settings for the active experience */}
      {state.activeTabId === 'experience' && (() => {
        const activeItem = items.find((i) => i.id === activeId)
        const hasExpSettings = activeItem?.settings && Object.keys(activeItem.settings).length > 0
        // Use merged experience from context (includes preset sectionBehaviours)
        // Falls back to registry lookup if context doesn't match active selection
        const activeExperience = contextExperience.id === activeId
          ? contextExperience
          : getExperienceForSectionBehaviours(activeId)
        return (
          <>
            {hasExpSettings && (
              <SettingsEditor
                settings={activeItem!.settings!}
                values={experienceSettingsValues}
                onChange={(key, value) => devSettingsStore.getState().setExperienceSetting(key, value)}
                header="Experience Settings"
              />
            )}
            {sections && sections.length > 0 && (
              <SectionBehaviourAssigner
                sections={sections}
                experience={activeExperience}
              />
            )}
            {sections && sections.length > 0 && (
              <WidgetBehaviourAssigner
                sections={sections}
                experience={activeExperience}
              />
            )}
            {introContext && (
              <IntroInfoDisplay config={introContext.config} />
            )}
          </>
        )
      })()}

      {/* Non-experience tab settings (gear toggle, read-only — future work) */}
      {state.activeTabId !== 'experience' && settingsItem?.settings && Object.keys(settingsItem.settings).length > 0 && (
        <SettingsEditor
          settings={settingsItem.settings}
          values={Object.fromEntries(
            Object.entries(settingsItem.settings).map(([k, v]) => [k, v?.default])
          )}
          onChange={() => {}}
          header="Settings"
        />
      )}

      {/* Footer */}
      {activeTab.footerMessage && (
        <div className="dt-panel__footer">
          {activeTab.footerMessage}
        </div>
      )}
    </div>
  )
}

// =============================================================================
// MinimizedBar
// =============================================================================

interface MinimizedBarProps {
  overrides: Record<string, string | null>
  onExpand: (tabId: string) => void
}

function MinimizedBar({ overrides, onExpand }: MinimizedBarProps) {
  return (
    <div className="dt-bar">
      {TAB_CONFIGS.map((tab) => (
        <button
          key={tab.id}
          className="dt-bar__btn"
          onClick={() => onExpand(tab.id)}
          title={tab.label}
        >
          <span className="dt-bar__icon">{tab.icon}</span>
          {overrides[tab.id] && (
            <span className="dt-bar__dot" style={{ background: `rgb(${tab.color})` }} />
          )}
        </button>
      ))}
    </div>
  )
}

// =============================================================================
// SectionBehaviourAssigner
// =============================================================================

/** All registered behaviour metas (computed once). */
const allBehaviourMetas = getAllBehaviourMetas()

interface SectionBehaviourAssignerProps {
  sections: SectionSchema[]
  experience: ReturnType<typeof getExperienceForSectionBehaviours>
}

/**
 * Shows all sections with a behaviour dropdown and per-section settings.
 * Lets users assign any registered behaviour to any section.
 */
function SectionBehaviourAssigner({ sections, experience }: SectionBehaviourAssignerProps) {
  return (
    <div className="dt-settings" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
      <div className="dt-settings__header">Section Behaviours</div>
      {sections.map((section) => (
        <SectionBehaviourRow
          key={section.id}
          section={section}
          experience={experience}
        />
      ))}
    </div>
  )
}

interface SectionBehaviourRowProps {
  section: SectionSchema
  experience: ReturnType<typeof getExperienceForSectionBehaviours>
}

/**
 * Single section row: label, multi-behaviour list, and settings editors.
 */
function SectionBehaviourRow({ section, experience }: SectionBehaviourRowProps) {
  // Resolve assignments from experience sectionBehaviours
  const schemaBehaviours = useMemo(() => {
    if (!experience?.sectionBehaviours) return []
    return experience.sectionBehaviours[section.id]
      ?? experience.sectionBehaviours[capitalize(section.id)]
      ?? experience.sectionBehaviours['*']
      ?? []
  }, [section.id, experience])

  // Dev override from store (new multi-behaviour)
  const devAssignments = useStore(
    devSettingsStore,
    (s) => s.sectionBehaviourAssignments[section.id],
  )
  const devPinned = useStore(
    devSettingsStore,
    (s) => s.sectionPinned[section.id] !== undefined ? s.sectionPinned[section.id] : undefined,
  )

  // Active assignments: dev override → schema
  const activeAssignments = devAssignments ?? schemaBehaviours

  const handleAdd = useCallback((behaviourId: string) => {
    const next = [...activeAssignments, { behaviour: behaviourId }]
    devSettingsStore.getState().setSectionBehaviourAssignments(section.id, next)
  }, [activeAssignments, section.id])

  const handleRemove = useCallback((idx: number) => {
    const next = activeAssignments.filter((_, i) => i !== idx)
    // If empty after removing, clear the override to fall back to schema
    devSettingsStore.getState().setSectionBehaviourAssignments(
      section.id,
      next.length > 0 ? next : null,
    )
  }, [activeAssignments, section.id])

  const handleChange = useCallback((idx: number, behaviourId: string) => {
    const next = activeAssignments.map((a, i) =>
      i === idx ? { ...a, behaviour: behaviourId, options: undefined } : a,
    )
    devSettingsStore.getState().setSectionBehaviourAssignments(section.id, next)
  }, [activeAssignments, section.id])

  const handleOptionChange = useCallback((idx: number, key: string, value: unknown) => {
    const next = activeAssignments.map((a, i) =>
      i === idx ? { ...a, options: { ...a.options, [key]: value } } : a,
    )
    devSettingsStore.getState().setSectionBehaviourAssignments(section.id, next)
  }, [activeAssignments, section.id])

  return (
    <div style={{ padding: '6px 12px 2px' }}>
      {/* Section label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
        <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: 500 }}>
          {section.id}
        </span>
        {section.layout?.pattern && (
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>
            ({section.layout.pattern})
          </span>
        )}
      </div>

      {/* Assigned behaviours list */}
      {activeAssignments.map((assignment, i) => {
        const behaviour = getBehaviour(assignment.behaviour)
        const hasSettings = behaviour?.settings && Object.keys(behaviour.settings).length > 0
        return (
          <div key={`${assignment.behaviour}-${i}`} style={{ marginBottom: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <select
                value={assignment.behaviour}
                onChange={(e) => handleChange(i, e.target.value)}
                className="dt-settings__select"
                style={{ flex: 1, maxWidth: 'none' }}
              >
                {allBehaviourMetas.map((meta) => (
                  <option key={meta.id} value={meta.id}>
                    {meta.name} ({meta.id})
                  </option>
                ))}
              </select>
              <button
                onClick={() => handleRemove(i)}
                style={{
                  color: 'rgba(255,255,255,0.5)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 14,
                  padding: '0 4px',
                  lineHeight: 1,
                }}
                title="Remove behaviour"
              >
                &times;
              </button>
            </div>
            {hasSettings && (
              <SettingsEditor
                settings={behaviour!.settings!}
                values={{
                  ...Object.fromEntries(
                    Object.entries(behaviour!.settings!).map(([k, v]) => [k, (v as { default: unknown })?.default])
                  ),
                  ...(assignment.options ?? {}),
                }}
                onChange={(key, value) => handleOptionChange(i, key, value)}
              />
            )}
          </div>
        )
      })}

      {/* No behaviours indicator */}
      {activeAssignments.length === 0 && (
        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, marginBottom: 4 }}>
          No behaviours assigned
        </div>
      )}

      {/* Add behaviour button */}
      <button
        onClick={() => handleAdd(allBehaviourMetas[0]?.id ?? 'visibility/fade-in')}
        style={{
          color: 'rgba(255,255,255,0.5)',
          background: 'none',
          border: '1px dashed rgba(255,255,255,0.2)',
          borderRadius: 4,
          cursor: 'pointer',
          fontSize: 11,
          padding: '2px 8px',
          width: '100%',
          marginBottom: 4,
        }}
      >
        + Add Behaviour
      </button>

      {/* Pinned toggle */}
      {(() => {
        const defaultPinned = schemaBehaviours.some(a => a.pinned)
        return (
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>
            <input
              type="checkbox"
              checked={devPinned ?? defaultPinned}
              onChange={(e) => {
                const checked = e.target.checked
                if (checked === defaultPinned) {
                  devSettingsStore.getState().setSectionPinned(section.id, null)
                } else {
                  devSettingsStore.getState().setSectionPinned(section.id, checked)
                }
              }}
              style={{ margin: 0 }}
            />
            Pinned
            {defaultPinned && <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10 }}>(default: on)</span>}
          </label>
        )
      })()}
    </div>
  )
}

// =============================================================================
// WidgetBehaviourAssigner
// =============================================================================

/** Collect unique widget types from sections (recursive). */
function collectWidgetTypes(sections: SectionSchema[]): string[] {
  const types = new Set<string>()
  function walk(widgets?: WidgetSchema[]) {
    if (!widgets) return
    for (const w of widgets) {
      types.add(w.type)
      if (w.widgets) walk(w.widgets)
    }
  }
  for (const section of sections) {
    walk(section.widgets)
  }
  return Array.from(types).sort()
}

interface WidgetBehaviourAssignerProps {
  sections: SectionSchema[]
  experience: ReturnType<typeof getExperienceForSectionBehaviours>
}

function WidgetBehaviourAssigner({ sections, experience }: WidgetBehaviourAssignerProps) {
  const widgetTypes = useMemo(() => collectWidgetTypes(sections), [sections])
  // Only show if experience has widget behaviours OR types exist in page
  const hasAny = (experience?.widgetBehaviours && Object.keys(experience.widgetBehaviours).length > 0) || widgetTypes.length > 0

  if (!hasAny) return null

  return (
    <div className="dt-settings" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
      <div className="dt-settings__header">Widget Behaviours</div>
      {widgetTypes.map((type) => (
        <WidgetBehaviourRow
          key={type}
          widgetType={type}
          experience={experience}
        />
      ))}
    </div>
  )
}

interface WidgetBehaviourRowProps {
  widgetType: string
  experience: ReturnType<typeof getExperienceForSectionBehaviours>
}

function WidgetBehaviourRow({ widgetType, experience }: WidgetBehaviourRowProps) {
  const schemaBehaviours = useMemo(() => {
    return experience?.widgetBehaviours?.[widgetType] ?? []
  }, [widgetType, experience])

  const devAssignments = useStore(
    devSettingsStore,
    (s) => s.widgetBehaviourAssignments[widgetType],
  )

  const activeAssignments = devAssignments ?? schemaBehaviours

  const handleAdd = useCallback((behaviourId: string) => {
    const next = [...activeAssignments, { behaviour: behaviourId }]
    devSettingsStore.getState().setWidgetBehaviourAssignments(widgetType, next)
  }, [activeAssignments, widgetType])

  const handleRemove = useCallback((idx: number) => {
    const next = activeAssignments.filter((_, i) => i !== idx)
    devSettingsStore.getState().setWidgetBehaviourAssignments(
      widgetType,
      next.length > 0 ? next : null,
    )
  }, [activeAssignments, widgetType])

  const handleChange = useCallback((idx: number, behaviourId: string) => {
    const next = activeAssignments.map((a, i) =>
      i === idx ? { ...a, behaviour: behaviourId, options: undefined } : a,
    )
    devSettingsStore.getState().setWidgetBehaviourAssignments(widgetType, next)
  }, [activeAssignments, widgetType])

  const handleOptionChange = useCallback((idx: number, key: string, value: unknown) => {
    const next = activeAssignments.map((a, i) =>
      i === idx ? { ...a, options: { ...a.options, [key]: value } } : a,
    )
    devSettingsStore.getState().setWidgetBehaviourAssignments(widgetType, next)
  }, [activeAssignments, widgetType])

  // Skip widget types with no behaviours and no dev overrides (less noise)
  if (schemaBehaviours.length === 0 && !devAssignments) return null

  return (
    <div style={{ padding: '6px 12px 2px' }}>
      <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: 500, marginBottom: 4 }}>
        {widgetType}
      </div>

      {activeAssignments.map((assignment, i) => {
        const behaviour = getBehaviour(assignment.behaviour)
        const hasSettings = behaviour?.settings && Object.keys(behaviour.settings).length > 0
        return (
          <div key={`${assignment.behaviour}-${i}`} style={{ marginBottom: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <select
                value={assignment.behaviour}
                onChange={(e) => handleChange(i, e.target.value)}
                className="dt-settings__select"
                style={{ flex: 1, maxWidth: 'none' }}
              >
                {allBehaviourMetas.map((meta) => (
                  <option key={meta.id} value={meta.id}>
                    {meta.name} ({meta.id})
                  </option>
                ))}
              </select>
              <button
                onClick={() => handleRemove(i)}
                style={{
                  color: 'rgba(255,255,255,0.5)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 14,
                  padding: '0 4px',
                  lineHeight: 1,
                }}
                title="Remove behaviour"
              >
                &times;
              </button>
            </div>
            {hasSettings && (
              <SettingsEditor
                settings={behaviour!.settings!}
                values={{
                  ...Object.fromEntries(
                    Object.entries(behaviour!.settings!).map(([k, v]) => [k, (v as { default: unknown })?.default])
                  ),
                  ...(assignment.options ?? {}),
                }}
                onChange={(key, value) => handleOptionChange(i, key, value)}
              />
            )}
          </div>
        )
      })}

      {activeAssignments.length === 0 && (
        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, marginBottom: 4 }}>
          No behaviours assigned
        </div>
      )}

      <button
        onClick={() => handleAdd(allBehaviourMetas[0]?.id ?? 'visibility/fade-in')}
        style={{
          color: 'rgba(255,255,255,0.5)',
          background: 'none',
          border: '1px dashed rgba(255,255,255,0.2)',
          borderRadius: 4,
          cursor: 'pointer',
          fontSize: 11,
          padding: '2px 8px',
          width: '100%',
          marginBottom: 4,
        }}
      >
        + Add Behaviour
      </button>
    </div>
  )
}

// =============================================================================
// IntroInfoDisplay
// =============================================================================

interface IntroInfoDisplayProps {
  config: import('../../../intro/types').IntroConfig
}

function IntroInfoDisplay({ config }: IntroInfoDisplayProps) {
  return (
    <div className="dt-settings" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
      <div className="dt-settings__header">Intro</div>
      <div style={{ padding: '4px 12px', fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>
        <div style={{ marginBottom: 2 }}>
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>Pattern: </span>
          <span style={{ color: 'rgba(255,255,255,0.9)' }}>{config.pattern}</span>
        </div>
        {config.overlay && (
          <div style={{ marginBottom: 2 }}>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>Overlay: </span>
            <span style={{ color: 'rgba(255,255,255,0.9)' }}>{config.overlay.component}</span>
          </div>
        )}
        {config.settings && Object.keys(config.settings).length > 0 && (
          <div style={{ marginTop: 4 }}>
            {Object.entries(config.settings).map(([key, value]) => (
              <div key={key} style={{ marginBottom: 1 }}>
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>{key}: </span>
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>{JSON.stringify(value)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// ItemButton
// =============================================================================

interface ItemButtonProps {
  id: string
  name: string
  description?: string
  isActive: boolean
  isDefault: boolean
  hasSettings?: boolean
  showingSettings?: boolean
  onSelect: () => void
  onToggleSettings?: () => void
}

function ItemButton({
  name,
  description,
  isActive,
  isDefault,
  hasSettings,
  showingSettings,
  onSelect,
  onToggleSettings,
}: ItemButtonProps): ReactNode {
  return (
    <div className={`dt-item ${isActive ? 'dt-item--active' : ''}`}>
      <button
        className="dt-item__main"
        onClick={onSelect}
      >
        <span className="dt-item__name">{name}</span>
        {description && <span className="dt-item__desc">{description}</span>}
        {isDefault && <span className="dt-item__default">default</span>}
      </button>
      {hasSettings && isActive && (
        <button
          className={`dt-item__gear ${showingSettings ? 'dt-item__gear--active' : ''}`}
          onClick={(e) => {
            e.stopPropagation()
            onToggleSettings?.()
          }}
          title="Settings"
        >
          &#9881;
        </button>
      )}
    </div>
  )
}

// Re-export types for external use
export type { DevToolsPanelProps }
