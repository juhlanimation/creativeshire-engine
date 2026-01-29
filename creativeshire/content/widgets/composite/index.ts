/**
 * Widget composites barrel.
 *
 * Composites come in two forms:
 * 1. Factory functions that return WidgetSchema (e.g., createProjectCard)
 * 2. React components for complex interactive widgets (e.g., GalleryThumbnail)
 *
 * Example factory:
 * ```typescript
 * export function createIconButton(props: IconButtonProps): WidgetSchema {
 *   return {
 *     id: props.id ?? 'icon-button',
 *     type: 'Button',
 *     props: { icon: props.icon, label: props.label }
 *   }
 * }
 * ```
 */

// ProjectCard - featured project display (factory)
export { createProjectCard } from './ProjectCard'
export type { ProjectCardConfig } from './ProjectCard/types'

// GalleryThumbnail - expandable thumbnail (component)
export { default as GalleryThumbnail } from './GalleryThumbnail'
export type { GalleryThumbnailProps, GalleryProject } from './GalleryThumbnail'

// VideoPlayer - full video player with controls (component)
export { default as VideoPlayer } from './VideoPlayer'
export type { VideoPlayerProps } from './VideoPlayer/types'

// ContactPrompt - copy-to-clipboard with flip animation (component)
export { default as ContactPrompt } from './ContactPrompt'
export type { ContactPromptProps } from './ContactPrompt/types'

// LogoLink - logo with hover effects and navigation (factory)
export { createLogoLink } from './LogoLink'
export type { LogoLinkConfig } from './LogoLink/types'

// ExpandableGalleryRow - gallery row with hover expansion (component)
export { default as ExpandableGalleryRow } from './ExpandableGalleryRow'
export type { ExpandableGalleryRowProps } from './ExpandableGalleryRow/types'

// Video - video widget with state and hooks (component)
// Moved from primitives/ due to: useState, useVisibilityPlayback, usePlaybackPosition, modal integration
export { default as Video } from './Video'
export type { VideoProps } from './Video/types'
