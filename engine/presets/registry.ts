/**
 * Preset registry - enables runtime discovery of available presets.
 *
 * Unlike experiences which can be switched at runtime, presets define
 * the entire site structure. Switching presets typically requires a page
 * reload since the page schema changes.
 *
 * Usage:
 * 1. Presets auto-register on import via registerPreset()
 * 2. DevPresetSwitcher shows available presets
 * 3. App reads getPresetOverride() to determine which preset to use
 */

import type { SitePreset, ContentContract, ContentPreprocessor } from './types'

// =============================================================================
// Types
// =============================================================================

/**
 * Lightweight metadata for listing presets in UI.
 */
export interface PresetMeta {
  /** Unique identifier */
  id: string
  /** Human-readable display name */
  name: string
  /** Brief description */
  description: string
  /** Preview image URL (optional) */
  preview?: string
}

/**
 * Registry entry - full preset + metadata
 */
interface RegistryEntry {
  meta: PresetMeta
  preset: SitePreset
  preprocessor?: ContentPreprocessor
}

// =============================================================================
// Registry
// =============================================================================

/** Registry of available presets by ID */
const registry = new Map<string, RegistryEntry>()

/**
 * Register a preset with metadata.
 * Content contract is read from preset.content.contentContract.
 * Called by preset modules on import.
 */
export function registerPreset(
  meta: PresetMeta,
  preset: SitePreset,
  options?: { preprocessor?: ContentPreprocessor }
): void {
  if (registry.has(meta.id)) {
    console.warn(`Preset "${meta.id}" is already registered. Overwriting.`)
  }
  registry.set(meta.id, {
    meta,
    preset,
    preprocessor: options?.preprocessor,
  })
}

/**
 * Get a preset by ID.
 */
export function getPreset(id: string): SitePreset | undefined {
  return registry.get(id)?.preset
}

/**
 * Get preset metadata by ID.
 */
export function getPresetMeta(id: string): PresetMeta | undefined {
  return registry.get(id)?.meta
}

/**
 * Get all preset metadata (for UI listing).
 */
export function getAllPresetMetas(): PresetMeta[] {
  return Array.from(registry.values()).map((entry) => entry.meta)
}

/**
 * Get all registered preset IDs.
 */
export function getPresetIds(): string[] {
  return Array.from(registry.keys())
}

/**
 * Get all registered presets.
 */
export function getAllPresets(): Array<{ meta: PresetMeta; preset: SitePreset }> {
  return Array.from(registry.values())
}

// =============================================================================
// Content Contract Accessors
// =============================================================================

/**
 * Get the content contract for a preset by ID.
 * Reads from the preset's content composition.
 */
export function getPresetContentContract(id: string): ContentContract | undefined {
  return registry.get(id)?.preset.content.contentContract
}

/**
 * Get the content preprocessor for a preset by ID.
 */
export function getPresetContentPreprocessor(id: string): ContentPreprocessor | undefined {
  return registry.get(id)?.preprocessor
}

// =============================================================================
// URL Override Helpers
// =============================================================================

/** Query param name for preset override */
export const DEV_PRESET_PARAM = '_preset'

/**
 * Get current preset override from URL.
 * Used by consuming apps to determine which preset to load.
 *
 * @example
 * ```typescript
 * const presetId = getPresetOverride() ?? 'default-preset'
 * const preset = getPreset(presetId)
 * ```
 */
export function getPresetOverride(): string | null {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  return params.get(DEV_PRESET_PARAM)
}

/**
 * Set preset override in URL and reload.
 * Since presets define site structure, a reload is required.
 */
export function setPresetOverride(id: string | null): void {
  if (typeof window === 'undefined') return

  const url = new URL(window.location.href)
  if (id) {
    url.searchParams.set(DEV_PRESET_PARAM, id)
  } else {
    url.searchParams.delete(DEV_PRESET_PARAM)
  }

  // Update URL and reload (presets are structural, need full reload)
  window.location.href = url.toString()
}
