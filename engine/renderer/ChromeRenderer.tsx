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
 * Widget-based overlays are portaled to the SITE CONTAINER (not document.body!)
 * to escape CSS transform contexts while maintaining:
 * - Container query context (@container site)
 * - Iframe embedding support
 *
 * IMPORTANT: Never use document.body for portals - it breaks container queries
 * and iframe support. See ESLint rule local/no-document-events.
 */

import { createPortal } from 'react-dom'
import type { ChromeSchema, PageChromeOverrides, RegionSchema, OverlaySchema } from '../schema'
import { getChromeComponent } from '../content/chrome/registry'
import { WidgetRenderer } from './WidgetRenderer'
import { useContainer } from '../interface/ContainerContext'
import { useSiteContainer } from './SiteContainerContext'
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
  /** Chrome IDs to hide (from experience.hideChrome) */
  hideChrome?: string[]
}

/**
 * Renders a region (header, footer, sidebar).
 * For widget-based regions, wraps content in semantic element.
 */
function renderRegion(
  region: RegionSchema | undefined,
  position: 'header' | 'footer' | 'sidebar'
): React.ReactNode {
  if (!region) return null

  // Component-based approach - component handles its own semantic element
  if (region.component) {
    const Component = getChromeComponent(region.component)
    if (!Component) {
      return <div data-error={`Unknown chrome: ${region.component}`}>Unknown chrome: {region.component}</div>
    }
    return <Component {...(region.props || {})} />
  }

  // Widget-based approach - wrap in semantic element
  if (region.widgets && region.widgets.length > 0) {
    const children = region.widgets.map((widget) => (
      <WidgetRenderer key={widget.id} widget={widget} />
    ))

    // Wrap in semantic element based on position
    switch (position) {
      case 'header':
        return <header role="banner">{children}</header>
      case 'footer':
        return <footer role="contentinfo">{children}</footer>
      case 'sidebar':
        return <aside role="complementary">{children}</aside>
      default:
        return <>{children}</>
    }
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
 * OverlaysRenderer component.
 *
 * Widget-based overlays are portaled to the site container to:
 * 1. Escape CSS transform contexts (like GSAP ScrollSmoother)
 * 2. Maintain container query context (@container site)
 * 3. Support iframe embedding (never escapes the container)
 *
 * IMPORTANT: Never portal to document.body - it breaks container queries and iframe support.
 *
 * Component-based overlays handle their own positioning (and portals if needed).
 *
 * Modal support:
 * - Add 'ModalRoot' to chrome overlays in preset to enable modal functionality
 * - ModalRoot registers actions (e.g., 'open-video-modal') for widgets to trigger
 * - If not configured, modal actions gracefully do nothing
 */
function OverlaysRenderer({
  overlays,
  hideChrome,
  portalTarget,
  siteContainer,
}: {
  overlays: ChromeSchema['overlays'] | undefined
  hideChrome: string[] | undefined
  portalTarget: HTMLElement | null
  siteContainer: HTMLElement | null
}): React.ReactNode {
  // No overlays configured
  if (!overlays) {
    return null
  }

  const elements: React.ReactNode[] = []

  // Portal target priority:
  // 1. portalTarget from ContainerContext (for contained/iframe mode)
  // 2. siteContainer from SiteContainerContext (for fullpage mode)
  // 3. null (renders inline - SSR or before mount)
  // NEVER use document.body - breaks container queries and iframe support
  const target = portalTarget || siteContainer

  Object.entries(overlays).forEach(([key, overlay]) => {
    if (!overlay) return

    // Skip if this overlay is in the hide list
    if (hideChrome?.includes(key)) return

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

    // Widget-based: portal to target to escape transform context
    if (typedOverlay.widget) {
      const positionClass = typedOverlay.position
        ? POSITION_CLASSES[typedOverlay.position]
        : 'chrome-overlay--top-right'

      const content = (
        <div key={key} className={`chrome-overlay ${positionClass}`}>
          <WidgetRenderer widget={typedOverlay.widget} />
        </div>
      )

      // Portal to target only after mount (prevents hydration mismatch)
      if (target) {
        elements.push(createPortal(content, target))
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
export function ChromeRenderer({ siteChrome, pageChrome, position, hideChrome }: ChromeRendererProps): React.ReactNode {
  const { portalTarget } = useContainer()
  const { siteContainer } = useSiteContainer()

  // Render overlays (ModalRoot, CursorLabel, etc.)
  if (position === 'overlays') {
    return (
      <OverlaysRenderer
        overlays={siteChrome?.overlays}
        hideChrome={hideChrome}
        portalTarget={portalTarget ?? null}
        siteContainer={siteContainer}
      />
    )
  }

  // Regions require siteChrome configuration
  if (!siteChrome) return null

  // Handle page chrome overrides and experience hiding
  const getRegion = (regionName: 'header' | 'footer' | 'sidebar'): RegionSchema | undefined => {
    // Check if experience hides this region
    if (hideChrome?.includes(regionName)) return undefined

    const pageOverride = pageChrome?.regions?.[regionName]

    // Check for page override
    if (pageOverride === 'hidden') return undefined
    if (pageOverride && pageOverride !== 'inherit') return pageOverride

    // Use site chrome
    return siteChrome.regions[regionName]
  }

  switch (position) {
    case 'header':
      return renderRegion(getRegion('header'), 'header')

    case 'footer':
      return renderRegion(getRegion('footer'), 'footer')

    default:
      return null
  }
}
