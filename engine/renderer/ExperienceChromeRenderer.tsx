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
import { WidgetRenderer } from './WidgetRenderer'
import type { ExperienceChrome } from '../experience/experiences/types'

interface ExperienceChromeRendererProps {
  /** Chrome items to render */
  items: ExperienceChrome[]
  /** Whether to render as overlays (portaled to body) */
  isOverlay?: boolean
}

/**
 * Renders experience-owned chrome items.
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
      {items.map((item, index) => (
        <WidgetRenderer
          key={`experience-chrome-${item.type}-${index}`}
          widget={{
            type: item.type,
            props: item.props,
          }}
          index={index}
        />
      ))}
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
