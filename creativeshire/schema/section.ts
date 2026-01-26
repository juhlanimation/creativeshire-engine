/**
 * Section schema types.
 * Sections are semantic containers that group widgets into coherent page units.
 */

import type { WidgetSchema } from './widget'
import type { FeatureSet } from './features'
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
  /** Layout configuration */
  layout: LayoutConfig
  /** Static styling features */
  features?: FeatureSet
  /** Behaviour configuration for animation */
  behaviour?: BehaviourConfig
  /** Additional behaviour options */
  behaviourOptions?: Record<string, SerializableValue>
  /** Widgets contained in this section */
  widgets: WidgetSchema[]
}
