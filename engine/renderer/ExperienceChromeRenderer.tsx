'use client'

/**
 * ExperienceChromeRenderer - renders experience-owned UI elements.
 *
 * These are distinct from Preset chrome (which is content).
 * Experience chrome includes navigation, indicators, and other
 * structural UI that the experience provides.
 *
 * Example: slideshow experience provides SlideIndicators and SlideNavigation.
 */

import { createPortal } from 'react-dom'
import { useSyncExternalStore } from 'react'
import { getChromeComponent } from '../content/chrome/registry'
import type { ExperienceChrome } from '../experience/compositions/types'
import { useContainer } from '../interface/ContainerContext'
import { useSiteContainer } from './SiteContainerContext'

// SSR-safe mounting detection using useSyncExternalStore
const subscribeNoop = () => () => {}
const getClientSnapshot = () => true
const getServerSnapshot = () => false

interface ExperienceChromeRendererProps {
  /** Chrome items to render */
  items: ExperienceChrome[]
  /** Whether to render as overlays (portaled to site container) */
  isOverlay?: boolean
}

/**
 * Renders experience-owned chrome items.
 * Looks up components from the chrome registry.
 * For overlays, uses portal to escape transform context.
 */
export function ExperienceChromeRenderer({
  items,
  isOverlay = false,
}: ExperienceChromeRendererProps) {
  // Get container context for portal target
  const { portalTarget } = useContainer()
  const { siteContainer } = useSiteContainer()

  // SSR-safe mounting detection (avoids setState in useEffect)
  const mounted = useSyncExternalStore(subscribeNoop, getClientSnapshot, getServerSnapshot)

  if (items.length === 0) return null

  const content = (
    <>
      {items.map((item, index) => {
        const Component = getChromeComponent(item.type)
        if (!Component) {
          console.warn(`[ExperienceChromeRenderer] Unknown chrome component: ${item.type}`)
          return null
        }
        return <Component key={`experience-chrome-${item.type}-${index}`} {...item.props} />
      })}
    </>
  )

  // Overlays portal to container to escape transform context
  // NEVER use document.body - breaks container queries and iframe support
  const resolvedTarget = portalTarget || siteContainer
  if (isOverlay && mounted && resolvedTarget) {
    return createPortal(
      <div data-experience-chrome="overlay">{content}</div>,
      resolvedTarget
    )
  }

  return <div data-experience-chrome={isOverlay ? 'overlay' : 'inline'}>{content}</div>
}

export default ExperienceChromeRenderer
