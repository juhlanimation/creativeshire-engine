/**
 * Theme barrel export.
 * Imports built-in themes (auto-register on import), exports everything.
 */

// Built-in themes (auto-register on import)
import './definitions/contrast'
import './definitions/muted'
import './definitions/editorial'
import './definitions/neon'
import './definitions/earthy'
import './definitions/monochrome'
import './definitions/crossroad'

// Types
export type {
  ColorPalette,
  ColorMode,
  ThemeTypography,
  TypographyScaleOverrides,
  ThemeSpacing,
  ThemeRadius,
  ThemeShadows,
  ThemeBorders,
  ThemeMotion,
  ThemeTextDecoration,
  ThemeInteraction,
  ThemeLayout,
  ScrollbarType,
  ThemeScrollbar,
  ThemeDefinition,
} from './types'

export type { LayoutPreset } from './types'
export { LAYOUT_PRESETS } from './types'

// Registry
export {
  registerTheme,
  getTheme,
  getThemeIds,
  getAllThemes,
  getAllThemeMetas,
  type ThemeMeta,
} from './registry'

// Utilities
export { createTheme, paletteToCSS, typographyToCSS, tokensToCSS } from './utils'

/**
 * Ensures all built-in themes are registered.
 * Call at engine entry point to prevent tree-shaking.
 */
export function ensureThemesRegistered(): void {
  // Registration already ran on import above.
}
