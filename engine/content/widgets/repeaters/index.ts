/**
 * Repeater widgets barrel.
 *
 * Repeaters take an array (or binding expression) and render
 * a widget template for each item. They bridge the gap between
 * pattern factory functions and runtime data binding.
 *
 * Single-use repeaters are scoped to their parent section
 * (e.g., MarqueeImageRepeater lives in sections/patterns/About/components/).
 * This barrel is for repeaters used by 2+ sections.
 *
 * Naming convention: [LayoutType][ContentType]Repeater
 *   - LayoutType = how items are arranged (Marquee, Stack, ExpandRow, Grid, Flex)
 *   - ContentType = what widget/pattern each item renders as (Image, Text, ProjectCard)
 *
 * For stateful interactive widgets, see ../interactive/
 */

// ExpandRowImageRepeater - horizontal row with coordinated hover expansion
export { default as ExpandRowImageRepeater } from './ExpandRowImageRepeater'
export type { ExpandRowImageRepeaterProps, ExpandRowItem, ExpandRowClickPayload } from './ExpandRowImageRepeater/types'
