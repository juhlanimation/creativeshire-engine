'use client'

/**
 * SectionLifecycleProvider - manages content lifecycle for navigable experiences.
 *
 * In experiences with active section navigation (slideshow, endless cycle, etc.),
 * sections may be positioned in ways where IntersectionObserver can't determine
 * true visibility (stacked, transformed, etc.).
 *
 * Strategy: Mount on approach, keep mounted after visit.
 * - Active section: mounted and visible
 * - Adjacent sections (±1): mounted but hidden (ready for transitions)
 * - Previously visited sections: stay mounted (prevents remount flicker)
 * - Never visited + distant (±2+): unmounted (lazy loading)
 *
 * This is more robust than trying to pause individual animation types (GSAP, CSS,
 * video, canvas, etc.) - unmounted components simply can't run anything.
 *
 * Architecture: L2 Experience layer - sits between SectionRenderer and content.
 *
 * @example
 * ```tsx
 * // Used automatically by SectionRenderer when experience has navigation
 * <SectionLifecycleProvider
 *   isActive={isActive}
 *   sectionIndex={index}
 *   activeSection={activeSection}
 * >
 *   {children}
 * </SectionLifecycleProvider>
 * ```
 */

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

// =============================================================================
// Types
// =============================================================================

export interface SectionLifecycleContextValue {
  /** Whether this section is currently active (visible) */
  isActive: boolean
  /** Section index (0-based) */
  sectionIndex: number
}

export interface SectionLifecycleProviderProps {
  /** Whether this section is currently active */
  isActive: boolean
  /** Section index (0-based) */
  sectionIndex: number
  /** Currently active section index (for adjacency calculation) */
  activeSection: number
  /** Section content */
  children: ReactNode
}

// =============================================================================
// Context
// =============================================================================

const SectionLifecycleContext = createContext<SectionLifecycleContextValue | null>(null)

// =============================================================================
// Provider
// =============================================================================

/**
 * Provides lifecycle management for section content.
 * Mounts current + adjacent sections, unmounts distant sections.
 */
export function SectionLifecycleProvider({
  isActive,
  sectionIndex,
  activeSection,
  children,
}: SectionLifecycleProviderProps) {
  // Track if this section has ever been mounted (for lazy loading)
  const [hasBeenMounted, setHasBeenMounted] = useState(false)

  // Calculate if this section should be mounted
  // Mount if: active, adjacent (±1), or has been previously mounted
  // Once mounted, stay mounted to prevent remount flicker on quick navigation
  const distance = Math.abs(sectionIndex - activeSection)
  const isAdjacent = distance <= 1
  const shouldMount = isAdjacent || hasBeenMounted

  // Once mounted, track it (for potential future optimizations)
  useEffect(() => {
    if (shouldMount && !hasBeenMounted) {
      setHasBeenMounted(true)
    }
  }, [shouldMount, hasBeenMounted])

  // Don't render children if not mounted
  if (!shouldMount) {
    return (
      <SectionLifecycleContext.Provider value={{ isActive, sectionIndex }}>
        <div data-lifecycle-scope data-mounted="false" />
      </SectionLifecycleContext.Provider>
    )
  }

  return (
    <SectionLifecycleContext.Provider value={{ isActive, sectionIndex }}>
      <div data-lifecycle-scope data-mounted="true" data-active={isActive}>
        {children}
      </div>
    </SectionLifecycleContext.Provider>
  )
}

// =============================================================================
// Hook
// =============================================================================

/**
 * Access section lifecycle state.
 * Returns null if not within a SectionLifecycleProvider (e.g., stacking mode).
 *
 * @example
 * ```tsx
 * function MyWidget() {
 *   const lifecycle = useSectionLifecycle()
 *
 *   // In navigable experience
 *   if (lifecycle) {
 *     console.log('Active:', lifecycle.isActive)
 *   }
 *
 *   // In stacking mode (no lifecycle)
 *   // lifecycle is null, use IntersectionObserver instead
 * }
 * ```
 */
export function useSectionLifecycle(): SectionLifecycleContextValue | null {
  return useContext(SectionLifecycleContext)
}

export default SectionLifecycleProvider
