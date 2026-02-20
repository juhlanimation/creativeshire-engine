/**
 * Left panel of the master-detail layout.
 * Shows categorized lists with clickable items that select into the detail panel.
 */

'use client'

import { widgetRegistry } from '../../../../engine/content/widgets/registry'
import { getWidgetMeta } from '../../../../engine/content/widgets/meta-registry'
import { getAllChromeMetas } from '../../../../engine/content/chrome/registry'
import { getAllBehaviourMetas } from '../../../../engine/experience/behaviours/registry'
import { getAllSectionMetas } from '../../../../engine/content/sections/registry'
import type { RegistrySubTab } from '../devAuthoringStore'
import { useCurrentDetail, useRegistryDetail } from './registry-store'

interface RegistryListProps {
  tab: RegistrySubTab
}

// =============================================================================
// Widget categories
// =============================================================================

const WIDGET_CATEGORIES: Record<string, string[]> = {
  Primitives: ['Text', 'Image', 'Icon', 'Button', 'Link'],
  Layout: ['Flex', 'Box', 'Stack', 'Grid', 'Split', 'Container'],
}

function categorizeWidgets(): Array<{ category: string; items: string[] }> {
  const allKeys = Object.keys(widgetRegistry)
  const categorized = new Set<string>()
  const result: Array<{ category: string; items: string[] }> = []

  for (const [cat, keys] of Object.entries(WIDGET_CATEGORIES)) {
    const present = keys.filter((k) => allKeys.includes(k))
    if (present.length > 0) {
      result.push({ category: cat, items: present })
      present.forEach((k) => categorized.add(k))
    }
  }

  const interactive = allKeys.filter((k) => !categorized.has(k))
  if (interactive.length > 0) {
    result.push({ category: 'Interactive', items: interactive })
  }

  return result
}

// =============================================================================
// List component
// =============================================================================

export function RegistryList({ tab }: RegistryListProps) {
  switch (tab) {
    case 'widgets':
      return <WidgetsList />
    case 'chrome':
      return <ChromeList />
    case 'behaviours':
      return <BehavioursList />
    case 'sections':
      return <SectionsList />
    default:
      return null
  }
}

// =============================================================================
// Widgets list
// =============================================================================

function WidgetsList() {
  const groups = categorizeWidgets()
  const current = useCurrentDetail()
  const { select } = useRegistryDetail()

  return (
    <div className="cd-master-list">
      {groups.map((group) => (
        <div key={group.category} className="cd-master-list__group">
          <div className="cd-master-list__group-header">{group.category}</div>
          {group.items.map((name) => {
            const meta = getWidgetMeta(name)
            const isActive = current?.kind === 'widget' && current.id === name
            return (
              <button
                key={name}
                className={`cd-master-list__item ${isActive ? 'cd-master-list__item--active' : ''}`}
                onClick={() => select({ kind: 'widget', id: name, label: meta?.name ?? name })}
              >
                <span className="cd-master-list__name">{meta?.name ?? name}</span>
                {meta?.settings && (
                  <span className="cd-master-list__badge">
                    {Object.keys(meta.settings).length}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}

// =============================================================================
// Chrome list
// =============================================================================

function ChromeList() {
  const metas = getAllChromeMetas()
  const regions = metas.filter((m) => m.category === 'region')
  const overlays = metas.filter((m) => m.category === 'overlay')
  const current = useCurrentDetail()
  const { select } = useRegistryDetail()

  const groups = [
    { label: 'Regions', items: regions },
    { label: 'Overlays', items: overlays },
  ]

  return (
    <div className="cd-master-list">
      {groups.map((group) => (
        <div key={group.label} className="cd-master-list__group">
          <div className="cd-master-list__group-header">{group.label}</div>
          {group.items.map((meta) => {
            const isActive = current?.kind === 'chrome' && current.id === meta.id
            return (
              <button
                key={meta.id}
                className={`cd-master-list__item ${isActive ? 'cd-master-list__item--active' : ''}`}
                onClick={() => select({ kind: 'chrome', id: meta.id, label: meta.name })}
              >
                <span className="cd-master-list__name">{meta.name}</span>
                {meta.settings && (
                  <span className="cd-master-list__badge">
                    {Object.keys(meta.settings).length}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}

// =============================================================================
// Behaviours list
// =============================================================================

function BehavioursList() {
  const metas = getAllBehaviourMetas()
  const byCategory = new Map<string, typeof metas>()

  for (const m of metas) {
    const list = byCategory.get(m.category) ?? []
    list.push(m)
    byCategory.set(m.category, list)
  }

  const categoryOrder = ['scroll', 'hover', 'visibility', 'animation', 'interaction', 'video', 'intro']
  const sorted = categoryOrder
    .filter((c) => byCategory.has(c))
    .map((c) => ({ category: c, items: byCategory.get(c)! }))

  const current = useCurrentDetail()
  const { select } = useRegistryDetail()

  return (
    <div className="cd-master-list">
      {sorted.map((group) => (
        <div key={group.category} className="cd-master-list__group">
          <div className="cd-master-list__group-header">{group.category}</div>
          {group.items.map((meta) => {
            const isActive = current?.kind === 'behaviour' && current.id === meta.id
            return (
              <button
                key={meta.id}
                className={`cd-master-list__item ${isActive ? 'cd-master-list__item--active' : ''}`}
                onClick={() => select({ kind: 'behaviour', id: meta.id, label: meta.name })}
              >
                <span className="cd-master-list__name">{meta.name}</span>
                {meta.settings && (
                  <span className="cd-master-list__badge">
                    {Object.keys(meta.settings).length}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}

// =============================================================================
// Sections list
// =============================================================================

function SectionsList() {
  const metas = getAllSectionMetas()
  const byCategory = new Map<string, typeof metas>()

  for (const m of metas) {
    const list = byCategory.get(m.sectionCategory) ?? []
    list.push(m)
    byCategory.set(m.sectionCategory, list)
  }

  const current = useCurrentDetail()
  const { select } = useRegistryDetail()

  return (
    <div className="cd-master-list">
      {Array.from(byCategory.entries()).map(([category, items]) => (
        <div key={category} className="cd-master-list__group">
          <div className="cd-master-list__group-header">{category}</div>
          {items.map((meta) => {
            const isActive = current?.kind === 'section' && current.id === meta.id
            return (
              <button
                key={meta.id}
                className={`cd-master-list__item ${isActive ? 'cd-master-list__item--active' : ''}`}
                onClick={() => select({ kind: 'section', id: meta.id, label: meta.name })}
              >
                <span className="cd-master-list__name">{meta.name}</span>
                {meta.unique && <span className="cd-master-list__badge cd-master-list__badge--unique">U</span>}
                {meta.settings && (
                  <span className="cd-master-list__badge">
                    {Object.keys(meta.settings).length}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      ))}
    </div>
  )
}
