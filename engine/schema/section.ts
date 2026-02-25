/**
 * Section schema types.
 * Sections are semantic containers that group widgets into coherent page units.
 */

import type { CSSProperties } from 'react'
import type { WidgetSchema } from './widget'
import type { ColorMode } from './theme'

/**
 * Layout configuration for a section.
 * Determines how widgets are arranged within the section.
 */
export interface LayoutConfig {
  /** Layout type */
  type: 'flex' | 'grid' | 'stack'
  /** Flex direction (for flex/stack) */
  direction?: 'row' | 'column'
  /** Cross-axis alignment */
  align?: 'start' | 'center' | 'end' | 'stretch'
  /** Main-axis distribution */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'
  /** Gap between items */
  gap?: number | string
  /** Multiplier for the gap value */
  gapScale?: number
  /** Container padding — supports layout preset names ('normal', 'tight', etc.) */
  padding?: string
  /** Multiplier for the padding value */
  paddingScale?: number
  /** Grid columns (for grid layout) */
  columns?: number
  /** Grid rows (for grid layout) */
  rows?: number
}

/**
 * Schema for a section instance.
 * Sections form the primary structural units of pages.
 */
export interface SectionSchema {
  /** Unique identifier for anchor linking */
  id: string
  /** Human-readable display name for UI hierarchy/inspector */
  label?: string
  /** Pattern that created this section (e.g., 'Hero', 'About') for tracking uniqueness */
  patternId?: string
  /** Layout configuration */
  layout: LayoutConfig
  /** Inline styles */
  style?: CSSProperties
  /** CSS class names */
  className?: string
  /** Whether section content is constrained to --site-max-width (opt-in) */
  constrained?: boolean
  /** Per-section color mode override — resolves palette from the active theme */
  colorMode?: ColorMode
  /** Per-section theme override — resolves full palette from a different theme */
  sectionTheme?: string

  /** Container padding overrides in px (CMS-editable, 0 = no override) */
  paddingTop?: number
  paddingBottom?: number
  paddingLeft?: number
  paddingRight?: number

  /** Section height mode: auto (default), viewport (min-height), viewport-fixed (locked height) */
  sectionHeight?: 'auto' | 'viewport' | 'viewport-fixed'

  /** Widgets contained in this section */
  widgets: WidgetSchema[]
}
