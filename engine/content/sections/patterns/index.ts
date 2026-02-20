/**
 * Section patterns barrel export.
 * Factory functions that return SectionSchema for common patterns.
 */

export type { BaseSectionProps } from './base'

export { createHeroVideoSection } from './HeroVideo'
export type { HeroVideoProps } from './HeroVideo/types'

export { createHeroTitleSection } from './HeroTitle'
export type { HeroTitleProps } from './HeroTitle/types'

export { createAboutBioSection } from './AboutBio'
export type { AboutBioProps, LogoItem, BioLink } from './AboutBio/types'

export { createProjectFeaturedSection } from './ProjectFeatured'
export type { ProjectFeaturedProps, FeaturedProject } from './ProjectFeatured/types'

export { createProjectStripSection } from './ProjectStrip'
export type { ProjectStripProps, OtherProject } from './ProjectStrip/types'

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

export { createTeamShowcaseSection } from './TeamShowcase'
export type { TeamShowcaseProps, MemberItem } from './TeamShowcase/types'

export { createContentPricingSection } from './ContentPricing'
export type { ContentPricingProps, PricingPlan, PricingFeature, PricingIcons } from './ContentPricing/types'

export { createAboutCollageSection } from './AboutCollage'
export type { AboutCollageProps, AboutCollageImage } from './AboutCollage/types'
