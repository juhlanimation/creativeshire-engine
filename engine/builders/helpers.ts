/**
 * Builder helper utilities.
 */

/**
 * Create a content binding expression.
 * @param path - Content path (e.g., 'hero.title')
 * @returns Binding expression string '{{ content.hero.title }}'
 */
export function bind(path: string): string {
  return `{{ content.${path} }}`
}
