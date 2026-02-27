/**
 * Content generation for site export.
 * Extracts sample content and content schema from a preset.
 */

import type { ContentContract, ContentSourceField } from '../../engine/presets/types'

/**
 * Build a content-schema.json structure from the content contract.
 * Groups fields by section with documentation for each field.
 */
export function generateContentSchema(contract: ContentContract): Record<string, unknown> {
  const schema: Record<string, unknown> = {
    $comment: 'Content field reference. This file documents the structure of content.json. DO NOT EDIT — regenerated on export.',
  }

  for (const section of contract.sections) {
    const sectionFields: Record<string, unknown> = {}

    const fields = contract.sourceFields.filter(f => f.section === section.id)
    for (const field of fields) {
      sectionFields[field.path] = describeField(field)
    }

    schema[section.id] = {
      _label: section.label,
      _description: section.description ?? '',
      fields: sectionFields,
    }
  }

  return schema
}

function describeField(field: ContentSourceField): Record<string, unknown> {
  const desc: Record<string, unknown> = {
    type: field.type,
    label: field.label,
  }
  if (field.required) desc.required = true
  if (field.placeholder) desc.placeholder = field.placeholder
  if (field.separator) desc.separator = field.separator
  if (field.itemFields) {
    desc.itemFields = field.itemFields.map(f => describeField(f))
  }
  return desc
}

/**
 * Generate the content.json payload from sample content.
 * Deep clones to avoid mutating the preset.
 */
export function generateContentJson(sampleContent: Record<string, unknown>): Record<string, unknown> {
  return JSON.parse(JSON.stringify(sampleContent))
}
