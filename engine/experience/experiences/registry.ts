/**
 * Experience registry with lazy loading support.
 *
 * Supports two registration modes:
 * 1. Eager: Experience object registered directly (current behavior)
 * 2. Lazy: Loader function registered, experience loaded on demand
 */

import type { Experience } from './types'
import type { SettingsConfig } from '../../schema/settings'

/**
 * Experience category for organization in CMS.
 */
export type ExperienceCategory = 'presentation' | 'scroll-driven' | 'physics' | 'simple'

/**
 * Lightweight metadata for listing without loading full experience.
 * Used for CMS UI, experience selection, etc.
 */
export interface ExperienceMeta<T = unknown> {
  /** Unique experience identifier */
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
  category?: ExperienceCategory
  /** Configurable settings for this experience */
  settings?: SettingsConfig<T>
  /** Preview image URL */
  preview?: string
  /** Documentation URL */
  docs?: string
}

/**
 * Helper function for defining type-safe experience metadata.
 */
export function defineExperienceMeta<T>(meta: ExperienceMeta<T>): ExperienceMeta<T> {
  return meta
}

/** Registry entry - either loaded experience or lazy loader */
type RegistryEntry =
  | { type: 'loaded'; experience: Experience }
  | { type: 'lazy'; meta: ExperienceMeta; loader: () => Promise<Experience> }

/** Registry of available experiences by ID */
const registry = new Map<string, RegistryEntry>()

/**
 * Register an experience eagerly.
 * Used by built-in experiences that auto-register on import.
 */
export function registerExperience(experience: Experience): void {
  if (registry.has(experience.id)) {
    console.warn(`Experience "${experience.id}" is already registered. Overwriting.`)
  }
  registry.set(experience.id, { type: 'loaded', experience })
}

/**
 * Register an experience lazily with metadata.
 * Experience code loads only when getExperienceAsync() is called.
 */
export function registerLazyExperience(
  meta: ExperienceMeta,
  loader: () => Promise<Experience>
): void {
  if (registry.has(meta.id)) {
    console.warn(`Experience "${meta.id}" is already registered. Overwriting.`)
  }
  registry.set(meta.id, { type: 'lazy', meta, loader })
}

/**
 * Get an experience by ID (async to support lazy loading).
 * Loads and caches lazy experiences on first access.
 */
export async function getExperienceAsync(id: string): Promise<Experience | undefined> {
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

/**
 * Get an experience synchronously.
 * Returns undefined for lazy experiences that haven't loaded yet.
 * Prefer getExperienceAsync() for new code.
 */
export function getExperience(id: string): Experience | undefined {
  const entry = registry.get(id)
  if (!entry) return undefined
  if (entry.type === 'loaded') return entry.experience
  return undefined // Lazy not yet loaded
}

/**
 * Preload an experience (useful for route prefetching).
 */
export async function preloadExperience(id: string): Promise<void> {
  await getExperienceAsync(id)
}

/**
 * Get all experience metadata (without loading lazy experiences).
 */
export function getAllExperienceMetas(): ExperienceMeta[] {
  return Array.from(registry.values()).map((entry) =>
    entry.type === 'loaded'
      ? {
          id: entry.experience.id,
          name: entry.experience.name,
          description: entry.experience.description,
          // Include extended meta fields if defined on Experience
          ...(entry.experience.icon && { icon: entry.experience.icon }),
          ...(entry.experience.tags && { tags: entry.experience.tags }),
          ...(entry.experience.category && { category: entry.experience.category }),
          ...(entry.experience.settings && { settings: entry.experience.settings }),
        }
      : entry.meta
  )
}

/**
 * Get all registered experience IDs.
 */
export function getExperienceIds(): string[] {
  return Array.from(registry.keys())
}

/**
 * Get all registered experiences.
 * Note: This only returns loaded experiences. Lazy experiences must be loaded first.
 */
export function getAllExperiences(): Experience[] {
  return Array.from(registry.values())
    .filter((entry): entry is { type: 'loaded'; experience: Experience } => entry.type === 'loaded')
    .map((entry) => entry.experience)
}
