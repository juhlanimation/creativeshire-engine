'use client'

/**
 * SiteRenderer - entry point for rendering.
 * Wraps tree in providers and renders page.
 */

import { ExperienceProvider } from '../experience'
import { DriverProvider } from '../experience/DriverProvider'
import { getMode, registerMode, stackingMode } from '../experience/modes'
import { PageRenderer } from './PageRenderer'
import { ChromeRenderer } from './ChromeRenderer'
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
    <ExperienceProvider mode={mode} store={store}>
      <DriverProvider>
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

        {/* Overlay chrome */}
        <ChromeRenderer
          siteChrome={site.chrome}
          pageChrome={page.chrome}
          position="overlays"
        />
      </DriverProvider>
    </ExperienceProvider>
  )
}

export default SiteRenderer
