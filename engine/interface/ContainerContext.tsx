'use client'

/**
 * Container Context
 *
 * Provides container mode awareness for engine components.
 * Enables rendering in both full-page and contained (canvas/preview) contexts.
 *
 * Usage:
 * - Full page (default): No wrapper needed, uses document/viewport
 * - Contained: Wrap SiteRenderer with ContainerProvider
 *
 * @example
 * // Canvas preview (contained)
 * const containerRef = useRef<HTMLDivElement>(null)
 *
 * <div ref={containerRef} className="canvas-container">
 *   <ContainerProvider mode="contained" containerRef={containerRef}>
 *     <SiteRenderer site={site} page={page} />
 *   </ContainerProvider>
 * </div>
 */

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
  type RefObject,
} from 'react'

/**
 * Container mode determines how the engine handles viewport-relative sizing.
 * - 'fullpage': Uses browser viewport (100svh, window.innerHeight)
 * - 'contained': Uses container dimensions (100%, containerRef.clientHeight)
 */
export type ContainerMode = 'fullpage' | 'contained'

/**
 * Container configuration passed through context.
 */
export interface ContainerConfig {
  /** Rendering mode */
  mode: ContainerMode
  /** Reference to container element (required for contained mode) */
  containerRef?: RefObject<HTMLElement | null>
  /** Target element for portals (defaults to container or document.body) */
  portalTarget?: HTMLElement | null
  /** Get current viewport height (container or window) */
  getViewportHeight: () => number
  /** Get current viewport width (container or window) */
  getViewportWidth: () => number
}

const defaultConfig: ContainerConfig = {
  mode: 'fullpage',
  getViewportHeight: () =>
    typeof window !== 'undefined' ? window.innerHeight : 0,
  getViewportWidth: () =>
    typeof window !== 'undefined' ? window.innerWidth : 0,
}

const ContainerContext = createContext<ContainerConfig>(defaultConfig)

/**
 * Props for ContainerProvider.
 */
export interface ContainerProviderProps {
  /** Rendering mode: 'fullpage' (default) or 'contained' */
  mode?: ContainerMode
  /** Reference to container element (required for contained mode) */
  containerRef?: RefObject<HTMLElement | null>
  /** Custom portal target (defaults to containerRef or document.body) */
  portalTarget?: HTMLElement | null
  children: ReactNode
}

/**
 * Provides container mode context to engine components.
 *
 * In contained mode, sets CSS custom properties on the container:
 * - --viewport-height: 100%
 * - --vh: 1%
 * - --viewport-width: 100%
 * - --vw: 1%
 * - --body-overflow: visible (prevents body lock)
 * - --body-height: auto
 * - --carousel-position: absolute
 * - --carousel-left: 0
 * - --carousel-transform: none
 * - --modal-position: absolute (for modal/overlay positioning)
 * - --overlay-position: absolute (for chrome overlays)
 */
export function ContainerProvider({
  mode = 'fullpage',
  containerRef,
  portalTarget,
  children,
}: ContainerProviderProps) {
  // Set CSS variables on container in contained mode
  useEffect(() => {
    if (mode !== 'contained' || !containerRef?.current) return

    const container = containerRef.current

    // Viewport unit overrides
    container.style.setProperty('--viewport-height', '100%')
    container.style.setProperty('--vh', '1%')
    container.style.setProperty('--viewport-width', '100%')
    container.style.setProperty('--vw', '1%')

    // Prevent body lock in contained mode
    container.style.setProperty('--body-overflow', 'visible')
    container.style.setProperty('--body-height', 'auto')

    // Carousel positioning for contained mode
    container.style.setProperty('--carousel-position', 'absolute')
    container.style.setProperty('--carousel-left', '0')
    container.style.setProperty('--carousel-transform', 'none')

    // Modal and overlay positioning for contained mode
    container.style.setProperty('--modal-position', 'absolute')
    container.style.setProperty('--overlay-position', 'absolute')

    // Mark container for CSS selectors
    container.setAttribute('data-container-mode', 'contained')

    return () => {
      container.style.removeProperty('--viewport-height')
      container.style.removeProperty('--vh')
      container.style.removeProperty('--viewport-width')
      container.style.removeProperty('--vw')
      container.style.removeProperty('--body-overflow')
      container.style.removeProperty('--body-height')
      container.style.removeProperty('--carousel-position')
      container.style.removeProperty('--carousel-left')
      container.style.removeProperty('--carousel-transform')
      container.style.removeProperty('--modal-position')
      container.style.removeProperty('--overlay-position')
      container.removeAttribute('data-container-mode')
    }
  }, [mode, containerRef])

  // Memoize context value
  const value = useMemo<ContainerConfig>(() => {
    const getViewportHeight = () => {
      if (mode === 'contained' && containerRef?.current) {
        return containerRef.current.clientHeight
      }
      return typeof window !== 'undefined' ? window.innerHeight : 0
    }

    const getViewportWidth = () => {
      if (mode === 'contained' && containerRef?.current) {
        return containerRef.current.clientWidth
      }
      return typeof window !== 'undefined' ? window.innerWidth : 0
    }

    return {
      mode,
      containerRef,
      portalTarget: portalTarget ?? containerRef?.current ?? null,
      getViewportHeight,
      getViewportWidth,
    }
  }, [mode, containerRef, portalTarget])

  return (
    <ContainerContext.Provider value={value}>
      {children}
    </ContainerContext.Provider>
  )
}

/**
 * Hook to access container context.
 * Returns default fullpage config if not wrapped in ContainerProvider.
 */
export function useContainer(): ContainerConfig {
  return useContext(ContainerContext)
}

/**
 * Hook to check if rendering in contained mode.
 */
export function useIsContained(): boolean {
  const { mode } = useContainer()
  return mode === 'contained'
}
