/**
 * Widget exports - registry, types, metadata, and composites.
 *
 * Widget categories:
 * - primitives/  : React components (leaf nodes) - Text, Image, Video
 * - layout/      : React components (containers) - Flex, Box
 * - interactive/ : Stateful React components - Video, ContactPrompt
 * - patterns/    : Factory functions → WidgetSchema
 */

// Component registry (for renderer)
export { widgetRegistry, getWidget } from './registry'
export type { WidgetComponent, WidgetBaseProps } from './types'

// Metadata registry (for platform UI)
export {
  widgetMetaRegistry,
  getWidgetMeta,
  getAllWidgetMeta,
  getWidgetMetaByCategory,
} from './meta-registry'
export type { WidgetType } from './meta-registry'
