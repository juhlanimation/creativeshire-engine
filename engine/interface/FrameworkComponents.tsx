'use client'

/**
 * Framework Components
 *
 * Provides framework-specific primitives (Image, Link, router) to engine widgets.
 * Defaults to plain HTML — no framework dependency.
 * Platform injects optimized versions (e.g. next/image, next/link) via EngineProvider.
 *
 * @example
 * // Platform (Next.js)
 * import NextImage from 'next/image'
 * import NextLink from 'next/link'
 * import { useRouter } from 'next/navigation'
 *
 * <EngineProvider
 *   input={input}
 *   framework={{ Image: NextImage, Link: NextLink, useRouter }}
 * >
 *   <SiteRenderer ... />
 * </EngineProvider>
 */

import {
  createContext,
  forwardRef,
  useContext,
  type ComponentType,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from 'react'

// =============================================================================
// Primitive Interfaces
// =============================================================================

/**
 * Props for the framework Image component.
 * Matches the subset of next/image that the engine uses.
 */
export interface FrameworkImageProps {
  ref?: Ref<HTMLImageElement>
  id?: string
  className?: string
  src: string
  alt: string
  style?: CSSProperties
  'data-behaviour'?: string
  width?: number
  height?: number
  sizes?: string
  priority?: boolean
  quality?: number
}

/**
 * Props for the framework Link component.
 * Matches the subset of next/link that the engine uses.
 */
export interface FrameworkLinkProps {
  ref?: Ref<HTMLAnchorElement>
  href: string
  children?: ReactNode
  className?: string
  style?: CSSProperties
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void
  [key: string]: unknown
}

/**
 * Router interface for programmatic navigation.
 * Matches the subset of next/navigation useRouter that the engine uses.
 */
export interface FrameworkRouter {
  push: (url: string) => void
  replace: (url: string) => void
  back: () => void
}

/**
 * Framework components injected by the platform.
 */
export interface FrameworkComponentsConfig {
  /** Image component (default: plain <img>) */
  Image: ComponentType<FrameworkImageProps>
  /** Link component for internal navigation (default: plain <a>) */
  Link: ComponentType<FrameworkLinkProps>
  /** Router hook for programmatic navigation (default: window.location) */
  useRouter: () => FrameworkRouter
}

// =============================================================================
// Default Implementations (plain HTML — no framework dependency)
// =============================================================================

const DefaultImage = forwardRef<HTMLImageElement, FrameworkImageProps>(
  function DefaultImage({ priority, quality, sizes, ...props }, ref) {
    return <img ref={ref} loading={priority ? 'eager' : 'lazy'} {...props} />
  }
)

const DefaultLink = forwardRef<HTMLAnchorElement, FrameworkLinkProps>(
  function DefaultLink({ href, children, ...props }, ref) {
    return (
      <a ref={ref} href={href} {...props}>
        {children}
      </a>
    )
  }
)

function useDefaultRouter(): FrameworkRouter {
  return {
    push: (url: string) => { window.location.href = url },
    replace: (url: string) => { window.location.replace(url) },
    back: () => { window.history.back() },
  }
}

// =============================================================================
// Context
// =============================================================================

const defaultComponents: FrameworkComponentsConfig = {
  Image: DefaultImage,
  Link: DefaultLink,
  useRouter: useDefaultRouter,
}

const FrameworkContext = createContext<FrameworkComponentsConfig>(defaultComponents)

// =============================================================================
// Provider (used internally by EngineProvider)
// =============================================================================

export interface FrameworkProviderProps {
  components?: Partial<FrameworkComponentsConfig>
  children: ReactNode
}

export function FrameworkProvider({ components, children }: FrameworkProviderProps) {
  // If no overrides, skip wrapping — use defaults from context
  if (!components) return <>{children}</>

  const merged: FrameworkComponentsConfig = {
    ...defaultComponents,
    ...components,
  }

  return (
    <FrameworkContext.Provider value={merged}>
      {children}
    </FrameworkContext.Provider>
  )
}

// =============================================================================
// Hooks (consumed by engine widgets)
// =============================================================================

/** Get the framework Image component. */
export function useFrameworkImage(): ComponentType<FrameworkImageProps> {
  return useContext(FrameworkContext).Image
}

/** Get the framework Link component. */
export function useFrameworkLink(): ComponentType<FrameworkLinkProps> {
  return useContext(FrameworkContext).Link
}

/** Get the framework router for programmatic navigation. */
export function useFrameworkRouter(): FrameworkRouter {
  const { useRouter } = useContext(FrameworkContext)
  return useRouter()
}
