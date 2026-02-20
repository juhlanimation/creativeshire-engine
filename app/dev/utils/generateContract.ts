/**
 * Auto-generate a ContentContract from a preset's binding expressions.
 *
 * Pure function: scans the preset for {{ content.xxx }} paths,
 * groups by top-level segment, merges with an existing contract
 * to preserve hand-written metadata, and prunes removed paths.
 */

import type { SitePreset } from '../../../engine/presets/types'
import type {
  ContentContract,
  ContentSourceField,
  ContentSourceFieldType,
  ContentSection,
} from '../../../engine/presets/types'
import { extractBindingPaths } from '../components/buildStructuralTree'

// =============================================================================
// Type inference heuristics
// =============================================================================

function inferFieldType(pathSegment: string): ContentSourceFieldType {
  const lower = pathSegment.toLowerCase()

  if (/(?:image|poster|logo|avatar|thumbnail)$/i.test(pathSegment)) return 'image'
  if (/(?:width|height|size|count|duration|time|frame)$/i.test(pathSegment)) return 'number'
  if (/(?:enabled|active|visible|autoplay|muted|loop)$/i.test(pathSegment)) return 'toggle'
  if (/(?:bio|description|body|summary|content)$/i.test(pathSegment)) return 'textarea'
  // src/url/link/href → text (not image, since these could be video URLs etc.)
  if (/(?:src|url|link|href)$/i.test(lower)) return 'text'

  return 'text'
}

/** Convert camelCase or kebab-case to a human-readable label */
function pathToLabel(path: string): string {
  // Take the last segment
  const segment = path.split('.').pop() ?? path
  // camelCase → spaced
  return segment
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

// =============================================================================
// Main generator
// =============================================================================

export function generateContractFromPreset(
  preset: SitePreset,
  existingContract?: ContentContract,
): ContentContract {
  // 1. Scan — extract all binding paths from the entire preset
  const allPaths = extractBindingPaths(preset)

  // 2. Group by top-level segment
  const groups = new Map<string, Set<string>>()
  for (const path of allPaths) {
    const dotIdx = path.indexOf('.')
    const topLevel = dotIdx >= 0 ? path.slice(0, dotIdx) : path
    if (!groups.has(topLevel)) groups.set(topLevel, new Set())
    groups.get(topLevel)!.add(path)
  }

  // 3. Build index of existing fields for merge
  const existingFieldMap = new Map<string, ContentSourceField>()
  const existingSectionMap = new Map<string, ContentSection>()

  if (existingContract) {
    for (const field of existingContract.sourceFields) {
      existingFieldMap.set(field.path, field)
      // Also index itemFields recursively
      if (field.itemFields) {
        for (const itemField of field.itemFields) {
          existingFieldMap.set(`${field.path}.${itemField.path}`, itemField)
        }
      }
    }
    for (const section of existingContract.sections) {
      existingSectionMap.set(section.id, section)
    }
  }

  // 4. Build fields and sections
  const sourceFields: ContentSourceField[] = []
  const sections: ContentSection[] = []

  for (const [sectionId, paths] of groups) {
    // Create section
    const existingSection = existingSectionMap.get(sectionId)
    sections.push(
      existingSection ?? {
        id: sectionId,
        label: pathToLabel(sectionId),
      },
    )

    // Create fields for each path
    for (const path of paths) {
      const existing = existingFieldMap.get(path)
      if (existing) {
        // Preserve existing metadata
        sourceFields.push({ ...existing, section: sectionId })
      } else {
        // Infer new field
        const lastSegment = path.split('.').pop() ?? path
        sourceFields.push({
          path,
          type: inferFieldType(lastSegment),
          label: pathToLabel(path),
          section: sectionId,
        })
      }
    }
  }

  // 5. Sort fields by path for stable output
  sourceFields.sort((a, b) => a.path.localeCompare(b.path))
  sections.sort((a, b) => a.id.localeCompare(b.id))

  return { sourceFields, sections }
}
