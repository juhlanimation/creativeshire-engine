/**
 * Page transition registry with lazy loading support.
 *
 * Supports two registration modes:
 * 1. Eager: Transition object registered directly
 * 2. Lazy: Loader function registered, transition loaded on demand
 */

import type { PageTransition, PageTransitionMeta } from './types'

/** Registry entry - either loaded transition or lazy loader */
type RegistryEntry =
  | { type: 'loaded'; transition: PageTransition }
  | { type: 'lazy'; meta: PageTransitionMeta; loader: () => Promise<PageTransition> }

/** Registry of available page transitions by ID */
const registry = new Map<string, RegistryEntry>()

/**
 * Helper function for defining type-safe transition metadata.
 */
export function definePageTransitionMeta<T>(meta: PageTransitionMeta<T>): PageTransitionMeta<T> {
  return meta
}

/**
 * Register a page transition eagerly.
 */
export function registerPageTransition(transition: PageTransition): void {
  if (registry.has(transition.id)) {
    console.warn(`Page transition "${transition.id}" is already registered. Overwriting.`)
  }
  registry.set(transition.id, { type: 'loaded', transition })
}

/**
 * Register a page transition lazily with metadata.
 * Transition code loads only when getPageTransitionAsync() is called.
 */
export function registerLazyPageTransition(
  meta: PageTransitionMeta,
  loader: () => Promise<PageTransition>
): void {
  if (registry.has(meta.id)) {
    console.warn(`Page transition "${meta.id}" is already registered. Overwriting.`)
  }
  registry.set(meta.id, { type: 'lazy', meta, loader })
}

/**
 * Get a page transition by ID (async to support lazy loading).
 * Loads and caches lazy transitions on first access.
 */
export async function getPageTransitionAsync(id: string): Promise<PageTransition | undefined> {
  const entry = registry.get(id)
  if (!entry) return undefined

  if (entry.type === 'loaded') {
    return entry.transition
  }

  // Lazy: load and cache
  const transition = await entry.loader()
  registry.set(id, { type: 'loaded', transition })
  return transition
}

/**
 * Get a page transition synchronously.
 * Returns undefined for lazy transitions that haven't loaded yet.
 */
export function getPageTransition(id: string): PageTransition | undefined {
  const entry = registry.get(id)
  if (!entry) return undefined
  if (entry.type === 'loaded') return entry.transition
  return undefined // Lazy not yet loaded
}

/**
 * Preload a page transition (useful for route prefetching).
 */
export async function preloadPageTransition(id: string): Promise<void> {
  await getPageTransitionAsync(id)
}

/**
 * Get all page transition metadata (without loading lazy transitions).
 */
export function getAllPageTransitionMetas(): PageTransitionMeta[] {
  return Array.from(registry.values()).map((entry) =>
    entry.type === 'loaded'
      ? {
          id: entry.transition.id,
          name: entry.transition.name,
          description: entry.transition.description,
          ...(entry.transition.icon && { icon: entry.transition.icon }),
          ...(entry.transition.tags && { tags: entry.transition.tags }),
          ...(entry.transition.category && { category: entry.transition.category }),
          ...(entry.transition.settings && { settings: entry.transition.settings }),
        }
      : entry.meta
  )
}

/**
 * Get all registered page transition IDs.
 */
export function getPageTransitionIds(): string[] {
  return Array.from(registry.keys())
}
