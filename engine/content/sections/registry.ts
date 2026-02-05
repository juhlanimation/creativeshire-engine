/**
 * Section pattern registry.
 * Registers all section patterns for platform discovery and uniqueness validation.
 *
 * Note: This registry only imports metadata at module load time.
 * Factory functions are imported lazily to avoid pulling in renderer dependencies
 * during architecture tests.
 */

import type { SectionMeta, SectionCategory, SectionSchema } from '../../schema'

// Import section pattern metas only (safe - no renderer dependencies)
import { meta as HeroMeta } from './patterns/Hero/meta'
import { meta as AboutMeta } from './patterns/About/meta'
import { meta as FeaturedProjectsMeta } from './patterns/FeaturedProjects/meta'
import { meta as OtherProjectsMeta } from './patterns/OtherProjects/meta'

// =============================================================================
// Types
// =============================================================================

/**
 * Registry entry for a section pattern.
 * Factory is provided as a getter to enable lazy loading.
 */
export interface SectionPatternEntry<T = unknown> {
  /** Section metadata */
  meta: SectionMeta<T>
  /** Get factory function (lazy-loaded to avoid renderer dependencies) */
  getFactory: () => Promise<(props: T) => SectionSchema>
}

// =============================================================================
// Registry
// =============================================================================

/**
 * Registry of all section patterns.
 * Maps pattern ID to metadata and lazy-loaded factory function.
 */
export const sectionRegistry: Record<string, SectionPatternEntry> = {
  Hero: {
    meta: HeroMeta as SectionMeta,
    getFactory: async () => (await import('./patterns/Hero')).createHeroSection,
  },
  About: {
    meta: AboutMeta as SectionMeta,
    getFactory: async () => (await import('./patterns/About')).createAboutSection,
  },
  FeaturedProjects: {
    meta: FeaturedProjectsMeta as SectionMeta,
    getFactory: async () => (await import('./patterns/FeaturedProjects')).createFeaturedProjectsSection,
  },
  OtherProjects: {
    meta: OtherProjectsMeta as SectionMeta,
    getFactory: async () => (await import('./patterns/OtherProjects')).createOtherProjectsSection,
  },
}

// =============================================================================
// Query Functions
// =============================================================================

/**
 * Get a section pattern entry by ID.
 */
export function getSectionPattern(id: string): SectionPatternEntry | undefined {
  return sectionRegistry[id]
}

/**
 * Get all registered section metas.
 */
export function getAllSectionMetas(): SectionMeta[] {
  return Object.values(sectionRegistry).map((entry) => entry.meta)
}

/**
 * Get section metas filtered by category.
 */
export function getSectionsByCategory(category: SectionCategory): SectionMeta[] {
  return getAllSectionMetas().filter((meta) => meta.sectionCategory === category)
}

/**
 * Get all unique section metas (max 1 per page).
 */
export function getUniqueSections(): SectionMeta[] {
  return getAllSectionMetas().filter((meta) => meta.unique)
}

/**
 * Get all non-unique section metas (can repeat).
 */
export function getRepeatableSections(): SectionMeta[] {
  return getAllSectionMetas().filter((meta) => !meta.unique)
}

// =============================================================================
// Typed Factory Helpers
// =============================================================================

// Re-export typed factory functions for type-safe usage
export { createHeroSection } from './patterns/Hero'
export { createAboutSection } from './patterns/About'
export { createFeaturedProjectsSection } from './patterns/FeaturedProjects'
export { createOtherProjectsSection } from './patterns/OtherProjects'

// Re-export types for convenience
export type { HeroProps } from './patterns/Hero/types'
export type { AboutProps } from './patterns/About/types'
export type { FeaturedProjectsProps } from './patterns/FeaturedProjects/types'
export type { OtherProjectsProps } from './patterns/OtherProjects/types'
