/**
 * Site configuration for Noir portfolio.
 * Uses noirPreset with chrome components.
 */

import type { SiteSchema } from '../engine/schema'
import { noirPreset } from '../engine/presets/noir'
import { noirSampleContent } from '../engine/presets/noir'
import { buildSiteSchemaFromPreset } from '../engine/presets/resolve'

/**
 * Toggle experience mode for testing.
 * Set to 'slideshow' to test slideshow navigation.
 * Set to 'infinite-carousel' to test momentum-based infinite scroll.
 * Set to 'default' to use preset's cinematic-portfolio experience.
 */
const EXPERIENCE_MODE: 'default' | 'slideshow' | 'infinite-carousel' = 'default'

const experienceOverride = (EXPERIENCE_MODE as string) === 'slideshow'
  ? { id: 'slideshow' }
  : (EXPERIENCE_MODE as string) === 'infinite-carousel'
  ? { id: 'infinite-carousel' }
  : undefined

/**
 * Main site configuration.
 * Easy to swap: change noirPreset to another preset.
 * Sites inherit from presets and can override specific values.
 */
export const siteConfig: SiteSchema = buildSiteSchemaFromPreset('noir', noirPreset, {
  content: noirSampleContent,
  ...(experienceOverride && { experienceOverride }),
})
