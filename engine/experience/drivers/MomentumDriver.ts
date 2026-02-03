/**
 * MomentumDriver - Class-based driver for momentum-based scrolling.
 *
 * Powers infinite carousel experiences with physics-based scrolling.
 * Intercepts wheel/touch events, applies friction, and snaps to sections.
 *
 * Architecture:
 * - Event listeners use { passive: false } for wheel (need preventDefault)
 * - Touch events use { passive: true } for better mobile performance
 * - Updates Zustand store with scroll progress, velocity, and section state
 * - Uses GSAP for smooth snap animations
 * - Implements infinite wrapping: ((progress % total) + total) % total
 *
 * Key differences from ScrollDriver:
 * - Does NOT implement Driver interface (no register/unregister)
 * - Controls entire container, not individual elements
 * - Manages its own physics state (velocity, momentum)
 * - Updates external Zustand store instead of CSS variables
 */

import type { StoreApi } from 'zustand'
import gsap from 'gsap'
import type { MomentumDriverConfig } from './types'
import type { InfiniteCarouselState } from '../experiences/types'

/**
 * Default configuration for momentum physics.
 * Values tuned from bishoy-gendi-portfolio reference implementation.
 */
const DEFAULT_CONFIG: MomentumDriverConfig = {
  friction: 0.92,
  snapThreshold: 0.00005,
  wheelMultiplier: 0.00005,
  snapDuration: 400,
  snapEasing: 'power3.inOut',
  infinite: true,
  snapDelay: 400,
  snapProgressThreshold: 0.25,
  smoothness: 0.12,
}

/**
 * Internal momentum state tracked by the driver.
 */
interface MomentumState {
  /** Current scroll velocity (sections per frame) */
  velocity: number
  /** Current scroll progress (continuous float, smoothly interpolated) */
  scrollProgress: number
  /** Target scroll progress (where input wants to go, velocity applied here) */
  targetProgress: number
  /** Target scroll progress for snap animation ref */
  targetScroll: { current: number }
  /** Last touch Y position */
  lastTouchY: number
  /** Timestamp when velocity reached zero */
  velocityZeroTime: number | null
  /** Whether snap delay timer is running */
  snapTimerPending: boolean
  /** Active snap animation (for cleanup) */
  snapTween: gsap.core.Tween | null
}

/**
 * Section height info for tall section handling.
 * Passed from controller to control snapping behavior.
 */
interface SectionHeightInfo {
  /** Section height as ratio to viewport (1.0 = 100vh, 1.5 = 150vh) */
  heightRatio: number
}

/**
 * MomentumDriver applies momentum physics to scroll-like interactions.
 * Updates a Zustand store with scroll progress and section state.
 */
export class MomentumDriver {
  /** Container element that receives input events */
  private container: HTMLElement

  /** Zustand store to update with state changes */
  private store: StoreApi<InfiniteCarouselState>

  /** Merged configuration */
  private config: MomentumDriverConfig

  /** Total number of sections (set via setTotalSections) */
  private totalSections = 1

  /** Section height info for snap control */
  private sectionHeights: SectionHeightInfo[] = []

  /** Internal momentum state */
  private state: MomentumState = {
    velocity: 0,
    scrollProgress: 0,
    targetProgress: 0,
    targetScroll: { current: 0 },
    lastTouchY: 0,
    velocityZeroTime: null,
    snapTimerPending: false,
    snapTween: null,
  }

  /** Animation frame ID for cleanup */
  private rafId: number | null = null

  /** Flag to track if driver is destroyed */
  private isDestroyed = false

  /** Snap delay timeout ID */
  private snapTimeoutId: ReturnType<typeof setTimeout> | null = null

  constructor(
    container: HTMLElement,
    store: StoreApi<InfiniteCarouselState>,
    config: Partial<MomentumDriverConfig> = {}
  ) {
    this.container = container
    this.store = store
    this.config = { ...DEFAULT_CONFIG, ...config }

    // Only run in browser environment
    if (typeof window === 'undefined') return

    // Initialize state from store
    const storeState = store.getState()
    this.state.scrollProgress = storeState.scrollProgress
    this.state.targetProgress = storeState.scrollProgress
    this.state.targetScroll.current = storeState.scrollProgress
    this.totalSections = storeState.totalSections

    // Add wheel listener with passive: false to allow preventDefault
    this.container.addEventListener('wheel', this.onWheel, { passive: false })

    // Add touch listeners
    this.container.addEventListener('touchstart', this.onTouchStart, { passive: true })
    this.container.addEventListener('touchmove', this.onTouchMove, { passive: false })
    this.container.addEventListener('touchend', this.onTouchEnd, { passive: true })

    // Start the animation loop
    this.tick()
  }

  /**
   * Set the total number of sections.
   * Called when sections mount to update wrapping bounds.
   */
  setTotalSections(count: number): void {
    this.totalSections = count
    this.store.setState({ totalSections: count })
  }

  /**
   * Set section height information.
   * Used to control snap behavior based on section height.
   */
  setSectionHeights(heights: Array<{ heightRatio: number }>): void {
    this.sectionHeights = heights.map(h => ({
      heightRatio: h.heightRatio,
    }))
  }

  /**
   * Check if the current section should snap.
   * Only snap when near edges (start/end) of any section.
   * This allows free scrolling through content while still snapping at boundaries.
   */
  private shouldSnapCurrentSection(): boolean {
    const currentIndex = Math.floor(this.state.scrollProgress) % this.totalSections
    const heightInfo = this.sectionHeights[currentIndex]
    const heightRatio = heightInfo?.heightRatio ?? 1.0

    // Only snap when near edges
    // Edge zone is 15% of a viewport height, scaled by section height
    const fractional = this.state.scrollProgress - Math.floor(this.state.scrollProgress)
    const edgeThreshold = 0.15 / heightRatio

    // Snap if near start (fractional < edgeThreshold) or near end (fractional > 1 - edgeThreshold)
    return fractional < edgeThreshold || fractional > (1 - edgeThreshold)
  }

  /**
   * Get the height ratio for the current section.
   * Used to scale scroll speed - taller sections need more scrolling.
   */
  private getCurrentSectionHeightRatio(): number {
    const currentIndex = Math.floor(this.state.scrollProgress) % this.totalSections
    const heightInfo = this.sectionHeights[currentIndex]
    return heightInfo ? heightInfo.heightRatio : 1.0
  }

  /**
   * Wheel event handler - arrow function for stable reference.
   * Accumulates velocity from wheel delta.
   */
  private onWheel = (e: WheelEvent): void => {
    // Prevent native scroll
    e.preventDefault()

    // Check if we're in intro phase - ignore input
    const { phase, hasLooped } = this.store.getState()
    if (phase === 'intro') return

    // Cancel any active snap animation
    this.cancelSnap()

    // Get direction multiplier based on deltaY
    const direction = Math.sign(e.deltaY)

    // Prevent backward scroll at start before looping
    if (!hasLooped && this.state.scrollProgress <= 0 && direction < 0) {
      return
    }

    // Scale scroll speed by section height - taller sections need more scrolling
    // A 200vh section takes 2x as much scroll as a 100vh section
    const heightRatio = this.getCurrentSectionHeightRatio()
    const scaledMultiplier = this.config.wheelMultiplier / heightRatio

    // Accumulate velocity
    const delta = e.deltaY * scaledMultiplier
    this.state.velocity += delta

    // Reset snap timer
    this.resetSnapTimer()
  }

  /**
   * Touch start handler - arrow function for stable reference.
   * Records initial touch position.
   */
  private onTouchStart = (e: TouchEvent): void => {
    // Check if we're in intro phase - ignore input
    const { phase } = this.store.getState()
    if (phase === 'intro') return

    // Cancel any active snap animation
    this.cancelSnap()

    // Record touch position
    const touch = e.touches[0]
    if (touch) {
      this.state.lastTouchY = touch.clientY
    }
  }

  /**
   * Touch move handler - arrow function for stable reference.
   * Converts touch delta to velocity.
   */
  private onTouchMove = (e: TouchEvent): void => {
    // Prevent native scroll
    e.preventDefault()

    // Check if we're in intro phase - ignore input
    const { phase, hasLooped } = this.store.getState()
    if (phase === 'intro') return

    const touch = e.touches[0]
    if (!touch) return

    // Calculate delta (inverted - swipe up = scroll down)
    const deltaY = this.state.lastTouchY - touch.clientY
    this.state.lastTouchY = touch.clientY

    // Prevent backward scroll at start before looping
    const direction = Math.sign(deltaY)
    if (!hasLooped && this.state.scrollProgress <= 0 && direction < 0) {
      return
    }

    // Scale scroll speed by section height - taller sections need more scrolling
    const heightRatio = this.getCurrentSectionHeightRatio()
    const scaledMultiplier = (this.config.wheelMultiplier * 2) / heightRatio

    // Apply velocity (touch needs higher multiplier)
    const delta = deltaY * scaledMultiplier
    this.state.velocity += delta

    // Reset snap timer
    this.resetSnapTimer()
  }

  /**
   * Touch end handler - arrow function for stable reference.
   * Triggers snap consideration after touch release.
   */
  private onTouchEnd = (): void => {
    // Reset snap timer on touch end
    this.resetSnapTimer()
  }

  /**
   * Cancel any active snap animation.
   */
  private cancelSnap(): void {
    if (this.state.snapTween) {
      this.state.snapTween.kill()
      this.state.snapTween = null
    }

    if (this.snapTimeoutId) {
      clearTimeout(this.snapTimeoutId)
      this.snapTimeoutId = null
    }

    this.state.snapTimerPending = false
    this.store.setState({ isSnapping: false, snapTarget: -1 })
  }

  /**
   * Reset the snap delay timer.
   * Snap triggers after velocity stays at zero for snapDelay ms.
   */
  private resetSnapTimer(): void {
    // Clear existing timer
    if (this.snapTimeoutId) {
      clearTimeout(this.snapTimeoutId)
      this.snapTimeoutId = null
    }

    this.state.snapTimerPending = false
    this.state.velocityZeroTime = null
  }

  /**
   * Start snap animation to target section.
   */
  private snapToSection(targetSection: number): void {
    // Already snapping to this target
    if (this.store.getState().snapTarget === targetSection) return

    // Calculate snap target progress
    const snapTarget = targetSection

    // Update store
    this.store.setState({
      isSnapping: true,
      snapTarget: targetSection,
    })

    // Animate to target using GSAP
    this.state.snapTween = gsap.to(this.state.targetScroll, {
      current: snapTarget,
      duration: this.config.snapDuration / 1000,
      ease: this.config.snapEasing,
      onUpdate: () => {
        // Update scroll progress from animated target (bypasses lerp during snap)
        this.state.scrollProgress = this.state.targetScroll.current
        this.state.targetProgress = this.state.targetScroll.current
        this.updateStore()
      },
      onComplete: () => {
        // Snap to exact integer to avoid floating-point imprecision
        this.state.scrollProgress = snapTarget
        this.state.targetProgress = snapTarget
        this.state.targetScroll.current = snapTarget
        this.updateStore()
        this.state.snapTween = null
        this.store.setState({ isSnapping: false, snapTarget: -1 })
      },
    })
  }

  /**
   * Calculate which section to snap to based on current progress.
   */
  private calculateSnapTarget(): number {
    const progress = this.state.scrollProgress
    const fractional = progress - Math.floor(progress)

    // Use threshold to determine snap direction
    if (fractional < this.config.snapProgressThreshold) {
      return Math.floor(progress)
    } else if (fractional > 1 - this.config.snapProgressThreshold) {
      return Math.ceil(progress)
    } else {
      // In the middle - snap to nearest
      return Math.round(progress)
    }
  }

  /**
   * Animation frame tick - arrow function for stable reference.
   * Applies friction to velocity, updates targetProgress, and lerps scrollProgress.
   */
  private tick = (): void => {
    if (this.isDestroyed) return

    const { isSnapping, phase } = this.store.getState()

    // Don't apply physics during snap animation or intro
    if (!isSnapping && phase === 'ready') {
      // Apply friction to velocity
      this.state.velocity *= this.config.friction

      // Stop tiny velocities
      if (Math.abs(this.state.velocity) < this.config.snapThreshold) {
        this.state.velocity = 0

        // Start snap timer if not already pending AND current section allows snapping
        // Tall sections (> 100vh) don't snap so users can scroll through content
        if (!this.state.snapTimerPending && !this.snapTimeoutId && this.shouldSnapCurrentSection()) {
          this.state.snapTimerPending = true
          this.snapTimeoutId = setTimeout(() => {
            // Only snap if still zero velocity, not destroyed, and section allows snap
            if (!this.isDestroyed && Math.abs(this.state.velocity) < this.config.snapThreshold && this.shouldSnapCurrentSection()) {
              const snapTarget = this.calculateSnapTarget()
              this.snapToSection(snapTarget)
            }
            this.state.snapTimerPending = false
            this.snapTimeoutId = null
          }, this.config.snapDelay)
        }
      } else {
        // Velocity is non-zero, reset snap timer
        this.resetSnapTimer()
      }

      // Apply velocity to TARGET progress (not scrollProgress directly)
      this.state.targetProgress += this.state.velocity

      // Handle infinite wrapping on target
      if (this.config.infinite && this.totalSections > 0) {
        const total = this.totalSections

        // Check if we've looped
        if (this.state.targetProgress >= total) {
          this.store.setState({ hasLooped: true })
        }

        // Wrap target progress
        this.state.targetProgress = ((this.state.targetProgress % total) + total) % total
      } else {
        // Clamp target for non-infinite mode
        this.state.targetProgress = Math.max(0, Math.min(this.state.targetProgress, this.totalSections - 1))
      }

      // Lerp scrollProgress toward targetProgress (smooth interpolation)
      let diff = this.state.targetProgress - this.state.scrollProgress

      // Handle wrap-around: take shortest path in infinite mode
      if (this.config.infinite && this.totalSections > 0) {
        const total = this.totalSections
        if (Math.abs(diff) > total / 2) {
          // Crossing the wrap boundary - adjust diff to take shorter path
          diff = diff > 0 ? diff - total : diff + total
        }
      }

      // Apply lerp interpolation
      this.state.scrollProgress += diff * this.config.smoothness

      // Handle wrapping on scrollProgress after lerp
      if (this.config.infinite && this.totalSections > 0) {
        const total = this.totalSections
        this.state.scrollProgress = ((this.state.scrollProgress % total) + total) % total
      }

      // Keep targetScroll in sync for snap animation compatibility
      this.state.targetScroll.current = this.state.targetProgress

      // Update store with new state
      this.updateStore()
    }

    this.rafId = requestAnimationFrame(this.tick)
  }

  /**
   * Update the Zustand store with current state.
   */
  private updateStore(): void {
    const currentSection = Math.floor(this.state.scrollProgress) % this.totalSections
    const previousSection = this.store.getState().activeSection

    // Determine transition direction
    let transitionDirection: 'forward' | 'backward' | null = null
    if (currentSection !== previousSection) {
      // Handle wrap-around direction detection
      if (this.config.infinite) {
        const diff = currentSection - previousSection
        const wrapDiff = this.totalSections - Math.abs(diff)

        if (Math.abs(diff) <= wrapDiff) {
          transitionDirection = diff > 0 ? 'forward' : 'backward'
        } else {
          transitionDirection = diff > 0 ? 'backward' : 'forward'
        }
      } else {
        transitionDirection = currentSection > previousSection ? 'forward' : 'backward'
      }
    }

    this.store.setState({
      scrollProgress: this.state.scrollProgress,
      velocity: this.state.velocity,
      activeSection: currentSection,
      previousSection: currentSection !== previousSection ? previousSection : this.store.getState().previousSection,
      transitionProgress: this.state.scrollProgress - Math.floor(this.state.scrollProgress),
      transitionDirection,
      isTransitioning: Math.abs(this.state.velocity) > this.config.snapThreshold,
    })
  }

  /**
   * Clean up driver resources.
   * Removes event listeners, cancels animation frame, clears timers.
   */
  destroy(): void {
    // Mark as destroyed to prevent further updates
    this.isDestroyed = true

    // Cancel snap animation
    this.cancelSnap()

    // Remove event listeners
    this.container.removeEventListener('wheel', this.onWheel)
    this.container.removeEventListener('touchstart', this.onTouchStart)
    this.container.removeEventListener('touchmove', this.onTouchMove)
    this.container.removeEventListener('touchend', this.onTouchEnd)

    // Cancel animation frame
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }

    // Clear snap timeout
    if (this.snapTimeoutId) {
      clearTimeout(this.snapTimeoutId)
      this.snapTimeoutId = null
    }
  }

  /**
   * Get current scroll progress (for testing).
   */
  get currentProgress(): number {
    return this.state.scrollProgress
  }

  /**
   * Get current velocity (for testing).
   */
  get currentVelocity(): number {
    return this.state.velocity
  }
}
