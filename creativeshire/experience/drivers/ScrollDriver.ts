/**
 * ScrollDriver - Class-based driver for scroll-based animations.
 *
 * Applies CSS variables at 60fps using requestAnimationFrame.
 * Bypasses React for performance-critical scroll animations.
 *
 * Architecture:
 * - Event listeners use { passive: true } for non-blocking scroll
 * - Targets stored in Map for O(1) lookup
 * - Only uses element.style.setProperty() for CSS variables
 * - IntersectionObserver tracks per-element visibility for sectionVisibility
 * - destroy() removes listeners and clears Map
 */

import type { Driver, Target } from './types'
import type { Behaviour } from '../behaviours/types'
import type { BehaviourState } from '../../schema/experience'

/**
 * Internal scroll state tracked by the driver.
 */
interface ScrollState {
  scrollProgress: number
  scrollVelocity: number
  lastScrollY: number
  lastTime: number
}

/**
 * Per-element visibility tracked by IntersectionObserver.
 */
interface ElementVisibility {
  /** Intersection ratio 0-1 */
  visibility: number
}

/**
 * ScrollDriver applies CSS variables based on scroll position.
 * Implements the Driver interface with register/unregister/destroy lifecycle.
 */
export class ScrollDriver implements Driver {
  /** Registered targets - Map for O(1) lookup */
  private targets: Map<string, Target> = new Map()

  /** Per-element visibility from IntersectionObserver */
  private visibility: Map<string, ElementVisibility> = new Map()

  /** Element ID lookup for IntersectionObserver callback */
  private elementIds: WeakMap<Element, string> = new WeakMap()

  /** IntersectionObserver for visibility tracking */
  private observer: IntersectionObserver | null = null

  /** Internal scroll state */
  private state: ScrollState = {
    scrollProgress: 0,
    scrollVelocity: 0,
    lastScrollY: 0,
    lastTime: 0,
  }

  /** Animation frame ID for cleanup */
  private rafId: number | null = null

  /** Flag to track if driver is destroyed */
  private isDestroyed = false

  constructor() {
    // Only run in browser environment
    if (typeof window === 'undefined') return

    // Initialize state
    this.state.lastScrollY = window.scrollY
    this.state.lastTime = performance.now()

    // Add scroll listener with passive: true for non-blocking scroll
    window.addEventListener('scroll', this.onScroll, { passive: true })

    // Create IntersectionObserver for visibility tracking
    // Uses threshold array for smooth visibility values
    this.observer = new IntersectionObserver(this.onIntersection, {
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
    })

    // Start the animation loop
    this.tick()
  }

  /**
   * IntersectionObserver callback - updates per-element visibility.
   * Arrow function for stable reference.
   */
  private onIntersection = (entries: IntersectionObserverEntry[]): void => {
    entries.forEach((entry) => {
      const id = this.elementIds.get(entry.target)
      if (id) {
        this.visibility.set(id, { visibility: entry.intersectionRatio })
      }
    })
  }

  /**
   * Scroll event handler - arrow function for stable reference.
   * Updates scroll state (velocity, progress).
   */
  private onScroll = (): void => {
    const now = performance.now()
    const scrollY = window.scrollY
    const maxScroll = document.body.scrollHeight - window.innerHeight
    const deltaTime = now - this.state.lastTime

    // Calculate velocity (pixels per millisecond)
    if (deltaTime > 0) {
      this.state.scrollVelocity = (scrollY - this.state.lastScrollY) / deltaTime
    }

    // Calculate progress (0-1)
    this.state.scrollProgress = maxScroll > 0 ? scrollY / maxScroll : 0

    // Update last values
    this.state.lastScrollY = scrollY
    this.state.lastTime = now
  }

  /**
   * Animation frame tick - arrow function for stable reference.
   * Requests next frame and updates all targets.
   */
  private tick = (): void => {
    if (this.isDestroyed) return

    this.update()
    this.rafId = requestAnimationFrame(this.tick)
  }

  /**
   * Update all registered targets.
   * Calls behaviour.compute() and applies CSS variables via setProperty().
   */
  private update(): void {
    // Batch read: get current scroll state once
    const { scrollProgress, scrollVelocity } = this.state

    // Batch write: update all targets
    this.targets.forEach(({ element, behaviour, options }, id) => {
      // Get per-element visibility from IntersectionObserver
      const elementVisibility = this.visibility.get(id)?.visibility ?? 0

      // Build state object for behaviour
      const behaviourState: BehaviourState = {
        scrollProgress,
        scrollVelocity,
        sectionProgress: scrollProgress, // Default to global progress
        sectionVisibility: elementVisibility, // Per-element visibility from observer
        sectionIndex: 0,
        totalSections: 1,
        isActive: true,
        prefersReducedMotion:
          typeof window !== 'undefined' &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      }

      // Compute CSS variables from behaviour
      const vars = behaviour.compute(behaviourState, options)

      // Apply CSS variables via setProperty
      Object.entries(vars).forEach(([key, value]) => {
        element.style.setProperty(key, String(value))
      })
    })
  }

  /**
   * Register an element with the driver.
   * Adds target to internal Map for animation updates.
   * Starts observing element for visibility tracking.
   */
  register(
    id: string,
    element: HTMLElement,
    behaviour: Behaviour,
    options: Record<string, unknown> = {}
  ): void {
    if (this.isDestroyed) {
      console.warn('ScrollDriver: Cannot register after destroy()')
      return
    }

    this.targets.set(id, { element, behaviour, options })

    // Track element ID for IntersectionObserver callback
    this.elementIds.set(element, id)

    // Initialize visibility and start observing
    this.visibility.set(id, { visibility: 0 })
    this.observer?.observe(element)
  }

  /**
   * Unregister an element from the driver.
   * Removes target from Map and stops observing for visibility.
   */
  unregister(id: string): void {
    const target = this.targets.get(id)
    if (target) {
      // Stop observing the element
      this.observer?.unobserve(target.element)
      this.elementIds.delete(target.element)
    }

    this.targets.delete(id)
    this.visibility.delete(id)
  }

  /**
   * Clean up driver resources.
   * Removes event listeners, cancels animation frame, clears all targets.
   */
  destroy(): void {
    // Mark as destroyed to prevent further updates
    this.isDestroyed = true

    // Remove scroll listener
    if (typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.onScroll)
    }

    // Disconnect IntersectionObserver
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }

    // Cancel animation frame
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }

    // Clear all targets and visibility tracking
    this.targets.clear()
    this.visibility.clear()
  }

  /**
   * Get the number of registered targets (for testing).
   */
  get targetCount(): number {
    return this.targets.size
  }
}
