'use client'

/**
 * DevToolsPanel - unified dev tools panel.
 *
 * Single scrollable panel with collapsible sections:
 * 1. Preset (top-level — everything below is scoped to this preset)
 * 2. Transition (only if multi-page preset)
 * 3. Experience (dropdown + settings)
 * 4. Intro Sequence (dropdown + settings)
 * 5. Section Behaviours (per-section, collapsible rows)
 * 6. Chrome Behaviours (per-region, collapsible rows)
 *
 * Two modes:
 * 1. Minimized — single button at bottom-right
 * 2. Expanded — full panel with all sections
 *
 * Only renders in development mode, not in iframes.
 */

import { useState, useCallback, useMemo, useSyncExternalStore, type ReactNode, type PropsWithChildren } from 'react'
import { createPortal } from 'react-dom'
import { useStore } from 'zustand'
import { useSiteContainer } from '../../SiteContainerContext'
import { SettingsEditor } from './SettingsEditor'
import { devSettingsStore } from '../devSettingsStore'
import { getBehaviour, getAllBehaviourMetas } from '../../../experience/behaviours'
import { getExperience, getAllExperienceMetas, getExperienceOverride, setExperienceOverride, useExperience } from '../../../experience'
import { getAllRegisteredTransitionMetas, getTransitionOverride, setTransitionOverride } from '../../../experience/transitions/registry'
import { getAllPresetMetas, getPreset, getPresetOverride, setPresetOverride } from '../../../presets/registry'
import { useIntro, getIntroOverride, setIntroOverride, getAllIntroSequenceMetas, getIntroSequenceEntry } from '../../../intro'
import type { IntroContextValue } from '../../../intro'
import { capitalize } from '../../utils'
import type { SectionSchema, ChromeSchema } from '../../../schema'
import './styles.css'

// SSR-safe subscription
const subscribeNoop = () => () => {}

/** Accent color for the panel (blue) */
const PANEL_ACCENT = '59,130,246'

/** Look up experience definition. Returns null if not found. */
function getExperienceDef(id: string) {
  return getExperience(id) ?? null
}

// =============================================================================
// Panel Root
// =============================================================================

interface DevToolsPanelProps {
  /** Current IDs from schema, keyed by category (preset, experience, transition) */
  currentIds: Record<string, string>
  /** Page sections for extracting behaviour settings */
  sections?: SectionSchema[]
  /** Site chrome config for chrome behaviour editing */
  siteChrome?: ChromeSchema
}

export function DevToolsPanel({ currentIds, sections, siteChrome }: DevToolsPanelProps) {
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
    <DevToolsPanelInner currentIds={currentIds} sections={sections} siteChrome={siteChrome} />,
    siteContainer,
  )
}

function DevToolsPanelInner({ currentIds, sections, siteChrome }: DevToolsPanelProps) {
  const { experience: contextExperience } = useExperience()
  const [expanded, setExpanded] = useState(false)
  const introContext = useIntro()

  // Read overrides from URL (once on mount — reload-mode overrides are static)
  const presetOverride = useMemo(() => getPresetOverride(), [])
  const transitionOverride = useMemo(() => getTransitionOverride(), [])
  const experienceOverride = useMemo(() => getExperienceOverride(), [])
  // Experience override can also update live, tracked separately
  const [liveExpOverride, setLiveExpOverride] = useState<string | null>(experienceOverride)

  // Active IDs (override → schema default)
  const activePresetId = presetOverride ?? currentIds.preset ?? ''
  const activeTransitionId = transitionOverride ?? currentIds.transition ?? ''
  const activeExperienceId = liveExpOverride ?? currentIds.experience ?? ''

  // Check if the active preset is multi-page
  const isMultiPage = useMemo(() => {
    const preset = getPreset(activePresetId)
    return preset ? Object.keys(preset.pages).length > 1 : false
  }, [activePresetId])

  // Items for each dropdown
  const presetItems = useMemo(() => getAllPresetMetas(), [])
  const transitionItems = useMemo(() => getAllRegisteredTransitionMetas(), [])
  const experienceItems = useMemo(() =>
    getAllExperienceMetas().map((m) => ({
      id: m.id,
      name: m.name,
      description: m.description,
    })),
    [],
  )

  // Resolve experience definition for sub-sections
  const activeExperience = contextExperience.id === activeExperienceId
    ? contextExperience
    : getExperienceDef(activeExperienceId)

  // Has any override active? (for minimized dot indicator)
  const hasAnyOverride = !!(presetOverride || transitionOverride || liveExpOverride || getIntroOverride())

  if (!expanded) {
    return (
      <div className="dt-bar">
        <a
          className="dt-bar__btn"
          href="/dev"
          title="Contract Inspector"
        >
          <span className="dt-bar__icon">&#9636;</span>
        </a>
        <button
          className="dt-bar__btn"
          onClick={() => setExpanded(true)}
          title="Dev Tools"
        >
          <span className="dt-bar__icon">&#9881;</span>
          {hasAnyOverride && (
            <span className="dt-bar__dot" style={{ background: `rgb(${PANEL_ACCENT})` }} />
          )}
        </button>
      </div>
    )
  }

  return (
    <div
      className="dt-panel"
      style={{ '--dt-accent': PANEL_ACCENT } as React.CSSProperties}
      onWheel={(e) => e.stopPropagation()}
    >
      {/* Header bar with minimize */}
      <div className="dt-panel__tabs">
        <span style={{ padding: '0 8px', color: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
          Dev Tools
        </span>
        <button
          className="dt-panel__minimize"
          onClick={() => setExpanded(false)}
          title="Minimize"
        >
          _
        </button>
      </div>

      {/* Scrollable body — all sections */}
      <div className="dt-panel__body">
        {/* Preset */}
        <PresetSection
          activeId={activePresetId}
          defaultId={currentIds.preset ?? ''}
          override={presetOverride}
          items={presetItems}
        />

        {/* Transition (only if multi-page) */}
        {isMultiPage && (
          <TransitionSection
            activeId={activeTransitionId}
            defaultId={currentIds.transition ?? ''}
            override={transitionOverride}
            items={transitionItems}
          />
        )}

        {/* Experience */}
        <ExperienceSection
          activeId={activeExperienceId}
          defaultId={currentIds.experience ?? ''}
          override={liveExpOverride}
          items={experienceItems}
          onSelect={(id) => {
            setLiveExpOverride(id)
            setExperienceOverride(id)
          }}
        />

        {/* Intro Sequence */}
        <IntroSequenceSection
          introContext={introContext}
          experience={activeExperience}
        />

        {/* Section Behaviours */}
        {sections && sections.length > 0 && (
          <SectionBehaviourAssigner
            sections={sections}
            experience={activeExperience}
          />
        )}

        {/* Chrome Behaviours */}
        {siteChrome && (
          <ChromeBehaviourAssigner
            siteChrome={siteChrome}
            experience={activeExperience}
          />
        )}
      </div>

      {/* Footer */}
      <div className="dt-panel__footer">
        Preset &amp; transition switches reload the page
      </div>
    </div>
  )
}

// =============================================================================
// CollapsibleSection
// =============================================================================

interface CollapsibleSectionProps {
  label: string
  defaultOpen?: boolean
}

function CollapsibleSection({ label, defaultOpen = false, children }: PropsWithChildren<CollapsibleSectionProps>) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="dt-settings" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
      <button
        className="dt-collapsible__toggle"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="dt-collapsible__arrow" data-open={open}>&#9656;</span>
        <span className="dt-settings__header" style={{ padding: 0 }}>{label}</span>
      </button>
      {open && children}
    </div>
  )
}

// =============================================================================
// Shared: reset ×  button style
// =============================================================================

const resetBtnStyle: React.CSSProperties = {
  color: 'rgba(255,255,255,0.5)',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: 14,
  padding: '0 4px',
  lineHeight: 1,
  flexShrink: 0,
}

// =============================================================================
// PresetSection
// =============================================================================

interface PresetSectionProps {
  activeId: string
  defaultId: string
  override: string | null
  items: { id: string; name: string; description?: string }[]
}

function PresetSection({ activeId, defaultId, override, items }: PresetSectionProps) {
  return (
    <CollapsibleSection label="Preset" defaultOpen>
      <div style={{ padding: '4px 12px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <select
            value={activeId}
            onChange={(e) => setPresetOverride(e.target.value === defaultId ? null : e.target.value)}
            className="dt-settings__select"
            style={{ flex: 1 }}
          >
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}{item.id === defaultId ? ' (default)' : ''}
              </option>
            ))}
          </select>
          {override && (
            <button onClick={() => setPresetOverride(null)} style={resetBtnStyle} title="Reset to default">
              &times;
            </button>
          )}
        </div>
      </div>
    </CollapsibleSection>
  )
}

// =============================================================================
// TransitionSection
// =============================================================================

interface TransitionSectionProps {
  activeId: string
  defaultId: string
  override: string | null
  items: { id: string; name: string; description?: string }[]
}

function TransitionSection({ activeId, defaultId, override, items }: TransitionSectionProps) {
  return (
    <CollapsibleSection label="Transition" defaultOpen>
      <div style={{ padding: '4px 12px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <select
            value={activeId}
            onChange={(e) => setTransitionOverride(e.target.value === defaultId ? null : e.target.value)}
            className="dt-settings__select"
            style={{ flex: 1 }}
          >
            <option value="none">No Transition</option>
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}{item.id === defaultId ? ' (default)' : ''}
              </option>
            ))}
          </select>
          {override && (
            <button onClick={() => setTransitionOverride(null)} style={resetBtnStyle} title="Reset to default">
              &times;
            </button>
          )}
        </div>
      </div>
    </CollapsibleSection>
  )
}

// =============================================================================
// ExperienceSection
// =============================================================================

interface ExperienceSectionProps {
  activeId: string
  defaultId: string
  override: string | null
  items: { id: string; name: string; description?: string }[]
  onSelect: (id: string | null) => void
}

function ExperienceSection({
  activeId, defaultId, override, items, onSelect,
}: ExperienceSectionProps) {
  const activeItem = items.find((i) => i.id === activeId)

  return (
    <CollapsibleSection label="Experience" defaultOpen>
      <div style={{ padding: '4px 12px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
          <select
            value={activeId}
            onChange={(e) => onSelect(e.target.value === defaultId ? null : e.target.value)}
            className="dt-settings__select"
            style={{ flex: 1 }}
          >
            {items.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}{item.id === defaultId ? ' (default)' : ''}
              </option>
            ))}
          </select>
          {override && (
            <button onClick={() => onSelect(null)} style={resetBtnStyle} title="Reset to default">
              &times;
            </button>
          )}
        </div>
        {activeItem?.description && (
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, marginBottom: 4 }}>
            {activeItem.description}
          </div>
        )}
      </div>
    </CollapsibleSection>
  )
}

// =============================================================================
// IntroSequenceSection
// =============================================================================

interface IntroSequenceSectionProps {
  introContext: IntroContextValue | null
  experience: ReturnType<typeof getExperienceDef>
}

function IntroSequenceSection({ introContext, experience }: IntroSequenceSectionProps) {
  const overrideId = getIntroOverride()
  const sequences = useMemo(() => getAllIntroSequenceMetas(), [])

  // Determine which sequence ID is active
  const activeSequenceId = useMemo(() => {
    if (overrideId === 'none') return 'none'
    if (overrideId) return overrideId
    const expIntro = experience?.intro
    if (!expIntro) return 'none'
    for (const seq of sequences) {
      const entry = getIntroSequenceEntry(seq.id)
      if (entry && entry.config.pattern === expIntro.pattern) return seq.id
    }
    return ''
  }, [overrideId, experience, sequences])

  const activeEntry = activeSequenceId && activeSequenceId !== 'none'
    ? getIntroSequenceEntry(activeSequenceId)
    : null

  const handleChange = useCallback((sequenceId: string) => {
    if (sequenceId === 'none') {
      setIntroOverride('none')
    } else {
      const expIntro = experience?.intro
      if (expIntro) {
        const entry = getIntroSequenceEntry(sequenceId)
        if (entry && entry.config.pattern === expIntro.pattern) {
          setIntroOverride(null)
          return
        }
      }
      setIntroOverride(sequenceId)
    }
  }, [experience])

  return (
    <CollapsibleSection label="Intro Sequence" defaultOpen>
      <div style={{ padding: '4px 12px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 4 }}>
          <select
            value={activeSequenceId}
            onChange={(e) => handleChange(e.target.value)}
            className="dt-settings__select"
            style={{ flex: 1, maxWidth: 'none' }}
          >
            <option value="none">None</option>
            {sequences.map((seq) => (
              <option key={seq.id} value={seq.id}>
                {seq.name} ({seq.category ?? seq.id})
              </option>
            ))}
          </select>
          {overrideId && (
            <button onClick={() => setIntroOverride(null)} style={resetBtnStyle} title="Reset to default">
              &times;
            </button>
          )}
        </div>

        {overrideId && (
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, marginBottom: 4, fontStyle: 'italic' }}>
            Switching intros reloads the page
          </div>
        )}

        {activeEntry?.meta.settings && Object.keys(activeEntry.meta.settings).length > 0 && (
          <SettingsEditor
            settings={activeEntry.meta.settings}
            values={{
              ...Object.fromEntries(
                Object.entries(activeEntry.meta.settings).map(([k, v]) => [k, (v as { default: unknown })?.default])
              ),
              ...(activeEntry.config.settings ?? {}),
            }}
            onChange={() => {}}
          />
        )}

        {activeEntry?.config.overlay && (
          <div style={{ padding: '4px 0', fontSize: 10 }}>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>Overlay: </span>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'ui-monospace, monospace' }}>
              {activeEntry.config.overlay.component}
            </span>
          </div>
        )}
      </div>
    </CollapsibleSection>
  )
}

// =============================================================================
// SectionBehaviourAssigner
// =============================================================================

/** All registered behaviour metas (computed once), excluding intro/* (app-level, not section/chrome). */
const allBehaviourMetas = getAllBehaviourMetas().filter((m) => !m.id.startsWith('intro/'))

interface BehaviourListProps {
  assignments: { behaviour: string; options?: Record<string, unknown> }[]
  onAdd: (behaviourId: string) => void
  onRemove: (idx: number) => void
  onChange: (idx: number, behaviourId: string) => void
  onOptionChange: (idx: number, key: string, value: unknown) => void
}

function BehaviourList({ assignments, onAdd, onRemove, onChange, onOptionChange }: BehaviourListProps) {
  return (
    <>
      {assignments.map((assignment, i) => {
        const behaviour = getBehaviour(assignment.behaviour)
        const hasSettings = behaviour?.settings && Object.keys(behaviour.settings).length > 0
        return (
          <div key={`${assignment.behaviour}-${i}`} style={{ marginBottom: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <select
                value={assignment.behaviour}
                onChange={(e) => onChange(i, e.target.value)}
                className="dt-settings__select"
                style={{ flex: 1 }}
              >
                {allBehaviourMetas.map((meta) => (
                  <option key={meta.id} value={meta.id}>
                    {meta.name} ({meta.id})
                  </option>
                ))}
              </select>
              <button onClick={() => onRemove(i)} style={resetBtnStyle} title="Remove behaviour">
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
                onChange={(key, value) => onOptionChange(i, key, value)}
              />
            )}
          </div>
        )
      })}

      {assignments.length === 0 && (
        <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, marginBottom: 4 }}>
          No behaviours assigned
        </div>
      )}

      <button
        onClick={() => onAdd(allBehaviourMetas[0]?.id ?? 'visibility/fade-in')}
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
    </>
  )
}

interface SectionBehaviourAssignerProps {
  sections: SectionSchema[]
  experience: ReturnType<typeof getExperienceDef>
}

function SectionBehaviourAssigner({ sections, experience }: SectionBehaviourAssignerProps) {
  return (
    <CollapsibleSection label="Section Behaviours">
      {sections.map((section) => (
        <SectionBehaviourRow
          key={section.id}
          section={section}
          experience={experience}
        />
      ))}
    </CollapsibleSection>
  )
}

interface SectionBehaviourRowProps {
  section: SectionSchema
  experience: ReturnType<typeof getExperienceDef>
}

function SectionBehaviourRow({ section, experience }: SectionBehaviourRowProps) {
  const [open, setOpen] = useState(false)

  const schemaBehaviours = useMemo(() => {
    if (!experience?.sectionBehaviours) return []
    return experience.sectionBehaviours[section.id]
      ?? experience.sectionBehaviours[capitalize(section.id)]
      ?? experience.sectionBehaviours['*']
      ?? []
  }, [section.id, experience])

  const devAssignments = useStore(
    devSettingsStore,
    (s) => s.sectionBehaviourAssignments[section.id],
  )

  const activeAssignments = devAssignments ?? schemaBehaviours

  const handleAdd = useCallback((behaviourId: string) => {
    const next = [...activeAssignments, { behaviour: behaviourId }]
    devSettingsStore.getState().setSectionBehaviourAssignments(section.id, next)
  }, [activeAssignments, section.id])

  const handleRemove = useCallback((idx: number) => {
    const next = activeAssignments.filter((_, i) => i !== idx)
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
    <div>
      <button className="dt-row-toggle" onClick={() => setOpen((v) => !v)}>
        <span className="dt-collapsible__arrow" data-open={open}>&#9656;</span>
        <span className="dt-row-toggle__label">{section.id}</span>
        {section.layout?.pattern && (
          <span className="dt-row-toggle__sub">({section.layout.pattern})</span>
        )}
        <span className="dt-row-toggle__count">{activeAssignments.length}</span>
      </button>

      {open && (
        <div style={{ padding: '2px 12px 4px 24px' }}>
          <BehaviourList
            assignments={activeAssignments}
            onAdd={handleAdd}
            onRemove={handleRemove}
            onChange={handleChange}
            onOptionChange={handleOptionChange}
          />
        </div>
      )}
    </div>
  )
}

// =============================================================================
// ChromeBehaviourAssigner
// =============================================================================

const CHROME_REGION_IDS = ['header', 'footer'] as const

interface ChromeBehaviourAssignerProps {
  siteChrome: ChromeSchema
  experience: ReturnType<typeof getExperienceDef>
}

function ChromeBehaviourAssigner({ siteChrome, experience }: ChromeBehaviourAssignerProps) {
  const activeRegions = useMemo(() =>
    CHROME_REGION_IDS.filter((id) => siteChrome.regions[id]),
    [siteChrome],
  )

  if (activeRegions.length === 0) return null

  return (
    <CollapsibleSection label="Chrome Behaviours">
      {activeRegions.map((regionId) => (
        <ChromeBehaviourRow
          key={regionId}
          regionId={regionId}
          experience={experience}
        />
      ))}
    </CollapsibleSection>
  )
}

interface ChromeBehaviourRowProps {
  regionId: string
  experience: ReturnType<typeof getExperienceDef>
}

function ChromeBehaviourRow({ regionId, experience }: ChromeBehaviourRowProps) {
  const [open, setOpen] = useState(false)

  const schemaBehaviours = useMemo(() => {
    return experience?.chromeBehaviours?.[regionId] ?? []
  }, [regionId, experience])

  const devAssignments = useStore(
    devSettingsStore,
    (s) => s.chromeBehaviourAssignments[regionId],
  )

  const activeAssignments = devAssignments ?? schemaBehaviours

  const handleAdd = useCallback((behaviourId: string) => {
    const next = [...activeAssignments, { behaviour: behaviourId }]
    devSettingsStore.getState().setChromeBehaviourAssignments(regionId, next)
  }, [activeAssignments, regionId])

  const handleRemove = useCallback((idx: number) => {
    const next = activeAssignments.filter((_, i) => i !== idx)
    devSettingsStore.getState().setChromeBehaviourAssignments(
      regionId,
      next.length > 0 ? next : null,
    )
  }, [activeAssignments, regionId])

  const handleChange = useCallback((idx: number, behaviourId: string) => {
    const next = activeAssignments.map((a, i) =>
      i === idx ? { ...a, behaviour: behaviourId, options: undefined } : a,
    )
    devSettingsStore.getState().setChromeBehaviourAssignments(regionId, next)
  }, [activeAssignments, regionId])

  const handleOptionChange = useCallback((idx: number, key: string, value: unknown) => {
    const next = activeAssignments.map((a, i) =>
      i === idx ? { ...a, options: { ...a.options, [key]: value } } : a,
    )
    devSettingsStore.getState().setChromeBehaviourAssignments(regionId, next)
  }, [activeAssignments, regionId])

  return (
    <div>
      <button className="dt-row-toggle" onClick={() => setOpen((v) => !v)}>
        <span className="dt-collapsible__arrow" data-open={open}>&#9656;</span>
        <span className="dt-row-toggle__label">{regionId}</span>
        <span className="dt-row-toggle__count">{activeAssignments.length}</span>
      </button>

      {open && (
        <div style={{ padding: '2px 12px 4px 24px' }}>
          <BehaviourList
            assignments={activeAssignments}
            onAdd={handleAdd}
            onRemove={handleRemove}
            onChange={handleChange}
            onOptionChange={handleOptionChange}
          />
        </div>
      )}
    </div>
  )
}

// Re-export types for external use
export type { DevToolsPanelProps }
