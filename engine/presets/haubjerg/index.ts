/**
 * Haubjerg Preset — Studio Dokumentar
 * Danish documentary photography studio portfolio.
 *
 * Split-panel layout with dark theme, DM Sans + Space Mono typography,
 * film grain overlay, and Motion-powered animations.
 *
 * 10 pages: home (Kerneprodukter), ambassadoer, workshops, kontakt, 6 project details.
 */

import type { SitePreset } from '../types'
import { registerPreset, type PresetMeta } from '../registry'
import { createHaubjergNavRegion } from '../../content/chrome/patterns/HaubjergNav'
import { homePage } from './pages/home'
import { ambassadoerPage } from './pages/ambassadoer'
import { workshopsPage } from './pages/workshops'
import { kontaktPage } from './pages/kontakt'
import { projekt1Page } from './pages/projekt-1'
import { projekt2Page } from './pages/projekt-2'
import { projekt3Page } from './pages/projekt-3'
import { projekt4Page } from './pages/projekt-4'
import { projekt5Page } from './pages/projekt-5'
import { projekt6Page } from './pages/projekt-6'
import { haubjergContentContract } from './content-contract'
import { haubjergSampleContent } from './sample-content'

/**
 * Haubjerg preset metadata for UI display.
 */
export const haubjergMeta: PresetMeta = {
  id: 'haubjerg',
  name: 'Studio Dokumentar — Haubjerg',
  description: 'Danish documentary photography studio with split-panel layout, film grain, and Motion animations.',
}

/**
 * Haubjerg preset — complete site configuration.
 */
export const haubjergPreset: SitePreset = {
  content: {
    id: 'haubjerg-content',
    name: 'Studio Dokumentar',
    pages: {
      home: homePage,
      ambassadoer: ambassadoerPage,
      workshops: workshopsPage,
      kontakt: kontaktPage,
      'projekt-1': projekt1Page,
      'projekt-2': projekt2Page,
      'projekt-3': projekt3Page,
      'projekt-4': projekt4Page,
      'projekt-5': projekt5Page,
      'projekt-6': projekt6Page,
    },
    chrome: {
      regions: {
        header: {
          ...createHaubjergNavRegion({
            brandParts: ['Studio', 'Dokumentar'],
            navLinks: [
              { label: 'Kerneprodukter', href: '/' },
              { label: 'Ambassadører', href: '/ambassadoer' },
              { label: 'Workshops', href: '/workshops' },
              { label: 'Kontakt', href: '/kontakt' },
            ],
          }),
          overlay: true,
          colorMode: 'dark',
        },
        footer: 'hidden',
      },
      overlays: {
        grain: { component: 'GrainOverlay' },
      },
    },
    contentContract: haubjergContentContract,
    sampleContent: haubjergSampleContent,
  },
  experience: {
    base: 'simple',
  },
  theme: {
    id: 'haubjerg-theme',
    name: 'Studio Dokumentar',
    theme: {
      colorTheme: 'contrast',
      typography: {
        heading: "'DM Sans', system-ui, sans-serif",
        paragraph: "'DM Sans', system-ui, sans-serif",
        ui: "'Space Mono', monospace",
      },
      container: {
        maxWidth: '2400px',
        outerBackground: '#0a0a0a',
        sectionGap: 'none',
      },
      scrollbar: {
        type: 'thin',
      },
      smoothScroll: {
        enabled: true,
      },
    },
  },
}

// Auto-register on module load
registerPreset(haubjergMeta, haubjergPreset)

// Content contract export
export { haubjergContentContract } from './content-contract'

// Export sample content for dev preview
export { haubjergSampleContent } from './sample-content'
