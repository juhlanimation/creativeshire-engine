/**
 * Shared utilities for renderers.
 */

/**
 * Capitalize first letter of a string.
 * Used to convert event names to React handler format: click → onClick
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}
