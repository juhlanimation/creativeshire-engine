/**
 * Setting configuration types for platform UI.
 * Defines how component props are exposed in the CMS editor.
 *
 * Uses discriminated unions to ensure type safety:
 * - `default` value matches the setting type
 * - Required fields per type (e.g., `choices` for select)
 */

// =============================================================================
// Editor Hints
// =============================================================================

/**
 * Visibility hint for platform editors.
 * - 'structural': implementation detail, hidden from content editors by default.
 * - 'content': user-facing, always shown (same as omitting editorHint).
 */
export type EditorHint = 'structural' | 'content'

// =============================================================================
// Validation
// =============================================================================

/**
 * Validation rules for settings.
 */
export interface SettingValidation {
  /** Field is required */
  required?: boolean
  /** Regex pattern for text validation */
  pattern?: string
  /** Error message for validation failure */
  message?: string
  /** Minimum numeric value */
  min?: number
  /** Maximum numeric value */
  max?: number
  /** Minimum text length */
  minLength?: number
  /** Maximum text length */
  maxLength?: number
}

// =============================================================================
// Choice Options
// =============================================================================

/**
 * Choice option for select controls.
 */
export interface SettingChoice {
  /** Value stored in schema */
  value: string
  /** Display label in UI */
  label: string
  /** Optional description */
  description?: string
  /** Optional icon */
  icon?: string
}

// =============================================================================
// Base Setting Config
// =============================================================================

/**
 * Common fields shared by all setting types.
 */
interface BaseSettingConfig {
  /** Human-readable label */
  label: string

  /** Help text / tooltip */
  description?: string

  /** Group for organizing settings (e.g., "Layout", "Typography") */
  group?: string

  /** Hide in basic mode, show in advanced */
  advanced?: boolean

  /** Conditional display: "otherSetting === 'value'" */
  condition?: string

  /**
   * Whether this setting supports data binding expressions.
   * When true, the CMS shows a "bind to content" option allowing
   * values like {{ content.hero.title }} or {{ item.name }}.
   * Content props (src, content, label, href) should be bindable.
   * Structural props (variant, objectFit, as) typically aren't.
   */
  bindable?: boolean

  /**
   * Visibility hint for platform editors.
   * - 'structural': implementation detail (id, layout, className). Hidden from content editors.
   * - 'content' or omitted: user-facing. Always shown.
   */
  editorHint?: EditorHint

  /**
   * Whether this setting is hidden from the CMS editor by default.
   * Hidden settings are engine-controlled — the preset wires them,
   * CMS users don't see or edit them.
   * Can be overridden per-preset via ContentContract.settingOverrides.
   * Default: false (visible).
   */
  hidden?: boolean

  /** Validation rules */
  validation?: SettingValidation
}

// =============================================================================
// Discriminated Union Setting Types
// =============================================================================

/** Boolean toggle switch */
interface ToggleSetting extends BaseSettingConfig {
  type: 'toggle'
  default: boolean
}

/** Single-line text input */
interface TextSetting extends BaseSettingConfig {
  type: 'text'
  default: string
  /**
   * Suggested values shown as a dropdown in Storybook / autocomplete in CMS.
   * Supports `{section}` template — expanded to actual section IDs at render time.
   * Example: `['--{section}-cover-progress']` → `['--hero-cover-progress', '--about-cover-progress']`
   */
  suggestions?: string[]
}

/** Multi-line text input */
interface TextareaSetting extends BaseSettingConfig {
  type: 'textarea'
  default: string
}

/** Numeric input field */
interface NumberSetting extends BaseSettingConfig {
  type: 'number'
  default: number
  /** Minimum value */
  min?: number
  /** Maximum value */
  max?: number
  /** Step increment */
  step?: number
}

/** Slider with min/max bounds */
interface RangeSetting extends BaseSettingConfig {
  type: 'range'
  default: number
  /** Minimum value (required for range) */
  min: number
  /** Maximum value (required for range) */
  max: number
  /** Step increment */
  step?: number
}

/** Dropdown selection */
interface SelectSetting extends BaseSettingConfig {
  type: 'select'
  default: string
  /** Available choices (required for select) */
  choices: SettingChoice[]
}

/** Color picker */
interface ColorSetting extends BaseSettingConfig {
  type: 'color'
  default: string
}

/** Image asset picker */
interface ImageSetting extends BaseSettingConfig {
  type: 'image'
  default: string
}

/** Video asset picker */
interface VideoSetting extends BaseSettingConfig {
  type: 'video'
  default: string
}

/** Icon picker */
interface IconSetting extends BaseSettingConfig {
  type: 'icon'
  default: string
}

/** Spacing picker (padding/margin/gap) */
interface SpacingSetting extends BaseSettingConfig {
  type: 'spacing'
  default: number | string
}

/** Alignment picker (flex align/justify) */
interface AlignmentSetting extends BaseSettingConfig {
  type: 'alignment'
  default: string
  /** Optional predefined choices */
  choices?: SettingChoice[]
}

/** Element reference picker — CMS shows widget/element picker, resolves to CSS selector */
interface ElementRefSetting extends BaseSettingConfig {
  type: 'element-ref'
  default: string | null
  /** DOM element type to filter candidates (e.g., 'video', 'img', '*' for any) */
  element: string
}

/** Platform-defined custom control */
interface CustomSetting extends BaseSettingConfig {
  type: 'custom'
  default: unknown
  /** Platform component name for custom control */
  component?: string
}

// =============================================================================
// Setting Config Union
// =============================================================================

/**
 * Configuration for a single setting displayed in platform UI.
 * Discriminated union ensures type safety for each setting type.
 */
export type SettingConfig =
  | ToggleSetting
  | TextSetting
  | TextareaSetting
  | NumberSetting
  | RangeSetting
  | SelectSetting
  | ColorSetting
  | ImageSetting
  | VideoSetting
  | IconSetting
  | SpacingSetting
  | AlignmentSetting
  | ElementRefSetting
  | CustomSetting

/**
 * UI control types for platform settings.
 * Derived from SettingConfig for consistency.
 */
export type SettingType = SettingConfig['type']

/**
 * Possible setting values.
 */
export type SettingValue = string | number | boolean | string[] | null

// =============================================================================
// Settings Group
// =============================================================================

/**
 * Group definition for organizing settings in platform UI.
 * Groups visually cluster related settings under a common heading.
 */
export interface SettingsGroup {
  /** Unique identifier matching `group` strings in settings */
  id: string
  /** Human-readable display label */
  label: string
  /** Icon name for platform UI */
  icon?: string
  /** Optional description shown as group tooltip */
  description?: string
}

// =============================================================================
// Settings Map
// =============================================================================

/**
 * Map of setting configurations keyed by prop name.
 * Generic over the component's props type for type safety.
 */
export type SettingsConfig<T> = {
  [K in keyof T]?: SettingConfig
}

// =============================================================================
// Type Helpers
// =============================================================================

/**
 * Extract the default value type for a given setting type.
 */
export type SettingDefaultType<T extends SettingType> = Extract<
  SettingConfig,
  { type: T }
>['default']

/**
 * Create a typed setting config.
 * Helper for better type inference when defining settings inline.
 */
export function defineSetting<T extends SettingConfig>(setting: T): T {
  return setting
}

// =============================================================================
// Defaults Extraction
// =============================================================================

/**
 * Extract default values from a SettingsConfig map.
 * Returns { propName: defaultValue } for each setting that has a default.
 *
 * Used by meta-registry to pre-compute widget defaults at module load time,
 * so WidgetRenderer can merge them with zero per-render cost.
 */
export function extractDefaults(
  settings: Record<string, SettingConfig>
): Record<string, unknown> {
  const defaults: Record<string, unknown> = {}
  for (const [key, config] of Object.entries(settings)) {
    if (config && config.default !== undefined) {
      defaults[key] = config.default
    }
  }
  return defaults
}

/**
 * Merge meta setting defaults under explicit props.
 * Factories call this once at the top so that meta defaults
 * automatically apply when a caller (e.g. preset) omits a setting.
 *
 * Props always win — meta defaults only fill in missing keys.
 */
export function applyMetaDefaults<T>(
  meta: { settings?: Record<string, SettingConfig> },
  props: T,
): T {
  const defaults = extractDefaults((meta.settings ?? {}) as Record<string, SettingConfig>)
  return { ...defaults, ...props } as T
}
