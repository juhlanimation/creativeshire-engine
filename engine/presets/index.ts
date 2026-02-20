/**
 * Presets barrel export.
 * Re-exports all available presets and registry functions.
 *
 * Presets auto-register when imported. Call ensurePresetsRegistered()
 * at app entry point to guarantee registration before lookups.
 */

// Preset exports (auto-register on import)
export { noirPreset, noirMeta, noirContentContract } from './noir'
export { prismPreset, prismMeta, prismContentContract } from './prism'
export { testMultipagePreset, testMultipageMeta, testMultipageContentContract } from './test-multipage'
export { loftPreset, loftMeta, loftContentContract } from './loft'

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
