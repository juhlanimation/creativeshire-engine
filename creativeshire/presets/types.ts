/**
 * Preset type definitions.
 * Presets bundle experience, chrome, and page configurations.
 */

import type { PageSchema } from '../schema/page'

/**
 * Experience configuration for a preset.
 */
export interface PresetExperienceConfig {
  /** Mode identifier (e.g., 'stacking', 'parallax', 'reveal') */
  mode: string
  /** Mode-specific options */
  options?: Record<string, unknown>
}

/**
 * Chrome region configuration.
 */
export interface PresetRegionConfig {
  /** Component type to render */
  component: string
  /** Props to pass to the component */
  props: Record<string, unknown>
}

/**
 * Chrome overlay configuration.
 */
export interface PresetOverlayConfig {
  /** Component type to render */
  component: string
  /** Props to pass to the component */
  props: Record<string, unknown>
  /** Position of the overlay */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

/**
 * Chrome configuration for a preset.
 */
export interface PresetChromeConfig {
  /** Chrome regions (header, footer, sidebar) */
  regions: {
    header?: PresetRegionConfig | 'hidden'
    footer?: PresetRegionConfig | 'hidden'
    sidebar?: PresetRegionConfig | 'hidden'
  }
  /** Chrome overlays (floating elements) */
  overlays?: Record<string, PresetOverlayConfig>
}

/**
 * Complete site preset definition.
 * Bundles experience, chrome, and pages into a ready-to-use configuration.
 */
export interface SitePreset {
  /** Experience mode and options */
  experience: PresetExperienceConfig
  /** Chrome regions and overlays */
  chrome: PresetChromeConfig
  /** Page templates keyed by page ID */
  pages: Record<string, PageSchema>
  /** Default behaviour mappings by widget type */
  behaviours?: Record<string, string>
}
