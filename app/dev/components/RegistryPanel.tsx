/**
 * Registry browser — thin wrapper that delegates to the master-detail layout.
 */

'use client'

import type { RegistrySubTab } from './devAuthoringStore'
import { RegistryMasterDetail } from './registry/RegistryMasterDetail'

interface RegistryPanelProps {
  tab: RegistrySubTab
}

export default function RegistryPanel({ tab }: RegistryPanelProps) {
  return <RegistryMasterDetail tab={tab} />
}
