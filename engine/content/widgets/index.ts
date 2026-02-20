/**
 * Widget exports - registry, types, and metadata.
 *
 * Widget categories:
 * - primitives/  : React components (leaf nodes) - Text, Image, Icon, Button, Link
 * - layout/      : React components (containers) - Stack, Grid, Flex, Split, Container, Box, Marquee
 * - interactive/ : Stateful React components - Video, VideoPlayer, EmailCopy
 * - repeaters/   : Array-to-widget renderers - ExpandRowImageRepeater
 */

// Component registry (for renderer)
export { widgetRegistry, getWidget, registerScopedWidget } from './registry'
export type { WidgetComponent, WidgetBaseProps } from './types'

// Metadata registry (for platform UI)
export {
  widgetMetaRegistry,
  getWidgetMeta,
  getAllWidgetMeta,
  getWidgetMetaByCategory,
} from './meta-registry'
export type { WidgetType } from './meta-registry'
