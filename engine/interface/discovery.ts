/**
 * Section Discovery API.
 * Platform queries this to populate the "Add Section" dropdown.
 */

import type { SectionSchema, SectionCategory, SettingConfig, ChromeSlot } from '../schema'
import type { ContentContract } from '../presets/types'
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
    team: [],
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

// =============================================================================
// Chrome Pattern Discovery
// =============================================================================

import { chromePatternRegistry, getAllChromePatternMetas, getChromePatternsBySlot as getPatternsBySlot, getOverlayPatternMetas } from '../content/chrome/pattern-registry'
import type { PresetRegionConfig, PresetOverlayConfig } from '../presets/types'

/**
 * Information about a chrome pattern's availability.
 */
export interface ChromePatternAvailability {
  id: string
  name: string
  description: string
  chromeSlot: ChromeSlot | null
  canAdd: boolean
  reason?: string
  settings?: Record<string, SettingConfig>
  icon?: string
  tags?: string[]
}

/**
 * Get patterns available for a specific slot.
 */
export function getAvailableChromePatterns(
  slot: ChromeSlot,
  currentSlotPatternId?: string
): ChromePatternAvailability[] {
  return getPatternsBySlot(slot).map((meta): ChromePatternAvailability => ({
    id: meta.id,
    name: meta.name,
    description: meta.description,
    chromeSlot: meta.chromeSlot,
    canAdd: meta.id !== currentSlotPatternId,
    reason: meta.id === currentSlotPatternId ? 'Already active in this slot' : undefined,
    settings: meta.settings,
    icon: meta.icon,
    tags: meta.tags,
  }))
}

/**
 * Get chrome patterns grouped by slot (for authoring UI).
 */
export function getChromePatternsBySlotGrouped(): Record<ChromeSlot, ChromePatternAvailability[]> {
  const slots: ChromeSlot[] = ['header', 'footer']
  const result = {} as Record<ChromeSlot, ChromePatternAvailability[]>
  for (const slot of slots) {
    result[slot] = getAvailableChromePatterns(slot)
  }
  return result
}

/**
 * Get available overlay patterns (chromeSlot === null).
 */
export function getAvailableOverlayPatterns(): ChromePatternAvailability[] {
  return getOverlayPatternMetas().map((meta): ChromePatternAvailability => ({
    id: meta.id,
    name: meta.name,
    description: meta.description,
    chromeSlot: null,
    canAdd: true,
    settings: meta.settings,
    icon: meta.icon,
    tags: meta.tags,
  }))
}

/**
 * Create chrome config from a pattern with provided props.
 */
export async function createChromeFromPattern<T extends object>(
  patternId: string,
  props: T
): Promise<PresetRegionConfig | PresetOverlayConfig> {
  const entry = chromePatternRegistry[patternId]
  if (!entry) {
    throw new Error(`Unknown chrome pattern: ${patternId}`)
  }
  const factory = await entry.getFactory()
  return factory(props)
}

// =============================================================================
// Setting Visibility Resolution
// =============================================================================

/**
 * Resolve whether a setting is hidden, respecting contract overrides.
 * Priority: contract override > meta default > false (visible).
 */
export function isSettingHidden(
  componentId: string,
  settingKey: string,
  settingConfig: SettingConfig,
  contract?: ContentContract,
): boolean {
  const override = contract?.settingOverrides?.[componentId]?.[settingKey]
  if (override !== undefined) return override
  return settingConfig.hidden ?? false
}

/**
 * Get resolved settings for a component, filtering hidden ones.
 * Returns only settings visible to CMS users for the given contract.
 */
export function getVisibleSettings(
  componentId: string,
  settings: Record<string, SettingConfig>,
  contract?: ContentContract,
): Record<string, SettingConfig> {
  const result: Record<string, SettingConfig> = {}
  for (const [key, config] of Object.entries(settings)) {
    if (!isSettingHidden(componentId, key, config, contract)) {
      result[key] = config
    }
  }
  return result
}
