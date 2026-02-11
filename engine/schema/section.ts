/**
 * Section schema types.
 * Sections are semantic containers that group widgets into coherent page units.
 */

import type { CSSProperties } from 'react'
import type { WidgetSchema } from './widget'
import type { BehaviourConfig } from './experience'
import type { SerializableValue } from './types'

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
  /** Behaviour configuration for animation */
  behaviour?: BehaviourConfig
  /** Additional behaviour options */
  behaviourOptions?: Record<string, SerializableValue>
  /** Whether section content is constrained to --site-max-width (opt-in) */
  constrained?: boolean
  /** Widgets contained in this section */
  widgets: WidgetSchema[]
  /** Whether this section stays visible (pinned) while the next section scrolls over it */
  pinned?: boolean
}
