/**
 * Presets barrel export.
 * Re-exports all available presets and registry functions.
 *
 * Presets auto-register when imported. Call ensurePresetsRegistered()
 * at app entry point to guarantee registration before lookups.
 */

// Preset exports (auto-register on import)
export { bojuhlPreset, bojuhlMeta, bojuhlContentContract } from './bojuhl'
export { bishoyGendiPreset, bishoyGendiMeta, bishoyGendiContentContract } from './bishoy-gendi'
export { testMultipagePreset, testMultipageMeta, testMultipageContentContract } from './test-multipage'
export { port12Preset, port12Meta, port12ContentContract } from './port-12'

/**
 * Ensures all presets are registered.
 * Call at engine entry point to guarantee registration before lookups.
 * Lazy registration happens on module load, this function prevents tree-shaking.
 */
export function ensurePresetsRegistered(): void {
  // Registration already ran on import above.
  // This function exists so bundlers don't tree-shake them.
}

// Registry exports
export {
  registerPreset,
  getPreset,
  getPresetMeta,
  getAllPresetMetas,
  getPresetIds,
  getAllPresets,
  getPresetOverride,
  setPresetOverride,
  getPresetContentContract,
  getPresetContentPreprocessor,
  DEV_PRESET_PARAM,
  type PresetMeta,
} from './registry'

// Types
export type {
  SitePreset,
  PresetExperienceConfig,
  PresetChromeConfig,
  ContentContract,
  ContentSourceField,
  ContentSourceFieldType,
  ContentSection,
  ContentPreprocessor,
} from './types'
