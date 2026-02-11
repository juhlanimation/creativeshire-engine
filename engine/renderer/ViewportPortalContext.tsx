'use client'

/**
 * Viewport Portal Context
 *
 * Provides portal targets for components that need to escape CSS containment.
 * The engine's container-type, contain, and transform ancestors create containing
 * blocks that trap position:fixed descendants. These viewport layers sit OUTSIDE
 * all containment, as siblings of [data-site-renderer].
 *
 * Two layers:
 * - backgroundLayer (z-index: 0) — behind site content (fullscreen video backdrops)
 * - foregroundLayer (z-index: 100) — above site content (modals, lightboxes)
 *
 * Usage:
 * const { backgroundLayer, foregroundLayer } = useViewportPortal()
 * if (backgroundLayer) {
 *   createPortal(content, backgroundLayer)
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

interface ViewportPortalContextValue {
  /** Background layer element — behind site content (null during SSR/contained mode) */
  backgroundLayer: HTMLElement | null
  /** Foreground layer element — above site content (null during SSR/contained mode) */
  foregroundLayer: HTMLElement | null
  /** Register the background layer ref (called by SiteRenderer) */
  registerBackgroundLayer: (element: HTMLElement | null) => void
  /** Register the foreground layer ref (called by SiteRenderer) */
  registerForegroundLayer: (element: HTMLElement | null) => void
}

const ViewportPortalContext = createContext<ViewportPortalContextValue>({
  backgroundLayer: null,
  foregroundLayer: null,
  registerBackgroundLayer: () => {},
  registerForegroundLayer: () => {},
})

/**
 * Provider for viewport portal context.
 * Wraps SiteRenderer to expose viewport layers to any descendant component.
 */
export function ViewportPortalProvider({ children }: { children: ReactNode }) {
  const [backgroundLayer, setBackgroundLayer] = useState<HTMLElement | null>(null)
  const [foregroundLayer, setForegroundLayer] = useState<HTMLElement | null>(null)

  const registerBackgroundLayer = useCallback((element: HTMLElement | null) => {
    setBackgroundLayer(element)
  }, [])

  const registerForegroundLayer = useCallback((element: HTMLElement | null) => {
    setForegroundLayer(element)
  }, [])

  return (
    <ViewportPortalContext.Provider value={{
      backgroundLayer,
      foregroundLayer,
      registerBackgroundLayer,
      registerForegroundLayer,
    }}>
      {children}
    </ViewportPortalContext.Provider>
  )
}

/**
 * Hook to access viewport portal layers.
 * Returns null for both layers in contained mode or during SSR.
 */
export function useViewportPortal() {
  const { backgroundLayer, foregroundLayer } = useContext(ViewportPortalContext)
  return { backgroundLayer, foregroundLayer }
}

/**
 * Component that registers the viewport layer elements.
 * Uses useLayoutEffect so layers are available BEFORE browser paint,
 * preventing flash of inline-rendered content before portal.
 */
export function ViewportPortalRegistrar({
  backgroundRef,
  foregroundRef,
}: {
  backgroundRef: React.RefObject<HTMLElement | null>
  foregroundRef: React.RefObject<HTMLElement | null>
}) {
  const { registerBackgroundLayer, registerForegroundLayer } = useContext(ViewportPortalContext)

  useLayoutEffect(() => {
    registerBackgroundLayer(backgroundRef.current)
    return () => registerBackgroundLayer(null)
  }, [backgroundRef, registerBackgroundLayer])

  useLayoutEffect(() => {
    registerForegroundLayer(foregroundRef.current)
    return () => registerForegroundLayer(null)
  }, [foregroundRef, registerForegroundLayer])

  return null
}
