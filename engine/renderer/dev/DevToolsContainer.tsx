'use client'

/**
 * Dev tools container - thin wrapper around DevToolsPanel.
 * Maps legacy prop names to the unified panel's currentIds format.
 */

import { useMemo, type ReactNode } from 'react'
import { DevToolsPanel } from './DevToolsPanel'
import type { SectionSchema, ChromeSchema } from '../../schema'

interface DevToolsContainerProps {
  schemaExperienceId: string
  schemaTransitionId: string
  presetId: string
  sections?: SectionSchema[]
  siteChrome?: ChromeSchema
}

export function DevToolsContainer({
  schemaExperienceId,
  schemaTransitionId,
  presetId,
  sections,
  siteChrome,
}: DevToolsContainerProps): ReactNode {
  const currentIds = useMemo(() => ({
    experience: schemaExperienceId,
    transition: schemaTransitionId,
    preset: presetId,
  }), [schemaExperienceId, schemaTransitionId, presetId])

  return <DevToolsPanel currentIds={currentIds} sections={sections} siteChrome={siteChrome} />
}
