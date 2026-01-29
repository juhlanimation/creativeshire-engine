/**
 * VisibilityDriver - tracks section visibility via IntersectionObserver.
 * Updates sectionVisibilities in ExperienceState store.
 *
 * Architecture:
 * - Observes elements with data-section-id attribute
 * - Updates store with intersection ratios (0-1)
 * - Sections register/unregister via observe/unobserve methods
 */

import type { Driver } from './types'
import type { StoreApi } from 'zustand'
import type { ExperienceState } from '../types'

/**
 * VisibilityDriver class.
 * Implements Driver interface with IntersectionObserver for section visibility.
 */
export class VisibilityDriver implements Driver {
  id = 'visibility'
  private observer: IntersectionObserver | null = null
  private store: StoreApi<ExperienceState>

  constructor(store: StoreApi<ExperienceState>) {
    this.store = store
  }

  start(): void {
    // Create thresholds for smooth visibility updates (0, 0.05, 0.10, ... 1.0)
    const thresholds = Array.from({ length: 21 }, (_, i) => i / 20)

    this.observer = new IntersectionObserver(
      (entries) => {
        const updates: Record<string, number> = {}

        entries.forEach((entry) => {
          const id = entry.target.getAttribute('data-section-id')
          if (id) {
            updates[id] = entry.intersectionRatio
          }
        })

        // Batch update to store
        if (Object.keys(updates).length > 0) {
          this.store.setState((state) => ({
            sectionVisibilities: { ...state.sectionVisibilities, ...updates },
          }))
        }
      },
      { threshold: thresholds }
    )

    // Observe any existing sections (for SSR hydration)
    document.querySelectorAll('[data-section-id]').forEach((el) => {
      this.observer?.observe(el)
    })
  }

  stop(): void {
    this.observer?.disconnect()
  }

  destroy(): void {
    this.stop()
    this.observer = null
  }

  /**
   * Register an element for visibility tracking.
   * Called when sections mount.
   */
  observe(element: Element): void {
    this.observer?.observe(element)
  }

  /**
   * Unregister an element from visibility tracking.
   * Called when sections unmount.
   */
  unobserve(element: Element): void {
    this.observer?.unobserve(element)
  }
}
