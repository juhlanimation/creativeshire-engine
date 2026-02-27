/**
 * Composition registry with lazy loading support.
 *
 * Supports two registration modes:
 * 1. Eager: Composition object registered directly (current behavior)
 * 2. Lazy: Loader function registered, composition loaded on demand
 */

import type { ExperienceComposition } from './types'

/**
 * Composition category for organization in CMS.
 */
export type CompositionCategory = 'presentation' | 'scroll-driven' | 'physics' | 'simple'

/** @deprecated Use CompositionCategory */
export type ExperienceCategory = CompositionCategory

/**
 * Lightweight metadata for listing without loading full composition.
 * Used for CMS UI, composition selection, etc.
 */
export interface CompositionMeta {
  /** Unique composition identifier */
  id: string
  /** Human-readable name */
  name: string
  /** Short description for CMS display */
  description: string
  /** Icon identifier for CMS UI */
  icon?: string
  /** Searchable tags */
  tags?: string[]
  /** Category for grouping in CMS */
  category?: CompositionCategory
  /** Preview image URL */
  preview?: string
  /** Documentation URL */
  docs?: string
}

/** @deprecated Use CompositionMeta */
export type ExperienceMeta = CompositionMeta

/**
 * Helper function for defining type-safe composition metadata.
 */
export function defineCompositionMeta(meta: CompositionMeta): CompositionMeta {
  return meta
}

/** @deprecated Use defineCompositionMeta */
export const defineExperienceMeta = defineCompositionMeta

/** Registry entry - either loaded composition or lazy loader */
type RegistryEntry =
  | { type: 'loaded'; experience: ExperienceComposition }
  | { type: 'lazy'; meta: CompositionMeta; loader: () => Promise<ExperienceComposition> }

/** Registry of available compositions by ID */
const registry = new Map<string, RegistryEntry>()

/**
 * Register a composition eagerly.
 * Used by built-in compositions that auto-register on import.
 */
export function registerComposition(experience: ExperienceComposition): void {
  if (registry.has(experience.id)) {
    console.warn(`Composition "${experience.id}" is already registered. Overwriting.`)
  }
  registry.set(experience.id, { type: 'loaded', experience })
}

/** @deprecated Use registerComposition */
export const registerExperience = registerComposition

/**
 * Register a composition lazily with metadata.
 * Composition code loads only when getCompositionAsync() is called.
 */
export function registerLazyComposition(
  meta: CompositionMeta,
  loader: () => Promise<ExperienceComposition>
): void {
  if (registry.has(meta.id)) {
    console.warn(`Composition "${meta.id}" is already registered. Overwriting.`)
  }
  registry.set(meta.id, { type: 'lazy', meta, loader })
}

/** @deprecated Use registerLazyComposition */
export const registerLazyExperience = registerLazyComposition

/**
 * Get a composition by ID (async to support lazy loading).
 * Loads and caches lazy compositions on first access.
 */
export async function getCompositionAsync(id: string): Promise<ExperienceComposition | undefined> {
  const entry = registry.get(id)
  if (!entry) return undefined

  if (entry.type === 'loaded') {
    return entry.experience
  }

  // Lazy: load and cache
  const experience = await entry.loader()
  registry.set(id, { type: 'loaded', experience })
  return experience
}

/** @deprecated Use getCompositionAsync */
export const getExperienceAsync = getCompositionAsync

/**
 * Get a composition synchronously.
 * Returns undefined for lazy compositions that haven't loaded yet.
 * Prefer getCompositionAsync() for new code.
 */
export function getComposition(id: string): ExperienceComposition | undefined {
  const entry = registry.get(id)
  if (!entry) return undefined
  if (entry.type === 'loaded') return entry.experience
  return undefined // Lazy not yet loaded
}

/** @deprecated Use getComposition */
export const getExperience = getComposition

/**
 * Preload a composition (useful for route prefetching).
 */
export async function preloadComposition(id: string): Promise<void> {
  await getCompositionAsync(id)
}

/** @deprecated Use preloadComposition */
export const preloadExperience = preloadComposition

/**
 * Get all composition metadata (without loading lazy compositions).
 */
export function getAllCompositionMetas(): CompositionMeta[] {
  return Array.from(registry.values()).map((entry) =>
    entry.type === 'loaded'
      ? {
          id: entry.experience.id,
          name: entry.experience.name,
          description: entry.experience.description,
          // Include extended meta fields if defined on composition
          ...(entry.experience.icon && { icon: entry.experience.icon }),
          ...(entry.experience.tags && { tags: entry.experience.tags }),
          ...(entry.experience.category && { category: entry.experience.category }),
        }
      : entry.meta
  )
}

/** @deprecated Use getAllCompositionMetas */
export const getAllExperienceMetas = getAllCompositionMetas

/**
 * Get all registered composition IDs.
 */
export function getCompositionIds(): string[] {
  return Array.from(registry.keys())
}

/** @deprecated Use getCompositionIds */
export const getExperienceIds = getCompositionIds

/**
 * Get all registered compositions.
 * Note: This only returns loaded compositions. Lazy compositions must be loaded first.
 */
export function getAllCompositions(): ExperienceComposition[] {
  return Array.from(registry.values())
    .filter((entry): entry is { type: 'loaded'; experience: ExperienceComposition } => entry.type === 'loaded')
    .map((entry) => entry.experience)
}

/** @deprecated Use getAllCompositions */
export const getAllExperiences = getAllCompositions

// =============================================================================
// URL Override Helpers (Dev Mode)
// =============================================================================

/** Query param name for composition override */
export const DEV_COMPOSITION_PARAM = '_experience'

/** @deprecated Use DEV_COMPOSITION_PARAM */
export const DEV_EXPERIENCE_PARAM = DEV_COMPOSITION_PARAM

/**
 * Get current composition override from URL.
 */
export function getCompositionOverride(): string | null {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  return params.get(DEV_COMPOSITION_PARAM)
}

/** @deprecated Use getCompositionOverride */
export const getExperienceOverride = getCompositionOverride

/**
 * Set composition override in URL without full page reload.
 */
export function setCompositionOverride(id: string | null): void {
  if (typeof window === 'undefined') return

  const url = new URL(window.location.href)
  if (id) {
    url.searchParams.set(DEV_COMPOSITION_PARAM, id)
  } else {
    url.searchParams.delete(DEV_COMPOSITION_PARAM)
  }

  // Update URL without reload, then trigger re-render via custom event
  window.history.replaceState({}, '', url.toString())
  window.dispatchEvent(new CustomEvent('experienceOverrideChange', { detail: id }))
}

/** @deprecated Use setCompositionOverride */
export const setExperienceOverride = setCompositionOverride
