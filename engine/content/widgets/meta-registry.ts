/**
 * Widget metadata registry - collects all widget meta for platform UI.
 *
 * This registry provides:
 * - Type-safe lookup of widget metadata
 * - All widget types as a union type
 * - Iteration over all available widgets
 *
 * Usage from platform:
 *   import { widgetMetaRegistry, getWidgetMeta } from '@creativeshire/engine/content/widgets'
 */

import type { ComponentMeta } from '../../schema/meta'
import { extractDefaults } from '../../schema/settings'

// Primitives
import { meta as TextMeta } from './primitives/Text/meta'
import { meta as ImageMeta } from './primitives/Image/meta'
import { meta as IconMeta } from './primitives/Icon/meta'
import { meta as ButtonMeta } from './primitives/Button/meta'
import { meta as LinkMeta } from './primitives/Link/meta'

// Layout
import { meta as FlexMeta } from './layout/Flex/meta'
import { meta as StackMeta } from './layout/Stack/meta'
import { meta as GridMeta } from './layout/Grid/meta'
import { meta as BoxMeta } from './layout/Box/meta'
import { meta as ContainerMeta } from './layout/Container/meta'
import { meta as SplitMeta } from './layout/Split/meta'
import { meta as MarqueeMeta } from './layout/Marquee/meta'

// Interactive
import { meta as VideoMeta } from './interactive/Video/meta'
import { meta as VideoPlayerMeta } from './interactive/VideoPlayer/meta'
import { meta as EmailCopyMeta } from './interactive/EmailCopy/meta'
import { meta as ContactBarMeta } from './interactive/ContactBar/meta'

// Repeaters (array-to-widget)
import { meta as ExpandRowImageRepeaterMeta } from './repeaters/ExpandRowImageRepeater/meta'

/**
 * Registry mapping widget type strings to their metadata.
 */
export const widgetMetaRegistry = {
  // Primitives
  Text: TextMeta,
  Image: ImageMeta,
  Icon: IconMeta,
  Button: ButtonMeta,
  Link: LinkMeta,
  // Layout
  Flex: FlexMeta,
  Stack: StackMeta,
  Grid: GridMeta,
  Box: BoxMeta,
  Container: ContainerMeta,
  Split: SplitMeta,
  Marquee: MarqueeMeta,
  // Interactive
  Video: VideoMeta,
  VideoPlayer: VideoPlayerMeta,
  EmailCopy: EmailCopyMeta,
  ContactBar: ContactBarMeta,
  // Repeaters
  ExpandRowImageRepeater: ExpandRowImageRepeaterMeta,
} as const

/**
 * All registered widget type names.
 */
export type WidgetType = keyof typeof widgetMetaRegistry

// =============================================================================
// Widget Defaults (pre-computed at module load — zero render-time cost)
// =============================================================================

/**
 * Pre-computed default prop values for each widget type.
 * Extracted from meta.settings at module load time.
 * Used by WidgetRenderer to fill in unspecified props.
 */
export const WIDGET_DEFAULTS: Record<string, Record<string, unknown>> =
  Object.fromEntries(
    Object.entries(widgetMetaRegistry).map(([type, meta]) => [
      type,
      meta.settings ? extractDefaults(meta.settings as Record<string, never>) : {},
    ])
  )

/**
 * Get pre-computed default props for a widget type.
 * Returns empty object for unknown types (safe to spread).
 */
export function getWidgetDefaults(type: string): Record<string, unknown> {
  return WIDGET_DEFAULTS[type] ?? {}
}

/**
 * Retrieves metadata for a widget by type string.
 * @param type - Widget type identifier (e.g., 'Text', 'Flex')
 * @returns The widget metadata or undefined if not found
 */
export function getWidgetMeta(type: string): ComponentMeta | undefined {
  return widgetMetaRegistry[type as WidgetType]
}

/**
 * Get all widget metadata as an array.
 * Useful for iterating in platform UI (component picker, etc.)
 */
export function getAllWidgetMeta(): ComponentMeta[] {
  return Object.values(widgetMetaRegistry)
}

/**
 * Get widget metadata filtered by category.
 * @param category - Category to filter by (e.g., 'primitive', 'layout')
 */
export function getWidgetMetaByCategory(
  category: ComponentMeta['category']
): ComponentMeta[] {
  return Object.values(widgetMetaRegistry).filter(
    (meta) => meta.category === category
  )
}
