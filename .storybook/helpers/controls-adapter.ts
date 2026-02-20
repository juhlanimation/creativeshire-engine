/**
 * Controls Adapter
 * Maps engine SettingConfig types to Storybook argTypes for auto-generated controls.
 */

import type { SettingConfig } from '../../engine/schema/settings'

export interface ArgType {
  control: { type: string; min?: number; max?: number; step?: number } | false
  description?: string
  options?: string[]
  table?: { category?: string; disable?: boolean }
  /** Storybook conditional display */
  if?: { arg: string; eq?: string; neq?: string; truthy?: boolean }
  /** Override display name in Controls panel */
  name?: string
}

/**
 * Convert a single SettingConfig to a Storybook argType.
 */
export function settingToArgType(setting: SettingConfig): ArgType | null {
  // Skip hidden, structural-only, and advanced settings
  if (setting.hidden || setting.editorHint === 'structural' || setting.advanced) return null

  const base: ArgType = {
    control: { type: 'text' },
    description: setting.description,
    table: setting.group ? { category: setting.group } : undefined,
  }

  switch (setting.type) {
    case 'toggle':
      return { ...base, control: { type: 'boolean' } }

    case 'text':
      if (setting.suggestions?.length) {
        return { ...base, control: { type: 'select' }, options: ['', ...setting.suggestions] }
      }
      return { ...base, control: { type: 'text' } }

    case 'textarea':
      return { ...base, control: { type: 'text' } }

    case 'number':
      return {
        ...base,
        control: {
          type: 'number',
          min: setting.min ?? setting.validation?.min,
          max: setting.max ?? setting.validation?.max,
          step: setting.step,
        },
      }

    case 'range':
      return {
        ...base,
        control: {
          type: 'range',
          min: setting.min,
          max: setting.max,
          step: setting.step,
        },
      }

    case 'select':
      return {
        ...base,
        control: { type: 'select' },
        options: setting.choices.map((c) => c.value),
      }

    case 'color':
      return { ...base, control: { type: 'color' } }

    case 'image':
      return { ...base, control: { type: 'text' } }

    case 'video':
      return { ...base, control: { type: 'text' } }

    case 'icon':
      return { ...base, control: { type: 'text' } }

    case 'spacing':
      return { ...base, control: { type: 'text' } }

    case 'alignment':
      if (setting.choices) {
        return {
          ...base,
          control: { type: 'select' },
          options: setting.choices.map((c) => c.value),
        }
      }
      return { ...base, control: { type: 'text' } }

    case 'element-ref':
      // Not meaningful in isolation
      return { ...base, control: false, table: { ...base.table, disable: true } }

    case 'custom':
      return { ...base, control: { type: 'object' } }

    default:
      return { ...base, control: { type: 'text' } }
  }
}

/**
 * Convert a SettingsConfig map to Storybook argTypes.
 */
export function settingsToArgTypes(
  settings?: Record<string, SettingConfig>
): Record<string, ArgType> {
  if (!settings) return {}

  const argTypes: Record<string, ArgType> = {}

  for (const [key, setting] of Object.entries(settings)) {
    const argType = settingToArgType(setting)
    if (argType) {
      argTypes[key] = argType
    }
  }

  return argTypes
}

/**
 * Convert a SettingsConfig map to conditional Storybook argTypes.
 * Args only display when `conditionArg` equals `conditionValue`.
 *
 * @param conditionArg  - Story arg to check ('intro', 'experience')
 * @param conditionValue - Value to match (e.g. 'wait', 'cover-scroll')
 * @param keyPrefix     - Arg key prefix (e.g. 'intro::wait', 'experience::cover-scroll::scroll/fade')
 * @param settings      - SettingsConfig map
 * @param category      - Storybook table category label
 */
export function settingsToConditionalArgTypes(
  conditionArg: string,
  conditionValue: string,
  keyPrefix: string,
  settings: Record<string, SettingConfig>,
  category: string,
): Record<string, ArgType> {
  const argTypes: Record<string, ArgType> = {}

  for (const [key, setting] of Object.entries(settings)) {
    const argType = settingToArgType(setting)
    if (!argType) continue

    const prefixedKey = `${keyPrefix}::${key}`
    argTypes[prefixedKey] = {
      ...argType,
      name: setting.label,
      if: { arg: conditionArg, eq: conditionValue },
      table: { ...argType.table, category },
    }
  }

  return argTypes
}
