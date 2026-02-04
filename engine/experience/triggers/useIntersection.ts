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
 *
 * Container-aware:
 * In contained mode, uses the container as the IntersectionObserver root
 * and scopes element discovery to the container.
 */

import { useEffect, useRef } from 'react'
import type { TriggerProps } from './types'

/**
 * Intersection trigger hook.
 * Observes all elements with data-section-id and updates store.sectionVisibilities.
 *
 * Uses 21 thresholds (0, 0.05, 0.10, ... 1.0) for smooth visibility transitions.
 * Automatically discovers new sections via MutationObserver.
 *
 * In contained mode, uses container as root for IntersectionObserver.
 */
export function useIntersection({ store, containerMode, containerRef }: TriggerProps): void {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const mutationObserverRef = useRef<MutationObserver | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Determine root and scope based on container mode
    const isContained = containerMode === 'contained' && containerRef?.current
    const observerRoot = isContained ? containerRef.current : null // null = viewport
    // Scope to container in contained mode, or site container in fullpage mode
    // Never use document.body directly - breaks iframe support
    const scopeElement = isContained
      ? containerRef.current
      : document.querySelector<HTMLElement>('[data-site-renderer]')

    // Create thresholds for smooth visibility updates (0, 0.05, 0.10, ... 1.0)
    const thresholds = Array.from({ length: 21 }, (_, i) => i / 20)

    // Create IntersectionObserver with container as root in contained mode
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
      { threshold: thresholds, root: observerRoot }
    )
    observerRef.current = observer

    // Helper to observe an element
    const observeElement = (el: Element) => {
      if (el.hasAttribute('data-section-id')) {
        observer.observe(el)
      }
    }

    // Observe existing sections within scope
    scopeElement?.querySelectorAll('[data-section-id]').forEach(observeElement)

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

    if (scopeElement) {
      mutationObserver.observe(scopeElement, {
        childList: true,
        subtree: true,
      })
    }

    return () => {
      observer.disconnect()
      mutationObserver.disconnect()
      observerRef.current = null
      mutationObserverRef.current = null
    }
  }, [store, containerMode, containerRef])
}
