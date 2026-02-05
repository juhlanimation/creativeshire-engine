/**
 * Shared utilities for layout widgets.
 * Content Layer (L1) - pure CSS value conversions.
 */

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
 * Alias for toCssValue, named for semantic clarity.
 */
export function toCssGap(value: number | string | undefined): string | undefined {
  return toCssValue(value)
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
