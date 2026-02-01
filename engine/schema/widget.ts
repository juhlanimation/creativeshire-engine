/**
 * Widget schema types.
 * Widgets are atomic content units that render static structure.
 */

import type { CSSProperties } from 'react'
import type { BehaviourConfig } from './experience'
import type { SerializableValue } from './types'

/**
 * Schema for a widget instance.
 * Widgets hold content (text, images, video) and render once.
 */
/**
 * Event to action mapping.
 * Maps DOM events to action IDs that are executed by the action registry.
 *
 * @example
 * ```typescript
 * { click: 'open-video-modal', hover: 'show-preview' }
 * ```
 */
export type WidgetEventMap = Record<string, string>

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
  /** Behaviour configuration for animation */
  behaviour?: BehaviourConfig
  /** Nested widgets (for layout widgets) */
  widgets?: WidgetSchema[]
  /**
   * Event to action mapping.
   * Maps DOM events (click, hover) to action IDs.
   * Actions are registered by chrome and executed by WidgetRenderer.
   *
   * @example
   * ```typescript
   * { on: { click: 'open-video-modal' } }
   * ```
   */
  on?: WidgetEventMap
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
