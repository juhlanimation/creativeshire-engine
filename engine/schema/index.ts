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
  ExperienceConfig,
} from './experience'

// Widget types
export type {
  ActionBinding,
  WidgetEventMap,
  WidgetSchema,
  WidgetType,
  WidgetTypeMap,
  TextWidgetProps,
  ImageWidgetProps,
  VideoWidgetProps,
  FlexWidgetProps,
  GridWidgetProps,
} from './widget'

// Decorator types
export type { DecoratorRef } from '../content/decorators/types'

// Section types
export type { SectionSchema, LayoutConfig } from './section'

// Chrome types
export type {
  ChromeSchema,
  RegionSchema,
  RegionLayout,
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
export type { SiteSchema, SiteMetadata, PageReference, FullSchema } from './site'

// Intro types
export type { IntroConfig } from '../intro/types'

// Transition types
export type { TransitionConfig, PageTransitionOverride, PageTransitionRoute } from './transition'

// Theme types
export type {
  ThemeSchema,
  ScrollbarConfig,
  SmoothScrollConfig,
  LenisConfig,
  TypographyConfig,
  SectionTransitionConfig,
  ContainerConfig,
  FontProvider,
  ColorMode,
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
  EditorHint,
  SettingType,
  SettingConfig,
  SettingValue,
  SettingChoice,
  SettingValidation,
  SettingsConfig,
  SettingsGroup,
} from './settings'

// Component meta types
export type { ComponentCategory, ComponentMeta, MetaProps, SectionCategory, SectionMeta, RegionType, RegionMeta, ChromeSlot, ChromePatternMeta } from './meta'
export { defineMeta, defineSectionMeta, defineRegionMeta, defineChromeMeta } from './meta'

// Structural schema metas
export { themeMeta, getThemeSettings, getThemeGroups } from './theme-meta'
export { pageMeta, getPageSettings, getPageGroups } from './page-meta'
export { siteMetadataMeta, getSiteMetadataSettings, getSiteMetadataGroups } from './site-meta'
export { sectionMeta, getSectionSettings, getSectionContainerSettings, getSectionGroups } from './section-meta'
export { regionMeta, getRegionSettings, getRegionGroups } from './region-meta'
export { overlayMeta, getOverlaySettings, getOverlayGroups } from './overlay-meta'

// Schema utilities
export {
  getValueAtPath,
  setValueAtPath,
  hasValueAtPath,
  getAllPaths,
  deepClone,
  mergeOverrides,
  extractOverrides,
} from './utils'

// Setting helpers
export { textScaleSetting } from './settings-helpers'
