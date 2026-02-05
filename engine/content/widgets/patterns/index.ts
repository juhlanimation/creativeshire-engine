/**
 * Widget patterns barrel.
 *
 * Patterns are factory functions that return WidgetSchema.
 * They compose existing primitives and layouts into reusable structures.
 *
 * Example:
 * ```typescript
 * export function createProjectCard(props: ProjectCardConfig): WidgetSchema {
 *   return {
 *     id: props.id ?? 'project-card',
 *     type: 'Flex',
 *     widgets: [
 *       { type: 'Image', props: { src: props.thumbnailSrc } },
 *       { type: 'Text', props: { content: props.title } },
 *     ]
 *   }
 * }
 * ```
 *
 * For stateful React components, see ../interactive/
 */

// ProjectCard - featured project display
export { createProjectCard } from './ProjectCard'
export type { ProjectCardConfig } from './ProjectCard/types'

// LogoLink - logo with hover effects and navigation
export { createLogoLink } from './LogoLink'
export type { LogoLinkConfig } from './LogoLink/types'

// ContactBar - footer bar with email contact and social links
export { createContactBar } from './ContactBar'
export type { ContactBarConfig } from './ContactBar/types'
