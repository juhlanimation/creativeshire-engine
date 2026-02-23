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
import { MIN_PAINT_OPACITY, type Behaviour } from '../behaviours/types'
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

  /** Cached max scroll distance (recomputed on resize) */
  private cachedMaxScroll = 0

  /** Per-target last-written CSS values (skip redundant setProperty calls) */
  private lastValues: Map<string, Record<string, string>> = new Map()

  /** Last-frame store visibility values (detect changes for idle-aware tick) */
  private lastStoreVisibilities: Map<string, number> = new Map()

  /** Reusable state object (avoids allocation per target per frame) */
  private reusableState: BehaviourState = {
    scrollProgress: 0,
    scrollVelocity: 0,
    sectionProgress: 0,
    sectionVisibility: 0,
    sectionIndex: 0,
    totalSections: 1,
    isActive: true,
    isHovered: false,
    isPressed: false,
    prefersReducedMotion: false,
  }

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

    // Cache max scroll distance (recomputed on resize)
    this.cachedMaxScroll = this.computeMaxScroll()
    window.addEventListener('resize', this.onResize, { passive: true })

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
   * Compute max scroll distance (container or document).
   * Uses document.documentElement for fullpage mode (not document.body).
   */
  private computeMaxScroll(): number {
    if (this.container) {
      return this.container.scrollHeight - this.container.clientHeight
    }
    return document.documentElement.scrollHeight - window.innerHeight
  }

  /**
   * Resize handler - recompute cached max scroll.
   */
  private onResize = (): void => {
    this.cachedMaxScroll = this.computeMaxScroll()
    this.state.needsUpdate = true
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
    const deltaTime = now - this.state.lastTime

    // Calculate velocity (pixels per millisecond)
    if (deltaTime > 0) {
      this.state.scrollVelocity = (scrollY - this.state.lastScrollY) / deltaTime
    }

    // Calculate progress (0-1) using cached max scroll
    this.state.scrollProgress = this.cachedMaxScroll > 0
      ? scrollY / this.cachedMaxScroll
      : 0

    // Update last values
    this.state.lastScrollY = scrollY
    this.state.lastTime = now

    // Mark dirty - needs update on next frame
    this.state.needsUpdate = true
  }

  /**
   * Animation frame tick - arrow function for stable reference.
   * Idle-aware: skips update when nothing changed (scroll, local observer, OR store visibility).
   */
  private tick = (): void => {
    if (this.isDestroyed) return

    // Check if any store-based visibility changed since last frame
    let storeChanged = false
    if (this.storeVisibilities.size > 0) {
      this.storeVisibilities.forEach((getter, id) => {
        const current = getter()
        if (current !== this.lastStoreVisibilities.get(id)) {
          this.lastStoreVisibilities.set(id, current)
          storeChanged = true
        }
      })
    }

    if (this.state.needsUpdate || storeChanged) {
      this.state.needsUpdate = false
      this.update()
    }

    this.rafId = requestAnimationFrame(this.tick)
  }

  /**
   * Update all registered targets.
   * Calls behaviour.compute() and applies CSS variables via setProperty().
   * Uses reusable state object and value-change guard to minimize allocations and DOM writes.
   */
  private update(): void {
    // Batch read: get current scroll state once
    const { scrollProgress, scrollVelocity } = this.state

    // Update shared fields on reusable state (mutate, don't allocate)
    this.reusableState.scrollProgress = scrollProgress
    this.reusableState.scrollVelocity = scrollVelocity
    this.reusableState.sectionProgress = scrollProgress
    this.reusableState.prefersReducedMotion = this.prefersReducedMotion

    // Batch write: update all targets
    this.targets.forEach(({ element, behaviour, options }, id) => {
      // Get visibility - prefer store-based getter (for sections), fallback to local observer
      const storeGetter = this.storeVisibilities.get(id)
      this.reusableState.sectionVisibility = storeGetter?.()
        ?? this.visibility.get(id)?.visibility
        ?? 0

      // Compute CSS variables from behaviour (pass element for DOM-aware behaviours)
      const vars = behaviour.compute(this.reusableState, options, element)

      // Value-change guard: only call setProperty when value actually changed
      let cached = this.lastValues.get(id)
      if (!cached) {
        cached = {}
        this.lastValues.set(id, cached)
      }

      for (const key in vars) {
        let value = String(vars[key as keyof typeof vars])
        // Prerasterize: clamp opacity vars to minimum paint threshold
        if (behaviour.prerasterize && key.includes('opacity')) {
          const num = Number(vars[key as keyof typeof vars])
          if (num < MIN_PAINT_OPACITY) value = String(MIN_PAINT_OPACITY)
        }
        if (cached[key] !== value) {
          cached[key] = value
          element.style.setProperty(key, value)
        }
      }
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
      isHovered: false,
      isPressed: false,
      prefersReducedMotion: this.prefersReducedMotion,
    }
    const vars = behaviour.compute(initialState, options, element)
    const cached: Record<string, string> = {}
    for (const key in vars) {
      let value = String(vars[key as keyof typeof vars])
      if (behaviour.prerasterize && key.includes('opacity')) {
        const num = Number(vars[key as keyof typeof vars])
        if (num < MIN_PAINT_OPACITY) value = String(MIN_PAINT_OPACITY)
      }
      cached[key] = value
      element.style.setProperty(key, value)
    }
    this.lastValues.set(id, cached)

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
    this.lastValues.delete(id)
    this.lastStoreVisibilities.delete(id)
  }

  /**
   * Clean up driver resources.
   * Removes event listeners, cancels animation frame, clears all targets.
   */
  destroy(): void {
    // Mark as destroyed to prevent further updates
    this.isDestroyed = true

    // Remove scroll and resize listeners
    if (typeof window !== 'undefined') {
      this.scrollTarget.removeEventListener('scroll', this.onScroll)
      window.removeEventListener('resize', this.onResize)
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

    // Clear all targets, visibility tracking, and caches
    this.targets.clear()
    this.visibility.clear()
    this.storeVisibilities.clear()
    this.lastValues.clear()
    this.lastStoreVisibilities.clear()
  }

  /**
   * Get the number of registered targets (for testing).
   */
  get targetCount(): number {
    return this.targets.size
  }
}
