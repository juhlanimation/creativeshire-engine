/**
 * L2 Experience tab — preset-mode experience, intro, transition, and behaviour editing.
 * Reuses SettingsEditor and BehaviourList patterns from the floating DevToolsPanel.
 * Wired to devAuthoringStore for persistent (in-memory) edits.
 *
 * This tab only handles preset overrides. Defaults editing lives in DefaultsTab.
 */

'use client'

import { useState, useCallback, useMemo } from 'react'
import { SettingsEditor } from '../../../engine/renderer/dev/DevToolsPanel/SettingsEditor'
import { getExperience, getAllExperienceMetas } from '../../../engine/experience'
import { getAllRegisteredTransitionMetas } from '../../../engine/experience/transitions/registry'
import { getAllIntroSequenceMetas, getIntroSequenceEntry, resolvePresetIntro } from '../../../engine/intro'
import { getBehaviour, getAllBehaviourMetas } from '../../../engine/experience/behaviours'
import { saveBehaviourDefault } from '../actions/saveBehaviourDefaults'
import { useAuthoring } from './devAuthoringStore'
import { CollapsibleSection } from './CollapsibleSection'
import { IntroTimeline } from './IntroTimeline'
import type { SitePreset } from '../../../engine/presets/types'
import type { BehaviourAssignment } from '../../../engine/experience/experiences/types'

// =============================================================================
// Shared: BehaviourList (preset mode — with override indicators)
// =============================================================================

const allBehaviourMetas = getAllBehaviourMetas().filter((m) => !m.id.startsWith('intro/'))

interface BehaviourListProps {
  assignments: BehaviourAssignment[]
  onAdd: (behaviourId: string) => void
  onRemove: (idx: number) => void
  onChange: (idx: number, behaviourId: string) => void
  onOptionChange: (idx: number, key: string, value: unknown) => void
  onOptionReset?: (idx: number, key: string) => void
}

function BehaviourList({
  assignments,
  onAdd,
  onRemove,
  onChange,
  onOptionChange,
  onOptionReset,
}: BehaviourListProps) {
  return (
    <>
      {assignments.map((assignment, i) => {
        const behaviour = getBehaviour(assignment.behaviour)
        const hasSettings = behaviour?.settings && Object.keys(behaviour.settings).length > 0

        if (!hasSettings) {
          return (
            <div key={`${assignment.behaviour}-${i}`} className="da-behaviour-item">
              <div className="da-behaviour-item__row">
                <select
                  value={assignment.behaviour}
                  onChange={(e) => onChange(i, e.target.value)}
                  className="da-select"
                >
                  {allBehaviourMetas.map((meta) => (
                    <option key={meta.id} value={meta.id}>
                      {meta.name} ({meta.id})
                    </option>
                  ))}
                </select>
                <button onClick={() => onRemove(i)} className="da-btn-icon" title="Remove">
                  &times;
                </button>
              </div>
            </div>
          )
        }

        const defaults = Object.fromEntries(
          Object.entries(behaviour!.settings!).map(([k, v]) => [k, (v as { default: unknown })?.default]),
        )
        const overriddenKeys = new Set(Object.keys(assignment.options ?? {}))

        return (
          <div key={`${assignment.behaviour}-${i}`} className="da-behaviour-item">
            <div className="da-behaviour-item__row">
              <select
                value={assignment.behaviour}
                onChange={(e) => onChange(i, e.target.value)}
                className="da-select"
              >
                {allBehaviourMetas.map((meta) => (
                  <option key={meta.id} value={meta.id}>
                    {meta.name} ({meta.id})
                  </option>
                ))}
              </select>
              <button onClick={() => onRemove(i)} className="da-btn-icon" title="Remove">
                &times;
              </button>
            </div>
            <SettingsEditor
              settings={behaviour!.settings!}
              values={{ ...defaults, ...(assignment.options ?? {}) }}
              onChange={(key, value) => onOptionChange(i, key, value)}
              overriddenKeys={overriddenKeys.size > 0 ? overriddenKeys : undefined}
              onReset={onOptionReset ? (key) => onOptionReset(i, key) : undefined}
            />
          </div>
        )
      })}

      {assignments.length === 0 && (
        <div className="da-muted">No behaviours assigned</div>
      )}

      <button
        onClick={() => onAdd(allBehaviourMetas[0]?.id ?? 'visibility/fade-in')}
        className="da-btn-add"
      >
        + Add Behaviour
      </button>
    </>
  )
}

// =============================================================================
// Experience Section (preset mode)
// =============================================================================

function ExperienceSection({ preset }: { preset: SitePreset }) {
  const { setExperience } = useAuthoring()
  const experienceItems = useMemo(() => getAllExperienceMetas(), [])
  const activeId = preset.experience?.id ?? ''
  const activeItem = experienceItems.find((i) => i.id === activeId)

  return (
    <CollapsibleSection label="Experience" defaultOpen>
      <div className="da-field-group">
        <select
          value={activeId}
          onChange={(e) => {
            const id = e.target.value
            setExperience({
              ...preset.experience,
              id,
              sectionBehaviours: preset.experience?.sectionBehaviours,
            })
          }}
          className="da-select"
          style={{ flex: 1 }}
        >
          <option value="">None</option>
          {experienceItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
        {activeItem?.description && (
          <div className="da-muted">{activeItem.description}</div>
        )}
      </div>
    </CollapsibleSection>
  )
}

// =============================================================================
// Intro Sequence Section (preset mode)
// =============================================================================

function IntroSection({ preset }: { preset: SitePreset }) {
  const { setIntro, setIntroSettings, setIntroSteps } = useAuthoring()
  const sequences = useMemo(() => getAllIntroSequenceMetas(), [])

  const activeIntro = preset.experience?.intro
  const activeSequenceId = activeIntro?.sequence ?? 'none'

  const activeEntry = activeSequenceId !== 'none'
    ? getIntroSequenceEntry(activeSequenceId)
    : null

  const resolvedIntro = useMemo(() => {
    if (!activeIntro?.sequence) return null
    return resolvePresetIntro(activeIntro)
  }, [activeIntro])

  const introOverriddenKeys = useMemo(() => {
    if (!activeIntro?.settings) return undefined
    const keys = Object.keys(activeIntro.settings)
    return keys.length > 0 ? new Set(keys) : undefined
  }, [activeIntro?.settings])

  const handleIntroReset = useCallback((key: string) => {
    if (!activeIntro?.settings) return
    const { [key]: _, ...rest } = activeIntro.settings
    setIntro({
      ...activeIntro,
      settings: Object.keys(rest).length > 0 ? rest : undefined,
    })
  }, [activeIntro, setIntro])

  return (
    <CollapsibleSection label="Intro Sequence" defaultOpen>
      <div className="da-field-group">
        <select
          value={activeSequenceId}
          onChange={(e) => {
            const id = e.target.value
            if (id === 'none') {
              setIntro(undefined)
            } else {
              setIntro({ sequence: id })
            }
          }}
          className="da-select da-select--full"
        >
          <option value="none">None</option>
          {sequences.map((seq) => (
            <option key={seq.id} value={seq.id}>
              {seq.name} ({seq.category ?? seq.id})
            </option>
          ))}
        </select>

        {activeEntry?.meta.settings && Object.keys(activeEntry.meta.settings).length > 0 && (
          <SettingsEditor
            settings={activeEntry.meta.settings}
            values={{
              ...Object.fromEntries(
                Object.entries(activeEntry.meta.settings).map(([k, v]) => [k, (v as { default: unknown })?.default])
              ),
              ...(activeEntry.config.settings ?? {}),
              ...(activeIntro?.settings ?? {}),
            }}
            onChange={(key, value) => setIntroSettings(key, value)}
            overriddenKeys={introOverriddenKeys}
            onReset={handleIntroReset}
          />
        )}

        {activeEntry?.config.overlay && (
          <div className="da-kv">
            <span className="da-kv__label">Overlay:</span>
            <span className="da-kv__value">{activeEntry.config.overlay.component}</span>
          </div>
        )}

        {resolvedIntro && (
          <IntroTimeline
            config={resolvedIntro}
            onSettingChange={(key, value) => setIntroSettings(key, value)}
            onStepsChange={(steps) => setIntroSteps(steps)}
          />
        )}
      </div>
    </CollapsibleSection>
  )
}

// =============================================================================
// Transition Section (preset mode only)
// =============================================================================

function TransitionSection({ preset }: { preset: SitePreset }) {
  const { setTransition } = useAuthoring()
  const transitionItems = useMemo(() => getAllRegisteredTransitionMetas(), [])
  const activeId = preset.transition?.id ?? 'none'

  const isMultiPage = Object.keys(preset.pages).length > 1
  if (!isMultiPage) return null

  return (
    <CollapsibleSection label="Transition" defaultOpen>
      <div className="da-field-group">
        <select
          value={activeId}
          onChange={(e) => {
            const id = e.target.value
            if (id === 'none') {
              setTransition(undefined)
            } else {
              setTransition({ id })
            }
          }}
          className="da-select da-select--full"
        >
          <option value="none">No Transition</option>
          {transitionItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
    </CollapsibleSection>
  )
}

// =============================================================================
// Section Behaviours (preset mode)
// =============================================================================

function PresetSectionBehaviours({ preset }: { preset: SitePreset }) {
  const { setSectionBehaviours } = useAuthoring()

  const sectionIds = useMemo(() => {
    const ids = new Set<string>()
    for (const page of Object.values(preset.pages)) {
      for (const section of page.sections) {
        ids.add(section.id)
      }
    }
    return Array.from(ids)
  }, [preset])

  const experienceDef = preset.experience?.id ? getExperience(preset.experience.id) : undefined
  const presetOverrides = preset.experience?.sectionBehaviours ?? {}

  return (
    <CollapsibleSection label="Section Behaviours" count={sectionIds.length}>
      {sectionIds.map((sectionId) => (
        <SectionBehaviourRow
          key={sectionId}
          sectionId={sectionId}
          experienceDef={experienceDef}
          presetOverrides={presetOverrides}
          onChange={(assignments) => setSectionBehaviours(sectionId, assignments)}
        />
      ))}
      <SectionBehaviourRow
        sectionId="*"
        label="* (default)"
        experienceDef={experienceDef}
        presetOverrides={presetOverrides}
        onChange={(assignments) => setSectionBehaviours('*', assignments)}
      />
    </CollapsibleSection>
  )
}

// =============================================================================
// Chrome Behaviours (preset mode)
// =============================================================================

const CHROME_REGION_IDS = ['header', 'footer'] as const

function PresetChromeBehaviours({ preset }: { preset: SitePreset }) {
  const { setChromeBehaviours } = useAuthoring()

  const experienceDef = preset.experience?.id ? getExperience(preset.experience.id) : undefined
  const presetOverrides = preset.experience?.sectionBehaviours ?? {}
  const activeRegions = CHROME_REGION_IDS.filter((id) => {
    const config = preset.chrome.regions[id]
    return config && config !== 'hidden'
  })

  if (activeRegions.length === 0) return null

  return (
    <CollapsibleSection label="Chrome Behaviours" count={activeRegions.length}>
      {activeRegions.map((regionId) => {
        const assignments =
          presetOverrides[`chrome:${regionId}`] ??
          experienceDef?.chromeBehaviours?.[regionId] ??
          []

        return (
          <ChromeBehaviourRow
            key={regionId}
            regionId={regionId}
            assignments={assignments}
            onChange={(a) => setChromeBehaviours(regionId, a)}
          />
        )
      })}
    </CollapsibleSection>
  )
}

// =============================================================================
// Section Behaviour Row (preset mode)
// =============================================================================

interface SectionBehaviourRowProps {
  sectionId: string
  label?: string
  experienceDef: ReturnType<typeof getExperience>
  presetOverrides: Record<string, BehaviourAssignment[]>
  onChange: (assignments: BehaviourAssignment[]) => void
}

function SectionBehaviourRow({ sectionId, label, experienceDef, presetOverrides, onChange }: SectionBehaviourRowProps) {
  const [open, setOpen] = useState(false)

  const assignments = useMemo(() => {
    if (presetOverrides[sectionId]) return presetOverrides[sectionId]
    if (experienceDef?.sectionBehaviours?.[sectionId]) return experienceDef.sectionBehaviours[sectionId]
    if (experienceDef?.sectionBehaviours?.['*']) return experienceDef.sectionBehaviours['*']
    return []
  }, [sectionId, presetOverrides, experienceDef])

  const handleAdd = useCallback((behaviourId: string) => {
    onChange([...assignments, { behaviour: behaviourId }])
  }, [assignments, onChange])

  const handleRemove = useCallback((idx: number) => {
    onChange(assignments.filter((_, i) => i !== idx))
  }, [assignments, onChange])

  const handleChange = useCallback((idx: number, behaviourId: string) => {
    onChange(assignments.map((a, i) =>
      i === idx ? { ...a, behaviour: behaviourId, options: undefined } : a,
    ))
  }, [assignments, onChange])

  const handleOptionChange = useCallback((idx: number, key: string, value: unknown) => {
    onChange(assignments.map((a, i) =>
      i === idx ? { ...a, options: { ...a.options, [key]: value } } : a,
    ))
  }, [assignments, onChange])

  const handleOptionReset = useCallback((idx: number, key: string) => {
    onChange(assignments.map((a, i) => {
      if (i !== idx || !a.options) return a
      const { [key]: _, ...rest } = a.options
      return { ...a, options: Object.keys(rest).length > 0 ? rest : undefined }
    }))
  }, [assignments, onChange])

  return (
    <div className="da-behaviour-row">
      <button className="da-behaviour-row__toggle" onClick={() => setOpen((v) => !v)}>
        <span className="da-collapsible__arrow" data-open={open}>&#9656;</span>
        <span className="da-behaviour-row__label">{label ?? sectionId}</span>
        <span className="da-behaviour-row__count">{assignments.length}</span>
      </button>
      {open && (
        <div className="da-behaviour-row__body">
          <BehaviourList
            assignments={assignments}
            onAdd={handleAdd}
            onRemove={handleRemove}
            onChange={handleChange}
            onOptionChange={handleOptionChange}
            onOptionReset={handleOptionReset}
          />
        </div>
      )}
    </div>
  )
}

// =============================================================================
// Chrome Behaviour Row (preset mode)
// =============================================================================

interface ChromeBehaviourRowProps {
  regionId: string
  assignments: BehaviourAssignment[]
  onChange: (assignments: BehaviourAssignment[]) => void
}

function ChromeBehaviourRow({ regionId, assignments, onChange }: ChromeBehaviourRowProps) {
  const [open, setOpen] = useState(false)

  const handleAdd = useCallback((behaviourId: string) => {
    onChange([...assignments, { behaviour: behaviourId }])
  }, [assignments, onChange])

  const handleRemove = useCallback((idx: number) => {
    onChange(assignments.filter((_, i) => i !== idx))
  }, [assignments, onChange])

  const handleChange = useCallback((idx: number, behaviourId: string) => {
    onChange(assignments.map((a, i) =>
      i === idx ? { ...a, behaviour: behaviourId, options: undefined } : a,
    ))
  }, [assignments, onChange])

  const handleOptionChange = useCallback((idx: number, key: string, value: unknown) => {
    onChange(assignments.map((a, i) =>
      i === idx ? { ...a, options: { ...a.options, [key]: value } } : a,
    ))
  }, [assignments, onChange])

  const handleOptionReset = useCallback((idx: number, key: string) => {
    onChange(assignments.map((a, i) => {
      if (i !== idx || !a.options) return a
      const { [key]: _, ...rest } = a.options
      return { ...a, options: Object.keys(rest).length > 0 ? rest : undefined }
    }))
  }, [assignments, onChange])

  return (
    <div className="da-behaviour-row">
      <button className="da-behaviour-row__toggle" onClick={() => setOpen((v) => !v)}>
        <span className="da-collapsible__arrow" data-open={open}>&#9656;</span>
        <span className="da-behaviour-row__label">{regionId}</span>
        <span className="da-behaviour-row__count">{assignments.length}</span>
      </button>
      {open && (
        <div className="da-behaviour-row__body">
          <BehaviourList
            assignments={assignments}
            onAdd={handleAdd}
            onRemove={handleRemove}
            onChange={handleChange}
            onOptionChange={handleOptionChange}
            onOptionReset={handleOptionReset}
          />
        </div>
      )}
    </div>
  )
}

// =============================================================================
// L2 Experience Tab (main export)
// =============================================================================

export default function L2ExperienceTab() {
  const { preset } = useAuthoring()

  if (!preset) {
    return <div className="da-empty-full">Select a preset to edit its experience.</div>
  }

  return (
    <div className="da-experience-tab">
      <ExperienceSection preset={preset} />
      <IntroSection preset={preset} />
      <TransitionSection preset={preset} />
      <PresetSectionBehaviours preset={preset} />
      <PresetChromeBehaviours preset={preset} />
    </div>
  )
}
