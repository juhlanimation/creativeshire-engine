/**
 * Section Discovery API.
 * Platform queries this to populate the "Add Section" dropdown.
 */

import type { SectionSchema, SectionCategory, SectionMeta, SettingConfig } from '../schema'
import { sectionRegistry, getAllSectionMetas } from '../content/sections/registry'

// =============================================================================
// Types
// =============================================================================

/**
 * Information about a section's availability for adding to a page.
 */
export interface SectionAvailability {
  /** Section pattern ID (e.g., 'Hero', 'About') */
  id: string
  /** Human-readable display name */
  name: string
  /** Brief description */
  description: string
  /** Section sub-category for grouping */
  category: SectionCategory
  /** Whether this section can be added (false if unique && already exists) */
  canAdd: boolean
  /** Reason why section cannot be added (only set when canAdd is false) */
  reason?: string
  /** Settings configuration for platform UI */
  settings?: Record<string, SettingConfig>
  /** Icon name for platform UI */
  icon?: string
  /** Tags for search/filtering */
  tags?: string[]
}

// =============================================================================
// Discovery Functions
// =============================================================================

/**
 * Get all available sections with their availability status.
 * Unique sections show canAdd: false if they already exist on the page.
 *
 * @param existingSections - Current sections on the page
 * @returns Array of section availability information
 */
export function getAvailableSections(
  existingSections: SectionSchema[]
): SectionAvailability[] {
  // Build set of existing pattern IDs for fast lookup
  const existingPatternIds = new Set(
    existingSections
      .map((section) => section.patternId)
      .filter((id): id is string => id !== undefined)
  )

  // Map all registered sections to availability info
  return getAllSectionMetas().map((meta): SectionAvailability => {
    const isUniqueAndExists = meta.unique && existingPatternIds.has(meta.id)

    return {
      id: meta.id,
      name: meta.name,
      description: meta.description,
      category: meta.sectionCategory,
      canAdd: !isUniqueAndExists,
      reason: isUniqueAndExists
        ? `Only one ${meta.name} allowed per page`
        : undefined,
      settings: meta.settings,
      icon: meta.icon,
      tags: meta.tags,
    }
  })
}

/**
 * Get sections grouped by category with availability status.
 * Useful for building categorized dropdown menus.
 *
 * @param existingSections - Current sections on the page
 * @returns Record mapping category to array of section availability
 */
export function getSectionsGroupedByCategory(
  existingSections: SectionSchema[]
): Record<SectionCategory, SectionAvailability[]> {
  const available = getAvailableSections(existingSections)

  // Initialize all categories with empty arrays
  const grouped: Record<SectionCategory, SectionAvailability[]> = {
    hero: [],
    about: [],
    project: [],
    contact: [],
    content: [],
    gallery: [],
  }

  // Group sections by category
  for (const section of available) {
    grouped[section.category].push(section)
  }

  return grouped
}

/**
 * Check if a section pattern can be added to a page.
 * Returns validation result with reason if not allowed.
 *
 * @param patternId - Pattern ID to check (e.g., 'Hero')
 * @param existingSections - Current sections on the page
 * @returns Validation result
 */
export function canAddSection(
  patternId: string,
  existingSections: SectionSchema[]
): { valid: true } | { valid: false; reason: string } {
  const entry = sectionRegistry[patternId]

  if (!entry) {
    return { valid: false, reason: `Unknown section pattern: ${patternId}` }
  }

  const { meta } = entry

  // Non-unique sections can always be added
  if (!meta.unique) {
    return { valid: true }
  }

  // Check if unique section already exists
  const exists = existingSections.some(
    (section) => section.patternId === patternId
  )

  if (exists) {
    return {
      valid: false,
      reason: `Only one ${meta.name} allowed per page`,
    }
  }

  return { valid: true }
}

/**
 * Create a section from a pattern with default settings.
 * Sets patternId on the created section for tracking.
 *
 * @param patternId - Pattern ID (e.g., 'Hero')
 * @param props - Props to pass to the factory function
 * @returns SectionSchema with patternId set
 */
export async function createSectionFromPattern<T extends object>(
  patternId: string,
  props: T
): Promise<SectionSchema> {
  const entry = sectionRegistry[patternId]

  if (!entry) {
    throw new Error(`Unknown section pattern: ${patternId}`)
  }

  const factory = await entry.getFactory()
  const section = factory(props)

  // Set patternId for tracking
  return {
    ...section,
    patternId,
  }
}
