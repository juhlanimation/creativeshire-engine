/**
 * Chrome schema types.
 * Chrome provides persistent UI outside page content - regions and overlays.
 */

import type { WidgetSchema } from './widget'
import type { BehaviourConfig } from './experience'
import type { SerializableValue } from './types'

/**
 * Trigger condition for overlays.
 * Discriminated union - type-safe trigger configuration.
 * Each trigger type has only its relevant properties.
 */
export type TriggerCondition =
  | ScrollTriggerCondition
  | ClickTriggerCondition
  | HoverTriggerCondition
  | LoadTriggerCondition
  | VisibilityTriggerCondition
  | TimerTriggerCondition
  | DeviceTriggerCondition
  | CustomTriggerCondition

/**
 * Scroll-based trigger.
 * Fires when scroll position crosses threshold.
 */
export interface ScrollTriggerCondition {
  type: 'scroll'
  /** Scroll progress threshold (0-1) */
  threshold: number
  /** Direction of scroll to trigger ('up' | 'down' | 'both') */
  direction?: 'up' | 'down' | 'both'
}

/**
 * Click-based trigger.
 * Fires when target element is clicked.
 */
export interface ClickTriggerCondition {
  type: 'click'
  /** Target element selector */
  target: string
}

/**
 * Hover-based trigger.
 * Fires when target element is hovered.
 */
export interface HoverTriggerCondition {
  type: 'hover'
  /** Target element selector */
  target: string
}

/**
 * Load-based trigger.
 * Fires when page loads.
 */
export interface LoadTriggerCondition {
  type: 'load'
  /** Delay after load before trigger fires (ms) */
  delay?: number
}

/**
 * Visibility-based trigger.
 * Fires when element enters/exits viewport via IntersectionObserver.
 */
export interface VisibilityTriggerCondition {
  type: 'visibility'
  /** Intersection threshold (0-1) */
  threshold: number
  /** Root margin for intersection calculation */
  rootMargin?: string
}

/**
 * Timer-based trigger.
 * Fires after a delay.
 */
export interface TimerTriggerCondition {
  type: 'timer'
  /** Delay before trigger fires (ms) */
  delay: number
  /** Whether timer should repeat */
  repeat?: boolean
  /** Interval between repeats (ms) */
  interval?: number
}

/**
 * Device-based trigger.
 * Fires based on device type.
 */
export interface DeviceTriggerCondition {
  type: 'device'
  /** Device type to match */
  device: 'desktop' | 'tablet' | 'mobile'
}

/**
 * Custom trigger.
 * Fires when custom event is dispatched.
 */
export interface CustomTriggerCondition {
  type: 'custom'
  /** Custom trigger identifier */
  customId: string
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
