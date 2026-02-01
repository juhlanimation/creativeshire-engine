/**
 * Component metadata types for platform UI.
 * Provides UI hints and component information to the CMS editor.
 */

import type { SettingsConfig } from './settings'

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
  | 'section'        // Section patterns
  | 'region'         // Chrome regions (Header, Footer)
  | 'overlay'        // Chrome overlays (Modal, Tooltip)
  | 'behaviour'      // Experience behaviours

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
