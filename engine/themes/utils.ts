/**
 * Theme utility functions.
 */

import type { ColorPalette, ThemeTypography, ThemeDefinition, TypographyScaleOverrides } from './types'
import { LAYOUT_PRESETS } from './types'

/** CSS variable name for each ColorPalette field. */
const PALETTE_VAR_MAP: Record<keyof ColorPalette, string> = {
  background: '--site-outer-bg',
  text: 'color',
  textPrimary: '--text-primary',
  textSecondary: '--text-secondary',
  accent: '--accent',
  interaction: '--interaction',
  colorPrimary: '--color-primary',
  colorPrimaryContrast: '--color-primary-contrast',
  colorSecondary: '--color-secondary',
  colorSecondaryContrast: '--color-secondary-contrast',
  colorLink: '--color-link',
  colorFocus: '--color-focus',
  scrollbarThumb: '--scrollbar-thumb',
  scrollbarTrack: '--scrollbar-track',
  statusSuccess: '--status-success',
  statusError: '--status-error',
}

/**
 * Convert a ColorPalette to CSS variable assignments.
 * Used by buildThemeStyle() and Storybook decorator.
 */
export function paletteToCSS(palette: ColorPalette): React.CSSProperties {
  const vars: Record<string, string> = {}
  for (const [field, cssVar] of Object.entries(PALETTE_VAR_MAP)) {
    const value = palette[field as keyof ColorPalette]
    if (value) {
      vars[cssVar] = value
    }
  }
  return vars as React.CSSProperties
}

/**
 * Convert ThemeTypography to CSS variable assignments.
 * Sets --font-title, --font-paragraph, --font-ui, and type scale vars.
 */
/** Emit CSS variables from a TypographyScaleOverrides object with a given prefix. */
function scaleOverridesToCSS(
  prefix: string,
  overrides: TypographyScaleOverrides | undefined,
  vars: Record<string, string>,
): void {
  if (!overrides) return
  if (overrides.display) vars[`${prefix}-display`] = overrides.display
  if (overrides.heading) vars[`${prefix}-heading`] = overrides.heading
  if (overrides.body) vars[`${prefix}-body`] = overrides.body
  if (overrides.small) vars[`${prefix}-small`] = overrides.small
  if (overrides.xs) vars[`${prefix}-xs`] = overrides.xs
}

export function typographyToCSS(typography: ThemeTypography): React.CSSProperties {
  const vars: Record<string, string> = {
    '--font-title': typography.title,
    '--font-heading': typography.heading,
    '--font-paragraph': typography.paragraph,
    '--font-ui': typography.ui,
    '--font-size-display': typography.scale.display,
    '--font-size-h1': typography.scale.h1,
    '--font-size-h2': typography.scale.h2,
    '--font-size-h3': typography.scale.h3,
    '--font-size-body': typography.scale.body,
    '--font-size-small': typography.scale.small,
    '--font-size-xs': typography.scale.xs,
  }

  scaleOverridesToCSS('--font-weight', typography.fontWeights, vars)
  scaleOverridesToCSS('--line-height', typography.lineHeights, vars)
  scaleOverridesToCSS('--letter-spacing', typography.letterSpacings, vars)

  return vars as React.CSSProperties
}

/**
 * Convert non-color, non-typography theme tokens to CSS variable assignments.
 * Covers: spacing, radius, shadows, borders, motion, textDecoration, interaction.
 */
export function tokensToCSS(def: ThemeDefinition): React.CSSProperties {
  const vars: Record<string, string> = {}

  // Spacing
  const s = def.spacing
  vars['--spacing-xs'] = s.xs
  vars['--spacing-sm'] = s.sm
  vars['--spacing-md'] = s.md
  vars['--spacing-lg'] = s.lg
  vars['--spacing-xl'] = s.xl
  vars['--spacing-2xl'] = s['2xl']
  vars['--spacing-3xl'] = s['3xl']
  vars['--spacing-section-x'] = s.sectionX
  vars['--spacing-section-y'] = s.sectionY

  // Radius
  const r = def.radius
  vars['--radius-none'] = r.none
  vars['--radius-sm'] = r.sm
  vars['--radius-md'] = r.md
  vars['--radius-lg'] = r.lg
  vars['--radius-full'] = r.full

  // Shadows
  const sh = def.shadows
  vars['--shadow-none'] = sh.none
  vars['--shadow-sm'] = sh.sm
  vars['--shadow-md'] = sh.md
  vars['--shadow-lg'] = sh.lg

  // Borders
  const b = def.borders
  vars['--border-width'] = b.width
  vars['--border-style'] = b.style
  vars['--border-color'] = b.color
  vars['--border-divider-opacity'] = b.dividerOpacity

  // Motion
  const m = def.motion
  vars['--duration-fast'] = m.durationFast
  vars['--duration-normal'] = m.durationNormal
  vars['--duration-slow'] = m.durationSlow
  vars['--ease-default'] = m.easeDefault
  vars['--ease-in'] = m.easeIn
  vars['--ease-out'] = m.easeOut

  // Text decoration
  const td = def.textDecoration
  vars['--text-decoration-style'] = td.style
  vars['--text-decoration-thickness'] = td.thickness
  vars['--text-decoration-offset'] = td.offset
  vars['--text-decoration-opacity'] = td.opacity
  if (td.dashLength) vars['--text-decoration-dash'] = td.dashLength
  if (td.gapLength) vars['--text-decoration-gap'] = td.gapLength

  // Interaction
  const i = def.interaction
  vars['--hover-opacity'] = i.hoverOpacity
  vars['--active-scale'] = i.activeScale
  vars['--focus-ring-width'] = i.focusRingWidth
  vars['--focus-ring-offset'] = i.focusRingOffset

  // Layout presets
  const l = def.layout
  for (const preset of LAYOUT_PRESETS) {
    vars[`--layout-gap-${preset}`] = l.gap[preset]
    vars[`--layout-padding-${preset}`] = l.padding[preset]
  }

  return vars as React.CSSProperties
}

/**
 * Create a theme definition.
 * TypeScript enforces all fields — no optional gaps.
 *
 * Usage:
 * ```ts
 * const myTheme = createTheme({
 *   id: 'my-theme',
 *   name: 'My Theme',
 *   ...all fields required...
 * })
 * registerTheme(myTheme)
 * ```
 */
export function createTheme(def: ThemeDefinition): ThemeDefinition {
  return def
}
