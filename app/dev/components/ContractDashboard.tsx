/**
 * Preset Authoring Tool — main layout.
 * 3 top-level tabs: Defaults, Preset, Registry.
 * Preset tab has sub-tabs: L1 Content, L2 Experience, Contract.
 */

'use client'

import { useEffect, useRef, useMemo, useState, useCallback, lazy, Suspense } from 'react'
import { getAllPresetMetas, getPreset } from '../../../engine/presets/registry'
import ContractInspector from './ContractInspector'
import RegistryPanel from './RegistryPanel'
import L1ContentTab from './L1ContentTab'
import L2ExperienceTab from './L2ExperienceTab'
import DefaultsTab from './DefaultsTab'
import {
  useAuthoring,
  type AuthoringTab,
  type PresetSubTab,
  type RegistrySubTab,
} from './devAuthoringStore'
import './ContractDashboard.css'

const PreviewContainer = lazy(() => import('./PreviewContainer'))

// =============================================================================
// Tab Definitions
// =============================================================================

const MAIN_TABS: Array<{ id: AuthoringTab; label: string }> = [
  { id: 'defaults', label: 'Defaults' },
  { id: 'preset', label: 'Preset' },
  { id: 'registry', label: 'Registry' },
]

const PRESET_SUB_TABS: Array<{ id: PresetSubTab; label: string }> = [
  { id: 'l1-content', label: 'L1 Content' },
  { id: 'l2-experience', label: 'L2 Experience' },
  { id: 'contract', label: 'Contract' },
]

const REGISTRY_SUB_TABS: Array<{ id: RegistrySubTab; label: string }> = [
  { id: 'widgets', label: 'Widgets' },
  { id: 'chrome', label: 'Chrome' },
  { id: 'behaviours', label: 'Behaviours' },
  { id: 'sections', label: 'Sections' },
]

// =============================================================================
// Dashboard
// =============================================================================

export default function ContractDashboard() {
  const {
    activePresetId,
    preset: workingPreset,
    activeTab,
    presetSubTab,
    registrySubTab,
    activePageId,
    isDirty,
    isSaving,
    generatedContract,
    loadPreset,
    savePreset,
    createPreset,
    deletePreset,
    renamePreset,
    setActiveTab,
    setPresetSubTab,
    setRegistrySubTab,
    setActivePageId,
  } = useAuthoring()

  const [showNewPreset, setShowNewPreset] = useState(false)
  const [newPresetId, setNewPresetId] = useState('')
  const [newPresetName, setNewPresetName] = useState('')
  const [statusMsg, setStatusMsg] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [previewHeight, setPreviewHeight] = useState(360)
  const [isResizing, setIsResizing] = useState(false)
  const resizeStartRef = useRef<{ startY: number; startHeight: number } | null>(null)

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    resizeStartRef.current = { startY: e.clientY, startHeight: previewHeight }
    setIsResizing(true)
  }, [previewHeight])

  useEffect(() => {
    if (!isResizing) return
    const onMouseMove = (e: MouseEvent) => {
      if (!resizeStartRef.current) return
      const delta = resizeStartRef.current.startY - e.clientY
      const maxH = window.innerHeight * 0.8
      const newHeight = Math.min(maxH, Math.max(200, resizeStartRef.current.startHeight + delta))
      setPreviewHeight(newHeight)
    }
    const onMouseUp = () => {
      setIsResizing(false)
      resizeStartRef.current = null
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
    document.body.style.cursor = 'ns-resize'
    document.body.style.userSelect = 'none'
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing])

  const showStatus = useCallback((msg: string) => {
    setStatusMsg(msg)
    setTimeout(() => setStatusMsg(null), 3000)
  }, [])

  const handleSave = useCallback(async () => {
    const result = await savePreset()
    if (result.ok) {
      showStatus('Saved')
    } else {
      showStatus(`Error: ${result.error}`)
    }
  }, [savePreset, showStatus])

  const handleCreate = useCallback(async () => {
    const id = newPresetId.trim()
    const name = newPresetName.trim() || id
    if (!id) return
    const result = await createPreset(id, name)
    if (result.ok) {
      setShowNewPreset(false)
      setNewPresetId('')
      setNewPresetName('')
      showStatus(`Created "${id}"`)
    } else {
      showStatus(`Error: ${result.error}`)
    }
  }, [newPresetId, newPresetName, createPreset, showStatus])

  const handleDelete = useCallback(async () => {
    if (!activePresetId) return
    if (!window.confirm(`Delete preset "${activePresetId}"? This removes the directory.`)) return
    const result = await deletePreset()
    if (result.ok) {
      showStatus('Deleted')
    } else {
      showStatus(`Error: ${result.error}`)
    }
  }, [activePresetId, deletePreset, showStatus])

  // Collect presets metadata
  const presets = useMemo(() =>
    getAllPresetMetas().map((meta) => ({
      meta,
      preset: getPreset(meta.id),
    })),
    [],
  )

  // Auto-select first preset if none selected
  useEffect(() => {
    if (!activePresetId && presets.length > 0) {
      loadPreset(presets[0].meta.id)
    }
  }, [activePresetId, presets, loadPreset])

  const isPresetTab = activeTab === 'preset'

  return (
    <div className="da-dashboard">
      {/* ── Main tab bar ── */}
      <div className="da-tabs">
        {MAIN_TABS.map((tab) => (
          <button
            key={tab.id}
            className={`da-tabs__tab ${activeTab === tab.id ? 'da-tabs__tab--active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Preset header: picker + CRUD (only in Preset tab) ── */}
      {isPresetTab && (
        <>
          <header className="da-header">
            <div className="da-header__left">
              <span className="da-header__label">Preset</span>
              <select
                value={activePresetId ?? ''}
                onChange={(e) => loadPreset(e.target.value)}
                className="da-header__select"
              >
                {presets.map(({ meta }) => (
                  <option key={meta.id} value={meta.id}>
                    {meta.id === activePresetId && workingPreset?.name
                      ? workingPreset.name
                      : meta.name}
                  </option>
                ))}
              </select>
              {workingPreset && (
                <input
                  className="da-header__name"
                  value={workingPreset.name ?? ''}
                  onChange={(e) => renamePreset(e.target.value)}
                  placeholder="Preset name"
                />
              )}
              {isDirty && <span className="da-header__dirty" title="Unsaved changes">*</span>}
              {statusMsg && <span className="da-header__status">{statusMsg}</span>}
            </div>
            <div className="da-header__actions">
              <button
                className="da-header__btn da-header__btn--primary"
                onClick={handleSave}
                disabled={isSaving || !isDirty}
                title="Save preset to disk"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button
                className="da-header__btn"
                onClick={() => setShowNewPreset(!showNewPreset)}
                disabled={isSaving}
                title="Create new preset"
              >
                + New
              </button>
              <button
                className="da-header__btn da-header__btn--danger"
                onClick={handleDelete}
                disabled={isSaving || !activePresetId}
                title="Delete preset"
              >
                Delete
              </button>
            </div>
          </header>

          {/* New preset form */}
          {showNewPreset && (
            <div className="da-new-preset-form">
              <input
                className="da-slug-input"
                placeholder="preset-id (kebab-case)"
                value={newPresetId}
                onChange={(e) => setNewPresetId(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                autoFocus
              />
              <input
                className="da-slug-input"
                placeholder="Display Name"
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              />
              <button
                className="da-btn-sm da-btn-sm--primary"
                onClick={handleCreate}
                disabled={isSaving || !newPresetId.trim()}
              >
                Create
              </button>
              <button
                className="da-btn-sm"
                onClick={() => setShowNewPreset(false)}
              >
                Cancel
              </button>
            </div>
          )}

          {/* Preset sub-tab bar */}
          <div className="da-tabs da-tabs--sub">
            {PRESET_SUB_TABS.map((tab) => (
              <button
                key={tab.id}
                className={`da-tabs__tab da-tabs__tab--sub ${presetSubTab === tab.id ? 'da-tabs__tab--active' : ''}`}
                onClick={() => setPresetSubTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </>
      )}

      {/* ── Registry sub-tab bar ── */}
      {activeTab === 'registry' && (
        <div className="da-tabs da-tabs--sub">
          {REGISTRY_SUB_TABS.map((tab) => (
            <button
              key={tab.id}
              className={`da-tabs__tab da-tabs__tab--sub ${registrySubTab === tab.id ? 'da-tabs__tab--active' : ''}`}
              onClick={() => setRegistrySubTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* ── Content area ── */}
      <div className="da-content">
        {activeTab === 'defaults' && <DefaultsTab />}
        {activeTab === 'preset' && presetSubTab === 'l1-content' && <L1ContentTab />}
        {activeTab === 'preset' && presetSubTab === 'l2-experience' && <L2ExperienceTab />}
        {activeTab === 'preset' && presetSubTab === 'contract' && (
          <ContractContent />
        )}
        {activeTab === 'registry' && (
          <RegistryPanel tab={registrySubTab} />
        )}
      </div>

      {/* ── Preview toggle + panel (only in Preset tab) ── */}
      {isPresetTab && (
        <>
          <div className="da-preview-toggle">
            <button
              className="da-preview-toggle__btn"
              onClick={() => setShowPreview((v) => !v)}
            >
              <span className="da-collapsible__arrow" data-open={showPreview}>&#9656;</span>
              Preview
            </button>
            {showPreview && workingPreset && (() => {
              const pageIds = Object.keys(workingPreset.pages)
              return pageIds.length > 1 ? (
                <select
                  className="da-preview-toggle__page-select"
                  value={activePageId ?? pageIds[0]}
                  onChange={(e) => setActivePageId(e.target.value)}
                >
                  {pageIds.map((id) => (
                    <option key={id} value={id}>
                      {workingPreset.pages[id]?.slug ?? id}
                    </option>
                  ))}
                </select>
              ) : null
            })()}
          </div>
          {showPreview && activePresetId && workingPreset && (
            <div className="da-preview" key={activePresetId} style={{ height: previewHeight }}>
              <div className="da-preview__resize-handle" onMouseDown={handleResizeStart} />
              <Suspense fallback={<div className="da-preview__loading">Loading preview...</div>}>
                <PreviewContainer
                  preset={workingPreset}
                  presetId={activePresetId}
                  pageId={activePageId ?? undefined}
                />
              </Suspense>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// =============================================================================
// Contract Content (reads from generatedContract in store)
// =============================================================================

function ContractContent() {
  const { activePresetId, preset, generatedContract } = useAuthoring()

  if (activePresetId && generatedContract && preset) {
    return (
      <ContractInspector
        key={activePresetId}
        presetId={activePresetId}
        presetName={preset.name ?? activePresetId}
        contract={generatedContract}
        preset={preset}
      />
    )
  }

  if (activePresetId && preset) {
    return (
      <div className="da-empty-full">
        No binding expressions found in <strong>{preset.name ?? activePresetId}</strong>.
      </div>
    )
  }

  return <div className="da-empty-full">Select a preset to view its contract.</div>
}
