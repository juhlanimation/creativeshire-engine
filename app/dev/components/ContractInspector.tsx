/**
 * Content contract view for a single preset.
 * Shows fields organized by their structural location in the preset:
 * EXPERIENCE > Intro, PAGES > home > Hero, CHROME > Footer, etc.
 */

'use client'

import { useState, useCallback } from 'react'
import type { ContentContract, ContentSourceField } from '../../../engine/presets/types'
import type { SitePreset } from '../../../engine/presets/types'
import { buildStructuralTree, type StructuralNode } from './buildStructuralTree'
import FieldTree from './FieldTree'
import ValidationPanel from './ValidationPanel'
import { useDevContract, applyHiddenOverrides } from './devContractStore'

interface ContractInspectorProps {
  presetId: string
  presetName: string
  contract: ContentContract
  preset: SitePreset
}

function countFields(fields: ContentSourceField[]): number {
  let count = 0
  for (const f of fields) {
    count++
    if (f.itemFields) count += countFields(f.itemFields)
  }
  return count
}

function countHidden(fields: ContentSourceField[]): number {
  let count = 0
  for (const f of fields) {
    if (f.hidden) count++
    if (f.itemFields) count += countHidden(f.itemFields)
  }
  return count
}

function countNodeFields(node: StructuralNode): number {
  let count = countFields(node.fields)
  for (const child of node.children) {
    count += countNodeFields(child)
  }
  return count
}

// =============================================================================
// StructuralNodeView — recursive collapsible tree node
// =============================================================================

interface StructuralNodeViewProps {
  node: StructuralNode
  depth: number
  collapsed: Record<string, boolean>
  onToggleCollapse: (id: string) => void
  hiddenOverrides: Record<string, boolean>
  onToggleHidden: (fieldPath: string) => void
}

function StructuralNodeView({
  node,
  depth,
  collapsed,
  onToggleCollapse,
  hiddenOverrides,
  onToggleHidden,
}: StructuralNodeViewProps) {
  const isCollapsed = collapsed[node.id] ?? false
  const fieldCount = countNodeFields(node)
  const hasContent = node.fields.length > 0 || node.children.length > 0

  if (!hasContent) return null

  // Determine style class based on depth
  const depthClass =
    depth === 0
      ? 'cd-structural-category'
      : depth === 1
        ? 'cd-structural-group'
        : 'cd-structural-section'

  return (
    <div className={depthClass}>
      <button
        className="cd-structural__toggle"
        onClick={() => onToggleCollapse(node.id)}
      >
        <span
          className="cd-section__arrow"
          data-open={!isCollapsed ? 'true' : 'false'}
        >
          ▶
        </span>
        <span className="cd-structural__label">{node.label}</span>
        {node.description && (
          <span className="cd-section__desc">{node.description}</span>
        )}
        <span className="cd-section__count">{fieldCount}</span>
      </button>

      {!isCollapsed && (
        <div className="cd-structural__content">
          {/* Direct fields at this node */}
          {node.fields.length > 0 && (
            <div className="cd-section__fields">
              <FieldTree
                fields={node.fields}
                parentPath=""
                hiddenOverrides={hiddenOverrides}
                onToggleHidden={onToggleHidden}
              />
            </div>
          )}

          {/* Recursive children */}
          {node.children.map((child) => (
            <StructuralNodeView
              key={child.id}
              node={child}
              depth={depth + 1}
              collapsed={collapsed}
              onToggleCollapse={onToggleCollapse}
              hiddenOverrides={hiddenOverrides}
              onToggleHidden={onToggleHidden}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// =============================================================================
// ContractInspector
// =============================================================================

export default function ContractInspector({
  presetId,
  presetName,
  contract,
  preset,
}: ContractInspectorProps) {
  const { hiddenOverrides, toggleHidden, resetOverrides } = useDevContract()
  const presetOverrides = hiddenOverrides[presetId] ?? {}
  const hasOverrides = Object.keys(presetOverrides).length > 0

  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})
  const [copied, setCopied] = useState(false)

  const effectiveContract = applyHiddenOverrides(contract, presetOverrides)

  const totalFields = countFields(contract.sourceFields)
  const hiddenCount = countHidden(effectiveContract.sourceFields)

  // Build structural tree from preset bindings
  const tree = buildStructuralTree(preset, effectiveContract)

  const handleToggle = useCallback(
    (fieldPath: string) => toggleHidden(presetId, fieldPath),
    [presetId, toggleHidden],
  )

  const handleCopyJson = useCallback(() => {
    const output = applyHiddenOverrides(contract, presetOverrides)
    navigator.clipboard.writeText(JSON.stringify(output, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }, [contract, presetOverrides])

  const handleReset = useCallback(() => resetOverrides(presetId), [presetId, resetOverrides])

  const toggleCollapse = useCallback((id: string) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }))
  }, [])

  return (
    <div className="cd-inspector">
      {/* Header */}
      <div className="cd-inspector__header">
        <div className="cd-inspector__title">
          <h2 className="cd-inspector__name">
            {presetName}
            <span className="cd-inspector__live-badge">Live</span>
          </h2>
          <span className="cd-inspector__stats">
            {totalFields} fields, {hiddenCount} hidden
          </span>
        </div>
        <div className="cd-inspector__actions">
          {hasOverrides && (
            <button className="cd-btn cd-btn--muted" onClick={handleReset}>
              Reset overrides
            </button>
          )}
          <button className="cd-btn" onClick={handleCopyJson}>
            {copied ? '✓ Copied' : 'Copy JSON'}
          </button>
        </div>
      </div>

      {/* Structural tree */}
      <div className="cd-inspector__sections">
        {tree.map((node) => (
          <StructuralNodeView
            key={node.id}
            node={node}
            depth={0}
            collapsed={collapsed}
            onToggleCollapse={toggleCollapse}
            hiddenOverrides={presetOverrides}
            onToggleHidden={handleToggle}
          />
        ))}
      </div>

      {/* Validation */}
      <div className="cd-inspector__validation">
        <ValidationPanel contract={effectiveContract} />
      </div>
    </div>
  )
}
