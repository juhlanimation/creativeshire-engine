'use client'

/**
 * SiteRenderer - entry point for rendering.
 * Wraps tree in providers and renders page.
 */

import { ExperienceProvider, SmoothScrollProvider, TriggerInitializer } from '../experience'
import { getMode, registerMode, stackingMode } from '../experience/modes'
import { useScrollIndicatorFade } from './hooks'
import { PageRenderer } from './PageRenderer'
import { ChromeRenderer } from './ChromeRenderer'
import { ThemeProvider } from './ThemeProvider'
import type { SiteSchema, PageSchema } from '../schema'

// Register built-in modes
registerMode(stackingMode)

interface SiteRendererProps {
  site: SiteSchema
  page: PageSchema
}

/**
 * Renders a site with providers and page content.
 */
export function SiteRenderer({ site, page }: SiteRendererProps) {
  // Fade out scroll indicator on scroll (GSAP-based for cross-browser support)
  useScrollIndicatorFade('#hero-scroll')

  // Resolve mode from site experience config
  const modeId = site.experience.mode
  const mode = getMode(modeId)

  if (!mode) {
    return (
      <div data-error={`Unknown mode: ${modeId}`}>
        Error: Unknown experience mode &quot;{modeId}&quot;
      </div>
    )
  }

  // Create store for this render
  const store = mode.createStore()

  return (
    <ThemeProvider theme={site.theme}>
      <ExperienceProvider mode={mode} store={store}>
        <TriggerInitializer>
          {/* Smooth scroll wrapper for main content */}
          <SmoothScrollProvider config={site.theme?.smoothScroll}>
            {/* Header chrome */}
            <ChromeRenderer
              siteChrome={site.chrome}
              pageChrome={page.chrome}
              position="header"
            />

            {/* Page content */}
            <PageRenderer page={page} />

            {/* Footer chrome */}
            <ChromeRenderer
              siteChrome={site.chrome}
              pageChrome={page.chrome}
              position="footer"
            />

            {/* Overlay chrome - uses portals to escape transform context.
                Stays in React tree for context access, portals to body for DOM.
                Includes built-in Modal infrastructure (always available). */}
            <ChromeRenderer
              siteChrome={site.chrome}
              pageChrome={page.chrome}
              position="overlays"
            />
          </SmoothScrollProvider>
        </TriggerInitializer>
      </ExperienceProvider>
    </ThemeProvider>
  )
}

export default SiteRenderer
