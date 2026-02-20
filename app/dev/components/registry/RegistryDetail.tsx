/**
 * Right panel of the master-detail layout.
 * Renders the appropriate detail component based on the current selection.
 */

'use client'

import { getAllChromeMetas } from '../../../../engine/content/chrome/registry'
import { getAllBehaviourMetas } from '../../../../engine/experience/behaviours/registry'
import { useCurrentDetail } from './registry-store'
import { DetailBreadcrumb } from './DetailBreadcrumb'
import { WidgetDetail } from './WidgetDetail'
import { SectionDetail } from './SectionDetail'
import { ChromeDetail } from './ChromeDetail'
import { BehaviourDetail } from './BehaviourDetail'

export function RegistryDetail() {
  const current = useCurrentDetail()

  if (!current) {
    return (
      <div className="cd-detail-panel cd-detail-panel--empty">
        <div className="cd-detail__placeholder">
          Select an item from the list to view details
        </div>
      </div>
    )
  }

  return (
    <div className="cd-detail-panel">
      <DetailBreadcrumb />
      <div className="cd-detail-panel__content">
        <DetailSwitch entry={current} />
      </div>
    </div>
  )
}

function DetailSwitch({ entry }: { entry: { kind: string; id: string } }) {
  switch (entry.kind) {
    case 'widget':
      return <WidgetDetail widgetType={entry.id} />

    case 'section':
      return <SectionDetail sectionId={entry.id} />

    case 'chrome': {
      const metas = getAllChromeMetas()
      const meta = metas.find((m) => m.id === entry.id)
      if (!meta) return <div className="cd-detail__empty">Unknown chrome: {entry.id}</div>
      return <ChromeDetail meta={meta} />
    }

    case 'behaviour': {
      const metas = getAllBehaviourMetas()
      const meta = metas.find((m) => m.id === entry.id)
      if (!meta) return <div className="cd-detail__empty">Unknown behaviour: {entry.id}</div>
      return <BehaviourDetail meta={meta} />
    }

    default:
      return null
  }
}
