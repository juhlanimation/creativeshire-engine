/**
 * Preset type definitions.
 * Presets bundle experience, chrome, and page configurations.
 *
 * Chrome regions use widget-based patterns (factory functions → WidgetSchema).
 * Chrome overlays may use either widget-based or component-based approach
 * (components are needed for overlays with React state like Modal, CursorLabel).
 */

import type { CSSProperties } from 'react'
import type { PageSchema } from '../schema/page'
import type { WidgetSchema } from '../schema/widget'
import type { RegionLayout } from '../schema/chrome'
import type { ThemeSchema } from '../schema/theme'
import type { PresetIntroConfig } from '../intro/types'
import type { TransitionConfig } from '../schema/transition'

/**
 * Data type of a source field in the platform CMS.
 */
export type ContentSourceFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'toggle'
  | 'image'
  | 'string-list'
  | 'collection'

/**
 * A single CMS source field that a preset reads.
 * `path` matches the binding expression path exactly (e.g. 'hero.videoSrc' → {{ content.hero.videoSrc }}).
 */
export interface ContentSourceField {
  /** Dot-notation path matching the binding expression (e.g. 'hero.videoSrc') */
  path: string
  /** Data type the CMS should present */
  type: ContentSourceFieldType
  /** Human-readable label for CMS UI */
  label: string
  /** Section this field belongs to (references ContentSection.id) */
  section: string
  /** Whether the field is required */
  required?: boolean
  /** Default value for seeding new sites from this preset */
  default?: unknown
  /** Placeholder hint for CMS UI */
  placeholder?: string
  /** Separator for string-list fields (e.g. ' & ') */
  separator?: string
  /** Item field definitions for collection fields */
  itemFields?: ContentSourceField[]
  /** Field exists in data but is not user-editable. CMS will auto-generate its value. */
  hidden?: boolean
}

/**
 * A logical grouping of source fields in the CMS editor.
 */
export interface ContentSection {
  /** Unique section identifier */
  id: string
  /** Human-readable label for CMS UI */
  label: string
  /** Optional description for the section */
  description?: string
}

/**
 * Content contract declaring which CMS fields a preset reads.
 * Platform auto-generates field definitions from this.
 */
export interface ContentContract {
  /** CMS source fields the preset reads */
  sourceFields: ContentSourceField[]
  /** Logical groupings for the CMS editor */
  sections: ContentSection[]
  /**
   * Per-component setting visibility overrides for this preset.
   * Outer key: component ID (widget type, section pattern ID, chrome ID).
   * Inner key: setting key from the component's meta.settings.
   * Value: true = hidden (engine-controlled), false = visible (CMS-editable).
   * Omitted settings use the registry default from meta.settings[key].hidden.
   */
  settingOverrides?: Record<string, Record<string, boolean>>
}

/**
 * Maps platform CMS data to the shape a preset's bindings expect.
 */
export type ContentPreprocessor = (content: Record<string, unknown>) => Record<string, unknown>

/**
 * Experience configuration for a preset.
 */
export interface PresetExperienceConfig {
  /** Experience identifier (e.g., 'stacking', 'cinematic-portfolio') */
  id: string
  /** Human-readable label for this experience configuration */
  name?: string
  /** Per-section behaviour overrides. Keys are section IDs. */
  sectionBehaviours?: Record<string, import('../experience/experiences/types').BehaviourAssignment[]>
  /** Intro reference + overrides (resolved to IntroConfig at runtime) */
  intro?: PresetIntroConfig
}

/**
 * Chrome region configuration.
 * Regions use widget-based patterns (factory functions → WidgetSchema).
 */
export interface PresetRegionConfig {
  /** Widgets to render in this region */
  widgets?: WidgetSchema[]
  /** Inline styles for the semantic wrapper element (e.g., backgroundColor for edge-to-edge) */
  style?: CSSProperties
  /** Whether region content is constrained to --site-max-width (opt-in) */
  constrained?: boolean
  /** Layout configuration for the region content wrapper */
  layout?: RegionLayout
  /** Floats on top of content (default: true for header, false for footer). */
  overlay?: boolean
  /** Layout direction (default: 'horizontal'). 'vertical' = sidebar-like. */
  direction?: 'horizontal' | 'vertical'
  /** Auto-hide on scroll down, show on scroll up. */
  collapsible?: boolean
  /** Force a color mode on this region, overriding the site-level palette. */
  colorMode?: 'dark' | 'light'
}

/**
 * Chrome overlay configuration.
 * Supports widget-based or component-based approach.
 *
 * Widget-based: ChromeRenderer handles positioning via `position` prop.
 * Component-based: For overlays needing React state (Modal, CursorLabel).
 */
export interface PresetOverlayConfig {
  /** Widget to render as overlay content (widget-based approach) */
  widget?: WidgetSchema
  /** Component type to render (for overlays needing React state) */
  component?: string
  /** Props to pass to the component */
  props?: Record<string, unknown>
  /** Position of the overlay (used by widget-based approach) */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

/**
 * Chrome configuration for a preset.
 */
export interface PresetChromeConfig {
  /** Chrome regions (header, footer) */
  regions: {
    header?: PresetRegionConfig | 'hidden'
    footer?: PresetRegionConfig | 'hidden'
  }
  /** Chrome overlays (floating elements) */
  overlays?: Record<string, PresetOverlayConfig>
  /** Chrome widgets injected into section layouts. Keys: section ID or '*' for all. */
  sectionChrome?: Record<string, WidgetSchema[]>
}

/**
 * Complete site preset definition.
 * Bundles theme, experience, chrome, and pages into a ready-to-use configuration.
 * Behaviour defaults now live in the Experience definition (not in preset).
 */
export interface SitePreset {
  /** Human-readable display name for this preset */
  name?: string
  /** Theme configuration (scrollbar, smooth scroll, colors) */
  theme?: ThemeSchema
  /** Experience configuration (references an Experience by ID) */
  experience?: PresetExperienceConfig
  /** Page transition configuration */
  transition?: TransitionConfig
  /** Chrome regions and overlays */
  chrome: PresetChromeConfig
  /** Page templates keyed by page ID */
  pages: Record<string, PageSchema>
}
