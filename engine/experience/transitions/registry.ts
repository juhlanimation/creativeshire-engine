/**
 * Page transition registry with lazy loading support.
 *
 * Supports two registration modes:
 * 1. Eager: Transition object registered directly
 * 2. Lazy: Loader function registered, transition loaded on demand
 */

import type { PageTransition, PageTransitionMeta } from './types'
import type { TransitionConfig } from '../../schema/transition'

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

// =============================================================================
// Compiled Transition Config Registry
// =============================================================================

/** Metadata for a compiled transition config (transition + settings bundled) */
export interface TransitionConfigMeta {
  /** Unique identifier (e.g., 'default-fade') */
  id: string
  /** Human-readable name (e.g., 'Default Fade') */
  name: string
  /** Description for CMS display */
  description: string
  /** Icon identifier for CMS UI */
  icon?: string
}

/** Registry of compiled transition configs */
const transitionConfigRegistry = new Map<string, { meta: TransitionConfigMeta; config: TransitionConfig }>()

/**
 * Register a compiled transition config (full config with meta).
 */
export function registerTransitionConfig(meta: TransitionConfigMeta, config: TransitionConfig): void {
  if (transitionConfigRegistry.has(meta.id)) {
    console.warn(`[Transition] Compiled config "${meta.id}" already registered, overwriting`)
  }
  transitionConfigRegistry.set(meta.id, { meta, config })
}

/**
 * Get a compiled transition config by ID.
 */
export function getRegisteredTransitionConfig(id: string): TransitionConfig | undefined {
  return transitionConfigRegistry.get(id)?.config
}

/**
 * Get meta for all registered compiled transition configs.
 */
export function getAllRegisteredTransitionMetas(): TransitionConfigMeta[] {
  return Array.from(transitionConfigRegistry.values()).map((entry) => entry.meta)
}

/**
 * Find which compiled transition config matches a given TransitionConfig (by transition ID).
 * Returns the compiled config ID, or undefined if no match.
 */
export function findTransitionConfigIdBySchemaConfig(config: TransitionConfig): string | undefined {
  for (const [id, entry] of transitionConfigRegistry) {
    if (entry.config.id === config.id) {
      return id
    }
  }
  return undefined
}

// =============================================================================
// URL Override Helpers (Dev Mode)
// =============================================================================

/** Query param name for transition override */
export const DEV_TRANSITION_PARAM = '_transition'

/**
 * Get current transition override from URL.
 * Returns config ID, 'none' to disable, or null for no override.
 */
export function getTransitionOverride(): string | null {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  return params.get(DEV_TRANSITION_PARAM)
}

/**
 * Set transition override in URL and reload.
 * Transitions need a fresh setup, so a reload is required.
 */
export function setTransitionOverride(id: string | null): void {
  if (typeof window === 'undefined') return

  const url = new URL(window.location.href)
  if (id) {
    url.searchParams.set(DEV_TRANSITION_PARAM, id)
  } else {
    url.searchParams.delete(DEV_TRANSITION_PARAM)
  }

  window.location.href = url.toString()
}
