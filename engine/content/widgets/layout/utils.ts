/**
 * Shared utilities for layout widgets.
 * Content Layer (L1) - pure CSS value conversions.
 */

import { LAYOUT_PRESETS } from '../../../themes/types'

const PRESET_SET = new Set<string>(LAYOUT_PRESETS)

/**
 * Check if a value is a layout preset name ('none' | 'tight' | 'normal' | 'loose').
 */
export function isLayoutPreset(value: string): boolean {
  return PRESET_SET.has(value)
}

/**
 * Converts a number or string to a CSS value.
 * Numbers are converted to pixels, strings are passed through.
 */
export function toCssValue(value: number | string | undefined): string | undefined {
  if (value === undefined) return undefined
  return typeof value === 'number' ? `${value}px` : value
}

/**
 * Converts a gap value to CSS.
 * Layout preset names resolve to CSS variables; numbers to px; other strings pass through.
 * When scale is provided, wraps the resolved value in calc(... * scale).
 */
export function toCssGap(value: number | string | undefined, scale?: number): string | undefined {
  if (value === undefined) return undefined
  let css: string
  if (typeof value === 'string' && isLayoutPreset(value)) {
    css = `var(--layout-gap-${value})`
  } else {
    css = toCssValue(value) ?? '0'
  }
  if (scale != null && scale !== 1) {
    return `calc(${css} * ${scale})`
  }
  return css
}

/**
 * Converts a padding value to CSS.
 * Layout preset names resolve to CSS variables; other strings pass through.
 * When scale is provided, wraps the resolved value in calc(... * scale).
 */
export function toCssPadding(value: string | undefined, scale?: number): string | undefined {
  if (value === undefined) return undefined
  let css: string
  if (isLayoutPreset(value)) {
    css = `var(--layout-padding-${value})`
  } else {
    css = value
  }
  if (scale != null && scale !== 1) {
    return `calc(${css} * ${scale})`
  }
  return css
}

/**
 * Flexbox alignment map.
 * Maps semantic alignment names to CSS values.
 */
export const ALIGN_MAP: Record<string, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
}

/**
 * Flexbox justify-content map.
 * Maps semantic justify names to CSS values.
 */
export const JUSTIFY_MAP: Record<string, string> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  between: 'space-between',
  around: 'space-around',
}

/**
 * Grid alignment map.
 * Maps semantic alignment names to CSS grid values.
 */
export const GRID_ALIGN_MAP: Record<string, string> = {
  start: 'start',
  center: 'center',
  end: 'end',
  stretch: 'stretch',
}
