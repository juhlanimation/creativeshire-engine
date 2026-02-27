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
import type { ExperienceComposition, ExperienceRef } from '../experience/compositions/types'

// Re-export content field types for convenience
export type { SectionContentField, SectionContentDeclaration } from '../schema/content-field'

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
 * @deprecated Use ExperienceRef instead. Will be removed in next major version.
 */
export interface PresetExperienceConfig {
  /** Experience identifier (e.g., 'stacking', 'cinematic-portfolio') */
  id: string
  /** Human-readable label for this experience configuration */
  name?: string
  /** Per-section behaviour overrides. Keys are section IDs. */
  sectionBehaviours?: Record<string, import('../experience/compositions/types').BehaviourAssignment[]>
  /** Per-chrome-region behaviour overrides. Keys are region IDs (header, footer). */
  chromeBehaviours?: Record<string, import('../experience/compositions/types').BehaviourAssignment[]>
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
 * L1 Content Composition — structural arrangement of content.
 * Pages, chrome, content-contract, and sample content.
 * Purely structural: no behaviours, no animations, no theme.
 */
export interface ContentComposition {
  /** Unique identifier for this content composition */
  id: string
  /** Human-readable name */
  name: string
  /** Page templates keyed by page ID */
  pages: Record<string, PageSchema>
  /** Chrome regions and overlays */
  chrome: PresetChromeConfig
  /** CMS field declarations aggregated from sections + chrome */
  contentContract: ContentContract
  /** Preview data for dev/Storybook */
  sampleContent: Record<string, unknown>
}

/**
 * Theme Composition — visual language tokens.
 * Wraps ThemeSchema with identification for registry/selection.
 */
export interface ThemeComposition {
  /** Unique identifier for this theme composition */
  id: string
  /** Human-readable name */
  name: string
  /** Theme configuration (colors, typography, spacing, scrollbar) */
  theme: ThemeSchema
}

/**
 * Complete site preset definition.
 * Composes three independent containers: content (L1), experience (L2), and theme.
 * Each container can be built from scratch or referenced from a registry.
 */
export interface SitePreset {
  /** Human-readable display name for this preset */
  name?: string
  /** L1: Content composition (pages, chrome, content-contract, sample content) */
  content: ContentComposition
  /** L2: Experience composition (behaviours, transitions, intro, presentation, navigation) */
  experience: ExperienceComposition | ExperienceRef
  /** Theme composition (colors, typography, spacing) */
  theme: ThemeComposition
}

// Re-export L2 composition types for convenience
export type { ExperienceComposition, ExperienceRef } from '../experience/compositions/types'
