/**
 * Intro sequence registry + dev override helpers.
 *
 * Intro sequences are named IntroConfig bundles (pattern + settings + overlay).
 * Registered sequences appear in DevTools for switching.
 */

import type { IntroConfig, IntroMeta, PresetIntroConfig } from './types'

// =============================================================================
// Sequence Registry
// =============================================================================

interface RegisteredSequence {
  meta: IntroMeta
  config: IntroConfig
}

const sequences = new Map<string, RegisteredSequence>()

/**
 * Register a named intro sequence (pattern + settings + overlay).
 */
export function registerIntroSequence(meta: IntroMeta, config: IntroConfig): void {
  sequences.set(meta.id, { meta, config })
}

/**
 * Get a registered intro sequence config by ID.
 */
export function getIntroSequence(id: string): IntroConfig | undefined {
  return sequences.get(id)?.config
}

/**
 * Get a registered intro sequence (meta + config) by ID.
 */
export function getIntroSequenceEntry(id: string): RegisteredSequence | undefined {
  return sequences.get(id)
}

/**
 * Get metadata for all registered intro sequences (for DevTools listing).
 */
export function getAllIntroSequenceMetas(): IntroMeta[] {
  return Array.from(sequences.values()).map((s) => s.meta)
}

export type { RegisteredSequence }

// =============================================================================
// Preset Resolution
// =============================================================================

/**
 * Resolve a PresetIntroConfig (reference + overrides) into a full IntroConfig.
 * Returns null if the referenced sequence is not registered.
 */
export function resolvePresetIntro(ref: PresetIntroConfig): IntroConfig | null {
  const base = getIntroSequence(ref.sequence)
  if (!base) return null
  if (!ref.settings) return base
  return { ...base, settings: { ...base.settings, ...ref.settings } }
}

// =============================================================================
// Dev Override Helpers
// =============================================================================

/** Query param name for intro override */
export const DEV_INTRO_PARAM = '_intro'

/**
 * Get current intro override from URL.
 * Returns 'none' to disable intro, a sequence ID to switch, or null for no override.
 */
export function getIntroOverride(): string | null {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  return params.get(DEV_INTRO_PARAM)
}

/**
 * Set intro override in URL and reload.
 * Intros are one-shot sequences, so a reload is required.
 */
export function setIntroOverride(id: string | null): void {
  if (typeof window === 'undefined') return

  const url = new URL(window.location.href)
  if (id) {
    url.searchParams.set(DEV_INTRO_PARAM, id)
  } else {
    url.searchParams.delete(DEV_INTRO_PARAM)
  }

  window.location.href = url.toString()
}
