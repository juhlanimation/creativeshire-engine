/**
 * Section composites barrel export.
 * Factory functions that return SectionSchema for common patterns.
 */

export { createHeroSection } from './Hero'
export type { HeroProps } from './Hero/types'

export { createAboutSection } from './About'
export type { AboutProps, LogoItem, BioLink } from './About/types'

export { createFeaturedProjectsSection } from './FeaturedProjects'
export type { FeaturedProjectsProps, FeaturedProject } from './FeaturedProjects/types'

export { createOtherProjectsSection } from './OtherProjects'
export type { OtherProjectsProps, OtherProject } from './OtherProjects/types'
