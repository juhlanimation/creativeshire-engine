'use client'

/**
 * Pinned Backdrop Context
 *
 * Provides a portal target for pinned sections that need to escape
 * ScrollSmoother's transform context. The backdrop is a fixed-position
 * element rendered OUTSIDE #smooth-wrapper, so portalled content is
 * truly viewport-fixed with no containing block issues.
 *
 * Usage:
 * const { backdropTarget } = usePinnedBackdrop()
 * if (backdropTarget) {
 *   createPortal(content, backdropTarget)
 * }
 */

import {
  createContext,
  useContext,
  useState,
  useLayoutEffect,
  useCallback,
  type ReactNode,
} from 'react'

interface PinnedBackdropContextValue {
  /** The backdrop element (null during SSR/initial render) */
  backdropTarget: HTMLElement | null
  /** Register the backdrop ref (called by SiteRenderer) */
  registerBackdrop: (element: HTMLElement | null) => void
}

const PinnedBackdropContext = createContext<PinnedBackdropContextValue>({
  backdropTarget: null,
  registerBackdrop: () => {},
})

/**
 * Provider for pinned backdrop context.
 * Wraps SiteRenderer to expose the backdrop element to SectionRenderer.
 */
export function PinnedBackdropProvider({ children }: { children: ReactNode }) {
  const [backdropTarget, setBackdropTarget] = useState<HTMLElement | null>(null)

  const registerBackdrop = useCallback((element: HTMLElement | null) => {
    setBackdropTarget(element)
  }, [])

  return (
    <PinnedBackdropContext.Provider value={{ backdropTarget, registerBackdrop }}>
      {children}
    </PinnedBackdropContext.Provider>
  )
}

/**
 * Hook to access the pinned backdrop target.
 * Used by SectionRenderer to portal pinned section content.
 */
export function usePinnedBackdrop(): PinnedBackdropContextValue {
  return useContext(PinnedBackdropContext)
}

/**
 * Component that registers the backdrop element.
 * Uses useLayoutEffect so the backdrop is available BEFORE browser paint.
 * This prevents a flash where pinned sections render inline then portal —
 * critical for intro triggers (useVideoTime) that capture video element refs
 * in useEffect (which fires after paint).
 */
export function PinnedBackdropRegistrar({
  backdropRef,
}: {
  backdropRef: React.RefObject<HTMLElement | null>
}) {
  const { registerBackdrop } = usePinnedBackdrop()

  useLayoutEffect(() => {
    registerBackdrop(backdropRef.current)
    return () => registerBackdrop(null)
  }, [backdropRef, registerBackdrop])

  return null
}
