/**
 * Section component barrel exports.
 */

export { default as Section } from './Section'
export { default } from './Section'

export type {
  SectionProps,
  SectionSchema,
  LayoutConfig,
  LayoutStyles,
  WidgetSchema,
} from './types'

export { ALIGN_MAP, JUSTIFY_MAP } from './types'

// Registry
export {
  getSectionPattern,
  getAllSectionMetas,
  getSectionsByCategory,
  getUniqueSections,
  getRepeatableSections,
} from './registry'

// Base meta
export { sectionBaseMeta } from './base-meta'
