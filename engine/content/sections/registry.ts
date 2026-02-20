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
import { meta as HeroVideoMeta } from './patterns/HeroVideo/meta'
import { meta as HeroTitleMeta } from './patterns/HeroTitle/meta'
import { meta as AboutBioMeta } from './patterns/AboutBio/meta'
import { meta as ProjectFeaturedMeta } from './patterns/ProjectFeatured/meta'
import { meta as ProjectStripMeta } from './patterns/ProjectStrip/meta'
import { meta as ProjectVideoGridMeta } from './patterns/ProjectVideoGrid/meta'
import { meta as ProjectExpandMeta } from './patterns/ProjectExpand/meta'
import { meta as ProjectShowcaseMeta } from './patterns/ProjectShowcase/meta'
import { meta as ProjectGalleryMeta } from './patterns/ProjectGallery/meta'
import { meta as ProjectCompareMeta } from './patterns/ProjectCompare/meta'
import { meta as ProjectTabsMeta } from './patterns/ProjectTabs/meta'
import { meta as TeamShowcaseMeta } from './patterns/TeamShowcase/meta'
import { meta as ContentPricingMeta } from './patterns/ContentPricing/meta'
import { meta as AboutCollageMeta } from './patterns/AboutCollage/meta'

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getFactory: () => Promise<(props: any) => SectionSchema>
}

// =============================================================================
// Registry
// =============================================================================

/**
 * Registry of all section patterns.
 * Maps pattern ID to metadata and lazy-loaded factory function.
 */
/**
 * Create a getFactory that auto-stamps patternId on the returned section.
 * This ensures every section created through the registry is traceable
 * back to its pattern — callers can never forget to set patternId.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createEntry(id: string, meta: SectionMeta, importFactory: () => Promise<(props: any) => SectionSchema>): SectionPatternEntry {
  return {
    meta,
    getFactory: async () => {
      const rawFactory = await importFactory()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return (props: any) => {
        const section = rawFactory(props)
        section.patternId = id
        return section
      }
    },
  }
}

export const sectionRegistry: Record<string, SectionPatternEntry> = {
  HeroVideo: createEntry('HeroVideo', HeroVideoMeta as SectionMeta,
    async () => (await import('./patterns/HeroVideo')).createHeroVideoSection),
  HeroTitle: createEntry('HeroTitle', HeroTitleMeta as SectionMeta,
    async () => (await import('./patterns/HeroTitle')).createHeroTitleSection),
  AboutBio: createEntry('AboutBio', AboutBioMeta as SectionMeta,
    async () => (await import('./patterns/AboutBio')).createAboutBioSection),
  ProjectFeatured: createEntry('ProjectFeatured', ProjectFeaturedMeta as SectionMeta,
    async () => (await import('./patterns/ProjectFeatured')).createProjectFeaturedSection),
  ProjectStrip: createEntry('ProjectStrip', ProjectStripMeta as SectionMeta,
    async () => (await import('./patterns/ProjectStrip')).createProjectStripSection),
  ProjectVideoGrid: createEntry('ProjectVideoGrid', ProjectVideoGridMeta as SectionMeta,
    async () => (await import('./patterns/ProjectVideoGrid')).createProjectVideoGridSection),
  ProjectExpand: createEntry('ProjectExpand', ProjectExpandMeta as SectionMeta,
    async () => (await import('./patterns/ProjectExpand')).createProjectExpandSection),
  ProjectShowcase: createEntry('ProjectShowcase', ProjectShowcaseMeta as SectionMeta,
    async () => (await import('./patterns/ProjectShowcase')).createProjectShowcaseSection),
  ProjectGallery: createEntry('ProjectGallery', ProjectGalleryMeta as SectionMeta,
    async () => (await import('./patterns/ProjectGallery')).createProjectGallerySection),
  ProjectCompare: createEntry('ProjectCompare', ProjectCompareMeta as SectionMeta,
    async () => (await import('./patterns/ProjectCompare')).createProjectCompareSection),
  ProjectTabs: createEntry('ProjectTabs', ProjectTabsMeta as SectionMeta,
    async () => (await import('./patterns/ProjectTabs')).createProjectTabsSection),
  TeamShowcase: createEntry('TeamShowcase', TeamShowcaseMeta as SectionMeta,
    async () => (await import('./patterns/TeamShowcase')).createTeamShowcaseSection),
  ContentPricing: createEntry('ContentPricing', ContentPricingMeta as SectionMeta,
    async () => (await import('./patterns/ContentPricing')).createContentPricingSection),
  AboutCollage: createEntry('AboutCollage', AboutCollageMeta as SectionMeta,
    async () => (await import('./patterns/AboutCollage')).createAboutCollageSection),
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
export { createHeroVideoSection } from './patterns/HeroVideo'
export { createHeroTitleSection } from './patterns/HeroTitle'
export { createAboutBioSection } from './patterns/AboutBio'
export { createProjectFeaturedSection } from './patterns/ProjectFeatured'
export { createProjectStripSection } from './patterns/ProjectStrip'
export { createProjectVideoGridSection } from './patterns/ProjectVideoGrid'
export { createProjectExpandSection } from './patterns/ProjectExpand'
export { createProjectShowcaseSection } from './patterns/ProjectShowcase'
export { createProjectGallerySection } from './patterns/ProjectGallery'
export { createProjectCompareSection } from './patterns/ProjectCompare'
export { createProjectTabsSection } from './patterns/ProjectTabs'
export { createTeamShowcaseSection } from './patterns/TeamShowcase'
export { createContentPricingSection } from './patterns/ContentPricing'
export { createAboutCollageSection } from './patterns/AboutCollage'

// Re-export types for convenience
export type { HeroVideoProps } from './patterns/HeroVideo/types'
export type { HeroTitleProps } from './patterns/HeroTitle/types'
export type { AboutBioProps } from './patterns/AboutBio/types'
export type { ProjectFeaturedProps } from './patterns/ProjectFeatured/types'
export type { ProjectStripProps } from './patterns/ProjectStrip/types'
export type { ProjectVideoGridProps } from './patterns/ProjectVideoGrid/types'
export type { ProjectExpandProps } from './patterns/ProjectExpand/types'
export type { ProjectShowcaseProps } from './patterns/ProjectShowcase/types'
export type { ProjectGalleryProps } from './patterns/ProjectGallery/types'
export type { ProjectCompareProps } from './patterns/ProjectCompare/types'
export type { ProjectTabsProps } from './patterns/ProjectTabs/types'
export type { TeamShowcaseProps, MemberItem } from './patterns/TeamShowcase/types'
export type { ContentPricingProps, PricingPlan, PricingFeature } from './patterns/ContentPricing/types'
export type { AboutCollageProps } from './patterns/AboutCollage/types'
