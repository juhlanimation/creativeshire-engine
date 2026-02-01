/**
 * Schema barrel exports.
 * Re-exports all types from the schema layer.
 */

// Base types
export type { SerializableValue } from './types'

// Experience types
export type {
  CSSVariables,
  BehaviourState,
  BehaviourConfig,
  OptionConfig,
  ExperienceConfig,
} from './experience'

// Widget types
export type {
  WidgetSchema,
  WidgetType,
  WidgetTypeMap,
  TextWidgetProps,
  ImageWidgetProps,
  VideoWidgetProps,
  FlexWidgetProps,
  GridWidgetProps,
} from './widget'

// Section types
export type { SectionSchema, LayoutConfig } from './section'

// Chrome types
export type {
  ChromeSchema,
  RegionSchema,
  OverlaySchema,
  PageChromeOverrides,
  TriggerCondition,
  ScrollTriggerCondition,
  ClickTriggerCondition,
  HoverTriggerCondition,
  LoadTriggerCondition,
  VisibilityTriggerCondition,
  TimerTriggerCondition,
  DeviceTriggerCondition,
  CustomTriggerCondition,
} from './chrome'

// Page types
export type { PageSchema, PageHeadSchema } from './page'

// Site types
export type { SiteSchema, PageReference } from './site'

// Theme types
export type {
  ThemeSchema,
  ScrollbarConfig,
  SmoothScrollConfig,
  TypographyConfig,
  SectionTransitionConfig,
} from './theme'

// Shell types
export type { ShellConfig, ShellResponsive } from './shell'

// Version types and utilities
export type { EngineVersion } from './version'
export {
  ENGINE_VERSION,
  MIN_SUPPORTED_VERSION,
  isCompatible,
  requiresMigration,
  parseVersion,
  versionToString,
  compareVersions,
} from './version'

// Settings types
export type {
  SettingType,
  SettingConfig,
  SettingValue,
  SettingChoice,
  SettingValidation,
  SettingsConfig,
} from './settings'

// Component meta types
export type { ComponentCategory, ComponentMeta, MetaProps } from './meta'
export { defineMeta } from './meta'
