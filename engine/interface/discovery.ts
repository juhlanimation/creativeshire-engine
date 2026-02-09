/**
 * Section Discovery API.
 * Platform queries this to populate the "Add Section" dropdown.
 */

import type { SectionSchema, SectionCategory, SettingConfig } from '../schema'
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
 * Unique sections show canAdd: false if any unique section of the same category exists.
 *
 * @param existingSections - Current sections on the page
 * @returns Array of section availability information
 */
export function getAvailableSections(
  existingSections: SectionSchema[]
): SectionAvailability[] {
  // Build set of categories that have unique sections already
  const existingUniqueCategories = new Set<SectionCategory>()

  for (const section of existingSections) {
    if (section.patternId) {
      const entry = sectionRegistry[section.patternId]
      if (entry?.meta.unique) {
        existingUniqueCategories.add(entry.meta.sectionCategory)
      }
    }
  }

  // Map all registered sections to availability info
  return getAllSectionMetas().map((meta): SectionAvailability => {
    // Unique sections blocked if ANY unique section of same category exists
    const categoryBlocked = meta.unique && existingUniqueCategories.has(meta.sectionCategory)

    return {
      id: meta.id,
      name: meta.name,
      description: meta.description,
      category: meta.sectionCategory,
      canAdd: !categoryBlocked,
      reason: categoryBlocked
        ? `Only one ${meta.sectionCategory} section allowed per page`
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
 * Unique sections are blocked per category, not per pattern.
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

  // Check if any unique section of the same category exists
  const categoryExists = existingSections.some((section) => {
    if (!section.patternId) return false
    const existingEntry = sectionRegistry[section.patternId]
    return existingEntry?.meta.unique &&
           existingEntry.meta.sectionCategory === meta.sectionCategory
  })

  if (categoryExists) {
    return {
      valid: false,
      reason: `Only one ${meta.sectionCategory} section allowed per page`,
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
