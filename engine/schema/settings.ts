/**
 * Setting configuration types for platform UI.
 * Defines how component props are exposed in the CMS editor.
 */

// =============================================================================
// Setting Types
// =============================================================================

/**
 * UI control types for platform settings.
 */
export type SettingType =
  | 'range'      // Slider with min/max
  | 'select'     // Dropdown with choices
  | 'toggle'     // Boolean switch
  | 'color'      // Color picker
  | 'text'       // Single-line text input
  | 'textarea'   // Multi-line text input
  | 'number'     // Numeric input
  | 'image'      // Image picker (asset reference)
  | 'video'      // Video picker (asset reference)
  | 'icon'       // Icon picker
  | 'spacing'    // Padding/margin picker
  | 'alignment'  // Flex alignment picker
  | 'custom'     // Platform-defined custom control

// =============================================================================
// Setting Configuration
// =============================================================================

/**
 * Configuration for a single setting displayed in platform UI.
 * Extends the existing OptionConfig pattern from behaviours.
 */
export interface SettingConfig {
  /** Control type for platform UI */
  type: SettingType

  /** Human-readable label */
  label: string

  /** Default value */
  default: SettingValue

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

  // Range/number specific
  /** Minimum value for range/number */
  min?: number
  /** Maximum value for range/number */
  max?: number
  /** Step increment for range/number */
  step?: number

  // Select specific
  /** Options for select dropdown */
  choices?: SettingChoice[]

  // Validation
  /** Validation rules */
  validation?: SettingValidation
}

/**
 * Possible setting values.
 */
export type SettingValue = string | number | boolean | string[] | null

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
  /** Minimum length/value */
  min?: number
  /** Maximum length/value */
  max?: number
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
