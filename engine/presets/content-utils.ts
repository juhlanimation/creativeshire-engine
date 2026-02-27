/**
 * Content utilities for presets.
 * Helpers for building content contracts, sample content, and binding maps
 * from section content declarations.
 */

import type {
  ContentContract,
  ContentSourceField,
  ContentSection,
} from './types'
import type {
  SectionContentDeclaration,
  SectionContentField,
} from '../schema/content-field'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Map of namespace → section content declaration. */
export type ContentDeclarationMap = Record<string, SectionContentDeclaration>

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/**
 * Convert a relative-path SectionContentField to an absolute-path ContentSourceField.
 * Prefixes the field path with the namespace, keeps itemFields relative.
 */
function addSection(
  field: SectionContentField,
  sectionId: string,
): ContentSourceField {
  const result: ContentSourceField = {
    path: field.path,
    type: field.type,
    label: field.label,
    section: sectionId,
    ...(field.required != null && { required: field.required }),
    ...(field.default !== undefined && { default: field.default }),
    ...(field.placeholder && { placeholder: field.placeholder }),
    ...(field.separator && { separator: field.separator }),
    ...(field.hidden != null && { hidden: field.hidden }),
  }
  if (field.itemFields) {
    result.itemFields = field.itemFields.map(f => addSection(f, sectionId))
  }
  return result
}

function toAbsoluteField(
  field: SectionContentField,
  namespace: string,
  sectionId: string,
): ContentSourceField {
  const result = addSection(field, sectionId)
  result.path = `${namespace}.${field.path}`
  // Item fields keep relative paths (already set by addSection)
  return result
}

/**
 * Set a deeply nested value on an object using dot-notation path.
 */
function setNestedValue(obj: Record<string, unknown>, path: string, value: unknown): void {
  const parts = path.split('.')
  let current = obj
  for (let i = 0; i < parts.length - 1; i++) {
    if (!(parts[i] in current) || typeof current[parts[i]] !== 'object') {
      current[parts[i]] = {}
    }
    current = current[parts[i]] as Record<string, unknown>
  }
  current[parts[parts.length - 1]] = value
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Build a ContentContract from section content declarations.
 * Aggregates relative-path fields into absolute-path source fields
 * and groups them by namespace/section.
 *
 * @param declarations - Map of namespace to section content declaration
 * @param options - Optional setting overrides
 * @returns ContentContract ready for preset registration
 *
 * @example
 * ```typescript
 * const contract = buildContentContract({
 *   hero: heroContent,
 *   gallery: galleryContent,
 * })
 * ```
 */
export function buildContentContract(
  declarations: ContentDeclarationMap,
  options?: { settingOverrides?: ContentContract['settingOverrides'] },
): ContentContract {
  const sections: ContentSection[] = []
  const sourceFields: ContentSourceField[] = []

  for (const [namespace, decl] of Object.entries(declarations)) {
    sections.push({
      id: namespace,
      label: decl.label,
      description: decl.description,
    })
    for (const field of decl.contentFields) {
      sourceFields.push(toAbsoluteField(field, namespace, namespace))
    }
  }

  return {
    sections,
    sourceFields,
    settingOverrides: options?.settingOverrides,
  }
}

/**
 * Build sample content object from section content declarations.
 * Merges each declaration's sampleContent under its namespace key.
 *
 * @param declarations - Map of namespace to section content declaration
 * @returns Nested content object matching binding paths
 *
 * @example
 * ```typescript
 * const sample = buildSampleContent({ hero: heroContent, gallery: galleryContent })
 * // { hero: { title: 'Sample', ... }, gallery: { items: [...] } }
 * ```
 */
export function buildSampleContent(
  declarations: ContentDeclarationMap,
): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const [namespace, decl] of Object.entries(declarations)) {
    result[namespace] = decl.sampleContent
  }
  return result
}

/**
 * Generate binding expressions for all fields in a namespace.
 * Returns an object where each field path maps to its `{{ content.namespace.path }}` expression.
 *
 * @param namespace - Content namespace (e.g., 'hero')
 * @param fields - Array of content field declarations
 * @returns Object with binding expressions at each field path
 *
 * @example
 * ```typescript
 * const bindings = withContentBindings('hero', heroContent.contentFields)
 * // { title: '{{ content.hero.title }}', image: { src: '{{ content.hero.image.src }}' } }
 * ```
 */
export function withContentBindings(
  namespace: string,
  fields: SectionContentField[],
): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const field of fields) {
    setNestedValue(result, field.path, `{{ content.${namespace}.${field.path} }}`)
  }
  return result
}
