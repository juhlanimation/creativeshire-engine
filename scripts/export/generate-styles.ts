/**
 * CSS generation for site export.
 * Builds globals.css with engine and preset style imports.
 */

/**
 * Generate globals.css content for the exported site.
 * Follows the PLATFORM-SETUP.md pattern exactly.
 */
export function generateGlobalsCss(presetId: string, hasPresetStyles: boolean): string {
  const lines: string[] = [
    '@import "tailwindcss";',
    '',
    '/* Engine styles — widgets, effects, chrome, renderer */',
    '@import "@creativeshire/engine/styles";',
  ]

  if (hasPresetStyles) {
    lines.push('')
    lines.push(`/* Preset-specific styles */`)
    lines.push(`@import "@creativeshire/engine/presets/${presetId}/styles";`)
  }

  lines.push('')
  lines.push('/* Tell Tailwind to scan engine components */')
  lines.push('@source "../node_modules/@creativeshire/engine/**/*.tsx";')
  lines.push('')
  lines.push('/* =============================================================================')
  lines.push(' * BASE RESETS')
  lines.push(' * Site-scoped styles (scrollbar, typography, media) come from engine.')
  lines.push(' * These are generic resets for the platform shell.')
  lines.push(' * ============================================================================= */')
  lines.push('')
  lines.push('*, *::before, *::after {')
  lines.push('  box-sizing: border-box;')
  lines.push('}')
  lines.push('')
  lines.push('body {')
  lines.push('  margin: 0;')
  lines.push('  padding: 0;')
  lines.push('}')
  lines.push('')
  lines.push('h1, h2, h3, h4, h5, h6, p {')
  lines.push('  margin: 0;')
  lines.push('}')
  lines.push('')
  lines.push('button {')
  lines.push('  border: none;')
  lines.push('  background: none;')
  lines.push('  padding: 0;')
  lines.push('  cursor: pointer;')
  lines.push('  font: inherit;')
  lines.push('}')
  lines.push('')

  return lines.join('\n')
}
