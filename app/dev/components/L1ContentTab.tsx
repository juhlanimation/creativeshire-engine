/**
 * L1 Content tab — editable view of preset structure.
 * Pages (with sections), chrome regions, and overlays.
 * Phase 2: full CRUD with pattern picker and inline editing.
 */

'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import type { SitePreset, PresetRegionConfig, PresetOverlayConfig } from '../../../engine/presets/types'
import type { SectionSchema } from '../../../engine/schema/section'
import { getSectionPattern } from '../../../engine/content/sections/registry'
import { getSectionsGroupedByCategory, getAvailableOverlayPatterns } from '../../../engine/interface/discovery'
import { getChromePatternsBySlot, chromePatternRegistry } from '../../../engine/content/chrome/pattern-registry'
import { collectTriggerableWidgets } from '../../../engine/content/actions/scanner'
import type { TriggerableWidget } from '../../../engine/content/actions/scanner'
import { getActionResolution } from '../../../engine/content/actions/resolver'
import { useAuthoring, useLockedOverlayIds } from './devAuthoringStore'
import { CollapsibleSection } from './CollapsibleSection'

// =============================================================================
// Section Pattern Picker
// =============================================================================

interface SectionPickerProps {
  existingSections: SectionSchema[]
  onAdd: (section: SectionSchema) => Promise<void> | void
  onCancel: () => void
}

function SectionPicker({ existingSections, onAdd, onCancel }: SectionPickerProps) {
  const [loading, setLoading] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  // Uses discovery API — returns grouped sections with canAdd/reason
  const grouped = getSectionsGroupedByCategory(existingSections)

  // Close on outside click (check against parent anchor, not just the list)
  useEffect(() => {
    const handle = (e: MouseEvent) => {
      const anchor = listRef.current?.parentElement
      if (anchor && !anchor.contains(e.target as Node)) {
        onCancel()
      }
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [onCancel])

  const handleSelect = useCallback(async (patternId: string) => {
    const entry = getSectionPattern(patternId)
    if (!entry) return

    setLoading(true)
    try {
      const factory = await entry.getFactory()
      // Derive section ID (camelCase convention: Hero → hero, ProjectGrid → projectGrid)
      const sectionId = patternId[0].toLowerCase() + patternId.slice(1)
      // Build binding expressions for all settings so the contract auto-generates
      const props: Record<string, unknown> = {}
      if (entry.meta.settings) {
        for (const key of Object.keys(entry.meta.settings)) {
          props[key] = `{{ content.${sectionId}.${key} }}`
        }
      }
      const section = factory(props)
      section.patternId = patternId
      onAdd(section)
    } catch (e) {
      console.error('[SectionPicker] Factory error:', e)
    } finally {
      setLoading(false)
    }
  }, [onAdd])

  if (loading) {
    return <span className="da-muted">Adding...</span>
  }

  return (
    <div ref={listRef} className="da-dropdown-list">
      {Object.entries(grouped).map(([category, items]) => {
        if (items.length === 0) return null
        const allBlocked = items.every((s) => !s.canAdd)
        const label = category.charAt(0).toUpperCase() + category.slice(1)
        return (
          <div key={category} className="da-dropdown-list__group">
            <div className="da-dropdown-list__label">
              {allBlocked ? `${label} (used)` : label}
            </div>
            {items.map((section) => (
              <button
                key={section.id}
                className="da-dropdown-list__item"
                disabled={!section.canAdd}
                onClick={() => handleSelect(section.id)}
              >
                {section.name}{!section.canAdd ? ' — already added' : ''}
              </button>
            ))}
          </div>
        )
      })}
    </div>
  )
}

// =============================================================================
// Inline Slug Editor
// =============================================================================

interface SlugEditorProps {
  slug: string
  onSave: (slug: string) => void
  validate?: (slug: string) => string | null
}

function SlugEditor({ slug, onSave, validate }: SlugEditorProps) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(slug)
  const [error, setError] = useState('')

  const trySave = () => {
    const err = validate?.(value)
    if (err) { setError(err); return }
    onSave(value)
    setEditing(false)
    setError('')
  }

  if (!editing) {
    return (
      <button
        className="da-slug-edit"
        onClick={() => { setValue(slug); setEditing(true); setError('') }}
        title="Click to edit slug"
      >
        {slug}
      </button>
    )
  }

  return (
    <span className="da-slug-editor-wrap">
      <input
        className={`da-slug-input${error ? ' da-slug-input--error' : ''}`}
        value={value}
        onChange={(e) => { setValue(e.target.value); setError('') }}
        onBlur={trySave}
        onKeyDown={(e) => {
          if (e.key === 'Enter') trySave()
          if (e.key === 'Escape') { setEditing(false); setError('') }
        }}
        autoFocus
        size={Math.max(value.length + 2, 4)}
        title={error || undefined}
      />
    </span>
  )
}

// =============================================================================
// Add Page Form
// =============================================================================

interface AddPageFormProps {
  existingPages: Record<string, { slug: string }>
  onAdd: (id: string, slug: string) => void
  onCancel: () => void
}

function AddPageForm({ existingPages, onAdd, onCancel }: AddPageFormProps) {
  const [id, setId] = useState('')
  const [slug, setSlug] = useState('/')
  const [error, setError] = useState('')

  const handleSubmit = () => {
    const trimmedId = id.trim()
    const trimmedSlug = slug.trim() || '/'

    if (!trimmedId) return

    if (existingPages[trimmedId]) {
      setError(`Page "${trimmedId}" already exists`)
      return
    }

    const slugTaken = Object.values(existingPages).some((p) => p.slug === trimmedSlug)
    if (slugTaken) {
      setError(`Slug "${trimmedSlug}" is already in use`)
      return
    }

    onAdd(trimmedId, trimmedSlug)
  }

  return (
    <div className="da-inline-form da-inline-form--col">
      <div className="da-inline-form">
        <input
          className="da-slug-input"
          placeholder="page-id"
          value={id}
          onChange={(e) => { setId(e.target.value); setError('') }}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          autoFocus
          size={12}
        />
        <input
          className="da-slug-input"
          placeholder="/slug"
          value={slug}
          onChange={(e) => { setSlug(e.target.value); setError('') }}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          size={8}
        />
        <button className="da-btn-sm da-btn-sm--primary" onClick={handleSubmit}>
          Add
        </button>
        <button className="da-btn-sm" onClick={onCancel}>
          Cancel
        </button>
      </div>
      {error && <span className="da-form-error">{error}</span>}
    </div>
  )
}

// =============================================================================
// Section Triggers (per-section inline trigger wiring)
// =============================================================================

interface SectionTriggersProps {
  pageId: string
  sectionIndex: number
  section: SectionSchema
  availableActions: Array<{ actionId: string; patternId: string; overlayKey: string }>
  overlayKeys: string[]
  onSetTrigger: (pageId: string, sectionIndex: number, widgetPath: string[], event: string, actionId: string | null) => void
}

function SectionTriggers({ pageId, sectionIndex, section, availableActions, overlayKeys, onSetTrigger }: SectionTriggersProps) {
  const [open, setOpen] = useState(false)

  // Collect triggerable widgets for just this section
  const singlePage = { [pageId]: { slug: '/', sections: [section] } }
  const triggerables = collectTriggerableWidgets(singlePage as Record<string, import('../../../engine/schema/page').PageSchema>)
    // Fix sectionIndex back to the real one (scanner sees index 0 since we passed a single-section page)
    .map((tw) => ({ ...tw, sectionIndex }))

  if (triggerables.length === 0) return null

  const wiredCount = triggerables.reduce((sum, tw) => sum + Object.keys(tw.currentOn).length, 0)
  const totalSlots = triggerables.reduce((sum, tw) => sum + tw.triggers.length, 0)

  // Check for unresolved actions
  const wiredActionIds = triggerables.flatMap((tw) =>
    Object.values(tw.currentOn).flatMap((v) => (Array.isArray(v) ? v : [v]))
  )
  const unresolvedCount = wiredActionIds.filter((id) => {
    const res = getActionResolution(id, overlayKeys)
    return !res.resolved
  }).length

  return (
    <div className="da-section-triggers">
      <button
        className="da-section-triggers__toggle"
        onClick={() => setOpen(!open)}
      >
        <span className={`da-chevron${open ? ' da-chevron--open' : ''}`}>&#9656;</span>
        <span className="da-section-triggers__label">Triggers</span>
        <span className={`da-section-triggers__count${wiredCount === totalSlots ? ' da-section-triggers__count--complete' : ''}`}>
          {wiredCount}/{totalSlots} wired
        </span>
        {unresolvedCount > 0 && (
          <span className="da-section-triggers__warn" title={`${unresolvedCount} unresolved action(s)`}>
            !
          </span>
        )}
      </button>
      {open && (
        <div className="da-section-triggers__body">
          {triggerables.map((tw) => (
            <TriggerableWidgetRow
              key={`${tw.sectionIndex}:${tw.widgetPath.join('.')}`}
              widget={tw}
              availableActions={availableActions}
              onSetTrigger={(event, actionId) =>
                onSetTrigger(pageId, tw.sectionIndex, tw.widgetPath, event, actionId)
              }
              compact
            />
          ))}
        </div>
      )}
    </div>
  )
}

// =============================================================================
// Draggable Section List
// =============================================================================

interface SectionListProps {
  pageId: string
  sections: SectionSchema[]
  onReorder: (from: number, to: number) => void
  onRemove: (index: number) => void
  onAdd: (section: SectionSchema) => Promise<void> | void
  addingSectionFor: string | null
  setAddingSectionFor: (pageId: string | null) => void
}

function SectionList({ pageId, sections, onReorder, onRemove, onAdd, addingSectionFor, setAddingSectionFor }: SectionListProps) {
  const { preset, setWidgetTrigger } = useAuthoring()
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dropIndex, setDropIndex] = useState<number | null>(null)

  // Compute available actions once for all sections
  const overlayKeys = Object.keys(preset?.chrome.overlays ?? {})
  const availableActions = getAvailableActions(overlayKeys)

  const handleDragStart = (e: React.DragEvent, i: number) => {
    setDragIndex(i)
    e.dataTransfer.effectAllowed = 'move'
    // Minimal drag image setup
    if (e.currentTarget instanceof HTMLElement) {
      e.dataTransfer.setDragImage(e.currentTarget, 0, 0)
    }
  }

  const handleDragOver = (e: React.DragEvent, i: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragIndex !== null && i !== dragIndex) {
      setDropIndex(i)
    }
  }

  const handleDrop = (e: React.DragEvent, i: number) => {
    e.preventDefault()
    if (dragIndex !== null && dragIndex !== i) {
      onReorder(dragIndex, i)
    }
    setDragIndex(null)
    setDropIndex(null)
  }

  const handleDragEnd = () => {
    setDragIndex(null)
    setDropIndex(null)
  }

  return (
    <div className="da-page__sections">
      {sections.length === 0 ? (
        <div className="da-empty">No sections</div>
      ) : (
        sections.map((section, i) => (
          <div key={`${section.id}-${i}`}>
            <div
              className={
                'da-item da-item--editable da-item--draggable'
                + (dragIndex === i ? ' da-item--dragging' : '')
                + (dropIndex === i ? ' da-item--drop-target' : '')
              }
              draggable
              onDragStart={(e) => handleDragStart(e, i)}
              onDragOver={(e) => handleDragOver(e, i)}
              onDrop={(e) => handleDrop(e, i)}
              onDragEnd={handleDragEnd}
            >
              <span className="da-drag-handle" title="Drag to reorder">⠿</span>
              <span className="da-item__name">{section.id}</span>
              {section.patternId && (
                <span className="da-item__badge">{section.patternId}</span>
              )}
              <span className="da-item__meta">{section.widgets.length}w</span>
              <div className="da-item__actions">
                <button
                  className="da-btn-icon da-btn-icon--danger"
                  onClick={() => onRemove(i)}
                  title="Remove section"
                >
                  x
                </button>
              </div>
            </div>
            <SectionTriggers
              section={section}
              pageId={pageId}
              sectionIndex={i}
              availableActions={availableActions}
              overlayKeys={overlayKeys}
              onSetTrigger={setWidgetTrigger}
            />
          </div>
        ))
      )}

      <div className="da-add-section-anchor">
        <button
          className={`da-btn-add${addingSectionFor === pageId ? ' da-btn-add--active' : ''}`}
          onClick={() => setAddingSectionFor(addingSectionFor === pageId ? null : pageId)}
        >
          + Add Section
        </button>
        {addingSectionFor === pageId && (
          <SectionPicker
            existingSections={sections}
            onAdd={async (section) => { await onAdd(section); setAddingSectionFor(null) }}
            onCancel={() => setAddingSectionFor(null)}
          />
        )}
      </div>
    </div>
  )
}

// =============================================================================
// Page Tree (editable)
// =============================================================================

interface PageTreeProps {
  preset: SitePreset
  activePageId: string | null
  onSelectPage: (id: string | null) => void
}

function PageTree({ preset, activePageId, onSelectPage }: PageTreeProps) {
  const {
    addPage,
    removePage,
    renamePage,
    reorderPages,
    setPageSlug,
    addSectionWithOverlays,
    removeSection,
    reorderSections,
  } = useAuthoring()

  const [showAddPage, setShowAddPage] = useState(false)
  const [addingSectionFor, setAddingSectionFor] = useState<string | null>(null)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dropIndex, setDropIndex] = useState<number | null>(null)

  const pageEntries = Object.entries(preset.pages)

  const handlePageDragStart = (e: React.DragEvent, i: number) => {
    setDragIndex(i)
    e.dataTransfer.effectAllowed = 'move'
    if (e.currentTarget instanceof HTMLElement) {
      e.dataTransfer.setDragImage(e.currentTarget, 0, 0)
    }
  }

  const handlePageDragOver = (e: React.DragEvent, i: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragIndex !== null && i !== dragIndex) setDropIndex(i)
  }

  const handlePageDrop = (e: React.DragEvent, i: number) => {
    e.preventDefault()
    if (dragIndex !== null && dragIndex !== i) reorderPages(dragIndex, i)
    setDragIndex(null)
    setDropIndex(null)
  }

  const handlePageDragEnd = () => {
    setDragIndex(null)
    setDropIndex(null)
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
        <button
          className="da-btn-sm da-btn-sm--header"
          onClick={() => setShowAddPage(true)}
          title="Add page"
        >
          + Page
        </button>
      </div>

      {showAddPage && (
        <AddPageForm
          existingPages={preset.pages}
          onAdd={(id, slug) => { addPage(id, slug); setShowAddPage(false) }}
          onCancel={() => setShowAddPage(false)}
        />
      )}

      <div className="da-section__body">
        {pageEntries.map(([pageId, page], i) => {
          const isActive = activePageId === pageId
          return (
            <div
              key={pageId}
              className={
                'da-page da-page--draggable'
                + (dragIndex === i ? ' da-page--dragging' : '')
                + (dropIndex === i ? ' da-page--drop-target' : '')
              }
              draggable
              onDragStart={(e) => handlePageDragStart(e, i)}
              onDragOver={(e) => handlePageDragOver(e, i)}
              onDrop={(e) => handlePageDrop(e, i)}
              onDragEnd={handlePageDragEnd}
            >
              <div
                className={`da-page__header ${isActive ? 'da-page__header--active' : ''}`}
              >
                <span className="da-drag-handle" title="Drag to reorder">⠿</span>
                <button
                  className="da-page__toggle"
                  onClick={() => onSelectPage(isActive ? null : pageId)}
                  title={isActive ? 'Collapse' : 'Expand'}
                >
                  <span className={`da-chevron${isActive ? ' da-chevron--open' : ''}`}>&#9656;</span>
                </button>
                <SlugEditor
                  slug={pageId}
                  onSave={(newId) => renamePage(pageId, newId)}
                  validate={(s) => {
                    if (!s.trim()) return 'ID cannot be empty'
                    if (s !== pageId && preset.pages[s]) return 'Page ID already exists'
                    if (!/^[a-z0-9-]+$/.test(s)) return 'Use lowercase, numbers, hyphens'
                    return null
                  }}
                />
                <SlugEditor
                  slug={page.slug}
                  onSave={(slug) => setPageSlug(pageId, slug)}
                  validate={(s) => {
                    const taken = Object.entries(preset.pages).some(([id, p]) => id !== pageId && p.slug === s)
                    return taken ? 'Slug already in use' : null
                  }}
                />
                <span className="da-page__count">{page.sections.length}s</span>
                <button
                  className="da-btn-icon da-btn-icon--danger"
                  onClick={() => removePage(pageId)}
                  title="Remove page"
                >
                  x
                </button>
              </div>

              {isActive && (
                <SectionList
                  pageId={pageId}
                  sections={page.sections}
                  onReorder={(from, to) => reorderSections(pageId, from, to)}
                  onRemove={(i) => removeSection(pageId, i)}
                  onAdd={async (section) => { await addSectionWithOverlays(pageId, section) }}
                  addingSectionFor={addingSectionFor}
                  setAddingSectionFor={setAddingSectionFor}
                />
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}

// =============================================================================
// Chrome View (editable)
// =============================================================================

interface ChromeViewProps {
  preset: SitePreset
}

function overlaySummary(config: PresetOverlayConfig): string {
  if (config.widget) return config.widget.type
  if (config.component) return config.component
  return 'empty'
}

function ChromeView({ preset }: ChromeViewProps) {
  const { chromePatternIds, setChromeRegion, setChromeRegionFromPattern, addChromeOverlayFromPattern, removeChromeOverlay, autoInjectedOverlays } = useAuthoring()
  const [showAddOverlay, setShowAddOverlay] = useState(false)
  const lockedOverlayIds = useLockedOverlayIds()

  const regions = preset.chrome.regions
  const overlays = preset.chrome.overlays ?? {}
  const overlayEntries = Object.entries(overlays)

  // Build map of locked overlay ID → section names that require it (for tooltip)
  const lockedByMap = new Map<string, string[]>()
  for (const page of Object.values(preset.pages)) {
    for (const section of page.sections) {
      if (!section.patternId) continue
      const entry = getSectionPattern(section.patternId)
      if (!entry?.meta.requiredOverlays) continue
      for (const patternId of entry.meta.requiredOverlays) {
        const key = patternId.charAt(0).toLowerCase() + patternId.slice(1)
        const existing = lockedByMap.get(key) ?? []
        const name = entry.meta.name ?? section.patternId
        if (!existing.includes(name)) existing.push(name)
        lockedByMap.set(key, existing)
      }
    }
  }

  /** Check if a region slot has content but no tracked pattern */
  function hasCustomContent(config: PresetRegionConfig | 'hidden' | undefined): boolean {
    if (!config || config === 'hidden') return false
    return !!(config.widgets?.length)
  }

  return (
    <div className="da-chrome">
      {/* Chrome Slots — pattern pickers */}
      <div className="da-section">
        <div className="da-section__header">
          <span className="da-section__title">Chrome Slots</span>
        </div>
        <div className="da-section__body">
          {/* Region slots: header, footer */}
          {(['header', 'footer'] as const).map((regionId) => {
            const config = regions[regionId]
            const slotPatterns = getChromePatternsBySlot(regionId)
            const trackedId = chromePatternIds[regionId] ?? ''
            const isCustom = !trackedId && hasCustomContent(config)
            const selectValue = trackedId || (isCustom ? '__custom' : '')
            return (
              <div key={regionId} className="da-region-slot">
                <span className="da-region-slot__label">{regionId}</span>
                {slotPatterns.length > 0 ? (
                  <select
                    className="da-select da-select--slot"
                    value={selectValue}
                    onChange={(e) => {
                      const val = e.target.value
                      if (!val) {
                        setChromeRegion(regionId, 'hidden')
                      } else {
                        setChromeRegionFromPattern(regionId, val)
                      }
                    }}
                  >
                    <option value="">None</option>
                    {isCustom && <option value="__custom" disabled>Custom</option>}
                    {slotPatterns.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                ) : (
                  <span className="da-muted">No {regionId} patterns</span>
                )}
              </div>
            )
          })}

        </div>
      </div>

      {/* Free Overlays */}
      <div className="da-section">
        <div className="da-section__header">
          <span className="da-section__title">Overlays</span>
          <span className="da-section__count">{overlayEntries.length}</span>
          <button
            className="da-btn-sm da-btn-sm--header"
            onClick={() => setShowAddOverlay(true)}
            title="Add overlay"
          >
            + Add
          </button>
        </div>

        {showAddOverlay && (
          <OverlayPatternPicker
            existingIds={Object.keys(overlays)}
            onAdd={(key, patternId) => { addChromeOverlayFromPattern(key, patternId); setShowAddOverlay(false) }}
            onCancel={() => setShowAddOverlay(false)}
          />
        )}

        <div className="da-section__body">
          {overlayEntries.length === 0 ? (
            <div className="da-empty">No overlays</div>
          ) : (
            overlayEntries.map(([overlayId, config]) => {
              const isLocked = lockedOverlayIds.has(overlayId)
              const lockedBy = lockedByMap.get(overlayId)
              // Find actions this overlay provides
              const overlayPatternActions = getOverlayProvidedActions(overlayId, config, Object.keys(overlays))
              return (
                <div key={overlayId}>
                  <div className="da-item da-item--editable">
                    <span className="da-item__name">{overlayId}</span>
                    <span className="da-item__badge">{overlaySummary(config)}</span>
                    {isLocked && (
                      <span
                        className="da-item__badge da-item__badge--locked"
                        title={lockedBy ? `Required by ${lockedBy.join(', ')}` : 'Required by section'}
                      >
                        locked
                      </span>
                    )}
                    {!isLocked && autoInjectedOverlays.has(overlayId) && (
                      <span className="da-item__badge da-item__badge--auto">auto</span>
                    )}
                    {config.position && (
                      <span className="da-item__meta">{config.position}</span>
                    )}
                    {isLocked ? (
                      <span
                        className="da-btn-icon da-btn-icon--disabled"
                        title={lockedBy ? `Required by ${lockedBy.join(', ')}` : 'Cannot remove — required by section'}
                      >
                        ⊘
                      </span>
                    ) : (
                      <button
                        className="da-btn-icon da-btn-icon--danger"
                        onClick={() => removeChromeOverlay(overlayId)}
                        title="Remove overlay"
                      >
                        x
                      </button>
                    )}
                  </div>
                  {overlayPatternActions.length > 0 && (
                    <div className="da-overlay-actions">
                      {overlayPatternActions.map((actionId) => (
                        <span key={actionId} className="da-overlay-actions__id">{actionId}</span>
                      ))}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>

    </div>
  )
}

// =============================================================================
// Trigger Helpers
// =============================================================================

/**
 * Get the expanded action IDs an overlay provides based on its pattern.
 * Uses getAvailableActions to find all expanded action IDs that reference
 * this overlay key — either via literal match or {key} template expansion.
 */
function getOverlayProvidedActions(overlayId: string, _config: PresetOverlayConfig, allOverlayKeys: string[]): string[] {
  const allActions = getAvailableActions(allOverlayKeys)
  return allActions
    .filter((a) => a.overlayKey === overlayId)
    .map((a) => a.actionId)
}

function getAvailableActions(overlayKeys: string[]): Array<{ actionId: string; patternId: string; overlayKey: string }> {
  const actions: Array<{ actionId: string; patternId: string; overlayKey: string }> = []
  for (const [patternId, entry] of Object.entries(chromePatternRegistry)) {
    if (!entry.meta.providesActions) continue
    for (const template of entry.meta.providesActions) {
      if (template.includes('{key}')) {
        // Expand template for each existing overlay that uses this pattern
        for (const key of overlayKeys) {
          const actionId = template.replace('{key}', key)
          actions.push({ actionId, patternId, overlayKey: key })
        }
      } else {
        const key = patternId.charAt(0).toLowerCase() + patternId.slice(1)
        actions.push({ actionId: template, patternId, overlayKey: key })
      }
    }
  }
  return actions
}

function TriggerableWidgetRow({
  widget,
  availableActions,
  onSetTrigger,
  compact,
}: {
  widget: TriggerableWidget
  availableActions: Array<{ actionId: string; patternId: string; overlayKey: string }>
  onSetTrigger: (event: string, actionId: string | null) => void
  compact?: boolean
}) {
  const breadcrumb = compact
    ? `(${widget.widgetId})`
    : `${widget.pageId} > ${widget.sectionId} > ${widget.widgetId}`

  return (
    <div className="da-trigger-widget">
      <div className="da-trigger-widget__header">
        <span className="da-trigger-widget__type">{widget.widgetType}</span>
        <span className="da-trigger-widget__breadcrumb">{breadcrumb}</span>
      </div>
      <div className="da-trigger-widget__events">
        {widget.triggers.map((event) => {
          const current = widget.currentOn[event]
          const currentId = Array.isArray(current) ? current[0] : current
          const isWired = !!currentId
          return (
            <div key={event} className="da-trigger-row">
              <span className={`da-trigger-row__dot ${isWired ? 'da-trigger-row__dot--wired' : ''}`} />
              <span className="da-trigger-row__event">{event}</span>
              <select
                className="da-select da-trigger-row__action"
                value={currentId ?? ''}
                onChange={(e) => {
                  const val = e.target.value
                  onSetTrigger(event, val || null)
                }}
              >
                <option value="">-- none --</option>
                {availableActions.map((a) => (
                  <option key={a.actionId} value={a.actionId}>{a.actionId}</option>
                ))}
              </select>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// =============================================================================
// Overlay Pattern Picker
// =============================================================================

interface OverlayPatternPickerProps {
  existingIds: string[]
  onAdd: (key: string, patternId: string) => void
  onCancel: () => void
}

function OverlayPatternPicker({ existingIds, onAdd, onCancel }: OverlayPatternPickerProps) {
  const [selectedId, setSelectedId] = useState('')

  const available = getAvailableOverlayPatterns().filter((m) => !existingIds.includes(m.id))

  return (
    <div className="da-inline-form">
      <select
        className="da-select da-pattern-picker"
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
      >
        <option value="">Select overlay pattern...</option>
        {available.map((meta) => (
          <option key={meta.id} value={meta.id}>{meta.name}</option>
        ))}
      </select>
      <button
        className="da-btn-sm da-btn-sm--primary"
        onClick={() => {
          if (!selectedId) return
          const overlayKey = selectedId.charAt(0).toLowerCase() + selectedId.slice(1)
          onAdd(overlayKey, selectedId)
        }}
        disabled={!selectedId}
      >
        Add
      </button>
      <button className="da-btn-sm" onClick={onCancel}>Cancel</button>
    </div>
  )
}

// =============================================================================
// L1 Content Tab
// =============================================================================

export default function L1ContentTab() {
  const { preset, activePageId, setActivePageId } = useAuthoring()

  if (!preset) {
    return <div className="da-empty-full">Select a preset to view its structure.</div>
  }

  const pageCount = Object.keys(preset.pages).length

  return (
    <div className="da-l1-tab">
      <CollapsibleSection label="Pages" defaultOpen count={pageCount}>
        <PageTree
          preset={preset}
          activePageId={activePageId}
          onSelectPage={setActivePageId}
        />
      </CollapsibleSection>
      <CollapsibleSection label="Chrome" defaultOpen>
        <ChromeView preset={preset} />
      </CollapsibleSection>
    </div>
  )
}
