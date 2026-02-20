/**
 * Defaults tab — edit experience definitions, intro sequences, and behaviour defaults.
 * Standalone: works without a preset selected. Uses its own experience selector.
 *
 * Extracted from L2ExperienceTab's "Edit Defaults" mode.
 */

'use client'

import { useState, useCallback, useMemo, useReducer, useRef } from 'react'
import { SettingsEditor } from '../../../engine/renderer/dev/DevToolsPanel/SettingsEditor'
import { getExperience, getAllExperienceMetas } from '../../../engine/experience'
import { getAllIntroSequenceMetas, getIntroSequenceEntry } from '../../../engine/intro'
import { getBehaviour, getAllBehaviourMetas } from '../../../engine/experience/behaviours'
import { CollapsibleSection } from './CollapsibleSection'
import { createExperience as createExperienceAction } from '../actions/createExperience'
import { createIntroSequence as createIntroSequenceAction } from '../actions/createIntroSequence'
import { saveBehaviourDefault } from '../actions/saveBehaviourDefaults'
import { saveExperienceName } from '../actions/saveExperienceDefaults'
import { saveIntroSequenceName, saveIntroSequenceSetting } from '../actions/saveIntroSequenceDefaults'
import { saveExperienceBehaviours } from '../actions/saveExperienceBehaviours'
import type { BehaviourAssignment } from '../../../engine/experience/experiences/types'

// =============================================================================
// Defaults Draft State
// =============================================================================

interface DefaultsDraft {
  experienceId: string
  experienceName: string | null
  introSequenceId: string | null
  introName: string | null
  introSettingChanges: Record<string, unknown>
  behaviourDefaultChanges: Record<string, Record<string, unknown>>
  sectionBehaviours: Record<string, BehaviourAssignment[]>
  chromeBehaviours: Record<string, BehaviourAssignment[]>
  isDirty: boolean
}

type DraftAction =
  | { type: 'init'; experienceId: string }
  | { type: 'set_experience_name'; name: string }
  | { type: 'set_intro_sequence'; id: string }
  | { type: 'set_intro_name'; name: string }
  | { type: 'set_intro_setting'; key: string; value: unknown }
  | { type: 'set_behaviour_default'; behaviourId: string; key: string; value: unknown }
  | { type: 'set_section_behaviours'; key: string; assignments: BehaviourAssignment[] }
  | { type: 'remove_section_key'; key: string }
  | { type: 'add_section_key'; key: string }
  | { type: 'set_chrome_behaviours'; key: string; assignments: BehaviourAssignment[] }
  | { type: 'remove_chrome_key'; key: string }
  | { type: 'add_chrome_key'; key: string }
  | { type: 'mark_clean' }

function createInitialDraft(experienceId: string): DefaultsDraft {
  const exp = experienceId ? getExperience(experienceId) : undefined
  return {
    experienceId,
    experienceName: null,
    introSequenceId: null,
    introName: null,
    introSettingChanges: {},
    behaviourDefaultChanges: {},
    sectionBehaviours: exp?.sectionBehaviours
      ? JSON.parse(JSON.stringify(exp.sectionBehaviours))
      : {},
    chromeBehaviours: exp?.chromeBehaviours
      ? JSON.parse(JSON.stringify(exp.chromeBehaviours))
      : {},
    isDirty: false,
  }
}

function draftReducer(state: DefaultsDraft, action: DraftAction): DefaultsDraft {
  switch (action.type) {
    case 'init':
      return createInitialDraft(action.experienceId)

    case 'set_experience_name':
      return { ...state, experienceName: action.name, isDirty: true }

    case 'set_intro_sequence':
      return { ...state, introSequenceId: action.id, isDirty: true }

    case 'set_intro_name':
      return { ...state, introName: action.name, isDirty: true }

    case 'set_intro_setting':
      return {
        ...state,
        introSettingChanges: { ...state.introSettingChanges, [action.key]: action.value },
        isDirty: true,
      }

    case 'set_behaviour_default':
      return {
        ...state,
        behaviourDefaultChanges: {
          ...state.behaviourDefaultChanges,
          [action.behaviourId]: {
            ...(state.behaviourDefaultChanges[action.behaviourId] ?? {}),
            [action.key]: action.value,
          },
        },
        isDirty: true,
      }

    case 'set_section_behaviours':
      return {
        ...state,
        sectionBehaviours: { ...state.sectionBehaviours, [action.key]: action.assignments },
        isDirty: true,
      }

    case 'remove_section_key': {
      const { [action.key]: _, ...rest } = state.sectionBehaviours
      return { ...state, sectionBehaviours: rest, isDirty: true }
    }

    case 'add_section_key':
      return {
        ...state,
        sectionBehaviours: { ...state.sectionBehaviours, [action.key]: [] },
        isDirty: true,
      }

    case 'set_chrome_behaviours':
      return {
        ...state,
        chromeBehaviours: { ...state.chromeBehaviours, [action.key]: action.assignments },
        isDirty: true,
      }

    case 'remove_chrome_key': {
      const { [action.key]: _, ...rest } = state.chromeBehaviours
      return { ...state, chromeBehaviours: rest, isDirty: true }
    }

    case 'add_chrome_key':
      return {
        ...state,
        chromeBehaviours: { ...state.chromeBehaviours, [action.key]: [] },
        isDirty: true,
      }

    case 'mark_clean':
      return { ...state, isDirty: false }

    default:
      return state
  }
}

// =============================================================================
// Shared BehaviourList (defaults mode only — no override indicators)
// =============================================================================

const allBehaviourMetas = getAllBehaviourMetas().filter((m) => !m.id.startsWith('intro/'))

interface BehaviourListProps {
  assignments: BehaviourAssignment[]
  onAdd: (behaviourId: string) => void
  onRemove: (idx: number) => void
  onChange: (idx: number, behaviourId: string) => void
  onOptionChange: (idx: number, key: string, value: unknown) => void
  onDefaultChange?: (behaviourId: string, key: string, value: unknown) => void
}

function BehaviourList({
  assignments,
  onAdd,
  onRemove,
  onChange,
  onOptionChange,
  onDefaultChange,
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
              values={defaults}
              onChange={(key, value) => onDefaultChange?.(assignment.behaviour, key, value)}
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
// Experience Section (defaults mode)
// =============================================================================

function ExperienceSection({
  draft,
  dispatch,
}: {
  draft: DefaultsDraft
  dispatch: React.Dispatch<DraftAction>
}) {
  const experienceItems = useMemo(() => getAllExperienceMetas(), [])
  const activeId = draft.experienceId
  const activeItem = experienceItems.find((i) => i.id === activeId)
  const [creatingExperience, setCreatingExperience] = useState(false)

  const displayName = draft.experienceName ?? activeItem?.name ?? ''

  const handleNewExperience = useCallback(async () => {
    const id = prompt('Experience ID (kebab-case):')
    if (!id) return
    const name = prompt('Display name:', id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '))
    if (!name) return
    setCreatingExperience(true)
    const result = await createExperienceAction(id, name)
    setCreatingExperience(false)
    if (!result.ok) {
      alert(result.error)
    }
  }, [])

  return (
    <CollapsibleSection label="Experience" defaultOpen>
      <div className="da-field-group">
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <select
            value={activeId}
            onChange={(e) => dispatch({ type: 'init', experienceId: e.target.value })}
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
          <button
            className="da-btn-add"
            style={{ width: 'auto', padding: '4px 8px', whiteSpace: 'nowrap' }}
            onClick={handleNewExperience}
            disabled={creatingExperience}
          >
            + New
          </button>
        </div>
        {activeId && (
          <input
            className="da-name-input"
            value={displayName}
            onChange={(e) => dispatch({ type: 'set_experience_name', name: e.target.value })}
            placeholder="Experience name (saved to source)"
          />
        )}
        {activeItem?.description && (
          <div className="da-muted">{activeItem.description}</div>
        )}
      </div>
    </CollapsibleSection>
  )
}

// =============================================================================
// Intro Sequence Section (defaults mode)
// =============================================================================

function IntroSection({
  draft,
  dispatch,
}: {
  draft: DefaultsDraft
  dispatch: React.Dispatch<DraftAction>
}) {
  const sequences = useMemo(() => getAllIntroSequenceMetas(), [])
  const [creatingIntro, setCreatingIntro] = useState(false)

  const activeSequenceId = draft.introSequenceId ?? 'none'
  const activeEntry = activeSequenceId !== 'none'
    ? getIntroSequenceEntry(activeSequenceId)
    : null

  const activeMetaName = activeEntry?.meta.name ?? ''
  const introDisplayName = draft.introName ?? activeMetaName

  const handleNewIntro = useCallback(async () => {
    const id = prompt('Intro sequence ID (kebab-case):')
    if (!id) return
    const name = prompt('Display name:', id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '))
    if (!name) return
    setCreatingIntro(true)
    const result = await createIntroSequenceAction(id, name)
    setCreatingIntro(false)
    if (!result.ok) {
      alert(result.error)
    }
  }, [])

  return (
    <CollapsibleSection label="Intro Sequence" defaultOpen>
      <div className="da-field-group">
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <select
            value={activeSequenceId}
            onChange={(e) => {
              const id = e.target.value
              dispatch({ type: 'set_intro_sequence', id: id === 'none' ? '' : id })
            }}
            className="da-select"
            style={{ flex: 1 }}
          >
            <option value="none">None</option>
            {sequences.map((seq) => (
              <option key={seq.id} value={seq.id}>
                {seq.name} ({seq.category ?? seq.id})
              </option>
            ))}
          </select>
          <button
            className="da-btn-add"
            style={{ width: 'auto', padding: '4px 8px', whiteSpace: 'nowrap' }}
            onClick={handleNewIntro}
            disabled={creatingIntro}
          >
            + New
          </button>
        </div>

        {activeSequenceId !== 'none' && (
          <input
            className="da-name-input"
            value={introDisplayName}
            onChange={(e) => dispatch({ type: 'set_intro_name', name: e.target.value })}
            placeholder="Intro name (saved to source)"
          />
        )}

        {activeEntry?.meta.settings && Object.keys(activeEntry.meta.settings).length > 0 && (
          <SettingsEditor
            settings={activeEntry.meta.settings}
            values={{
              ...Object.fromEntries(
                Object.entries(activeEntry.meta.settings).map(([k, v]) => [k, (v as { default: unknown })?.default])
              ),
              ...(activeEntry.config.settings ?? {}),
              ...draft.introSettingChanges,
            }}
            onChange={(key, value) => dispatch({ type: 'set_intro_setting', key, value })}
          />
        )}

        {activeEntry?.config.overlay && (
          <div className="da-kv">
            <span className="da-kv__label">Overlay:</span>
            <span className="da-kv__value">{activeEntry.config.overlay.component}</span>
          </div>
        )}
      </div>
    </CollapsibleSection>
  )
}

// =============================================================================
// Section Behaviours (defaults mode)
// =============================================================================

function DefaultsSectionBehaviours({
  draft,
  dispatch,
}: {
  draft: DefaultsDraft
  dispatch: React.Dispatch<DraftAction>
}) {
  const sectionKeys = Object.keys(draft.sectionBehaviours)

  const handleAddKey = useCallback(() => {
    const key = prompt('Section key (section ID or * for default):')
    if (!key) return
    if (draft.sectionBehaviours[key]) {
      alert(`Key "${key}" already exists.`)
      return
    }
    dispatch({ type: 'add_section_key', key })
  }, [draft.sectionBehaviours, dispatch])

  return (
    <CollapsibleSection label="Section Behaviours" count={sectionKeys.length}>
      {sectionKeys.map((key) => (
        <DefaultsBehaviourRow
          key={key}
          rowKey={key}
          label={key === '*' ? '* (default)' : key}
          assignments={draft.sectionBehaviours[key]}
          onAssignmentsChange={(a) => dispatch({ type: 'set_section_behaviours', key, assignments: a })}
          onRemoveKey={() => dispatch({ type: 'remove_section_key', key })}
          onDefaultChange={(behaviourId, k, v) =>
            dispatch({ type: 'set_behaviour_default', behaviourId, key: k, value: v })
          }
        />
      ))}
      <button onClick={handleAddKey} className="da-btn-add">
        + Add Section Key
      </button>
    </CollapsibleSection>
  )
}

// =============================================================================
// Chrome Behaviours (defaults mode)
// =============================================================================

function DefaultsChromeBehaviours({
  draft,
  dispatch,
}: {
  draft: DefaultsDraft
  dispatch: React.Dispatch<DraftAction>
}) {
  const chromeKeys = Object.keys(draft.chromeBehaviours)

  const handleAddKey = useCallback(() => {
    const key = prompt('Chrome region key (e.g. header, footer, sidebar):')
    if (!key) return
    if (draft.chromeBehaviours[key]) {
      alert(`Key "${key}" already exists.`)
      return
    }
    dispatch({ type: 'add_chrome_key', key })
  }, [draft.chromeBehaviours, dispatch])

  if (chromeKeys.length === 0 && !draft.isDirty) {
    return (
      <CollapsibleSection label="Chrome Behaviours" count={0}>
        <div className="da-muted">No chrome behaviours defined</div>
        <button onClick={handleAddKey} className="da-btn-add">
          + Add Chrome Key
        </button>
      </CollapsibleSection>
    )
  }

  return (
    <CollapsibleSection label="Chrome Behaviours" count={chromeKeys.length}>
      {chromeKeys.map((key) => (
        <DefaultsBehaviourRow
          key={key}
          rowKey={key}
          label={key}
          assignments={draft.chromeBehaviours[key]}
          onAssignmentsChange={(a) => dispatch({ type: 'set_chrome_behaviours', key, assignments: a })}
          onRemoveKey={() => dispatch({ type: 'remove_chrome_key', key })}
          onDefaultChange={(behaviourId, k, v) =>
            dispatch({ type: 'set_behaviour_default', behaviourId, key: k, value: v })
          }
        />
      ))}
      <button onClick={handleAddKey} className="da-btn-add">
        + Add Chrome Key
      </button>
    </CollapsibleSection>
  )
}

// =============================================================================
// Defaults Behaviour Row
// =============================================================================

interface DefaultsBehaviourRowProps {
  rowKey: string
  label: string
  assignments: BehaviourAssignment[]
  onAssignmentsChange: (assignments: BehaviourAssignment[]) => void
  onRemoveKey: () => void
  onDefaultChange: (behaviourId: string, key: string, value: unknown) => void
}

function DefaultsBehaviourRow({
  rowKey,
  label,
  assignments,
  onAssignmentsChange,
  onRemoveKey,
  onDefaultChange,
}: DefaultsBehaviourRowProps) {
  const [open, setOpen] = useState(false)

  const handleAdd = useCallback((behaviourId: string) => {
    onAssignmentsChange([...assignments, { behaviour: behaviourId }])
  }, [assignments, onAssignmentsChange])

  const handleRemove = useCallback((idx: number) => {
    onAssignmentsChange(assignments.filter((_, i) => i !== idx))
  }, [assignments, onAssignmentsChange])

  const handleChange = useCallback((idx: number, behaviourId: string) => {
    onAssignmentsChange(assignments.map((a, i) =>
      i === idx ? { ...a, behaviour: behaviourId, options: undefined } : a,
    ))
  }, [assignments, onAssignmentsChange])

  const handleOptionChange = useCallback((idx: number, key: string, value: unknown) => {
    onAssignmentsChange(assignments.map((a, i) =>
      i === idx ? { ...a, options: { ...a.options, [key]: value } } : a,
    ))
  }, [assignments, onAssignmentsChange])

  return (
    <div className="da-behaviour-row">
      <button className="da-behaviour-row__toggle" onClick={() => setOpen((v) => !v)}>
        <span className="da-collapsible__arrow" data-open={open}>&#9656;</span>
        <span className="da-behaviour-row__label">{label}</span>
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
            onDefaultChange={onDefaultChange}
          />
          <button
            onClick={onRemoveKey}
            className="da-btn-add"
            style={{ color: 'rgba(255, 120, 100, 0.7)', borderColor: 'rgba(255, 120, 100, 0.2)', marginTop: 4 }}
          >
            Remove &quot;{rowKey}&quot; key
          </button>
        </div>
      )}
    </div>
  )
}

// =============================================================================
// Save Defaults Bar
// =============================================================================

function SaveDefaultsBar({
  draft,
  dispatch,
}: {
  draft: DefaultsDraft
  dispatch: React.Dispatch<DraftAction>
}) {
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  const handleSave = useCallback(async () => {
    setSaving(true)
    setStatus(null)
    const errors: string[] = []

    try {
      if (draft.experienceName !== null) {
        const result = await saveExperienceName(draft.experienceId, draft.experienceName)
        if (!result.ok) errors.push(`Experience name: ${result.error}`)
      }

      if (draft.introName !== null && draft.introSequenceId) {
        const result = await saveIntroSequenceName(draft.introSequenceId, draft.introName)
        if (!result.ok) errors.push(`Intro name: ${result.error}`)
      }

      const introSeqId = draft.introSequenceId
      if (introSeqId) {
        for (const [key, value] of Object.entries(draft.introSettingChanges)) {
          const result = await saveIntroSequenceSetting(introSeqId, key, value)
          if (!result.ok) errors.push(`Intro setting "${key}": ${result.error}`)
        }
      }

      for (const [behaviourId, changes] of Object.entries(draft.behaviourDefaultChanges)) {
        for (const [key, value] of Object.entries(changes)) {
          const result = await saveBehaviourDefault(behaviourId, key, value)
          if (!result.ok) errors.push(`Behaviour "${behaviourId}" default "${key}": ${result.error}`)
        }
      }

      const result = await saveExperienceBehaviours(
        draft.experienceId,
        draft.sectionBehaviours,
        draft.chromeBehaviours,
      )
      if (!result.ok) errors.push(`Behaviours structure: ${result.error}`)

      if (errors.length > 0) {
        setStatus(`Errors: ${errors.join('; ')}`)
        console.error('Save defaults errors:', errors)
      } else {
        setStatus('Saved')
        dispatch({ type: 'mark_clean' })
        setTimeout(() => setStatus(null), 2000)
      }
    } catch (e) {
      setStatus(`Error: ${String(e)}`)
    } finally {
      setSaving(false)
    }
  }, [draft, dispatch])

  return (
    <div className="da-save-defaults-bar">
      <button
        className="da-save-defaults-btn"
        onClick={handleSave}
        disabled={saving || !draft.isDirty}
      >
        {saving ? 'Saving...' : 'Save Defaults'}
      </button>
      {draft.isDirty && !saving && !status && (
        <span className="da-defaults-dirty">unsaved changes</span>
      )}
      {status && (
        <span className={`da-defaults-status${status === 'Saved' ? ' da-defaults-status--ok' : ''}`}>
          {status}
        </span>
      )}
    </div>
  )
}

// =============================================================================
// DefaultsTab (main export)
// =============================================================================

export default function DefaultsTab() {
  const experienceItems = useMemo(() => getAllExperienceMetas(), [])
  const initialExpId = experienceItems[0]?.id ?? ''
  const [draft, dispatch] = useReducer(draftReducer, initialExpId, createInitialDraft)

  return (
    <div className="da-experience-tab">
      <ExperienceSection draft={draft} dispatch={dispatch} />
      <IntroSection draft={draft} dispatch={dispatch} />
      <DefaultsSectionBehaviours draft={draft} dispatch={dispatch} />
      <DefaultsChromeBehaviours draft={draft} dispatch={dispatch} />
      <SaveDefaultsBar draft={draft} dispatch={dispatch} />
    </div>
  )
}
