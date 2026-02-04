/**
 * Container-aware driver factory.
 *
 * Returns a ScrollDriver instance for the given container.
 * Uses keyed singleton pattern: one driver per container (null = window).
 *
 * This enables contained mode (iframe/preview) where each container
 * has its own driver with properly scoped IntersectionObserver and scroll tracking.
 *
 * Usage:
 * ```typescript
 * const { mode, containerRef } = useContainer()
 * const container = mode === 'contained' ? containerRef?.current : null
 * const driver = getDriver(container)
 * // ... use driver
 * releaseDriver(container)
 * ```
 */

import { ScrollDriver } from './ScrollDriver'

// Keyed by container element (or null for window/document)
const drivers = new Map<HTMLElement | null, ScrollDriver>()
const refCounts = new Map<HTMLElement | null, number>()

/**
 * Get or create a ScrollDriver for the given container.
 * Increments reference count for cleanup tracking.
 *
 * @param container - Container element for contained mode, or null for fullpage
 * @returns ScrollDriver instance for the container
 */
export function getDriver(container: HTMLElement | null = null): ScrollDriver {
  let driver = drivers.get(container)

  if (!driver) {
    driver = new ScrollDriver({ container: container ?? undefined })
    drivers.set(container, driver)
    refCounts.set(container, 0)
  }

  refCounts.set(container, (refCounts.get(container) ?? 0) + 1)
  return driver
}

/**
 * Release a reference to a ScrollDriver.
 * When reference count reaches 0, the driver is destroyed.
 *
 * @param container - Container element that was passed to getDriver
 */
export function releaseDriver(container: HTMLElement | null = null): void {
  const count = (refCounts.get(container) ?? 0) - 1
  refCounts.set(container, count)

  if (count <= 0) {
    const driver = drivers.get(container)
    driver?.destroy()
    drivers.delete(container)
    refCounts.delete(container)
  }
}

/**
 * Get current reference count for a container (for testing/debugging).
 */
export function getDriverRefCount(container: HTMLElement | null = null): number {
  return refCounts.get(container) ?? 0
}

/**
 * Check if a driver exists for a container (for testing/debugging).
 */
export function hasDriver(container: HTMLElement | null = null): boolean {
  return drivers.has(container)
}
