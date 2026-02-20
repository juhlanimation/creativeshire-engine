/**
 * Widget schema types.
 * Widgets are atomic content units that render static structure.
 */

import type { CSSProperties } from 'react'
import type { BehaviourConfig } from './experience'
import type { DecoratorRef } from '../content/decorators/types'
import type { SerializableValue } from './types'

/**
 * Schema for a widget instance.
 * Widgets hold content (text, images, video) and render once.
 */
/**
 * Action binding — either a plain action ID string or an object with params.
 * Object form allows CMS to inject/override payload fields from the schema.
 *
 * @example
 * ```typescript
 * 'modal.open'
 * { action: 'modal.open', params: { animationType: 'expand' } }
 * ```
 */
export type ActionBinding = string | { action: string; params?: Record<string, SerializableValue> }

/**
 * Event to action mapping.
 * Maps DOM events to action bindings that are executed by the action registry.
 * Supports single binding or array for multiple responses per event.
 *
 * @example
 * ```typescript
 * { click: 'modal.open' }
 * { click: { action: 'modal.open', params: { animationType: 'expand' } } }
 * { mouseenter: ['cursorLabel.show', 'emphasis.highlight'] }
 * ```
 */
export type WidgetEventMap = Record<string, ActionBinding | ActionBinding[]>

export interface WidgetSchema {
  /** Unique identifier for the widget */
  id?: string
  /** Widget type name (e.g., 'Text', 'Image', 'Flex') */
  type: string
  /** Widget-specific properties - must be serializable */
  props?: Record<string, SerializableValue>
  /** Inline styles */
  style?: CSSProperties
  /** CSS class names */
  className?: string
  /** Behaviour configuration for animation (singular, legacy) */
  behaviour?: BehaviourConfig
  /** Behaviour configurations for animation (array, preferred) */
  behaviours?: BehaviourConfig[]
  /** Decorators applied to this widget. Resolved at render time into on + behaviours. */
  decorators?: DecoratorRef[]
  /** Nested widgets (for layout widgets) */
  widgets?: WidgetSchema[]
  /**
   * Event to action mapping.
   * Maps DOM events (click, hover) to action IDs.
   * Actions are registered by chrome and executed by WidgetRenderer.
   *
   * @example
   * ```typescript
   * { on: { click: 'modal.open' } }
   * ```
   */
  on?: WidgetEventMap
  /**
   * Repeat directive for dynamic content.
   * Binding expression that resolves to an array.
   * Platform expands this widget N times, one per array item.
   * Use {{ item.xxx }} bindings in props to access item properties.
   *
   * @example
   * ```typescript
   * {
   *   __repeat: '{{ content.projects.featured }}',
   *   type: 'Flex',
   *   props: { title: '{{ item.title }}' },
   *   widgets: [...]
   * }
   * ```
   */
  __repeat?: string
  /**
   * Condition for conditional rendering.
   * Binding expression that must resolve to a truthy value for widget to render.
   * Widget is skipped entirely if condition resolves to falsy (null, undefined, '', false, 0).
   *
   * @example
   * ```typescript
   * {
   *   condition: '{{ item.studio }}',
   *   type: 'Text',
   *   props: { content: 'Studio: {{ item.studio }}' }
   * }
   * ```
   */
  condition?: string
  /**
   * Display label for expanded __repeat items (set by expandRepeater).
   * Used by platform hierarchy panel for human-readable widget names.
   * Priority: title > name > label > $index
   */
  __label?: string
  /**
   * Key field for stable item identity in __repeat.
   * Defaults to 'id'. Used for:
   * - Stable widget IDs: `{widgetId}-{item[keyField]}`
   * - React keys for efficient reconciliation
   * - Platform references that survive reorder
   *
   * @example
   * ```typescript
   * {
   *   __repeat: '{{ content.projects }}',
   *   __key: 'id',  // Uses item.id for identity
   *   type: 'ProjectCard',
   *   props: { title: '{{ item.title }}' }
   * }
   * ```
   */
  __key?: string
  /**
   * Item key from __repeat expansion (set by expandRepeater).
   * Stable identifier from source data, survives reorder.
   * Platform uses this to reference items in data store.
   */
  __itemKey?: string | number
  /**
   * Item index from __repeat expansion.
   * Used to compute alternating layouts (data-reversed).
   * Set via binding: '{{ item.$index }}'
   */
  'data-index'?: string | number
  /**
   * Reversed layout flag.
   * Can be set explicitly or computed from data-index by Flex widget.
   * Controls card layout direction and modal animation.
   */
  'data-reversed'?: boolean | string
  /**
   * Effect identifier.
   * Used to apply CSS effects via [data-effect="value"] selectors.
   */
  'data-effect'?: string
}

/**
 * Built-in widget type names.
 */
export type WidgetType =
  | 'Text'
  | 'Image'
  | 'Video'
  | 'Button'
  | 'Badge'
  | 'Link'
  | 'Icon'
  | 'Flex'
  | 'Grid'
  | 'Stack'

/**
 * Props interface for Text widget.
 */
export interface TextWidgetProps {
  content: string
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span'
}

/**
 * Props interface for Image widget.
 */
export interface ImageWidgetProps {
  src: string
  alt: string
  width?: number
  height?: number
  priority?: boolean
}

/**
 * Props interface for Video widget.
 */
export interface VideoWidgetProps {
  src: string
  poster?: string
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
}

/**
 * Props interface for Flex layout widget.
 */
export interface FlexWidgetProps {
  direction?: 'row' | 'column'
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'
  wrap?: boolean
  gap?: number | string
}

/**
 * Props interface for Grid layout widget.
 */
export interface GridWidgetProps {
  columns?: number
  rows?: number
  gap?: number | string
}

/**
 * Map of widget types to their props interfaces.
 */
export interface WidgetTypeMap {
  Text: TextWidgetProps
  Image: ImageWidgetProps
  Video: VideoWidgetProps
  Flex: FlexWidgetProps
  Grid: GridWidgetProps
}
