/**
 * Converts a working-copy SitePreset into a SiteSchema for preview rendering.
 * Thin wrapper around the shared buildSiteSchemaFromPreset / buildPageFromPreset.
 */

import type { SitePreset } from '../../../engine/presets/types'
import type { SiteSchema, PageSchema } from '../../../engine/schema'
import { buildSiteSchemaFromPreset, buildPageFromPreset } from '../../../engine/presets/resolve'

// Sample content for each preset
import { prismSampleContent } from '../../../engine/presets/prism'
import { noirSampleContent } from '../../../engine/presets/noir'
import { loftSampleContent } from '../../../engine/presets/loft'

const PRESET_SAMPLE_CONTENT: Record<string, Record<string, unknown>> = {
  'prism': prismSampleContent,
  'noir': noirSampleContent,
  'loft': loftSampleContent,
}

/**
 * Build a SiteSchema from a SitePreset working copy.
 * Used by PreviewContainer to render a live preview.
 * Omits intro and transition to avoid gate/fade issues in preview.
 */
export function presetToSiteSchema(preset: SitePreset, presetId: string): SiteSchema {
  return buildSiteSchemaFromPreset(presetId, preset, {
    content: PRESET_SAMPLE_CONTENT[presetId],
    includeIntro: false,
    includeTransition: false,
  })
}

/**
 * Get a page from a preset for preview rendering.
 * Resolves binding expressions if sample content is available.
 */
export function getPresetPage(preset: SitePreset, presetId: string, pageId?: string): PageSchema | undefined {
  const content = PRESET_SAMPLE_CONTENT[presetId]
  // Try pageId first, fall back to first page
  const key = pageId && preset.pages[pageId] ? pageId : Object.keys(preset.pages)[0]
  if (!key) return undefined
  return buildPageFromPreset(preset, key, content)
}
