/**
 * Widget exports - registry, types, and composites.
 *
 * Widget categories:
 * - content/  : React components (leaf nodes) - Text, Image, Video
 * - layout/   : React components (containers) - Flex, Box
 * - composite/: Factory functions → WidgetSchema
 */

export { widgetRegistry, getWidget } from './registry'
export type { WidgetComponent, WidgetBaseProps } from './types'

// Widget composites (factory functions returning WidgetSchema)
// Export as they are created:
// export { createIconButton } from './composite'
