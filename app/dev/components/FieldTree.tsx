/**
 * Recursive tree for collection itemFields.
 * Renders FieldRow for each field and recurses for nested collections.
 */

'use client'

import type { ContentSourceField } from '../../../engine/presets/types'
import FieldRow from './FieldRow'

interface FieldTreeProps {
  fields: ContentSourceField[]
  parentPath: string
  hiddenOverrides: Record<string, boolean>
  onToggleHidden: (fieldPath: string) => void
  depth?: number
}

export default function FieldTree({
  fields,
  parentPath,
  hiddenOverrides,
  onToggleHidden,
  depth = 0,
}: FieldTreeProps) {
  return (
    <>
      {fields.map((field) => {
        const fullPath = parentPath ? `${parentPath}.${field.path}` : field.path
        const hasOverride = hiddenOverrides[fullPath] !== undefined
        const effectiveHidden = hasOverride ? hiddenOverrides[fullPath] : !!field.hidden

        return (
          <div key={fullPath}>
            <FieldRow
              field={field}
              fullPath={fullPath}
              isHiddenOverridden={hasOverride}
              effectiveHidden={effectiveHidden}
              onToggleHidden={onToggleHidden}
              depth={depth}
            />
            {field.type === 'collection' && field.itemFields && (
              <FieldTree
                fields={field.itemFields}
                parentPath={fullPath}
                hiddenOverrides={hiddenOverrides}
                onToggleHidden={onToggleHidden}
                depth={depth + 1}
              />
            )}
          </div>
        )
      })}
    </>
  )
}
