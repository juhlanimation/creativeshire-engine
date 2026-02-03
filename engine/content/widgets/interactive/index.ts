/**
 * Interactive widgets barrel.
 *
 * Interactive widgets are React components with internal state,
 * complex event handling, or multiple render modes.
 *
 * Unlike patterns (factory functions), these are actual React components
 * that use hooks, refs, and effects.
 *
 * For factory functions that compose widgets, see ../patterns/
 */

// Video - video with hover-play, visibility playback, modal integration
export { default as Video } from './Video'
export type { VideoProps } from './Video/types'

// VideoPlayer - full video player with controls, scrubber, fullscreen
export { default as VideoPlayer } from './VideoPlayer'
export type { VideoPlayerProps } from './VideoPlayer/types'

// ContactPrompt - copy-to-clipboard with flip animation
export { default as ContactPrompt } from './ContactPrompt'
export type { ContactPromptProps } from './ContactPrompt/types'

// ExpandableGalleryRow - gallery row with hover expansion
export { default as ExpandableGalleryRow } from './ExpandableGalleryRow'
export type { ExpandableGalleryRowProps } from './ExpandableGalleryRow/types'

// GalleryThumbnail - expandable thumbnail with video and metadata
export { default as GalleryThumbnail } from './GalleryThumbnail'
export type { GalleryThumbnailProps, GalleryProject } from './GalleryThumbnail'

// HeroRoles - role titles for hero sections (supports binding expressions)
export { default as HeroRoles } from './HeroRoles'
export type { HeroRolesProps } from './HeroRoles/types'

// FeaturedProjectsGrid - featured project cards (supports binding expressions)
export { default as FeaturedProjectsGrid } from './FeaturedProjectsGrid'
export type { FeaturedProjectsGridProps, FeaturedProject } from './FeaturedProjectsGrid/types'
