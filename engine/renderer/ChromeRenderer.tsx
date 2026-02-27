'use client'

/**
 * ChromeRenderer - Renders chrome regions and overlays.
 *
 * Chrome provides persistent UI elements outside page content:
 * - Regions: header, footer (widget-based, with overlay/direction/collapsible props)
 * - Overlays: floating elements (component-based for React state, or widget-based)
 *
 * Portal Pattern:
 * Overlay regions need to escape two different CSS contexts:
 * 1. ScrollSmoother's CSS transforms (portal out of scroll container)
 * 2. [data-site-renderer]'s container-type: inline-size (creates contain: layout,
 *    which makes position:fixed behave like position:absolute)
 *
 * Overlay region strategy (mode-dependent):
 * - Fullpage mode: Portal to chromeLayer (non-stacking-context, so blend modes work)
 *   Falls back to foregroundLayer → position:fixed
 * - Contained mode: No portal (stays in document flow) → position:sticky
 *   (ScrollSmoother is disabled in contained mode, so sticky works)
 *
 * Non-overlay regions render in document flow (no portal).
 *
 * IMPORTANT: Never use document.body for portals - it breaks container queries
 * and iframe support. See ESLint rule local/no-document-events.
 */

import { useMemo, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import type { CSSProperties } from 'react'
import type { ChromeSchema, PageChromeOverrides, RegionSchema, RegionLayout, OverlaySchema } from '../schema'
import { getChromeComponent } from '../content/chrome/registry'
import { BehaviourWrapper } from '../experience/behaviours'
import { useExperience } from '../experience'
import type { BehaviourAssignment } from '../experience/compositions/types'
import { useDevChromeBehaviourAssignments } from './dev/devSettingsStore'
import { WidgetRenderer } from './WidgetRenderer'
import { useContainer } from '../interface/ContainerContext'
import { useSiteContainer } from './SiteContainerContext'
import { useViewportPortal } from './ViewportPortalContext'
import { useChromeVisibility } from './hooks/useChromeVisibility'
import { useThemeContext } from './ThemeProvider'
import { getTheme, paletteToCSS } from '../themes'
import { JUSTIFY_MAP, ALIGN_MAP } from '../content/widgets/layout/utils'

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
 * Resolve whether a region is an overlay.
 * Headers default to overlay (floating), footers default to document flow.
 * Explicit `overlay` prop overrides the default.
 */
function resolveOverlay(region: RegionSchema, position: 'header' | 'footer'): boolean {
  if (region.overlay !== undefined) return region.overlay
  // Headers default to overlay, footers default to document flow
  return position === 'header'
}

/**
 * Builds inline styles for the region layout wrapper from RegionLayout config.
 * Always display:flex. Maps semantic justify/align names to CSS values.
 */
function buildLayoutStyle(region: RegionSchema): CSSProperties {
  const layout = region.layout
  const style: CSSProperties = {
    display: 'flex',
    width: '100%',
  }

  if (layout?.justify) {
    style.justifyContent = JUSTIFY_MAP[layout.justify] ?? layout.justify
  }
  if (layout?.align) {
    style.alignItems = ALIGN_MAP[layout.align] ?? layout.align
  }
  if (layout?.padding) {
    style.padding = layout.padding
  }
  if (layout?.gap) {
    style.gap = layout.gap
  }

  // Max-width: explicit layout.maxWidth takes priority, otherwise constrained shorthand
  const maxWidth = layout?.maxWidth ?? (region.constrained ? 'var(--site-max-width)' : undefined)
  if (maxWidth) {
    style.maxWidth = maxWidth
    style.marginLeft = 'auto'
    style.marginRight = 'auto'
  }

  return style
}

/**
 * Build palette CSS variable overrides for a region with a forced colorMode.
 * Returns undefined when no override is needed.
 */
function buildColorModeOverride(
  colorMode: 'dark' | 'light' | undefined,
  colorTheme: string | undefined,
): CSSProperties | undefined {
  if (!colorMode || !colorTheme) return undefined

  const themeDef = getTheme(colorTheme)
  if (!themeDef) return undefined

  const palette = paletteToCSS(themeDef[colorMode])
  const vars = palette as Record<string, string>

  // Also override --theme-bg so footer-chrome's var(--theme-bg, ...) resolves correctly
  if (vars['--site-outer-bg']) {
    vars['--theme-bg'] = vars['--site-outer-bg']
  }

  return vars as CSSProperties
}

/**
 * Renders a region (header, footer).
 * Wraps widget content in semantic element with a layout wrapper div.
 * Applies overlay/direction/collapsible classes based on region props.
 */
function renderRegion(
  region: RegionSchema | undefined,
  position: 'header' | 'footer',
  colorModeOverride?: CSSProperties,
): ReactNode {
  if (!region) return null

  const isOverlay = resolveOverlay(region, position)

  // Widget-based approach - wrap in semantic element
  if (region.widgets && region.widgets.length > 0) {
    const children = region.widgets.map((widget) => (
      <WidgetRenderer key={widget.id} widget={widget} />
    ))

    const layoutStyle = buildLayoutStyle(region)

    // Merge region.style with colorMode palette overrides
    const mergedStyle = colorModeOverride
      ? { ...colorModeOverride, ...region.style }
      : region.style

    // Full-width overlay or document-flow region
    const classes = buildRegionClasses(region, isOverlay)
    const role = position === 'header' ? 'banner' : 'contentinfo'
    const Tag = position === 'header' ? 'header' : 'footer'

    return (
      <Tag role={role} className={classes || undefined} style={mergedStyle}>
        <div className="chrome-region__layout" style={layoutStyle}>
          {children}
        </div>
      </Tag>
    )
  }

  return null
}

/**
 * Builds CSS class string for a region based on its props.
 */
function buildRegionClasses(region: RegionSchema, isOverlay: boolean): string {
  const classes: string[] = ['chrome-region']

  if (isOverlay) {
    // Full-width overlay (fixed at top/bottom)
    classes.push('chrome-header--overlay')
  }

  if (region.direction === 'vertical') {
    classes.push('chrome-header--vertical')
  }

  if (region.collapsible) {
    classes.push('chrome-header--collapsible')
  }

  return classes.join(' ')
}

/**
 * Wraps region content with BehaviourWrappers for chrome behaviours.
 * Uses reduceRight pattern (same as SectionRenderer) for multi-behaviour nesting.
 *
 * When region has collapsible: true, auto-adds scroll/collapse behaviour.
 */
function ChromeRegionWithBehaviours({
  regionId,
  region,
  children,
}: {
  regionId: string
  region?: RegionSchema
  children: ReactNode
}): ReactNode {
  const { experience } = useExperience()
  const devAssignments = useDevChromeBehaviourAssignments(regionId)

  const assignments: BehaviourAssignment[] = useMemo(() => {
    if (experience.bareMode) return []
    if (devAssignments && devAssignments.length > 0) return devAssignments

    const base = experience.chromeBehaviours?.[regionId] ?? []

    // Auto-wire scroll/collapse when region has collapsible: true
    if (region?.collapsible) {
      const hasCollapse = base.some((a) => a.behaviour === 'scroll/collapse')
      if (!hasCollapse) {
        return [...base, { behaviour: 'scroll/collapse' }]
      }
    }

    return base
  }, [experience.bareMode, devAssignments, experience.chromeBehaviours, regionId, region?.collapsible])

  if (assignments.length === 0) return children

  return assignments.reduceRight<ReactNode>(
    (inner, assignment) => (
      <BehaviourWrapper
        behaviourId={assignment.behaviour}
        options={assignment.options}
      >
        {inner}
      </BehaviourWrapper>
    ),
    children,
  )
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
 * - ModalRoot registers actions (e.g., 'modal.open') for widgets to trigger
 * - If not configured, modal actions gracefully do nothing
 */
function OverlaysRenderer({
  overlays,
  hideChrome,
  currentPageSlug,
  portalTarget,
  foregroundLayer,
  siteContainer,
  introHidesChrome,
}: {
  overlays: ChromeSchema['overlays'] | undefined
  hideChrome: string[] | undefined
  currentPageSlug: string | undefined
  portalTarget: HTMLElement | null
  foregroundLayer: HTMLElement | null
  siteContainer: HTMLElement | null
  introHidesChrome: boolean
}): React.ReactNode {
  // No overlays configured
  if (!overlays || Object.keys(overlays).length === 0) {
    return null
  }

  const elements: React.ReactNode[] = []

  // Portal target priority:
  // 1. portalTarget from ContainerContext (contained/iframe mode — position:absolute)
  // 2. foregroundLayer from ViewportPortalContext (fullpage mode — escapes containment)
  // 3. siteContainer fallback (pre-mount)
  // NEVER use document.body - breaks container queries and iframe support
  const target = portalTarget || foregroundLayer || siteContainer

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
      elements.push(<Component key={key} overlayKey={key} {...(typedOverlay.props || {})} />)
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
  const { portalTarget, mode } = useContainer()
  const { siteContainer } = useSiteContainer()
  const { chromeLayer, foregroundLayer } = useViewportPortal()
  const { introHidesChrome } = useChromeVisibility()
  const { colorTheme } = useThemeContext()

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
        foregroundLayer={foregroundLayer}
        siteContainer={siteContainer}
        introHidesChrome={introHidesChrome}
      />
    )
  }

  // Regions require siteChrome configuration
  if (!siteChrome) return null

  // Handle page chrome overrides and experience hiding
  const getRegion = (regionName: 'header' | 'footer'): RegionSchema | undefined => {
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
      const region = getRegion('header')
      const colorOverride = buildColorModeOverride(region?.colorMode, colorTheme)
      const content = renderRegion(region, 'header', colorOverride)
      if (!content) return null

      const isOverlay = region ? resolveOverlay(region, 'header') : true

      const wrapped = (
        <ChromeRegionWithBehaviours regionId="header" region={region}>
          {content}
        </ChromeRegionWithBehaviours>
      )

      if (isOverlay) {
        // Contained mode: wrap in sticky anchor (height:0 + overflow:visible).
        // Anchor sticks to top of scroll viewport without pushing content down.
        // Inner region uses relative/absolute positioning within the anchor.
        if (mode === 'contained') {
          return <div className="chrome-overlay-anchor">{wrapped}</div>
        }
        // Fullpage mode: portal to chrome layer (non-stacking-context) so headers
        // can use mix-blend-mode against page content. Falls back to foreground layer.
        const target = chromeLayer || foregroundLayer || siteContainer
        return target ? createPortal(wrapped, target) : wrapped
      }

      // Non-overlay: render in document flow (no portal)
      return wrapped
    }

    case 'footer': {
      const region = getRegion('footer')
      const colorOverride = buildColorModeOverride(region?.colorMode, colorTheme)
      const content = renderRegion(region, 'footer', colorOverride)
      if (!content) return null

      const isOverlay = region ? resolveOverlay(region, 'footer') : false

      const wrapped = (
        <ChromeRegionWithBehaviours regionId="footer" region={region}>
          {content}
        </ChromeRegionWithBehaviours>
      )

      if (isOverlay) {
        if (mode === 'contained') {
          return wrapped
        }
        const target = chromeLayer || foregroundLayer || siteContainer
        return target ? createPortal(wrapped, target) : wrapped
      }

      // Non-overlay footer: render in document flow
      return wrapped
    }

    default:
      return null
  }
}
