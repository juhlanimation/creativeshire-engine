/**
 * Intro pattern registry with lazy loading support.
 *
 * Supports two registration modes:
 * 1. Eager: Pattern object registered directly
 * 2. Lazy: Loader function registered, pattern loaded on demand
 */

import type { IntroPattern, IntroPatternMeta } from './types'

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
