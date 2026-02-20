/**
 * Master-detail layout for the registry tab.
 * Left panel: categorized list. Right panel: detail view.
 */

'use client'

import { useEffect, useRef } from 'react'
import type { RegistrySubTab } from '../devAuthoringStore'
import { registryDetailStore } from './registry-store'
import { RegistryList } from './RegistryList'
import { RegistryDetail } from './RegistryDetail'

interface RegistryMasterDetailProps {
  tab: RegistrySubTab
}

export function RegistryMasterDetail({ tab }: RegistryMasterDetailProps) {
  const prevTab = useRef(tab)

  // Clear selection only when the sub-tab actually changes (not on mount)
  useEffect(() => {
    if (prevTab.current !== tab) {
      registryDetailStore.getState().clearSelection()
      prevTab.current = tab
    }
  }, [tab])

  return (
    <div className="cd-master-detail">
      <div className="cd-master-detail__left">
        <RegistryList tab={tab} />
      </div>
      <div className="cd-master-detail__right">
        <RegistryDetail />
      </div>
    </div>
  )
}
