'use client'

/**
 * Viewport Portal Context
 *
 * Provides portal targets for components that need to escape CSS containment.
 * The engine's container-type, contain, and transform ancestors create containing
 * blocks that trap position:fixed descendants. These viewport layers sit OUTSIDE
 * all containment, as siblings of [data-site-renderer].
 *
 * Three layers:
 * - backgroundLayer (z-index: 0) — behind site content (fullscreen video backdrops)
 * - chromeLayer (no stacking context) — overlay header/footer portal target
 * - foregroundLayer (z-index: 100) — above site content (modals, lightboxes)
 *
 * chromeLayer is a non-stacking-context div so that headers portaled there
 * participate at the root compositing level — mix-blend-mode works against
 * page content below.
 *
 * Usage:
 * const { backgroundLayer, foregroundLayer, chromeLayer } = useViewportPortal()
 * if (chromeLayer) {
 *   createPortal(headerContent, chromeLayer)
 * }
 */

import {
  createContext,
  useContext,
  useState,
  useLayoutEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react'

interface ViewportPortalContextValue {
  /** Background layer element — behind site content (null during SSR/contained mode) */
  backgroundLayer: HTMLElement | null
  /** Chrome layer element — non-stacking-context target for overlay headers (null during SSR/contained mode) */
  chromeLayer: HTMLElement | null
  /** Foreground layer element — above site content (null during SSR/contained mode) */
  foregroundLayer: HTMLElement | null
  /** Register the background layer ref (called by SiteRenderer) */
  registerBackgroundLayer: (element: HTMLElement | null) => void
  /** Register the chrome layer ref (called by SiteRenderer) */
  registerChromeLayer: (element: HTMLElement | null) => void
  /** Register the foreground layer ref (called by SiteRenderer) */
  registerForegroundLayer: (element: HTMLElement | null) => void
}

const ViewportPortalContext = createContext<ViewportPortalContextValue>({
  backgroundLayer: null,
  chromeLayer: null,
  foregroundLayer: null,
  registerBackgroundLayer: () => {},
  registerChromeLayer: () => {},
  registerForegroundLayer: () => {},
})

/**
 * Provider for viewport portal context.
 * Wraps SiteRenderer to expose viewport layers to any descendant component.
 */
export function ViewportPortalProvider({ children }: { children: ReactNode }) {
  const [backgroundLayer, setBackgroundLayer] = useState<HTMLElement | null>(null)
  const [chromeLayer, setChromeLayer] = useState<HTMLElement | null>(null)
  const [foregroundLayer, setForegroundLayer] = useState<HTMLElement | null>(null)

  const registerBackgroundLayer = useCallback((element: HTMLElement | null) => {
    setBackgroundLayer(element)
  }, [])

  const registerChromeLayer = useCallback((element: HTMLElement | null) => {
    setChromeLayer(element)
  }, [])

  const registerForegroundLayer = useCallback((element: HTMLElement | null) => {
    setForegroundLayer(element)
  }, [])

  const value = useMemo(() => ({
    backgroundLayer,
    chromeLayer,
    foregroundLayer,
    registerBackgroundLayer,
    registerChromeLayer,
    registerForegroundLayer,
  }), [backgroundLayer, chromeLayer, foregroundLayer, registerBackgroundLayer, registerChromeLayer, registerForegroundLayer])

  return (
    <ViewportPortalContext.Provider value={value}>
      {children}
    </ViewportPortalContext.Provider>
  )
}

/**
 * Hook to access viewport portal layers.
 * Returns null for both layers in contained mode or during SSR.
 */
export function useViewportPortal() {
  const { backgroundLayer, chromeLayer, foregroundLayer } = useContext(ViewportPortalContext)
  return { backgroundLayer, chromeLayer, foregroundLayer }
}

/**
 * Component that registers the viewport layer elements.
 * Uses useLayoutEffect so layers are available BEFORE browser paint,
 * preventing flash of inline-rendered content before portal.
 */
export function ViewportPortalRegistrar({
  backgroundRef,
  chromeRef,
  foregroundRef,
}: {
  backgroundRef: React.RefObject<HTMLElement | null>
  chromeRef: React.RefObject<HTMLElement | null>
  foregroundRef: React.RefObject<HTMLElement | null>
}) {
  const { registerBackgroundLayer, registerChromeLayer, registerForegroundLayer } = useContext(ViewportPortalContext)

  useLayoutEffect(() => {
    registerBackgroundLayer(backgroundRef.current)
    return () => registerBackgroundLayer(null)
  }, [backgroundRef, registerBackgroundLayer])

  useLayoutEffect(() => {
    registerChromeLayer(chromeRef.current)
    return () => registerChromeLayer(null)
  }, [chromeRef, registerChromeLayer])

  useLayoutEffect(() => {
    registerForegroundLayer(foregroundRef.current)
    return () => registerForegroundLayer(null)
  }, [foregroundRef, registerForegroundLayer])

  return null
}
