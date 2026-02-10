/**
 * Port-12 Preset
 * Danish coworking space — single-page with video hero.
 */

import './styles.css'
import type { SitePreset } from '../types'
import { registerPreset, type PresetMeta } from '../registry'
import { experienceConfig, introConfig } from './site'
import { chromeConfig } from './chrome'
import { homePageTemplate } from './pages'
import { port12ContentContract } from './content-contract'

export const port12Meta: PresetMeta = {
  id: 'port-12',
  name: 'Port-12 Coworking',
  description: 'Danish coworking space — single-page with video hero and team showcase.',
}

export const port12Preset: SitePreset = {
  theme: {
    smoothScroll: { enabled: true },
    typography: {
      title: '"BBH Sans Hegarty", system-ui, sans-serif',
      paragraph: 'var(--font-plus-jakarta), system-ui, sans-serif',
    },
  },
  intro: introConfig,
  experience: experienceConfig,
  chrome: chromeConfig,
  pages: {
    home: homePageTemplate,
  },
}

// Auto-register on module load
registerPreset(port12Meta, port12Preset, {
  contentContract: port12ContentContract,
})

// Content contract export
export { port12ContentContract } from './content-contract'

// Export sample content for dev preview
export { port12SampleContent } from './sample-content'
