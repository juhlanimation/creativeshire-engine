'use client'

/**
 * ChromeRenderer - Renders chrome regions and overlays.
 *
 * Chrome provides persistent UI elements outside page content:
 * - Regions: header, footer, sidebar
 * - Overlays: floating elements like contact buttons
 *
 * Supports both widget-based and component-based chrome definitions.
 *
 * Portal Pattern:
 * Widget-based overlays are portaled to document.body to escape CSS transform
 * contexts (e.g., GSAP ScrollSmoother). This keeps them in the React tree
 * for context access while positioning them correctly in the DOM.
 */

import { createPortal } from 'react-dom'
import type { ChromeSchema, PageChromeOverrides, RegionSchema, OverlaySchema } from '@/creativeshire/schema'
import { getChromeComponent } from '../content/chrome/registry'
import { WidgetRenderer } from './WidgetRenderer'
import './chrome.css'

/**
 * Props for ChromeRenderer.
 */
export interface ChromeRendererProps {
  /** Site-level chrome configuration */
  siteChrome?: ChromeSchema
  /** Page-level chrome overrides */
  pageChrome?: PageChromeOverrides
  /** Which chrome position to render */
  position: 'header' | 'footer' | 'overlays'
}

/**
 * Renders a region (header, footer, sidebar).
 */
function renderRegion(region: RegionSchema | undefined): React.ReactNode {
  if (!region) return null

  // Component-based approach
  if (region.component) {
    const Component = getChromeComponent(region.component)
    if (!Component) {
      return <div data-error={`Unknown chrome: ${region.component}`}>Unknown chrome: {region.component}</div>
    }
    return <Component {...(region.props || {})} />
  }

  // Widget-based approach
  if (region.widgets && region.widgets.length > 0) {
    return (
      <>
        {region.widgets.map((widget) => (
          <WidgetRenderer key={widget.id} widget={widget} />
        ))}
      </>
    )
  }

  return null
}

/**
 * Position class map for overlay positioning.
 */
const POSITION_CLASSES: Record<string, string> = {
  'top-left': 'chrome-overlay--top-left',
  'top-right': 'chrome-overlay--top-right',
  'bottom-left': 'chrome-overlay--bottom-left',
  'bottom-right': 'chrome-overlay--bottom-right',
}

/**
 * Renders overlays.
 *
 * Widget-based overlays are portaled to document.body to escape CSS transform
 * contexts (like GSAP ScrollSmoother). This is necessary because `position: fixed`
 * becomes relative to the nearest transformed ancestor, not the viewport.
 *
 * Component-based overlays handle their own positioning (and portals if needed).
 */
function renderOverlays(overlays: ChromeSchema['overlays'] | undefined): React.ReactNode {
  if (!overlays) return null

  const elements: React.ReactNode[] = []

  Object.entries(overlays).forEach(([key, overlay]) => {
    if (!overlay) return

    const typedOverlay = overlay as OverlaySchema

    // Component-based: component handles its own positioning (may use portal internally)
    if (typedOverlay.component) {
      const Component = getChromeComponent(typedOverlay.component)
      if (!Component) {
        elements.push(
          <div key={key} data-error={`Unknown chrome: ${typedOverlay.component}`}>
            Unknown chrome: {typedOverlay.component}
          </div>
        )
        return
      }
      elements.push(<Component key={key} {...(typedOverlay.props || {})} />)
      return
    }

    // Widget-based: portal to document.body to escape transform context
    if (typedOverlay.widget) {
      const positionClass = typedOverlay.position
        ? POSITION_CLASSES[typedOverlay.position]
        : 'chrome-overlay--top-right'

      const content = (
        <div key={key} className={`chrome-overlay ${positionClass}`}>
          <WidgetRenderer widget={typedOverlay.widget} />
        </div>
      )

      // Portal to body (SSR-safe: only portal on client)
      if (typeof window !== 'undefined') {
        elements.push(createPortal(content, document.body))
      } else {
        elements.push(content)
      }
    }
  })

  return elements.length > 0 ? <>{elements}</> : null
}

/**
 * Renders chrome for the specified position.
 */
export function ChromeRenderer({ siteChrome, pageChrome, position }: ChromeRendererProps): React.ReactNode {
  if (!siteChrome) return null

  // Handle page chrome overrides
  const getRegion = (regionName: 'header' | 'footer' | 'sidebar'): RegionSchema | undefined => {
    const pageOverride = pageChrome?.regions?.[regionName]

    // Check for page override
    if (pageOverride === 'hidden') return undefined
    if (pageOverride && pageOverride !== 'inherit') return pageOverride

    // Use site chrome
    return siteChrome.regions[regionName]
  }

  switch (position) {
    case 'header':
      return renderRegion(getRegion('header'))

    case 'footer':
      return renderRegion(getRegion('footer'))

    case 'overlays':
      return renderOverlays(siteChrome.overlays)

    default:
      return null
  }
}
