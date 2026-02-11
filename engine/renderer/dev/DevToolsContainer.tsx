'use client'

/**
 * Dev tools container - only renders in dev mode AND not in iframe.
 * When in an iframe (platform preview), dev tools are hidden.
 * Renders experience, preset, intro, and transition switchers at bottom-right.
 */

import { useSyncExternalStore, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { DevExperienceSwitcher } from './DevExperienceSwitcher'
import { DevPresetSwitcher } from './DevPresetSwitcher'
import { DevIntroSwitcher } from './DevIntroSwitcher'
import { DevTransitionSwitcher } from './DevTransitionSwitcher'
import { useSiteContainer } from '../SiteContainerContext'

// SSR-safe subscription
const subscribeNoop = () => () => {}

interface DevToolsContainerProps {
  schemaExperienceId: string
  schemaIntroId: string
  schemaTransitionId: string
  presetId: string
}

export function DevToolsContainer({
  schemaExperienceId,
  schemaIntroId,
  schemaTransitionId,
  presetId,
}: DevToolsContainerProps): ReactNode {
  const shouldShow = useSyncExternalStore(
    subscribeNoop,
    () => process.env.NODE_ENV === 'development'
      && typeof window !== 'undefined'
      && window.self === window.top,
    () => false,
  )
  const { siteContainer } = useSiteContainer()

  if (!shouldShow || !siteContainer) return null

  return createPortal(
    <div style={{
      position: 'fixed',
      bottom: 16,
      right: 16,
      zIndex: 99999,
      display: 'flex',
      gap: 8,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      fontSize: 12,
    }}>
      <DevPresetSwitcher currentPresetId={presetId} position="inline" />
      <DevIntroSwitcher currentIntroId={schemaIntroId} position="inline" />
      <DevTransitionSwitcher currentTransitionId={schemaTransitionId} position="inline" />
      <DevExperienceSwitcher currentExperienceId={schemaExperienceId} position="inline" />
    </div>,
    siteContainer,
  )
}
