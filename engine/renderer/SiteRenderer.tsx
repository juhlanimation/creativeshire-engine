'use client'

/**
 * SiteRenderer - entry point for rendering.
 * Wraps tree in providers and renders page.
 *
 * Supports structural experiences via:
 * - pageWrapper: wraps page content in a behaviour (e.g., slide container)
 * - experienceChrome: experience-owned UI (navigation, indicators)
 * - constraints: structural rules (fullViewportSections, etc.)
 *
 * Page transitions resolved from schema (site.transition / page.transition).
 */

import { useEffect, useState, useRef } from 'react'
import {
  ExperienceProvider,
  ScrollLockProvider,
  SmoothScrollProvider,
  TriggerInitializer,
  ensureExperiencesRegistered,
} from '../experience'

import {
  TransitionProvider,
  PageTransitionWrapper,
  PageTransitionProvider,
} from '../experience/navigation'
import { ExperienceChoreographer } from '../experience/ExperienceChoreographer'
import {
  ensurePageTransitionsRegistered,
} from '../experience/transitions'
import {
  useScrollIndicatorFade,
  useResolvedExperience,
  useResolvedIntro,
  useResolvedTransition,
} from './hooks'
import { PageRenderer } from './PageRenderer'
import { ChromeRenderer } from './ChromeRenderer'
import { SiteContainerProvider, SiteContainerRegistrar } from './SiteContainerContext'
import { PinnedBackdropProvider, PinnedBackdropRegistrar } from './PinnedBackdropContext'
import { ViewportPortalProvider, ViewportPortalRegistrar } from './ViewportPortalContext'
import { ThemeProvider } from './ThemeProvider'
import { ExperienceChromeRenderer } from './ExperienceChromeRenderer'
import { SectionChromeProvider } from './SectionChromeContext'
import type { SiteSchema, PageSchema, ThemeSchema } from '../schema'
import { toCssGap } from '../content/widgets/layout/utils'
import { getBreakpointValue, type BreakpointValue } from '../config/breakpoints'
import { useContainer } from '../interface/ContainerContext'
import { THEME_DEFAULTS } from './hooks/useThemeVariables'

// Dev-only (tree-shaken in production)
import { DevToolsContainer } from './dev/DevToolsContainer'
import { ensurePresetsRegistered } from '../presets'
import { ensureThemesRegistered, getTheme, paletteToCSS, typographyToCSS, tokensToCSS } from '../themes'

// Intro system
import {
  IntroProvider,
  IntroContentGate,
} from '../intro'
import { ensureChromeRegistered } from '../content/chrome/registry'

// Ensure all experiences, presets, transitions, and chrome are registered before any lookups
ensureExperiencesRegistered()
ensurePresetsRegistered()
ensurePageTransitionsRegistered()
ensureChromeRegistered()
ensureThemesRegistered()

/**
 * Build inline CSS variable styles from theme schema.
 * These are set directly on the [data-site-renderer] element in the JSX,
 * so they're present in the server-rendered HTML — zero FOUC.
 *
 * Variables that also need to be on document.documentElement (scrollbar, outer-bg)
 * are duplicated there by useThemeVariables at runtime.
 */
export function buildThemeStyle(theme?: ThemeSchema): React.CSSProperties {
  const d = THEME_DEFAULTS
  const vars: Record<string, string> = {}

  // Color theme palette (set first — structural vars override below)
  if (theme?.colorTheme) {
    const themeDef = getTheme(theme.colorTheme)
    if (themeDef) {
      const mode = theme.colorMode ?? themeDef.defaultMode ?? 'dark'
      Object.assign(vars, paletteToCSS(themeDef[mode]) as Record<string, string>)
      Object.assign(vars, typographyToCSS(themeDef.typography) as Record<string, string>)
      Object.assign(vars, tokensToCSS(themeDef) as Record<string, string>)

      // Expose both mode palettes so components can force a color mode
      // (e.g. ContactFooter with colorMode: 'dark' uses var(--dark-bg)).
      vars['--dark-bg'] = themeDef.dark.background
      vars['--dark-text-primary'] = themeDef.dark.textPrimary
      vars['--light-bg'] = themeDef.light.background
      vars['--light-text-primary'] = themeDef.light.textPrimary
    }
  }

  // Preserve palette background as --theme-bg (immune to container.outerBackground override).
  // Chrome patterns use this for backgrounds that must stay paired with --text-primary.
  if (vars['--site-outer-bg']) vars['--theme-bg'] = vars['--site-outer-bg']

  // Structural vars (override palette defaults when explicitly set)
  vars['--font-title'] = theme?.typography?.title ?? vars['--font-title'] ?? d.typography.title
  if (theme?.typography?.heading) vars['--font-heading'] = theme.typography.heading
  vars['--font-paragraph'] = theme?.typography?.paragraph ?? vars['--font-paragraph'] ?? d.typography.paragraph
  vars['--scrollbar-width'] = `${theme?.scrollbar?.width ?? d.scrollbar.width}px`
  // Scrollbar colors: explicit preset value > palette value > THEME_DEFAULTS
  vars['--scrollbar-thumb'] = theme?.scrollbar?.thumb ?? vars['--scrollbar-thumb'] ?? d.scrollbar.thumb
  vars['--scrollbar-track'] = theme?.scrollbar?.track ?? vars['--scrollbar-track'] ?? d.scrollbar.track
  vars['--scrollbar-thumb-dark'] = theme?.scrollbar?.thumbDark ?? vars['--scrollbar-thumb-dark'] ?? d.scrollbar.thumbDark
  vars['--scrollbar-track-dark'] = theme?.scrollbar?.trackDark ?? vars['--scrollbar-track-dark'] ?? d.scrollbar.trackDark

  if (theme?.typography?.ui) vars['--font-ui'] = theme.typography.ui
  if (theme?.container?.maxWidth) vars['--site-max-width'] = theme.container.maxWidth
  if (theme?.container?.outerBackground) vars['--site-outer-bg'] = theme.container.outerBackground
  if (theme?.container?.sectionGap != null) {
    const gapValue = toCssGap(theme.container.sectionGap, theme.container.sectionGapScale)
    if (gapValue) vars['--site-section-gap'] = gapValue
  }
  if (theme?.sectionTransition?.fadeDuration) vars['--section-fade-duration'] = theme.sectionTransition.fadeDuration
  if (theme?.sectionTransition?.fadeEasing) vars['--section-fade-easing'] = theme.sectionTransition.fadeEasing

  return vars as React.CSSProperties
}

interface SiteRendererProps {
  site: SiteSchema
  page: PageSchema
  /** Current preset ID (for dev mode preset switcher) */
  presetId?: string
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

  // Resolve experience, intro, and transition via hooks
  const {
    experience, store, schemaExperienceId,
    beforeChrome, afterChrome, overlayChrome,
  } = useResolvedExperience(site, page)

  const {
    introConfig,
    overlayComponent: introOverlayComponent,
    overlayProps: introOverlayProps,
  } = useResolvedIntro(site, page, experience)

  const {
    pageTransitionConfig,
    schemaTransitionId,
  } = useResolvedTransition(site, page)

  // Fade out scroll indicator on scroll (disabled in bare mode)
  useScrollIndicatorFade('#hero-scroll', !experience.bareMode)

  // Smooth scrolling: disabled when experience owns page scroll (e.g., slideshow, carousel).
  // bareMode disables behaviours, not theme-level smooth scrolling.
  // smoothScrollOverride lets experiences force a provider (e.g., cover-scroll → Lenis for CSS sticky).
  const smoothScrollConfig = experience.presentation?.ownsPageScroll
    ? { ...site.theme?.smoothScroll, enabled: false }
    : experience.presentation?.smoothScrollOverride
      ? { ...site.theme?.smoothScroll, ...experience.presentation.smoothScrollOverride }
      : site.theme?.smoothScroll

  // In fullpage mode, we set the breakpoint attribute here
  // In contained mode, ContainerProvider sets it on the container element
  const breakpointAttr = mode === 'fullpage' ? breakpoint : undefined

  // Ref to the site container for portal targets
  // Overlays portal here to maintain container query context
  const siteContainerRef = useRef<HTMLDivElement>(null)

  // Ref for pinned section backdrop (outside ScrollSmoother's transform context)
  const pinnedBackdropRef = useRef<HTMLDivElement>(null)

  // Refs for viewport portal layers (outside all containment)
  const backgroundLayerRef = useRef<HTMLDivElement>(null)
  const chromeLayerRef = useRef<HTMLDivElement>(null)
  const foregroundLayerRef = useRef<HTMLDivElement>(null)

  // Viewport layers only in fullpage mode (no containment escape needed in iframes)
  const renderViewportLayers = mode === 'fullpage'

  const themeStyle = buildThemeStyle(site.theme)

  return (
    <SiteContainerProvider>
    <PinnedBackdropProvider>
    <ViewportPortalProvider>
    <div data-engine-root style={themeStyle}>
      {/* Background viewport layer — between page bg and site content (z-index: 0) */}
      {renderViewportLayers && (
        <div
          ref={backgroundLayerRef}
          data-viewport-layer="background"
          data-breakpoint={breakpointAttr}
          style={themeStyle}
        />
      )}
    <div ref={siteContainerRef} data-site-renderer data-breakpoint={breakpointAttr} style={themeStyle}>
      {/* Register site container for portal targets */}
      <SiteContainerRegistrar containerRef={siteContainerRef} />
      {/* Register viewport layers (only when rendered) */}
      {renderViewportLayers && (
        <ViewportPortalRegistrar
          backgroundRef={backgroundLayerRef}
          chromeRef={chromeLayerRef}
          foregroundRef={foregroundLayerRef}
        />
      )}
    <ThemeProvider theme={site.theme}>
      <ScrollLockProvider>
      <IntroProvider
        config={introConfig}
        overlayComponent={introOverlayComponent}
        overlayProps={introOverlayProps}
      >
        <ExperienceProvider experience={experience} store={store}>
          <TransitionProvider config={pageTransitionConfig}>
            <TriggerInitializer>
            {/* Backdrop for pinned sections — outside ScrollSmoother to avoid transforms.
                position:fixed puts it behind #smooth-wrapper (DOM order stacking). */}
            <div
              ref={pinnedBackdropRef}
              data-pinned-backdrop
              style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}
            />
            <PinnedBackdropRegistrar backdropRef={pinnedBackdropRef} />
            {/* Smooth scroll wrapper for main content (disabled for slideshow) */}
            <SmoothScrollProvider config={smoothScrollConfig}>
              <div data-site-content>
              <SectionChromeProvider sectionChrome={site.chrome?.sectionChrome}>
              {/* IntroContentGate inside #smooth-content: opacity wrapper doesn't
                  break ScrollSmoother's position:fixed #smooth-wrapper */}
              <IntroContentGate settings={introConfig?.settings}>
              {/* PageTransitionProvider wraps ALL content so Link in chrome can access it */}
              <PageTransitionProvider
                enabled={!!pageTransitionConfig}
                duration={pageTransitionConfig?.defaultExitDuration ?? 600}
              >
                {/* Header chrome */}
                <ChromeRenderer
                  siteChrome={site.chrome}
                  pageChrome={page.chrome}
                  position="header"
                  hideChrome={experience.hideChrome}
                  currentPageSlug={page.slug}
                />

                {/* Experience chrome: before sections */}
                {beforeChrome.length > 0 && <ExperienceChromeRenderer items={beforeChrome} />}

                {/* ExperienceChoreographer renders controllers, presentation, and page wrapper.
                    Experience chrome stays here (SiteRenderer) to avoid circular dependency
                    through chrome/registry → widgets → WidgetRenderer. */}
                <PageTransitionWrapper
                  enabled={!!pageTransitionConfig}
                  duration={pageTransitionConfig?.defaultExitDuration ?? 600}
                  pageId={page.slug}
                >
                  <ExperienceChoreographer>
                    <PageRenderer page={page} />
                  </ExperienceChoreographer>
                </PageTransitionWrapper>

                {/* Experience chrome: after sections */}
                {afterChrome.length > 0 && <ExperienceChromeRenderer items={afterChrome} />}

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

                {/* Experience chrome: overlays (portaled to escape transform context) */}
                {overlayChrome.length > 0 && <ExperienceChromeRenderer items={overlayChrome} isOverlay />}

                {/* Dev-mode switchers (only in development AND not in iframe) */}
                <DevToolsContainer
                  schemaExperienceId={schemaExperienceId}
                  schemaTransitionId={schemaTransitionId}
                  presetId={presetId ?? site.id}
                  sections={page.sections}
                  siteChrome={site.chrome}
                />
              </PageTransitionProvider>
              </IntroContentGate>
              </SectionChromeProvider>
              </div>
            </SmoothScrollProvider>
            </TriggerInitializer>
          </TransitionProvider>
        </ExperienceProvider>
      </IntroProvider>
    </ScrollLockProvider>
    </ThemeProvider>
    </div>
      {/* Chrome portal layer — non-stacking-context target for overlay headers.
          Sits between site-renderer and foreground layer so headers can blend
          with page content while modals in foreground layer stay above. */}
      {renderViewportLayers && (
        <div ref={chromeLayerRef} data-chrome-layer />
      )}
      {/* Foreground viewport layer — above site content (z-index: 100) */}
      {renderViewportLayers && (
        <div
          ref={foregroundLayerRef}
          data-viewport-layer="foreground"
          data-breakpoint={breakpointAttr}
          style={themeStyle}
        />
      )}
    </div>
    </ViewportPortalProvider>
    </PinnedBackdropProvider>
    </SiteContainerProvider>
  )
}

export default SiteRenderer
