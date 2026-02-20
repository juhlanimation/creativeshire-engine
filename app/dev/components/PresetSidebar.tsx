/**
 * Left sidebar: preset list with field/section stats.
 */

'use client'

import type { PresetMeta } from '../../../engine/presets/registry'
import type { ContentContract } from '../../../engine/presets/types'
import { useDevContract } from './devContractStore'

interface PresetSidebarProps {
  presets: Array<{ meta: PresetMeta; contract?: ContentContract }>
}

function countAllFields(contract: ContentContract): number {
  let count = 0
  function walk(fields: ContentContract['sourceFields']) {
    for (const f of fields) {
      count++
      if (f.itemFields) walk(f.itemFields)
    }
  }
  walk(contract.sourceFields)
  return count
}

export default function PresetSidebar({ presets }: PresetSidebarProps) {
  const { activePresetId, setActivePresetId } = useDevContract()

  return (
    <nav className="cd-sidebar">
      <div className="cd-sidebar__header">Presets</div>
      <ul className="cd-sidebar__list">
        {presets.map(({ meta, contract }) => {
          const isActive = activePresetId === meta.id
          const fieldCount = contract ? countAllFields(contract) : 0
          const sectionCount = contract?.sections.length ?? 0

          return (
            <li key={meta.id}>
              <button
                className={`cd-sidebar__item ${isActive ? 'cd-sidebar__item--active' : ''}`}
                onClick={() => setActivePresetId(meta.id)}
              >
                <span className="cd-sidebar__name">{meta.name}</span>
                <span className="cd-sidebar__meta">
                  {contract
                    ? `${sectionCount}s · ${fieldCount}f`
                    : 'no contract'}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
