/**
 * Single field row with hidden toggle (eye icon).
 * Shows: toggle, path (mono), type badge, required dot, default value, placeholder.
 */

'use client'

import type { ContentSourceField } from '../../../engine/presets/types'

interface FieldRowProps {
  field: ContentSourceField
  fullPath: string
  isHiddenOverridden: boolean
  effectiveHidden: boolean
  onToggleHidden: (fieldPath: string) => void
  depth?: number
}

const TYPE_COLORS: Record<string, string> = {
  text: '130, 180, 255',
  textarea: '100, 160, 240',
  number: '255, 180, 100',
  toggle: '180, 130, 255',
  image: '100, 220, 180',
  'string-list': '255, 140, 180',
  collection: '220, 180, 100',
}

export default function FieldRow({
  field,
  fullPath,
  isHiddenOverridden,
  effectiveHidden,
  onToggleHidden,
  depth = 0,
}: FieldRowProps) {
  const color = TYPE_COLORS[field.type] ?? '180, 180, 180'
  const isHidden = effectiveHidden

  return (
    <div
      className="cd-field-row"
      style={{
        paddingLeft: `${12 + depth * 16}px`,
        opacity: isHidden ? 0.45 : 1,
      }}
    >
      <button
        className="cd-field-row__eye"
        onClick={() => onToggleHidden(fullPath)}
        title={isHidden ? 'Show field (remove hidden)' : 'Hide field (mark hidden)'}
        style={{
          color: isHiddenOverridden ? 'rgb(255, 200, 80)' : undefined,
        }}
      >
        {isHidden ? '◌' : '◉'}
      </button>

      <span
        className="cd-field-row__path"
        style={{ textDecoration: isHidden ? 'line-through' : undefined }}
      >
        {field.path}
      </span>

      <span
        className="cd-field-row__type"
        style={{ background: `rgba(${color}, 0.2)`, color: `rgb(${color})` }}
      >
        {field.type}
      </span>

      {field.required && <span className="cd-field-row__required" title="Required">●</span>}

      {isHidden && <span className="cd-field-row__badge">auto</span>}

      {field.default !== undefined && (
        <span className="cd-field-row__default" title={`Default: ${JSON.stringify(field.default)}`}>
          {typeof field.default === 'string'
            ? field.default.length > 24
              ? field.default.slice(0, 24) + '…'
              : field.default
            : Array.isArray(field.default)
              ? `[${field.default.length}]`
              : String(field.default)}
        </span>
      )}

      {field.placeholder && !field.default && (
        <span className="cd-field-row__placeholder">{field.placeholder}</span>
      )}
    </div>
  )
}
