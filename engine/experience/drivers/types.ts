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
import type { Behaviour } from '../behaviours/types'

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

// =============================================================================
// Class-based Driver interfaces (spec-compliant)
// =============================================================================

/**
 * Target registered with a driver.
 * Stores element reference, behaviour, and options for animation.
 */
export interface Target {
  /** DOM element to animate */
  element: HTMLElement
  /** Behaviour that computes CSS variables */
  behaviour: Behaviour
  /** Options passed to behaviour.compute() */
  options: Record<string, unknown>
}

// =============================================================================
// Momentum Driver types
// =============================================================================

/**
 * Configuration for momentum-based scrolling driver.
 * Used by infinite carousel and similar transform-based scroll experiences.
 */
export interface MomentumDriverConfig {
  /** Friction coefficient (0.90 = high friction, 0.98 = low friction). Default: 0.92 */
  friction: number
  /** Minimum velocity before snapping (sections per frame). Default: 0.00005 */
  snapThreshold: number
  /** Velocity multiplier for wheel input. Default: 0.00005 */
  wheelMultiplier: number
  /** Snap animation duration (ms). Default: 150 */
  snapDuration: number
  /** Snap easing function. Default: 'power2.out' */
  snapEasing: string
  /** Whether to enable infinite looping. Default: true */
  infinite: boolean
  /** Delay before snap begins after scroll stops (ms). Default: 400 */
  snapDelay: number
  /** Progress threshold for snap decision (0-0.5). Default: 0.25 */
  snapProgressThreshold: number
  /** Smoothness factor for lerp interpolation (0.1 = very smooth, 0.3 = responsive). Default: 0.12 */
  smoothness: number
}

/**
 * Driver interface for class-based drivers.
 * Manages element registration and applies CSS variables at 60fps.
 *
 * Lifecycle:
 * 1. constructor() - add event listeners with { passive: true }
 * 2. register() - add target to internal Map
 * 3. tick() - called every frame, computes and applies CSS vars
 * 4. unregister() - remove target from Map
 * 5. destroy() - remove event listeners, clear Map
 */
export interface Driver {
  /**
   * Register an element with the driver.
   * @param id - Unique identifier for this registration
   * @param element - DOM element to animate
   * @param behaviour - Behaviour that computes CSS variables
   * @param options - Options passed to behaviour.compute()
   */
  register(id: string, element: HTMLElement, behaviour: Behaviour, options: Record<string, unknown>): void

  /**
   * Unregister an element from the driver.
   * @param id - Identifier used during registration
   */
  unregister(id: string): void

  /**
   * Clean up driver resources.
   * Removes event listeners and clears all registered targets.
   */
  destroy(): void
}
