/**
 * Section patterns barrel export.
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

export { createProjectVideoGridSection } from './ProjectVideoGrid'
export type { ProjectVideoGridProps, VideoGridItem } from './ProjectVideoGrid/types'

export { createProjectExpandSection } from './ProjectExpand'
export type { ProjectExpandProps, ExpandableVideoItem } from './ProjectExpand/types'

export { createProjectShowcaseSection } from './ProjectShowcase'
export type { ProjectShowcaseProps } from './ProjectShowcase/types'

export { createProjectGallerySection } from './ProjectGallery'
export type { ProjectGalleryProps, GalleryProject } from './ProjectGallery/types'

export { createProjectCompareSection } from './ProjectCompare'
export type { ProjectCompareProps } from './ProjectCompare/types'

export { createProjectTabsSection } from './ProjectTabs'
export type { ProjectTabsProps, ProjectTab, TabVideo } from './ProjectTabs/types'

export { createMemberGallerySection } from './MemberGallery'
export type { MemberGalleryProps, MemberItem, MemberGalleryTextStyles } from './MemberGallery/types'

export { createPricingSection } from './Pricing'
export type { PricingProps, PricingPlan, PricingFeature, PricingIcons, PricingTextStyles } from './Pricing/types'
