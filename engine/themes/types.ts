/**
 * Theme definition types.
 * Full brand system: colors, typography, spacing, radii, shadows, borders.
 */

// =============================================================================
// Colors
// =============================================================================

export interface ColorPalette {
  /** Page background (--site-outer-bg) */
  background: string
  /** Inherited text color (CSS color property) */
  text: string
  /** Primary text (--text-primary) */
  textPrimary: string
  /** Muted text (--text-secondary) */
  textSecondary: string
  /** Highlight/active color (--accent) */
  accent: string
  /** Interactive elements: links in chrome, prompts (--interaction) */
  interaction: string
  /** Primary button bg (--color-primary) */
  colorPrimary: string
  /** Primary button text (--color-primary-contrast) */
  colorPrimaryContrast: string
  /** Secondary button bg (--color-secondary) */
  colorSecondary: string
  /** Secondary button text (--color-secondary-contrast) */
  colorSecondaryContrast: string
  /** Link color (--color-link) */
  colorLink: string
  /** Focus ring (--color-focus) */
  colorFocus: string
  /** Scrollbar thumb (--scrollbar-thumb) */
  scrollbarThumb: string
  /** Scrollbar track (--scrollbar-track) */
  scrollbarTrack: string
  /** Success state color (--status-success) */
  statusSuccess: string
  /** Error state color (--status-error) */
  statusError: string
}

export type ColorMode = 'dark' | 'light'

// =============================================================================
// Typography
// =============================================================================

/** Scale-level typography overrides (display, heading, body, small, xs). */
export interface TypographyScaleOverrides {
  /** Display / hero text */
  display?: string
  /** Section headings (h1–h3) */
  heading?: string
  /** Body / paragraph text */
  body?: string
  /** Small / caption text */
  small?: string
  /** XS / micro metadata text */
  xs?: string
}

export interface ThemeTypography {
  /** Font for display / brand text (maps to --font-title) */
  title: string
  /** Font for section headings h1–h3 (maps to --font-heading) */
  heading: string
  /** Font for body/paragraph text (maps to --font-paragraph) */
  paragraph: string
  /** Font for UI elements (maps to --font-ui) */
  ui: string
  /** Type scale — font sizes per semantic role */
  scale: {
    /** Display / hero text (e.g. '6rem') */
    display: string
    /** Page headings (e.g. '2.25rem') */
    h1: string
    /** Section headings (e.g. '1.5rem') */
    h2: string
    /** Sub-headings (e.g. '1.125rem') */
    h3: string
    /** Body text (e.g. '1rem') */
    body: string
    /** Small / caption text (e.g. '0.75rem') */
    small: string
    /** XS / micro metadata text (e.g. '0.625rem') */
    xs: string
  }
  /** Font weights per scale level (e.g. '700', '400') */
  fontWeights?: TypographyScaleOverrides
  /** Line heights per scale level (e.g. '1.1', '1.5') */
  lineHeights?: TypographyScaleOverrides
  /** Letter spacings per scale level (e.g. '-0.02em', '0') */
  letterSpacings?: TypographyScaleOverrides
}

// =============================================================================
// Spacing
// =============================================================================

export interface ThemeSpacing {
  /** Micro spacing — inline elements, icon gaps (e.g. '0.25rem') */
  xs: string
  /** Small spacing — labels, metadata gaps (e.g. '0.5rem') */
  sm: string
  /** Medium spacing — component internal padding (e.g. '1rem') */
  md: string
  /** Large spacing — card padding, section gaps (e.g. '2rem') */
  lg: string
  /** Extra large — section vertical padding (e.g. '4rem') */
  xl: string
  /** 2x extra large — page-level vertical rhythm (e.g. '6rem') */
  '2xl': string
  /** 3x extra large — extreme page margins, ultrawide padding (e.g. '12rem') */
  '3xl': string
  /** Section horizontal padding — responsive page margins (e.g. 'clamp(1.5rem, 5cqw, 8rem)') */
  sectionX: string
  /** Section vertical padding — top/bottom breathing room (e.g. 'clamp(3rem, 6cqw, 6rem)') */
  sectionY: string
}

// =============================================================================
// Border Radius
// =============================================================================

export interface ThemeRadius {
  /** No rounding (e.g. '0') */
  none: string
  /** Subtle rounding (e.g. '2px') */
  sm: string
  /** Default rounding (e.g. '8px') */
  md: string
  /** Pronounced rounding (e.g. '16px') */
  lg: string
  /** Fully round / pill (e.g. '9999px') */
  full: string
}

// =============================================================================
// Shadows
// =============================================================================

export interface ThemeShadows {
  /** No shadow */
  none: string
  /** Subtle shadow — inputs, minor elevation */
  sm: string
  /** Default shadow — cards, dropdowns */
  md: string
  /** Strong shadow — modals, overlays */
  lg: string
}

// =============================================================================
// Borders
// =============================================================================

export interface ThemeBorders {
  /** Default border width (e.g. '1px') */
  width: string
  /** Default border color — should work on both dark and light palettes */
  color: string
  /** Border line style — cascades to navs, dividers, cards */
  style: 'solid' | 'dashed' | 'dotted' | 'double'
  /** Divider opacity (e.g. '0.15') */
  dividerOpacity: string
}

// =============================================================================
// Motion
// =============================================================================

export interface ThemeMotion {
  /** Micro interactions — button hover, toggle (e.g. '150ms') */
  durationFast: string
  /** Default transitions — panels, reveals (e.g. '300ms') */
  durationNormal: string
  /** Page-level — route transitions, modals (e.g. '500ms') */
  durationSlow: string
  /** Default easing — most transitions */
  easeDefault: string
  /** Enter easing — elements appearing */
  easeIn: string
  /** Exit easing — elements leaving */
  easeOut: string
}

// =============================================================================
// Text Decoration
// =============================================================================

export interface ThemeTextDecoration {
  /** Underline style for links and nav items */
  style: 'solid' | 'dashed' | 'dotted' | 'wavy'
  /** Underline thickness (e.g. '1px', '2px') */
  thickness: string
  /** Underline offset from text baseline (e.g. '4px', '0.2em') */
  offset: string
  /** Underline opacity (e.g. '0.6' — 1 = fully opaque) */
  opacity: string
  /** Dash segment length for dashed/dotted styles (e.g. '9px'). Omit for solid. */
  dashLength?: string
  /** Gap between dash segments (e.g. '6px'). Omit for solid. */
  gapLength?: string
}

// =============================================================================
// Interactive States
// =============================================================================

export interface ThemeInteraction {
  /** Hover opacity (e.g. '0.8' — 1 = no change) */
  hoverOpacity: string
  /** Press/active scale (e.g. '0.98' — 1 = no change) */
  activeScale: string
  /** Focus ring width (e.g. '2px') */
  focusRingWidth: string
  /** Focus ring offset from element (e.g. '2px') */
  focusRingOffset: string
}

// =============================================================================
// Layout Presets
// =============================================================================

export type LayoutPreset = 'none' | 'tight' | 'normal' | 'loose'
export const LAYOUT_PRESETS = ['none', 'tight', 'normal', 'loose'] as const

export interface ThemeLayout {
  /** Responsive gap values per preset (e.g. clamp() expressions) */
  gap: Record<LayoutPreset, string>
  /** Responsive padding values per preset — shorthand: "vertical horizontal" */
  padding: Record<LayoutPreset, string>
}

// =============================================================================
// Scrollbar
// =============================================================================

export type ScrollbarType = 'thin' | 'pill' | 'hidden'

export interface ThemeScrollbar {
  type: ScrollbarType
}

// =============================================================================
// Theme Definition
// =============================================================================

export interface ThemeDefinition {
  id: string
  name: string
  description: string
  defaultMode: ColorMode
  typography: ThemeTypography
  spacing: ThemeSpacing
  radius: ThemeRadius
  shadows: ThemeShadows
  borders: ThemeBorders
  motion: ThemeMotion
  textDecoration: ThemeTextDecoration
  interaction: ThemeInteraction
  layout: ThemeLayout
  scrollbar?: ThemeScrollbar
  dark: ColorPalette
  light: ColorPalette
}
