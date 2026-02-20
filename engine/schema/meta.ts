/**
 * Component metadata types for platform UI.
 * Provides UI hints and component information to the CMS editor.
 */

import type { SettingsConfig } from './settings'
import type { DecoratorRef } from '../content/decorators/types'

// =============================================================================
// Component Categories
// =============================================================================

/**
 * Component category for organization in platform UI.
 */
export type ComponentCategory =
  | 'primitive'      // Atomic widgets (Text, Image, Icon)
  | 'layout'         // Container widgets (Flex, Stack, Grid)
  | 'pattern'        // Factory composites that return WidgetSchema
  | 'interactive'    // Stateful React components
  | 'repeater'       // Array-to-widget repeaters
  | 'section'        // Section patterns
  | 'region'         // Chrome regions (Header, Footer)
  | 'overlay'        // Chrome overlays (Modal, Tooltip)
  | 'behaviour'      // Experience behaviours
  | 'theme'          // Site-wide theme configuration
  | 'page'           // Page-level configuration

/**
 * Section sub-category for organization in platform UI "Add Section" dropdown.
 */
export type SectionCategory =
  | 'hero'       // Landing/intro sections (Hero)
  | 'about'      // Bio/team sections (About)
  | 'project'    // Portfolio sections (FeaturedProjects, OtherProjects)
  | 'contact'    // Forms, CTAs
  | 'content'    // General content blocks
  | 'gallery'    // Media showcases

// =============================================================================
// Component Metadata
// =============================================================================

/**
 * Metadata for a component displayed in platform UI.
 * Generic over the component's props type for type-safe settings.
 */
export interface ComponentMeta<T = unknown> {
  /** Unique identifier (matches folder/component name) */
  id: string

  /** Human-readable display name */
  name: string

  /** Brief description for platform UI */
  description: string

  /** Component category for organization */
  category: ComponentCategory

  /** Icon name for platform UI (e.g., 'text', 'image', 'grid') */
  icon?: string

  /** Tags for search/filtering in platform UI */
  tags?: string[]

  /**
   * Whether this is a React component (true) or factory function (false).
   * - true: Component renders directly (primitives, layout, interactive)
   * - false: Factory returns WidgetSchema (patterns)
   */
  component?: boolean

  /** Settings configuration for each prop */
  settings?: SettingsConfig<T>

  /** Preview/thumbnail image URL for platform UI */
  preview?: string

  /** Documentation URL */
  docs?: string

  /** Minimum engine version required */
  minVersion?: string

  /** Deprecation info */
  deprecated?: {
    message: string
    alternative?: string
  }

  /**
   * DOM events this widget can emit (for action wiring discovery).
   * Used by the authoring UI to show available triggers per widget type.
   *
   * @example
   * ```typescript
   * triggers: ['mouseenter', 'mouseleave', 'click']
   * ```
   */
  triggers?: string[]

  /**
   * Default decorator refs applied when schema.decorators is absent.
   * Provides sensible interaction defaults that can be overridden per-instance.
   *
   * For React components: WidgetRenderer falls back to these when no schema.decorators.
   * For factories: factory reads its own meta defaults to wire inner widgets.
   * For authoring UI: discovers available interactions and required overlays.
   *
   * Override: Set schema.decorators (even []) to fully replace defaults.
   */
  defaultDecorators?: DecoratorRef[]

  /**
   * Widget types used internally by this component.
   * Declared manually for React components (regions/overlays) since
   * their widget usage can't be auto-extracted from schema trees.
   */
  usedWidgets?: string[]

  /**
   * Base fields this component controls (i.e., depends on for its design).
   * Platform hides these from content editors because changing them
   * would break the component's design contract.
   *
   * Example: a Hero pattern that owns ['layout', 'behaviour', 'className']
   * prevents editors from changing flex direction or animation on that section.
   */
  ownedFields?: string[]
}

// =============================================================================
// Type Helpers
// =============================================================================

/**
 * Extract props type from a ComponentMeta.
 */
export type MetaProps<M extends ComponentMeta> =
  M extends ComponentMeta<infer T> ? T : never

/**
 * Create a typed ComponentMeta.
 * Helper for better type inference when defining meta.
 */
export function defineMeta<T>(meta: ComponentMeta<T>): ComponentMeta<T> {
  return meta
}

// =============================================================================
// Section Metadata
// =============================================================================

/**
 * Extended metadata for section patterns.
 * Adds section-specific categorization and uniqueness constraints.
 */
export interface SectionMeta<T = unknown> extends ComponentMeta<T> {
  /** Always 'section' for section patterns */
  category: 'section'

  /** Sub-categorization for "Add Section" dropdown grouping */
  sectionCategory: SectionCategory

  /** Whether only one instance is allowed per page */
  unique: boolean

  /**
   * Chrome overlay pattern IDs this section requires (auto-injected, locked in authoring UI).
   * When a section is added, these overlays are automatically included.
   *
   * @example
   * ```typescript
   * requiredOverlays: ['VideoModal', 'CursorTracker']
   * ```
   */
  requiredOverlays?: string[]
}

/**
 * Create a typed SectionMeta.
 * Helper for better type inference when defining section pattern meta.
 */
export function defineSectionMeta<T>(meta: SectionMeta<T>): SectionMeta<T> {
  return meta
}

// =============================================================================
// Region Metadata
// =============================================================================

/**
 * Which chrome region slot this component can fill.
 */
export type RegionType = 'header' | 'footer'

/**
 * Extended metadata for chrome region components.
 * Adds region-specific slot typing so pickers only show valid options.
 */
export interface RegionMeta<T = unknown> extends ComponentMeta<T> {
  /** Always 'region' for region components */
  category: 'region'

  /** Which slot this component fills */
  regionType: RegionType
}

/**
 * Create a typed RegionMeta.
 */
export function defineRegionMeta<T>(meta: RegionMeta<T>): RegionMeta<T> {
  return meta
}

// =============================================================================
// Chrome Pattern Metadata
// =============================================================================

/**
 * Chrome slot for unique pattern assignment.
 * Each slot allows at most one pattern per site.
 */
export type ChromeSlot = 'header' | 'footer'

/**
 * Extended metadata for chrome patterns (factory functions → PresetRegionConfig | PresetOverlayConfig).
 * Mirrors SectionMeta: registered factories with meta, lazy loading, discovery API.
 */
export interface ChromePatternMeta<T = unknown> extends ComponentMeta<T> {
  /** Always 'chrome-pattern' for chrome patterns */
  category: 'chrome-pattern'

  /** Which slot this pattern fills, or null for free overlays */
  chromeSlot: ChromeSlot | null

  /** Action IDs this pattern provides (e.g., ['{key}.open', '{key}.close']) */
  providesActions?: string[]
}

/**
 * Create a typed ChromePatternMeta.
 */
export function defineChromeMeta<T>(meta: ChromePatternMeta<T>): ChromePatternMeta<T> {
  return meta
}
