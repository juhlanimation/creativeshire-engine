/**
 * Chrome schema types.
 * Chrome provides persistent UI outside page content - regions and overlays.
 */

import type { WidgetSchema } from './widget'
import type { BehaviourConfig } from './experience'
import type { SerializableValue } from './types'

/**
 * Trigger condition for overlays.
 * Defines when an overlay should be shown/hidden.
 */
export interface TriggerCondition {
  /** Event type that triggers the condition */
  event: 'scroll' | 'click' | 'hover' | 'load' | 'custom'
  /** Threshold value (e.g., scroll percentage) */
  threshold?: number
  /** Target element selector */
  target?: string
  /** Custom trigger identifier */
  customId?: string
}

/**
 * Schema for a chrome region (header, footer, sidebar).
 * Regions occupy fixed screen positions.
 * Supports either widget-based or component-based definition.
 */
export interface RegionSchema {
  /** Widgets contained in this region (widget-based approach) */
  widgets?: WidgetSchema[]
  /** Component name to render (component-based approach) */
  component?: string
  /** Props to pass to component (component-based approach) */
  props?: Record<string, SerializableValue>
  /** Behaviour configuration for animation */
  behaviour?: BehaviourConfig
  /** Additional behaviour options */
  behaviourOptions?: Record<string, SerializableValue>
}

/**
 * Schema for a chrome overlay (cursor, loader, modal).
 * Overlays float above all content.
 * Supports either widget-based or component-based definition.
 */
export interface OverlaySchema {
  /** Trigger condition for showing/hiding */
  trigger?: TriggerCondition
  /** Widget to render as overlay content (widget-based approach) */
  widget?: WidgetSchema
  /** Component name to render (component-based approach) */
  component?: string
  /** Props to pass to component (component-based approach) */
  props?: Record<string, SerializableValue>
  /** Position for floating overlays */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  /** Behaviour configuration for animation */
  behaviour?: BehaviourConfig
}

/**
 * Schema for all chrome elements.
 * Chrome exists at site level (defaults) and can be overridden per page.
 */
export interface ChromeSchema {
  /** Region definitions */
  regions: {
    header?: RegionSchema
    footer?: RegionSchema
    sidebar?: RegionSchema
  }
  /** Overlay definitions - supports both standard and custom overlays */
  overlays?: Record<string, OverlaySchema>
}

/**
 * Page-level chrome overrides.
 * Allows pages to inherit, hide, or replace site chrome.
 */
export interface PageChromeOverrides {
  /** Region overrides */
  regions?: {
    header?: 'inherit' | 'hidden' | RegionSchema
    footer?: 'inherit' | 'hidden' | RegionSchema
    sidebar?: 'inherit' | 'hidden' | RegionSchema
  }
  /** Overlay overrides */
  overlays?: {
    cursor?: 'inherit' | 'hidden' | OverlaySchema
    loader?: 'inherit' | 'hidden' | OverlaySchema
    modal?: 'inherit' | 'hidden' | OverlaySchema
  }
}
