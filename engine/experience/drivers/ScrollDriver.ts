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
 *
 * Container-aware:
 * Can operate on a container element instead of window for iframe/preview mode.
 */

import type { Driver, Target } from './types'
import type { Behaviour } from '../behaviours/types'
import type { BehaviourState } from '../../schema/experience'

/**
 * Configuration options for ScrollDriver.
 */
export interface ScrollDriverConfig {
  /** Container element to track scroll on (defaults to window) */
  container?: HTMLElement | null
}

/**
 * Internal scroll state tracked by the driver.
 */
interface ScrollState {
  scrollProgress: number
  scrollVelocity: number
  lastScrollY: number
  lastTime: number
  /** Dirty flag - only update when scroll or visibility changes */
  needsUpdate: boolean
}

/**
 * Per-element visibility tracked by IntersectionObserver.
 */
interface ElementVisibility {
  /** Intersection ratio 0-1 */
  visibility: number
}

/**
 * Visibility getter function type.
 * Used for sections that get visibility from the store instead of local observer.
 */
export type VisibilityGetter = () => number

/**
 * ScrollDriver applies CSS variables based on scroll position.
 * Implements the Driver interface with register/unregister/destroy lifecycle.
 */
export class ScrollDriver implements Driver {
  /** Registered targets - Map for O(1) lookup */
  private targets: Map<string, Target> = new Map()

  /** Per-element visibility from IntersectionObserver (for non-section elements) */
  private visibility: Map<string, ElementVisibility> = new Map()

  /** Store-based visibility getters (for sections tracked by useIntersection) */
  private storeVisibilities: Map<string, VisibilityGetter> = new Map()

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
    needsUpdate: true, // Start dirty to apply initial values
  }

  /** Animation frame ID for cleanup */
  private rafId: number | null = null

  /** Flag to track if driver is destroyed */
  private isDestroyed = false

  /** Cached reduced motion preference (checked once at start, updated on change) */
  private prefersReducedMotion = false

  /** MediaQueryList for reduced motion */
  private reducedMotionQuery: MediaQueryList | null = null

  /** Container element for contained mode (null = window) */
  private container: HTMLElement | null = null

  /** Scroll target (container or window) */
  private scrollTarget!: HTMLElement | Window

  constructor(config?: ScrollDriverConfig) {
    // Only run in browser environment
    if (typeof window === 'undefined') return

    // Set container mode
    this.container = config?.container ?? null
    this.scrollTarget = this.container ?? window

    // Initialize state
    this.state.lastScrollY = this.getScrollY()
    this.state.lastTime = performance.now()

    // Add scroll listener with passive: true for non-blocking scroll
    this.scrollTarget.addEventListener('scroll', this.onScroll, { passive: true })

    // Create IntersectionObserver for visibility tracking
    // Uses threshold array for smooth visibility values
    // In container mode, use container as root
    this.observer = new IntersectionObserver(this.onIntersection, {
      root: this.container, // null = viewport, HTMLElement = container
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
    })

    // Cache reduced motion preference (avoid calling matchMedia every frame)
    this.reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    this.prefersReducedMotion = this.reducedMotionQuery.matches
    this.reducedMotionQuery.addEventListener('change', this.onReducedMotionChange)

    // Start the animation loop
    this.tick()
  }

  /**
   * Get current scroll position (container or window).
   */
  private getScrollY(): number {
    if (this.container) {
      return this.container.scrollTop
    }
    return window.scrollY
  }

  /**
   * Get max scroll distance (container or document).
   * Uses document.documentElement for fullpage mode (not document.body).
   */
  private getMaxScroll(): number {
    if (this.container) {
      return this.container.scrollHeight - this.container.clientHeight
    }
    // Use documentElement for cross-browser compatibility
    // (document.body can have quirks, documentElement is more reliable)
    return document.documentElement.scrollHeight - window.innerHeight
  }

  /**
   * Reduced motion preference change handler.
   */
  private onReducedMotionChange = (e: MediaQueryListEvent): void => {
    this.prefersReducedMotion = e.matches
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
    // Mark dirty - visibility changed, needs update
    if (entries.length > 0) {
      this.state.needsUpdate = true
    }
  }

  /**
   * Scroll event handler - arrow function for stable reference.
   * Updates scroll state (velocity, progress).
   */
  private onScroll = (): void => {
    const now = performance.now()
    const scrollY = this.getScrollY()
    const maxScroll = this.getMaxScroll()
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

    // Mark dirty - needs update on next frame
    this.state.needsUpdate = true
  }

  /**
   * Animation frame tick - arrow function for stable reference.
   * Requests next frame and updates all targets only when dirty.
   */
  private tick = (): void => {
    if (this.isDestroyed) return

    // For elements using store-based visibility (sections), we must update every frame
    // because the store can change without triggering our local IntersectionObserver.
    // For elements using local observer only, we can skip frames when nothing changed.
    const hasStoreVisibilities = this.storeVisibilities.size > 0

    if (this.state.needsUpdate || hasStoreVisibilities) {
      this.state.needsUpdate = false
      this.update()
    }

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
      // Get visibility - prefer store-based getter (for sections), fallback to local observer
      const storeGetter = this.storeVisibilities.get(id)
      const elementVisibility = storeGetter?.()
        ?? this.visibility.get(id)?.visibility
        ?? 0

      // Build state object for behaviour
      const behaviourState: BehaviourState = {
        scrollProgress,
        scrollVelocity,
        sectionProgress: scrollProgress, // Default to global progress
        sectionVisibility: elementVisibility,
        sectionIndex: 0,
        totalSections: 1,
        isActive: true,
        prefersReducedMotion: this.prefersReducedMotion, // Use cached value
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
   *
   * @param id - Unique identifier for this element
   * @param element - DOM element to apply CSS variables to
   * @param behaviour - Behaviour definition with compute function
   * @param options - Options passed to behaviour.compute()
   * @param visibilityGetter - Optional getter for store-based visibility (sections).
   *   If provided, local IntersectionObserver is skipped for this element.
   *   This prevents duplicate observers when useIntersection already tracks the element.
   */
  register(
    id: string,
    element: HTMLElement,
    behaviour: Behaviour,
    options: Record<string, unknown> = {},
    visibilityGetter?: VisibilityGetter
  ): void {
    if (this.isDestroyed) {
      console.warn('ScrollDriver: Cannot register after destroy()')
      return
    }

    this.targets.set(id, { element, behaviour, options })

    // Use store-based visibility getter if provided (for sections)
    // This avoids duplicate IntersectionObserver tracking
    if (visibilityGetter) {
      this.storeVisibilities.set(id, visibilityGetter)
    } else {
      // Only use local IntersectionObserver for non-section elements
      this.elementIds.set(element, id)
      this.visibility.set(id, { visibility: 0 })
      this.observer?.observe(element)
    }

    // Get initial visibility - from getter or default to 0
    const initialVisibility = visibilityGetter?.() ?? 0

    // Apply initial CSS variables synchronously to prevent flash
    // Without this, elements flash visible for 1 frame before RAF applies vars
    const initialState: BehaviourState = {
      scrollProgress: this.state.scrollProgress,
      scrollVelocity: 0,
      sectionProgress: 0,
      sectionVisibility: initialVisibility,
      sectionIndex: 0,
      totalSections: 1,
      isActive: true,
      prefersReducedMotion: this.prefersReducedMotion,
    }
    const vars = behaviour.compute(initialState, options)
    Object.entries(vars).forEach(([key, value]) => {
      element.style.setProperty(key, String(value))
    })

    // Mark dirty to apply values on next frame (visibility may change)
    this.state.needsUpdate = true
  }

  /**
   * Unregister an element from the driver.
   * Removes target from Map and stops observing for visibility.
   */
  unregister(id: string): void {
    const target = this.targets.get(id)
    if (target) {
      // Stop observing the element (only if using local observer)
      if (!this.storeVisibilities.has(id)) {
        this.observer?.unobserve(target.element)
        this.elementIds.delete(target.element)
      }
    }

    this.targets.delete(id)
    this.visibility.delete(id)
    this.storeVisibilities.delete(id)
  }

  /**
   * Clean up driver resources.
   * Removes event listeners, cancels animation frame, clears all targets.
   */
  destroy(): void {
    // Mark as destroyed to prevent further updates
    this.isDestroyed = true

    // Remove scroll listener from the correct target
    if (typeof window !== 'undefined') {
      this.scrollTarget.removeEventListener('scroll', this.onScroll)
    }

    // Remove reduced motion listener
    if (this.reducedMotionQuery) {
      this.reducedMotionQuery.removeEventListener('change', this.onReducedMotionChange)
      this.reducedMotionQuery = null
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
    this.storeVisibilities.clear()
  }

  /**
   * Get the number of registered targets (for testing).
   */
  get targetCount(): number {
    return this.targets.size
  }
}
