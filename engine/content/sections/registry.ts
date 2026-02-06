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
import { meta as ProjectVideoGridMeta } from './patterns/ProjectVideoGrid/meta'
import { meta as ProjectExpandMeta } from './patterns/ProjectExpand/meta'
import { meta as ProjectShowcaseMeta } from './patterns/ProjectShowcase/meta'
import { meta as ProjectGalleryMeta } from './patterns/ProjectGallery/meta'
import { meta as ProjectCompareMeta } from './patterns/ProjectCompare/meta'
import { meta as ProjectTabsMeta } from './patterns/ProjectTabs/meta'
import { meta as MemberGalleryMeta } from './patterns/MemberGallery/meta'
import { meta as PricingMeta } from './patterns/Pricing/meta'

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
  ProjectVideoGrid: {
    meta: ProjectVideoGridMeta as SectionMeta,
    getFactory: async () => (await import('./patterns/ProjectVideoGrid')).createProjectVideoGridSection,
  },
  ProjectExpand: {
    meta: ProjectExpandMeta as SectionMeta,
    getFactory: async () => (await import('./patterns/ProjectExpand')).createProjectExpandSection,
  },
  ProjectShowcase: {
    meta: ProjectShowcaseMeta as SectionMeta,
    getFactory: async () => (await import('./patterns/ProjectShowcase')).createProjectShowcaseSection,
  },
  ProjectGallery: {
    meta: ProjectGalleryMeta as SectionMeta,
    getFactory: async () => (await import('./patterns/ProjectGallery')).createProjectGallerySection,
  },
  ProjectCompare: {
    meta: ProjectCompareMeta as SectionMeta,
    getFactory: async () => (await import('./patterns/ProjectCompare')).createProjectCompareSection,
  },
  ProjectTabs: {
    meta: ProjectTabsMeta as SectionMeta,
    getFactory: async () => (await import('./patterns/ProjectTabs')).createProjectTabsSection,
  },
  MemberGallery: {
    meta: MemberGalleryMeta as SectionMeta,
    getFactory: async () => (await import('./patterns/MemberGallery')).createMemberGallerySection,
  },
  Pricing: {
    meta: PricingMeta as SectionMeta,
    getFactory: async () => (await import('./patterns/Pricing')).createPricingSection,
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
export { createProjectVideoGridSection } from './patterns/ProjectVideoGrid'
export { createProjectExpandSection } from './patterns/ProjectExpand'
export { createProjectShowcaseSection } from './patterns/ProjectShowcase'
export { createProjectGallerySection } from './patterns/ProjectGallery'
export { createProjectCompareSection } from './patterns/ProjectCompare'
export { createProjectTabsSection } from './patterns/ProjectTabs'
export { createMemberGallerySection } from './patterns/MemberGallery'
export { createPricingSection } from './patterns/Pricing'

// Re-export types for convenience
export type { HeroProps } from './patterns/Hero/types'
export type { AboutProps } from './patterns/About/types'
export type { FeaturedProjectsProps } from './patterns/FeaturedProjects/types'
export type { OtherProjectsProps } from './patterns/OtherProjects/types'
export type { ProjectVideoGridProps } from './patterns/ProjectVideoGrid/types'
export type { ProjectExpandProps } from './patterns/ProjectExpand/types'
export type { ProjectShowcaseProps } from './patterns/ProjectShowcase/types'
export type { ProjectGalleryProps } from './patterns/ProjectGallery/types'
export type { ProjectCompareProps } from './patterns/ProjectCompare/types'
export type { ProjectTabsProps } from './patterns/ProjectTabs/types'
export type { MemberGalleryProps, MemberItem } from './patterns/MemberGallery/types'
export type { PricingProps, PricingPlan, PricingFeature } from './patterns/Pricing/types'
