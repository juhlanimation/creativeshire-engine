/**
 * Shared utilities for Theme Showcase stories.
 * Constants, styles, and helpers extracted from the monolith.
 */

import React from 'react'
import { getTheme, ensureThemesRegistered } from '../index'
import type {
  ColorPalette,
  ColorMode,
  ThemeTypography,
  ThemeDefinition,
} from '../types'

ensureThemesRegistered()

// ---------------------------------------------------------------------------
// Re-exports for story files
// ---------------------------------------------------------------------------

export type { ColorPalette, ColorMode, ThemeTypography, ThemeDefinition }
export { getTheme }

// ---------------------------------------------------------------------------
// Palette → CSS variable mapping
// ---------------------------------------------------------------------------

export const PALETTE_VAR_MAP: Record<keyof ColorPalette, string> = {
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

export const PALETTE_GROUPS: { label: string; fields: (keyof ColorPalette)[] }[] = [
  { label: 'Core', fields: ['background', 'text', 'textPrimary', 'textSecondary'] },
  { label: 'Brand', fields: ['accent', 'interaction'] },
  { label: 'Buttons', fields: ['colorPrimary', 'colorPrimaryContrast', 'colorSecondary', 'colorSecondaryContrast'] },
  { label: 'UI', fields: ['colorLink', 'colorFocus'] },
  { label: 'Scrollbar', fields: ['scrollbarThumb', 'scrollbarTrack'] },
  { label: 'Status', fields: ['statusSuccess', 'statusError'] },
]

// ---------------------------------------------------------------------------
// Typography constants
// ---------------------------------------------------------------------------

/** Map scale keys to TypographyScaleOverrides keys */
export const SCALE_TO_OVERRIDE: Record<keyof ThemeTypography['scale'], 'display' | 'heading' | 'body' | 'small'> = {
  display: 'display',
  h1: 'heading',
  h2: 'heading',
  h3: 'heading',
  body: 'body',
  small: 'small',
}

export const DEFAULT_WEIGHTS: Record<string, string> = { display: '700', heading: '600', body: '400', small: '400' }
export const DEFAULT_LINE_HEIGHTS: Record<string, string> = { display: '1.1', heading: '1.2', body: '1.5', small: '1.4' }
export const DEFAULT_LETTER_SPACINGS: Record<string, string> = { display: '-0.02em', heading: '-0.01em', body: '0em', small: '0.02em' }

export const SCALE_SAMPLES: { key: keyof ThemeTypography['scale']; label: string; text: string }[] = [
  { key: 'display', label: 'Display', text: 'Brand Statement' },
  { key: 'h1', label: 'H1', text: 'Page Heading' },
  { key: 'h2', label: 'H2', text: 'Section Heading' },
  { key: 'h3', label: 'H3', text: 'Sub-heading' },
  { key: 'body', label: 'Body', text: 'The quick brown fox jumps over the lazy dog. Pack my box with five dozen liquor jugs.' },
  { key: 'small', label: 'Small', text: 'Caption and metadata text — secondary information lives here.' },
]

// ---------------------------------------------------------------------------
// Token arrays
// ---------------------------------------------------------------------------

import type { ThemeSpacing, ThemeRadius, ThemeShadows } from '../types'

export const SPACING_TOKENS: { key: keyof ThemeSpacing; label: string }[] = [
  { key: 'xs', label: 'xs' },
  { key: 'sm', label: 'sm' },
  { key: 'md', label: 'md' },
  { key: 'lg', label: 'lg' },
  { key: 'xl', label: 'xl' },
  { key: '2xl', label: '2xl' },
  { key: '3xl', label: '3xl' },
  { key: 'sectionX', label: 'sectionX' },
  { key: 'sectionY', label: 'sectionY' },
]

export const RADIUS_TOKENS: { key: keyof ThemeRadius; label: string }[] = [
  { key: 'none', label: 'none' },
  { key: 'sm', label: 'sm' },
  { key: 'md', label: 'md' },
  { key: 'lg', label: 'lg' },
  { key: 'full', label: 'full' },
]

export const SHADOW_TOKENS: { key: keyof ThemeShadows; label: string }[] = [
  { key: 'none', label: 'none' },
  { key: 'sm', label: 'sm' },
  { key: 'md', label: 'md' },
  { key: 'lg', label: 'lg' },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Extract the human-readable font name from a CSS font-family stack. */
export function displayFontName(stack: string): string {
  const generics = ['system-ui', '-apple-system', 'sans-serif', 'serif', 'monospace']
  for (const part of stack.split(',')) {
    const clean = part.trim().replace(/^["']|["']$/g, '')
    if (clean.startsWith('var(')) continue
    if (generics.includes(clean)) continue
    return clean
  }
  return stack.split(',')[0].trim()
}

/** Resolve which font family to use for a scale entry (pure — takes typo param). */
export function scaleFont(key: string, typo: ThemeTypography): string {
  return key === 'body' || key === 'small' ? typo.paragraph
    : key === 'display' ? typo.title
    : typo.heading
}

/** Resolve theme from Storybook globals. Returns null if theme not found. */
export function resolveShowcaseTheme(globals: Record<string, unknown>) {
  const themeId = (globals.colorTheme as string) ?? 'contrast'
  const mode = ((globals.colorMode as string) ?? 'dark') as ColorMode
  const theme = getTheme(themeId)
  if (!theme) return null

  const palette = theme[mode]
  const typo = theme.typography

  return {
    themeId,
    mode,
    theme,
    palette,
    typo,
    uiFont: typo.ui,
    titleFont: typo.title,
    headingFont: typo.heading,
    bodyFont: typo.paragraph,
  }
}

// ---------------------------------------------------------------------------
// Inline styles (documentation story — not a shipped component)
// ---------------------------------------------------------------------------

export const s = {
  root: {
    padding: '40px',
    minHeight: '100vh',
  } satisfies React.CSSProperties,

  // Header
  header: { marginBottom: '48px' } satisfies React.CSSProperties,
  themeName: {
    fontSize: '32px',
    fontWeight: 700,
    fontFamily: 'var(--font-title, system-ui, sans-serif)',
    marginBottom: '8px',
  } satisfies React.CSSProperties,
  description: { fontSize: '16px', opacity: 0.7, marginBottom: '16px' } satisfies React.CSSProperties,
  badges: { display: 'flex', gap: '8px', flexWrap: 'wrap' as const } satisfies React.CSSProperties,
  badge: (bg: string, fg: string): React.CSSProperties => ({
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 600,
    backgroundColor: bg,
    color: fg,
  }),

  // Section chrome
  sectionTitle: {
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    opacity: 0.4,
    marginBottom: '20px',
    paddingBottom: '8px',
    borderBottom: '1px solid rgba(128,128,128,0.15)',
  } satisfies React.CSSProperties,

  // Color palette
  groupLabel: {
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.06em',
    opacity: 0.35,
    marginBottom: '12px',
  } satisfies React.CSSProperties,
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
    gap: '16px',
    marginBottom: '28px',
  } satisfies React.CSSProperties,
  swatchCard: { display: 'flex', flexDirection: 'column' as const, gap: '6px' } satisfies React.CSSProperties,
  swatch: (color: string): React.CSSProperties => ({
    width: '100%',
    height: '56px',
    borderRadius: '6px',
    backgroundColor: color,
    border: '1px solid rgba(128,128,128,0.2)',
  }),
  swatchLabel: { fontSize: '12px', fontWeight: 600 } satisfies React.CSSProperties,
  swatchMeta: { fontSize: '10px', opacity: 0.5, fontFamily: 'monospace' } satisfies React.CSSProperties,

  // Typography section
  fontFamilies: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  } satisfies React.CSSProperties,
  fontCard: {
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid rgba(128,128,128,0.12)',
  } satisfies React.CSSProperties,
  fontRole: {
    fontSize: '10px',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
    opacity: 0.4,
    marginBottom: '4px',
  } satisfies React.CSSProperties,
  fontFamily: (family: string): React.CSSProperties => ({
    fontFamily: family,
    fontSize: '28px',
    fontWeight: 700,
    lineHeight: 1.2,
    marginBottom: '4px',
  }),
  fontFamilyMono: {
    fontSize: '10px',
    fontFamily: 'monospace',
    opacity: 0.35,
    wordBreak: 'break-all' as const,
  } satisfies React.CSSProperties,

  // Type scale
  scaleRow: {
    display: 'grid',
    gridTemplateColumns: '80px 1fr',
    gap: '16px',
    alignItems: 'center',
    paddingTop: '16px',
    paddingBottom: '16px',
    borderBottom: '1px solid rgba(128,128,128,0.08)',
  } satisfies React.CSSProperties,
  scaleMeta: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2px',
    paddingTop: '4px',
  } satisfies React.CSSProperties,
  scaleLabel: {
    fontSize: '11px',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.06em',
    opacity: 0.5,
  } satisfies React.CSSProperties,
  scaleSize: {
    fontSize: '10px',
    fontFamily: 'monospace',
    opacity: 0.35,
  } satisfies React.CSSProperties,
  scaleSample: (family: string, size: string, weight: string, lh: string, ls: string): React.CSSProperties => ({
    fontFamily: family,
    fontSize: size,
    fontWeight: weight,
    lineHeight: lh,
    letterSpacing: ls,
  }),

  // Spacing section
  spacingRow: {
    display: 'grid',
    gridTemplateColumns: '80px 1fr',
    gap: '16px',
    alignItems: 'center',
    paddingTop: '10px',
    paddingBottom: '10px',
    borderBottom: '1px solid rgba(128,128,128,0.08)',
  } satisfies React.CSSProperties,
  spacingBar: (color: string): React.CSSProperties => ({
    height: '16px',
    borderRadius: '3px',
    backgroundColor: color,
    opacity: 0.6,
  }),
  spacingValue: {
    fontSize: '10px',
    fontFamily: 'monospace',
    opacity: 0.5,
    marginTop: '2px',
  } satisfies React.CSSProperties,

  // Radius section
  radiusGrid: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '20px',
    marginBottom: '28px',
  } satisfies React.CSSProperties,
  radiusCard: (radius: string, borderColor: string): React.CSSProperties => ({
    width: '80px',
    height: '80px',
    borderRadius: radius,
    border: `2px solid ${borderColor}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.7,
  }),

  // Shadows section
  shadowGrid: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '24px',
    marginBottom: '28px',
  } satisfies React.CSSProperties,
  shadowCard: (shadow: string, bg: string): React.CSSProperties => ({
    width: '120px',
    height: '80px',
    borderRadius: '8px',
    backgroundColor: bg,
    boxShadow: shadow,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),

  // Borders section
  bordersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '28px',
  } satisfies React.CSSProperties,
  borderCard: {
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid rgba(128,128,128,0.12)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  } satisfies React.CSSProperties,
  borderSample: (width: string, color: string): React.CSSProperties => ({
    height: '0',
    borderTop: `${width} solid ${color}`,
  }),
  borderDividerSample: (width: string, color: string, opacity: string): React.CSSProperties => ({
    height: '0',
    borderTop: `${width} solid ${color}`,
    opacity: Number(opacity),
  }),

  // Motion section
  motionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '28px',
  } satisfies React.CSSProperties,
  motionCard: {
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid rgba(128,128,128,0.12)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  } satisfies React.CSSProperties,
  motionBar: (duration: string, easing: string, accent: string): React.CSSProperties => ({
    height: '8px',
    borderRadius: '4px',
    backgroundColor: accent,
    opacity: 0.6,
    width: '30%',
    transition: `width ${duration} ${easing}`,
  }),

  // Text decoration section — gradient-based underline matching engine ::after rendering
  textDecoSample: (
    _style: string,
    thickness: string,
    offset: string,
    opacity?: string,
    dashLength?: string,
    gapLength?: string,
  ): React.CSSProperties => {
    const dash = dashLength ?? '100%'
    const gap = gapLength ?? '0px'
    const color = opacity && opacity !== '1'
      ? `color-mix(in srgb, currentColor ${Number(opacity) * 100}%, transparent)`
      : 'currentColor'
    return {
      fontSize: '20px',
      fontWeight: 600,
      textDecoration: 'none',
      position: 'relative' as const,
      paddingBottom: `calc(${offset} + ${thickness})`,
      backgroundImage: `repeating-linear-gradient(to right, ${color} 0, ${color} ${dash}, transparent ${dash}, transparent calc(${dash} + ${gap}))`,
      backgroundRepeat: 'repeat-x',
      backgroundSize: `100% ${thickness}`,
      backgroundPosition: '0 100%',
    }
  },

  // Layout presets
  layoutRow: {
    display: 'grid',
    gridTemplateColumns: '80px 1fr',
    gap: '16px',
    alignItems: 'center',
    paddingTop: '12px',
    paddingBottom: '12px',
    borderBottom: '1px solid rgba(128,128,128,0.08)',
  } satisfies React.CSSProperties,
  layoutGapDemo: (_accent: string): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
  }),
  layoutGapBox: (accent: string): React.CSSProperties => ({
    width: '48px',
    height: '32px',
    borderRadius: '4px',
    backgroundColor: accent,
    opacity: 0.6,
    flexShrink: 0,
  }),
  layoutPaddingDemo: (accent: string): React.CSSProperties => ({
    border: `2px dashed ${accent}`,
    borderRadius: '6px',
    opacity: 0.6,
    position: 'relative',
  }),
  layoutPaddingInner: (bg: string): React.CSSProperties => ({
    backgroundColor: bg,
    borderRadius: '3px',
    height: '24px',
    width: '100%',
    opacity: 0.4,
  }),
}

// ---------------------------------------------------------------------------
// Root wrapper — shared across all showcase stories
// ---------------------------------------------------------------------------

export interface ShowcaseRootProps {
  children: React.ReactNode
  bodyFont: string
  bg: string
  color: string
}

export function ShowcaseRoot({ children, bodyFont, bg, color }: ShowcaseRootProps) {
  return (
    <div style={{ ...s.root, fontFamily: bodyFont, backgroundColor: bg, color }}>
      {children}
    </div>
  )
}

/** Standard "theme not found" fallback. */
export function ThemeNotFound({ themeId }: { themeId: string }) {
  return <div style={{ padding: '40px', color: '#ff4444' }}>Theme &ldquo;{themeId}&rdquo; not found.</div>
}
