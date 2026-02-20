/**
 * Chrome schema types.
 * Chrome provides persistent UI outside page content - regions and overlays.
 */

import type { CSSProperties } from 'react'
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
 * Layout configuration for a chrome region's content wrapper.
 * The wrapper is always display:flex (row). Patterns organize freely inside.
 */
export interface RegionLayout {
  /** Horizontal placement: 'start' | 'center' | 'end' | 'between' | 'around' */
  justify?: string
  /** Vertical alignment: 'start' | 'center' | 'end' | 'stretch' */
  align?: string
  /** CSS padding (e.g. '1.5rem 2rem') */
  padding?: string
  /** CSS max-width (e.g. 'var(--site-max-width)') */
  maxWidth?: string
  /** CSS gap between top-level widgets (e.g. '1rem') */
  gap?: string
}

/**
 * Schema for a chrome region (header, footer).
 * Regions occupy fixed screen positions or document flow.
 * Uses widget-based definition (factory functions → WidgetSchema).
 */
export interface RegionSchema {
  /** Widgets contained in this region */
  widgets?: WidgetSchema[]
  /** Inline styles for the semantic wrapper element (e.g., backgroundColor for edge-to-edge) */
  style?: CSSProperties
  /** Whether region content is constrained to --site-max-width (opt-in) */
  constrained?: boolean
  /** Layout configuration for the region content wrapper */
  layout?: RegionLayout
  /** Floats on top of content (default: true for header, false for footer). */
  overlay?: boolean
  /** Layout direction (default: 'horizontal'). 'vertical' = sidebar-like. */
  direction?: 'horizontal' | 'vertical'
  /** Auto-hide on scroll down, show on scroll up. */
  collapsible?: boolean
  /** Force a color mode on this region, overriding the site-level palette. */
  colorMode?: 'dark' | 'light'
  /** Behaviour configuration for animation */
  behaviour?: BehaviourConfig
  /** Additional behaviour options */
  behaviourOptions?: Record<string, SerializableValue>
  /** Page slugs where this region should be hidden */
  disabledPages?: string[]
}

/**
 * Schema for a chrome overlay (cursor, loader, modal).
 * Overlays float above all content.
 * Supports widget-based or component-based definition.
 * Component-based is used for overlays needing React state (Modal, CursorLabel).
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
  /** Page slugs where this overlay should be hidden */
  disabledPages?: string[]
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
  }
  /** Overlay definitions - supports both standard and custom overlays */
  overlays?: Record<string, OverlaySchema>
  /** Chrome widgets injected into section layouts. Keys: section ID or '*' for all. */
  sectionChrome?: Record<string, WidgetSchema[]>
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
  }
  /** Overlay overrides */
  overlays?: {
    loader?: 'inherit' | 'hidden' | OverlaySchema
    modal?: 'inherit' | 'hidden' | OverlaySchema
  }
}
