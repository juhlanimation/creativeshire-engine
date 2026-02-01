/**
 * Creativeshire Engine - Main entry point
 *
 * A CMS rendering engine library. Exports widgets, sections, behaviours, schema.
 *
 * @example
 * // Full import
 * import { SiteRenderer, PageRenderer } from '@creativeshire/engine'
 *
 * // Subpath imports (recommended for specific needs)
 * import { SiteRenderer } from '@creativeshire/engine/renderer'
 * import type { SiteSchema } from '@creativeshire/engine/schema'
 * import { EngineProvider } from '@creativeshire/engine/interface'
 */

// Renderer - main entry for rendering sites
export {
  SiteRenderer,
  PageRenderer,
  SectionRenderer,
  WidgetRenderer,
  ChromeRenderer,
  ErrorBoundary,
} from './renderer'

// Schema - types for configuration
export type {
  SiteSchema,
  PageSchema,
  SectionSchema,
  WidgetSchema,
  ChromeSchema,
  ThemeSchema,
  ExperienceConfig,
  BehaviourConfig,
} from './schema'

export { ENGINE_VERSION, isCompatible } from './schema'

// Presets - site templates
export * from './presets'

// Interface - platform integration
export {
  EngineProvider,
  useEngineController,
  useEngineState,
  useEngineStore,
  createEngineStore,
} from './interface'

export type {
  EngineInput,
  EngineState,
  EngineController,
  EngineEvents,
} from './interface'

// Note: For full access to all exports, use subpath imports:
// - @creativeshire/engine/schema
// - @creativeshire/engine/interface
// - @creativeshire/engine/experience
// - @creativeshire/engine/content/widgets
// - @creativeshire/engine/content/sections
// - @creativeshire/engine/content/chrome
