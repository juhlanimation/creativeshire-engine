/**
 * Bojuhl Preset
 * Portfolio site preset with hero, about, and projects sections.
 *
 * Usage:
 * ```typescript
 * import { bojuhlPreset } from './'
 *
 * export const siteConfig: SiteSchema = {
 *   id: 'my-site',
 *   ...bojuhlPreset,
 * }
 * ```
 */

import type { SitePreset } from '../types'
import { registerPreset, type PresetMeta } from '../registry'
import { experienceConfig } from './site'
import { footerConfig, floatingContactConfig } from './chrome'
import { homePageTemplate } from './pages'

/**
 * Bojuhl preset metadata for UI display.
 */
export const bojuhlMeta: PresetMeta = {
  id: 'bojuhl',
  name: 'Bojuhl Portfolio',
  description: 'Cinematic portfolio with hero video, about section, and project grid.',
}

/**
 * Bojuhl preset - complete portfolio site configuration.
 * Includes hero, about, featured projects, and other projects sections.
 */
export const bojuhlPreset: SitePreset = {
  theme: {
    scrollbar: {
      width: 6,
      thumb: '#000000',
      track: '#ffffff',
      thumbDark: '#ffffff',
      trackDark: '#0a0a0a',
    },
    smoothScroll: {
      enabled: true,
      smooth: 1.2,
      smoothMac: 0.5,
      effects: true,
    },
    typography: {
      // Inter for titles (alternative to Neue Haas Grotesk)
      title: 'var(--font-inter), system-ui, -apple-system, sans-serif',
      // Plus Jakarta Sans for body (alternative to Soleil)
      paragraph: 'var(--font-plus-jakarta), system-ui, -apple-system, sans-serif',
    },
    sectionTransition: {
      fadeDuration: '0.15s',
      fadeEasing: 'ease-out',
    },
  },
  experience: experienceConfig,
  chrome: {
    regions: {
      header: 'hidden',
      footer: footerConfig,
    },
    overlays: {
      floatingContact: floatingContactConfig,
      modal: { component: 'ModalRoot' },
    },
  },
  pages: {
    home: homePageTemplate,
  },
}

// Auto-register on module load
registerPreset(bojuhlMeta, bojuhlPreset)
