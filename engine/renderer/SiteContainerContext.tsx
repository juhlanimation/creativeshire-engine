'use client'

/**
 * Site Container Context
 *
 * Provides a reference to the site container element for portal targets.
 * This ensures overlays and modals stay inside the site container,
 * maintaining container query context and iframe compatibility.
 *
 * IMPORTANT: Portals MUST use the site container, never document.body.
 * Using document.body breaks:
 * - Container queries (overlays lose @container site context)
 * - Iframe embedding (overlays escape the iframe)
 *
 * Usage:
 * const { siteContainer } = useSiteContainer()
 * if (siteContainer) {
 *   createPortal(content, siteContainer)
 * }
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'

interface SiteContainerContextValue {
  /** The site container element (null during SSR/initial render) */
  siteContainer: HTMLElement | null
  /** Register the site container ref (called by SiteRenderer) */
  registerContainer: (element: HTMLElement | null) => void
}

const SiteContainerContext = createContext<SiteContainerContextValue>({
  siteContainer: null,
  registerContainer: () => {},
})

/**
 * Provider for site container context.
 * Wraps SiteRenderer content to expose the site container to children.
 */
export function SiteContainerProvider({ children }: { children: ReactNode }) {
  const [siteContainer, setSiteContainer] = useState<HTMLElement | null>(null)

  const registerContainer = useCallback((element: HTMLElement | null) => {
    setSiteContainer(element)
  }, [])

  return (
    <SiteContainerContext.Provider value={{ siteContainer, registerContainer }}>
      {children}
    </SiteContainerContext.Provider>
  )
}

/**
 * Hook to access the site container.
 * Returns the site container element for use as portal target.
 */
export function useSiteContainer(): SiteContainerContextValue {
  return useContext(SiteContainerContext)
}

/**
 * Component that registers the site container element.
 * Rendered inside SiteRenderer to capture the container ref.
 */
export function SiteContainerRegistrar({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLElement | null>
}) {
  const { registerContainer } = useSiteContainer()

  useEffect(() => {
    registerContainer(containerRef.current)
    return () => registerContainer(null)
  }, [containerRef, registerContainer])

  return null
}
