/**
 * Setting definition helpers for common patterns.
 * Provides reusable factory functions for standard setting configurations.
 */

import type { SettingConfig } from './settings'
import type { TextElement } from '../content/widgets/primitives/Text/types'

/**
 * Standard text scale choices matching the Text widget's scale system.
 */
const TEXT_SCALE_CHOICES = [
  { value: 'display', label: 'Display — Brand Statement' },
  { value: 'h1', label: 'H1 — Page Heading' },
  { value: 'h2', label: 'H2 — Section Heading' },
  { value: 'h3', label: 'H3 — Sub-heading' },
  { value: 'body', label: 'Body' },
  { value: 'small', label: 'Small — Caption' },
  { value: 'xs', label: 'XS — Micro / Metadata' },
] as const

/**
 * Creates a text scale select setting for section metas.
 * Produces a dropdown with the same choices as the Text widget's `as` prop.
 *
 * @param label - Human-readable label (e.g., "Title Scale")
 * @param defaultValue - Default text scale level
 * @param options - Optional overrides (group, advanced, description)
 */
export function textScaleSetting(
  label: string,
  defaultValue: TextElement,
  options?: { group?: string; advanced?: boolean; description?: string }
): SettingConfig {
  return {
    type: 'select',
    label,
    default: defaultValue,
    description: options?.description ?? 'Type scale level (maps to theme typography)',
    choices: [...TEXT_SCALE_CHOICES],
    group: options?.group ?? 'Typography',
    advanced: options?.advanced,
  }
}

/**
 * Creates a text size multiplier range setting.
 * Produces a slider that scales font-size relative to the selected type scale.
 * At 1 the text renders at the theme's default size; higher values enlarge it.
 *
 * @param label - Human-readable label (e.g., "Title Size")
 * @param defaultValue - Default multiplier (default: 1)
 * @param options - Optional overrides (group, advanced, description)
 */
export function textSizeMultiplierSetting(
  label: string,
  defaultValue: number = 1,
  options?: { group?: string; advanced?: boolean; description?: string }
): SettingConfig {
  return {
    type: 'range',
    label,
    default: defaultValue,
    min: 0.5,
    max: 5,
    step: 0.1,
    description: options?.description ?? 'Scale factor applied to the selected type scale',
    group: options?.group ?? 'Typography',
    advanced: options?.advanced,
  }
}
