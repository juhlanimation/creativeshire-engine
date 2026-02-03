/**
 * Utility functions for section patterns.
 * Includes binding expression detection for preset support.
 */

/**
 * Checks if a value is a binding expression string.
 * Binding expressions use the format: {{ content.xxx }}
 *
 * @param value - Any value to check
 * @returns true if the value is a binding expression string
 */
export function isBindingExpression(value: unknown): value is string {
  return typeof value === 'string' && value.startsWith('{{ content.')
}
