'use client'

/**
 * useIntersection - tracks section visibility via IntersectionObserver.
 *
 * Writes:
 * - sectionVisibilities: Record<sectionId, ratio 0-1>
 *
 * Architecture:
 * - Auto-discovers sections with data-section-id attribute
 * - Uses MutationObserver to watch for dynamically added sections
 * - Updates store with intersection ratios for smooth transitions
 */

import { useEffect, useRef } from 'react'
import type { TriggerProps } from './types'

/**
 * Intersection trigger hook.
 * Observes all elements with data-section-id and updates store.sectionVisibilities.
 *
 * Uses 21 thresholds (0, 0.05, 0.10, ... 1.0) for smooth visibility transitions.
 * Automatically discovers new sections via MutationObserver.
 */
export function useIntersection({ store }: TriggerProps): void {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const mutationObserverRef = useRef<MutationObserver | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Create thresholds for smooth visibility updates (0, 0.05, 0.10, ... 1.0)
    const thresholds = Array.from({ length: 21 }, (_, i) => i / 20)

    // Create IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        const updates: Record<string, number> = {}

        entries.forEach((entry) => {
          const id = entry.target.getAttribute('data-section-id')

          // Skip elements managed by lifecycle (e.g., slideshow sections at inset:0)
          // Their visibility is determined by activeSection state, not intersection
          const hasLifecycle = entry.target.hasAttribute('data-lifecycle-scope') ||
                               entry.target.closest('[data-lifecycle-scope]')

          if (id && !hasLifecycle) {
            updates[id] = entry.intersectionRatio
          }
        })

        // Batch update to store
        if (Object.keys(updates).length > 0) {
          store.setState((state) => ({
            sectionVisibilities: { ...state.sectionVisibilities, ...updates },
          }))
        }
      },
      { threshold: thresholds }
    )
    observerRef.current = observer

    // Helper to observe an element
    const observeElement = (el: Element) => {
      if (el.hasAttribute('data-section-id')) {
        observer.observe(el)
      }
    }

    // Observe existing sections
    document.querySelectorAll('[data-section-id]').forEach(observeElement)

    // Watch for dynamically added sections
    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof Element) {
            // Check the node itself
            observeElement(node)
            // Check children
            node.querySelectorAll('[data-section-id]').forEach(observeElement)
          }
        })
      })
    })
    mutationObserverRef.current = mutationObserver

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    })

    return () => {
      observer.disconnect()
      mutationObserver.disconnect()
      observerRef.current = null
      mutationObserverRef.current = null
    }
  }, [store])
}
