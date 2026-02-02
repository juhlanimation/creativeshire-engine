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
import { useEffect, useState } from 'react'
import { getChromeComponent } from '../content/chrome/registry'
import type { ExperienceChrome } from '../experience/experiences/types'

interface ExperienceChromeRendererProps {
  /** Chrome items to render */
  items: ExperienceChrome[]
  /** Whether to render as overlays (portaled to body) */
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
  // Track portal mount state for SSR safety
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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

  // Overlays portal to body to escape transform context
  if (isOverlay && mounted && typeof document !== 'undefined') {
    return createPortal(
      <div data-experience-chrome="overlay">{content}</div>,
      document.body
    )
  }

  return <div data-experience-chrome={isOverlay ? 'overlay' : 'inline'}>{content}</div>
}

export default ExperienceChromeRenderer
