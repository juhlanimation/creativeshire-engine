/**
 * Preset type definitions.
 * Presets bundle experience, chrome, and page configurations.
 *
 * Chrome supports two approaches:
 * 1. Widget-based (preferred): Chrome handles positioning, widget handles content
 * 2. Component-based (legacy): Chrome component handles both positioning and content
 */

import type { CSSProperties } from 'react'
import type { PageSchema } from '../schema/page'
import type { WidgetSchema } from '../schema/widget'
import type { ThemeSchema } from '../schema/theme'
import type { IntroConfig } from '../intro/types'
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
  /** Per-section behaviour overrides. Keys are section IDs. */
  sectionBehaviours?: Record<string, import('../experience/experiences/types').BehaviourAssignment[]>
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
  /** Inline styles for the semantic wrapper element (e.g., backgroundColor for edge-to-edge) */
  style?: CSSProperties
  /** Whether region content is constrained to --site-max-width (opt-in) */
  constrained?: boolean
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
  /** Intro sequence configuration (runs before experience) */
  intro?: IntroConfig
  /** Experience configuration (references an Experience by ID) */
  experience?: PresetExperienceConfig
  /** Page transition configuration */
  transition?: TransitionConfig
  /** Chrome regions and overlays */
  chrome: PresetChromeConfig
  /** Page templates keyed by page ID */
  pages: Record<string, PageSchema>
}
