/**
 * animateElement - promise-based CSS animation helper.
 *
 * Applies a CSS class to trigger an animation, waits for the
 * `animationend` event, removes the class, and resolves.
 *
 * Uses `animationend` event for reliable completion detection
 * instead of setTimeout, which can drift from actual animation timing.
 *
 * @example
 * ```ts
 * // Fade out an element
 * await animateElement(wrapper, { className: 'page-transition--exiting' })
 *
 * // Element has now faded out, class has been removed
 * router.push('/next-page')
 * ```
 */

// =============================================================================
// Types
// =============================================================================

export interface AnimateElementOptions {
  /** CSS class to add (triggers the animation) */
  className: string
  /** Fallback timeout in ms if animationend doesn't fire (default: 2000) */
  timeout?: number
  /** Whether to remove the class after animation (default: true) */
  removeClassOnComplete?: boolean
  /**
   * Element to listen for animationend on.
   * Defaults to the element the class is applied to.
   * Use when the CSS animation runs on a child element (e.g., overlay inside wrapper).
   */
  animationTarget?: HTMLElement | null
}

// =============================================================================
// Helper
// =============================================================================

/**
 * Animate an element using CSS class-based animations.
 *
 * 1. Adds the specified CSS class
 * 2. Waits for `animationend` event (or timeout)
 * 3. Removes the class (unless removeClassOnComplete is false)
 * 4. Resolves the promise
 *
 * @param element - The element to animate (null-safe)
 * @param options - Animation options
 * @returns Promise that resolves when animation completes
 */
export function animateElement(
  element: HTMLElement | null,
  options: AnimateElementOptions
): Promise<void> {
  return new Promise((resolve) => {
    // Null-safe: resolve immediately if no element
    if (!element) {
      resolve()
      return
    }

    const { className, timeout = 2000, removeClassOnComplete = true, animationTarget } = options

    // Listen on animationTarget if provided (e.g., child overlay), else on element itself
    const listenEl = animationTarget ?? element

    let resolved = false

    const cleanup = () => {
      if (resolved) return
      resolved = true
      listenEl.removeEventListener('animationend', handleAnimationEnd)
      if (removeClassOnComplete) {
        element.classList.remove(className)
      }
      resolve()
    }

    const handleAnimationEnd = (e: AnimationEvent) => {
      if (e.target === listenEl) {
        cleanup()
      }
    }

    // Listen for animation end on the target element
    listenEl.addEventListener('animationend', handleAnimationEnd)

    // Add class to trigger animation
    element.classList.add(className)

    // Fallback timeout in case animationend never fires
    // (e.g., animation was cancelled, or CSS doesn't define an animation)
    setTimeout(cleanup, timeout)
  })
}

/**
 * Check if the user prefers reduced motion.
 * Useful for skipping animations entirely.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
