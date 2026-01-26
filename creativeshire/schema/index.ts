/**
 * Schema barrel exports.
 * Re-exports all types from the schema layer.
 */

// Base types
export type { SerializableValue } from './types'

// Feature types
export type {
  FeatureSet,
  SpacingFeature,
  TypographyFeature,
  BackgroundFeature,
  BorderFeature,
} from './features'

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
} from './chrome'

// Page types
export type { PageSchema, PageHeadSchema } from './page'

// Site types
export type { SiteSchema, PageReference } from './site'
