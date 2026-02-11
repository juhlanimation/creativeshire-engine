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
 * Header regions and widget-based overlays are portaled to the SITE CONTAINER
 * (not document.body!) to escape CSS transform contexts while maintaining:
 * - Container query context (@container site)
 * - Iframe embedding support
 * - React context tree (TransitionProvider, ExperienceProvider, etc.)
 *
 * Headers portal because position:fixed navbars inside ScrollSmoother's
 * #smooth-content are trapped by the CSS transform containing block.
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
import { useChromeVisibility } from './hooks/useChromeVisibility'
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
  /** Current page slug for disabledPages filtering */
  currentPageSlug?: string
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

    const content = <Component {...(region.props || {})} />

    // Wrap in chrome-region for constrained/style support.
    // Uses a non-semantic div — component handles its own semantic element.
    if (region.constrained || region.style) {
      const regionClass = `chrome-region${region.constrained ? ' chrome-region--constrained' : ''}`
      return <div className={regionClass} style={region.style}>{content}</div>
    }

    return content
  }

  // Widget-based approach - wrap in semantic element
  if (region.widgets && region.widgets.length > 0) {
    const children = region.widgets.map((widget) => (
      <WidgetRenderer key={widget.id} widget={widget} />
    ))

    // Wrap in semantic element based on position.
    // chrome-region class marks the wrapper as full-width (like [data-section-id]).
    // chrome-region--constrained applies max-width to direct children (content widgets).
    // region.style carries background color etc. for edge-to-edge backgrounds.
    const regionClass = `chrome-region${region.constrained ? ' chrome-region--constrained' : ''}`

    switch (position) {
      case 'header':
        return <header role="banner" className={regionClass} style={region.style}>{children}</header>
      case 'footer':
        return <footer role="contentinfo" className={regionClass} style={region.style}>{children}</footer>
      case 'sidebar':
        return <aside role="complementary" className={regionClass} style={region.style}>{children}</aside>
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
  currentPageSlug,
  portalTarget,
  siteContainer,
  introHidesChrome,
}: {
  overlays: ChromeSchema['overlays'] | undefined
  hideChrome: string[] | undefined
  currentPageSlug: string | undefined
  portalTarget: HTMLElement | null
  siteContainer: HTMLElement | null
  introHidesChrome: boolean
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

    // During intro, hide all overlays (IntroOverlay is now rendered by IntroProvider)
    if (introHidesChrome) return

    // Skip if overlay is disabled for current page
    if (currentPageSlug && typedOverlay.disabledPages?.includes(currentPageSlug)) return

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
export function ChromeRenderer({ siteChrome, pageChrome, position, hideChrome, currentPageSlug }: ChromeRendererProps): React.ReactNode {
  const { portalTarget } = useContainer()
  const { siteContainer } = useSiteContainer()
  const { introHidesChrome } = useChromeVisibility()

  // For header/footer, hide if intro is hiding chrome
  if (introHidesChrome && (position === 'header' || position === 'footer')) {
    return null
  }

  // Render overlays (ModalRoot, CursorLabel, etc.)
  if (position === 'overlays') {
    return (
      <OverlaysRenderer
        overlays={siteChrome?.overlays}
        hideChrome={hideChrome}
        currentPageSlug={currentPageSlug}
        portalTarget={portalTarget ?? null}
        siteContainer={siteContainer}
        introHidesChrome={introHidesChrome}
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
    const region = siteChrome.regions[regionName]

    // Check if region is disabled for current page
    if (currentPageSlug && region?.disabledPages?.includes(currentPageSlug)) return undefined

    return region
  }

  switch (position) {
    case 'header': {
      const content = renderRegion(getRegion('header'), 'header')
      if (!content) return null

      // Portal header to site container to escape ScrollSmoother's CSS transform
      // context. Without this, position:fixed navbars are trapped inside
      // #smooth-content's transform and scroll with the page.
      // React portals preserve context (TransitionProvider, etc.) so
      // TransitionLink in nav still works.
      const target = portalTarget || siteContainer
      return target ? createPortal(content, target) : content
    }

    case 'footer':
      return renderRegion(getRegion('footer'), 'footer')

    default:
      return null
  }
}
