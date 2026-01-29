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
