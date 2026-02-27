/**
 * Content field types for section/chrome content declarations.
 *
 * These types live in schema/ (not presets/) so sections can import
 * without a content→preset dependency direction.
 */

import type { ContentSourceFieldType } from '../presets/types'

/**
 * Content field with a RELATIVE path, declared by a section/chrome pattern.
 * The `section` property is omitted — auto-filled during aggregation.
 */
export interface SectionContentField {
  /** Relative dot-notation path (e.g. 'logo.src', NOT 'azukiElementals.logo.src') */
  path: string
  type: ContentSourceFieldType
  label: string
  required?: boolean
  default?: unknown
  placeholder?: string
  separator?: string
  hidden?: boolean
  /** For collection-type fields: nested item fields (also relative) */
  itemFields?: SectionContentField[]
}

/**
 * Content declaration exported by a section or chrome pattern's content.ts.
 * Declares CMS fields (relative paths) and provides sample data for previews.
 */
export interface SectionContentDeclaration<T = Record<string, unknown>> {
  /** Human-readable label for CMS grouping (e.g. 'Project Gallery') */
  label: string
  /** Optional description for CMS UI */
  description?: string
  /** CMS field declarations with relative paths */
  contentFields: SectionContentField[]
  /** Concrete sample data matching the shape the factory expects */
  sampleContent: T
}
