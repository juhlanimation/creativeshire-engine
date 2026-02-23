/**
 * Font manifest utilities.
 * Scans registered themes to extract required font CSS variable references.
 * Platform can call this at build time to ensure all font variables are loaded.
 */

import { getAllThemes } from './registry'

/** Extract all var(--font-xxx) references from registered theme typographies. */
export function getRequiredFontVariables(): string[] {
  const vars = new Set<string>()
  for (const theme of getAllThemes()) {
    const { title, heading, paragraph, ui } = theme.typography
    for (const value of [title, heading, paragraph, ui]) {
      const match = value.match(/^var\((--font-[^)]+)\)/)
      if (match) vars.add(match[1])
    }
  }
  return [...vars].sort()
}
