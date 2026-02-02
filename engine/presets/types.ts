/**
 * Preset type definitions.
 * Presets bundle experience, chrome, and page configurations.
 *
 * Chrome supports two approaches:
 * 1. Widget-based (preferred): Chrome handles positioning, widget handles content
 * 2. Component-based (legacy): Chrome component handles both positioning and content
 */

import type { PageSchema } from '../schema/page'
import type { WidgetSchema } from '../schema/widget'
import type { ThemeSchema } from '../schema/theme'

/**
 * Experience configuration for a preset.
 */
export interface PresetExperienceConfig {
  /** Experience identifier (e.g., 'stacking', 'cinematic-portfolio') */
  id: string
  /**
   * @deprecated Use `id` instead. Kept for backward compatibility.
   */
  mode?: string
}

/**
 * Chrome region configuration.
 * Supports widget-based (preferred) or component-based (legacy) approach.
 */
export interface PresetRegionConfig {
  /** Widgets to render in this region (widget-based approach - preferred) */
  widgets?: WidgetSchema[]
  /** Component type to render (component-based approach - legacy) */
  component?: string
  /** Props to pass to the component (component-based approach) */
  props?: Record<string, unknown>
}

/**
 * Chrome overlay configuration.
 * Supports widget-based (preferred) or component-based (legacy) approach.
 *
 * Widget-based: ChromeRenderer handles positioning via `position` prop.
 * Component-based: Component handles its own positioning.
 */
export interface PresetOverlayConfig {
  /** Widget to render as overlay content (widget-based approach - preferred) */
  widget?: WidgetSchema
  /** Component type to render (component-based approach - legacy) */
  component?: string
  /** Props to pass to the component (component-based approach) */
  props?: Record<string, unknown>
  /** Position of the overlay (used by widget-based approach) */
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
 * Bundles theme, experience, chrome, and pages into a ready-to-use configuration.
 * Behaviour defaults now live in the Experience definition (not in preset).
 */
export interface SitePreset {
  /** Theme configuration (scrollbar, smooth scroll, colors) */
  theme?: ThemeSchema
  /** Experience configuration (references an Experience by ID) */
  experience: PresetExperienceConfig
  /** Chrome regions and overlays */
  chrome: PresetChromeConfig
  /** Page templates keyed by page ID */
  pages: Record<string, PageSchema>
}
