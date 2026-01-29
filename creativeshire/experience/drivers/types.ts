/**
 * Driver types.
 * Drivers apply CSS variables at 60fps, bypassing React for performance.
 *
 * Architecture:
 * - Triggers write TO store (input)
 * - Behaviours define WHAT to compute (logic)
 * - Drivers apply CSS vars at 60fps (output, performance path)
 *
 * Use drivers when:
 * - Animation needs 60fps smoothness (scroll-based effects)
 * - React's 16ms render latency would cause jank
 * - You can bypass React entirely for the animation loop
 */

import type { RefObject } from 'react'

/**
 * Configuration for a driver.
 * Drivers are hooks that apply CSS variables directly to DOM elements.
 */
export interface DriverConfig {
  /** Unique identifier */
  id: string
  /** Human-readable description */
  description: string
}

/**
 * Common props for driver hooks that target an element.
 */
export interface ElementDriverProps {
  /** Ref to the element to animate */
  ref: RefObject<HTMLElement | null>
}
