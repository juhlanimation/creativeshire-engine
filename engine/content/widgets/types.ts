/**
 * Widget component type definitions.
 * Used by the registry to type widget component lookup.
 */

import type { ComponentType, CSSProperties } from 'react'

/**
 * Base props that all widgets must accept.
 */
export interface WidgetBaseProps {
  /** Additional CSS class names */
  className?: string
  /** Inline styles */
  style?: CSSProperties
  /** Data attribute for behaviour binding */
  'data-behaviour'?: string
}

/**
 * Generic widget component type.
 * Widgets accept their specific props extending WidgetBaseProps.
 */
export type WidgetComponent<P extends WidgetBaseProps = WidgetBaseProps> = ComponentType<P>
