/**
 * Section schema builder.
 * Reduces factory boilerplate by providing a fluent builder for SectionSchema objects.
 *
 * @example
 * ```typescript
 * import { section, text, image, bind } from '@creativeshire/engine/builders'
 *
 * section(
 *   { id: 'hero', patternId: 'HeroImage', constrained: false, sectionHeight: 'viewport' },
 *   [
 *     image({ src: bind('hero.imageSrc'), className: 'hero-bg' }),
 *     text(bind('hero.title'), { scale: 'h1' }),
 *   ]
 * )
 * ```
 */

import type { CSSProperties } from 'react'
import type { SectionSchema, WidgetSchema, ColorMode, LayoutConfig } from '../schema'

// ---------------------------------------------------------------------------
// Options
// ---------------------------------------------------------------------------

export interface SectionBuilderOptions {
  /** Section ID (used for anchor linking) */
  id: string
  /** Pattern that created this section (e.g., 'HeroImage') */
  patternId: string
  /** Human-readable display name */
  label?: string
  /** Constrain content to --site-max-width */
  constrained?: boolean
  /** Per-section color mode */
  colorMode?: ColorMode
  /** Per-section theme override */
  sectionTheme?: string
  /** Section height mode */
  sectionHeight?: 'auto' | 'viewport' | 'viewport-fixed'
  /** Layout configuration (defaults to vertical stack) */
  layout?: Partial<LayoutConfig>
  /** Inline styles */
  style?: CSSProperties
  /** CSS class names */
  className?: string
  /** Container padding overrides in px */
  padding?: {
    top?: number
    bottom?: number
    left?: number
    right?: number
  }
}

// ---------------------------------------------------------------------------
// Builder
// ---------------------------------------------------------------------------

/**
 * Build a SectionSchema with sensible defaults.
 *
 * @param options - Section configuration
 * @param widgets - Child widget schemas
 * @returns A complete SectionSchema
 */
export function section(
  options: SectionBuilderOptions,
  widgets: WidgetSchema[],
): SectionSchema {
  return {
    id: options.id,
    patternId: options.patternId,
    label: options.label ?? options.id,
    constrained: options.constrained,
    colorMode: options.colorMode,
    sectionTheme: options.sectionTheme,
    layout: {
      type: 'stack',
      direction: 'column',
      align: 'start',
      ...options.layout,
    } as LayoutConfig,
    style: options.style,
    className: options.className,
    paddingTop: options.padding?.top,
    paddingBottom: options.padding?.bottom,
    paddingLeft: options.padding?.left,
    paddingRight: options.padding?.right,
    sectionHeight: options.sectionHeight ?? 'auto',
    widgets,
  }
}
