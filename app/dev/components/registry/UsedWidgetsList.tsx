/**
 * Clickable list of used widget types — shared by SectionDetail and ChromeDetail.
 */

'use client'

import { useRegistryDetail } from './registry-store'

interface UsedWidgetsListProps {
  widgets: string[]
}

export function UsedWidgetsList({ widgets }: UsedWidgetsListProps) {
  const { pushDetail } = useRegistryDetail()

  if (widgets.length === 0) {
    return <div className="cd-detail__empty">No widgets used</div>
  }

  return (
    <div className="cd-used-widgets">
      <div className="cd-used-widgets__header">Used Widgets</div>
      <div className="cd-used-widgets__list">
        {widgets.map((type) => (
          <button
            key={type}
            className="cd-used-widgets__item"
            onClick={() => pushDetail({ kind: 'widget', id: type, label: type })}
          >
            <span className="cd-used-widgets__name">{type}</span>
            <span className="cd-used-widgets__arrow">&rsaquo;</span>
          </button>
        ))}
      </div>
    </div>
  )
}
