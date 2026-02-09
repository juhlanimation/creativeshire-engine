/**
 * Intro pattern registry with lazy loading support.
 *
 * Supports two registration modes:
 * 1. Eager: Pattern object registered directly
 * 2. Lazy: Loader function registered, pattern loaded on demand
 */

import type { IntroPattern, IntroPatternMeta, IntroMeta, IntroConfig } from './types'

/** Registry entry - either loaded pattern or lazy loader */
type RegistryEntry =
  | { type: 'loaded'; pattern: IntroPattern }
  | { type: 'lazy'; meta: IntroPatternMeta; loader: () => Promise<IntroPattern> }

/** Registry of intro patterns by ID */
const registry = new Map<string, RegistryEntry>()

/**
 * Type-safe define helper for intro pattern metadata.
 */
export function defineIntroPatternMeta<T>(meta: IntroPatternMeta<T>): IntroPatternMeta<T> {
  return meta
}

/**
 * Register an intro pattern eagerly.
 */
export function registerIntroPattern(pattern: IntroPattern): void {
  if (registry.has(pattern.id)) {
    console.warn(`[Intro] Pattern "${pattern.id}" already registered, overwriting`)
  }
  registry.set(pattern.id, { type: 'loaded', pattern })
}

/**
 * Register an intro pattern lazily with metadata.
 * Pattern code loads only when getIntroPatternAsync() is called.
 */
export function registerLazyIntroPattern(
  meta: IntroPatternMeta,
  loader: () => Promise<IntroPattern>
): void {
  if (registry.has(meta.id)) {
    console.warn(`[Intro] Pattern "${meta.id}" already registered, overwriting`)
  }
  registry.set(meta.id, { type: 'lazy', meta, loader })
}

/**
 * Get an intro pattern by ID (async to support lazy loading).
 * Loads and caches lazy patterns on first access.
 */
export async function getIntroPatternAsync(id: string): Promise<IntroPattern | undefined> {
  const entry = registry.get(id)
  if (!entry) return undefined

  if (entry.type === 'loaded') {
    return entry.pattern
  }

  // Lazy: load and cache
  const pattern = await entry.loader()
  registry.set(id, { type: 'loaded', pattern })
  return pattern
}

/**
 * Get an intro pattern by ID (sync).
 * Returns undefined for lazy patterns that haven't loaded yet.
 */
export function getIntroPattern(id: string): IntroPattern | undefined {
  const entry = registry.get(id)
  if (!entry) return undefined
  if (entry.type === 'loaded') return entry.pattern
  return undefined // Lazy not yet loaded
}

/**
 * Preload an intro pattern (useful for route prefetching).
 */
export async function preloadIntroPattern(id: string): Promise<void> {
  await getIntroPatternAsync(id)
}

/**
 * Get all registered pattern IDs.
 */
export function getIntroPatternIds(): string[] {
  return Array.from(registry.keys())
}

/**
 * Get all registered patterns (loaded only).
 */
export function getAllIntroPatterns(): IntroPattern[] {
  return Array.from(registry.values())
    .filter((entry): entry is { type: 'loaded'; pattern: IntroPattern } => entry.type === 'loaded')
    .map((entry) => entry.pattern)
}

/**
 * Get meta-only data for all registered patterns (for CMS listing).
 * Works for both loaded and lazy entries without triggering loading.
 */
export function getAllIntroPatternMetas(): IntroPatternMeta[] {
  return Array.from(registry.values()).map((entry) =>
    entry.type === 'loaded'
      ? {
          id: entry.pattern.id,
          name: entry.pattern.name,
          description: entry.pattern.description,
          ...(entry.pattern.icon && { icon: entry.pattern.icon }),
          ...(entry.pattern.tags && { tags: entry.pattern.tags }),
          ...(entry.pattern.category && { category: entry.pattern.category }),
          ...(entry.pattern.settings && { settings: entry.pattern.settings }),
        }
      : entry.meta
  )
}

// =============================================================================
// Compiled Intro Registry
// =============================================================================

/** Registry of compiled intros (pattern + settings + overlay bundled) */
const introRegistry = new Map<string, { meta: IntroMeta; config: IntroConfig }>()

/**
 * Register a compiled intro (full config with meta).
 */
export function registerIntro(meta: IntroMeta, config: IntroConfig): void {
  if (introRegistry.has(meta.id)) {
    console.warn(`[Intro] Compiled intro "${meta.id}" already registered, overwriting`)
  }
  introRegistry.set(meta.id, { meta, config })
}

/**
 * Get a compiled intro config by ID.
 */
export function getRegisteredIntro(id: string): IntroConfig | undefined {
  return introRegistry.get(id)?.config
}

/**
 * Get compiled intro meta by ID.
 */
export function getRegisteredIntroMeta(id: string): IntroMeta | undefined {
  return introRegistry.get(id)?.meta
}

/**
 * Get meta for all registered compiled intros (for CMS listing / DevIntroSwitcher).
 */
export function getAllRegisteredIntroMetas(): IntroMeta[] {
  return Array.from(introRegistry.values()).map((entry) => entry.meta)
}

/**
 * Find which compiled intro matches a given IntroConfig (by pattern ID).
 * Returns the compiled intro ID, or undefined if no match.
 */
export function findIntroIdByConfig(config: IntroConfig): string | undefined {
  for (const [id, entry] of introRegistry) {
    if (entry.config.pattern === config.pattern) {
      return id
    }
  }
  return undefined
}

// =============================================================================
// URL Override Helpers (Dev Mode)
// =============================================================================

/** Query param name for intro override */
export const DEV_INTRO_PARAM = '_intro'

/**
 * Get current intro override from URL.
 * Returns pattern ID, 'none' to disable, or null for no override.
 */
export function getIntroOverride(): string | null {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  return params.get(DEV_INTRO_PARAM)
}

/**
 * Set intro override in URL and reload.
 * Intros are one-shot sequences, so a reload is required.
 */
export function setIntroOverride(id: string | null): void {
  if (typeof window === 'undefined') return

  const url = new URL(window.location.href)
  if (id) {
    url.searchParams.set(DEV_INTRO_PARAM, id)
  } else {
    url.searchParams.delete(DEV_INTRO_PARAM)
  }

  window.location.href = url.toString()
}

