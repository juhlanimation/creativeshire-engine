'use client'

/**
 * SiteRenderer - entry point for rendering.
 * Wraps tree in providers and renders page.
 *
 * Supports structural experiences via:
 * - pageWrapper: wraps page content in a behaviour (e.g., slide container)
 * - experienceChrome: experience-owned UI (navigation, indicators)
 * - constraints: structural rules (fullViewportSections, etc.)
 * - pageTransition: exit/entry animations when navigating
 */

import { useMemo, useEffect, useState, useRef, type CSSProperties, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import type { StoreApi } from 'zustand'
import {
  ExperienceProvider,
  SmoothScrollProvider,
  TriggerInitializer,
  getExperience,
  getExperienceAsync,
  simpleExperience,
  simpleTransitionsExperience, // Force eager load for page transitions
  ensureExperiencesRegistered,
  PresentationWrapper,
  InfiniteCarouselController,
} from '../experience'

import { BehaviourWrapper } from '../experience/behaviours'
import {
  TransitionProvider,
  NavigationInitializer,
  PageTransitionWrapper,
  PageTransitionProvider,
} from '../experience/navigation'
import type { NavigableExperienceState } from '../experience/experiences/types'
import { useScrollIndicatorFade } from './hooks'
import { PageRenderer } from './PageRenderer'
import { ChromeRenderer } from './ChromeRenderer'
import { SiteContainerProvider, SiteContainerRegistrar, useSiteContainer } from './SiteContainerContext'
import { ThemeProvider } from './ThemeProvider'
import { ExperienceChromeRenderer } from './ExperienceChromeRenderer'
import type { SiteSchema, PageSchema } from '../schema'
import type { Experience, ExperienceConstraints } from '../experience/experiences/types'
import { getBreakpointValue, type BreakpointValue } from '../config/breakpoints'
import { useContainer } from '../interface/ContainerContext'

// Dev-only switchers (tree-shaken in production)
import {
  DevExperienceSwitcher,
  getExperienceOverride,
} from './dev/DevExperienceSwitcher'
import { DevPresetSwitcher } from './dev/DevPresetSwitcher'
import { ensurePresetsRegistered } from '../presets'

// Ensure all experiences and presets are registered before any lookups
ensureExperiencesRegistered()
ensurePresetsRegistered()

// Force eager registration of transition-enabled experiences (prevents lazy load fallback)
// The import above ensures the module loads, this reference prevents tree-shaking
void simpleTransitionsExperience

interface SiteRendererProps {
  site: SiteSchema
  page: PageSchema
  /** Current preset ID (for dev mode preset switcher) */
  presetId?: string
}

/**
 * Generates CSS properties from experience constraints.
 * Applied to the page wrapper container.
 */
function getConstraintStyles(constraints?: ExperienceConstraints): CSSProperties | undefined {
  if (!constraints) return undefined

  const styles: Record<string, string | number> = {}

  if (constraints.fullViewportSections) {
    // Applied at page level - sections inherit this via CSS custom property
    styles['--section-min-height'] = '100vh'
  }

  if (constraints.sectionOverflow) {
    styles.overflow = constraints.sectionOverflow
  }

  return Object.keys(styles).length > 0 ? (styles as CSSProperties) : undefined
}

/**
 * Wraps content with experience pageWrapper if defined.
 * Otherwise renders children directly.
 */
function PageWrapperRenderer({
  experience,
  children,
}: {
  experience: Experience
  children: ReactNode
}) {
  const constraintStyles = useMemo(
    () => getConstraintStyles(experience.constraints),
    [experience.constraints]
  )

  if (!experience.pageWrapper) {
    // No wrapper - return children with constraint styles
    if (constraintStyles) {
      return <div style={constraintStyles}>{children}</div>
    }
    return <>{children}</>
  }

  // Apply pageWrapper behaviour around page content
  return (
    <BehaviourWrapper
      behaviourId={experience.pageWrapper.behaviourId}
      options={experience.pageWrapper.options}
      style={constraintStyles}
    >
      {children}
    </BehaviourWrapper>
  )
}


/**
 * Dev tools container - only renders in dev mode AND not in iframe.
 * When in an iframe (platform preview), dev tools are hidden.
 * Renders experience and preset switchers side by side at bottom-right.
 */
function DevToolsContainer({
  schemaExperienceId,
  presetId,
}: {
  schemaExperienceId: string
  presetId: string
}): ReactNode {
  const [shouldShow, setShouldShow] = useState(false)
  const { siteContainer } = useSiteContainer()

  useEffect(() => {
    // Only show in development mode AND when not in an iframe
    if (process.env.NODE_ENV !== 'development') return

    // Check if we're in an iframe (platform preview)
    const inIframe = typeof window !== 'undefined' && window.self !== window.top
    setShouldShow(!inIframe)
  }, [])

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
      <DevExperienceSwitcher currentExperienceId={schemaExperienceId} position="inline" />
    </div>,
    siteContainer
  )
}

/**
 * Renders a site with providers and page content.
 */
export function SiteRenderer({ site, page, presetId }: SiteRendererProps) {
  // Check if we're in contained mode (ContainerProvider handles breakpoint tracking there)
  const { mode } = useContainer()

  // Track viewport breakpoint for fullpage mode
  const [breakpoint, setBreakpoint] = useState<BreakpointValue>('desktop')

  useEffect(() => {
    // Skip if in contained mode - ContainerProvider handles breakpoint tracking
    if (mode === 'contained') return
    if (typeof window === 'undefined') return

    const updateBreakpoint = () => {
      setBreakpoint(getBreakpointValue(window.innerWidth))
    }

    // Set initial value
    updateBreakpoint()

    // Listen for window resize
    window.addEventListener('resize', updateBreakpoint)
    return () => window.removeEventListener('resize', updateBreakpoint)
  }, [mode])

  // Dev-mode experience override (from URL query param)
  const [devOverride, setDevOverride] = useState<string | null>(null)

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return

    // Read initial override from URL
    setDevOverride(getExperienceOverride())

    // Listen for override changes from DevExperienceSwitcher
    const handleOverrideChange = (e: CustomEvent<string | null>) => {
      setDevOverride(e.detail)
    }

    window.addEventListener('experienceOverrideChange', handleOverrideChange as EventListener)
    return () => {
      window.removeEventListener('experienceOverrideChange', handleOverrideChange as EventListener)
    }
  }, [])

  // Resolve experience: dev override > page config > site config > fallback
  const schemaExperienceId = page.experience?.id ?? site.experience?.id ?? 'simple'
  const experienceId = (process.env.NODE_ENV === 'development' && devOverride)
    ? devOverride
    : schemaExperienceId

  // Try sync lookup first (for already-loaded experiences)
  const syncExperience = getExperience(experienceId)

  // Track async-loaded experience
  const [asyncExperience, setAsyncExperience] = useState<Experience | null>(null)

  useEffect(() => {
    // If sync lookup worked, no need for async
    if (syncExperience) return

    // Load async and cache
    let cancelled = false
    getExperienceAsync(experienceId).then((exp: Experience | undefined) => {
      if (cancelled) return
      if (!exp) {
        console.warn(
          `[Creativeshire] Unknown experience "${experienceId}", falling back to "simple"`
        )
        setAsyncExperience(simpleExperience)
      } else {
        setAsyncExperience(exp)
      }
    })

    return () => {
      cancelled = true
    }
  }, [experienceId, syncExperience])

  // Use sync experience if available, then async, then fallback to simple
  const experience = syncExperience ?? asyncExperience ?? simpleExperience

  // Fade out scroll indicator on scroll (disabled in bare mode)
  useScrollIndicatorFade('#hero-scroll', !experience.bareMode)

  // Create store for this render (memoized to avoid recreating on every render)
  const store = useMemo(() => experience.createStore(), [experience])

  // Filter experience chrome by position
  const beforeChrome = experience.experienceChrome?.filter(c => c.position === 'before') ?? []
  const afterChrome = experience.experienceChrome?.filter(c => c.position === 'after') ?? []
  const overlayChrome = experience.experienceChrome?.filter(c => c.position === 'overlay') ?? []

  // Smooth scrolling: ScrollSmoother needs page-level scroll to work
  // - Stacking/parallax: Use ScrollSmoother (page scrolls)
  // - Slideshow: Disable ScrollSmoother (body locked), use section-level smoothing
  // - Bare mode: Disable for raw layout testing
  const isSlideshow = experience.presentation?.model === 'slideshow'
  const smoothScrollConfig = (isSlideshow || experience.bareMode)
    ? { ...site.theme?.smoothScroll, enabled: false }  // Disable page-level, keep config for section use
    : site.theme?.smoothScroll

  // In fullpage mode, we set the breakpoint attribute here
  // In contained mode, ContainerProvider sets it on the container element
  const breakpointAttr = mode === 'fullpage' ? breakpoint : undefined

  // Ref to the site container for portal targets
  // Overlays portal here to maintain container query context
  const siteContainerRef = useRef<HTMLDivElement>(null)

  return (
    <SiteContainerProvider>
    <div ref={siteContainerRef} data-site-renderer data-breakpoint={breakpointAttr}>
      {/* Register site container for portal targets */}
      <SiteContainerRegistrar containerRef={siteContainerRef} />
    <ThemeProvider theme={site.theme}>
      <ExperienceProvider experience={experience} store={store}>
        <TransitionProvider config={experience.pageTransition}>
          <TriggerInitializer>
            {/* Smooth scroll wrapper for main content (disabled for slideshow) */}
            <SmoothScrollProvider config={smoothScrollConfig}>
              {/* PageTransitionProvider wraps ALL content so TransitionLink in chrome can access it */}
              <PageTransitionProvider
                enabled={!!experience.pageTransition}
                duration={experience.pageTransition?.defaultExitDuration ?? 600}
              >
                {/* Header chrome */}
                <ChromeRenderer
                  siteChrome={site.chrome}
                  pageChrome={page.chrome}
                  position="header"
                  hideChrome={experience.hideChrome}
                  currentPageSlug={page.slug}
                />

                {/* Experience chrome (before page) */}
                {beforeChrome.length > 0 && (
                  <ExperienceChromeRenderer items={beforeChrome} />
                )}

                {/* Navigation input handlers for navigable experiences */}
                {experience.navigation && experience.presentation?.model !== 'infinite-carousel' && (
                  <NavigationInitializer
                    store={store as StoreApi<NavigableExperienceState>}
                    config={experience.navigation}
                    totalSections={page.sections?.length ?? 0}
                  />
                )}

                {/* Infinite carousel controller - handles MomentumDriver and section transforms */}
                {experience.presentation?.model === 'infinite-carousel' && (
                  <InfiniteCarouselController />
                )}

                {/* Page content - wrapped by transition wrapper, presentation, and experience pageWrapper */}
                <PageTransitionWrapper
                  enabled={!!experience.pageTransition}
                  duration={experience.pageTransition?.defaultExitDuration ?? 600}
                >
                  <PresentationWrapper
                    config={experience.presentation}
                    store={store}
                  >
                    <PageWrapperRenderer experience={experience}>
                      <PageRenderer page={page} />
                    </PageWrapperRenderer>
                  </PresentationWrapper>
                </PageTransitionWrapper>

                {/* Experience chrome (after page) */}
                {afterChrome.length > 0 && (
                  <ExperienceChromeRenderer items={afterChrome} />
                )}

                {/* Footer chrome */}
                <ChromeRenderer
                  siteChrome={site.chrome}
                  pageChrome={page.chrome}
                  position="footer"
                  hideChrome={experience.hideChrome}
                  currentPageSlug={page.slug}
                />

                {/* Overlay chrome - uses portals to site container to escape transform context
                    while maintaining container query support and iframe compatibility. */}
                <ChromeRenderer
                  siteChrome={site.chrome}
                  pageChrome={page.chrome}
                  position="overlays"
                  hideChrome={experience.hideChrome}
                  currentPageSlug={page.slug}
                />

                {/* Experience chrome (overlays) */}
                {overlayChrome.length > 0 && (
                  <ExperienceChromeRenderer items={overlayChrome} isOverlay />
                )}

                {/* Dev-mode switchers (only in development AND not in iframe) */}
                <DevToolsContainer
                  schemaExperienceId={schemaExperienceId}
                  presetId={presetId ?? site.id}
                />
              </PageTransitionProvider>
            </SmoothScrollProvider>
          </TriggerInitializer>
        </TransitionProvider>
      </ExperienceProvider>
    </ThemeProvider>
    </div>
    </SiteContainerProvider>
  )
}

export default SiteRenderer
