/**
 * Theme registry.
 * Named color themes registered at module load time.
 */

import type { ThemeDefinition } from './types'

/** Lightweight metadata for CMS listing. */
export interface ThemeMeta {
  id: string
  name: string
  description: string
}

/** Registry of available themes by ID */
const registry = new Map<string, ThemeDefinition>()

/** Register a theme definition. */
export function registerTheme(theme: ThemeDefinition): void {
  if (registry.has(theme.id)) {
    console.warn(`Theme "${theme.id}" is already registered. Overwriting.`)
  }
  registry.set(theme.id, theme)
}

/** Get a theme by ID. */
export function getTheme(id: string): ThemeDefinition | undefined {
  return registry.get(id)
}

/** Get all registered theme IDs. */
export function getThemeIds(): string[] {
  return Array.from(registry.keys())
}

/** Get all registered theme definitions. */
export function getAllThemes(): ThemeDefinition[] {
  return Array.from(registry.values())
}

/** Get lightweight metadata for all themes (CMS display). */
export function getAllThemeMetas(): ThemeMeta[] {
  return Array.from(registry.values()).map(({ id, name, description }) => ({
    id,
    name,
    description,
  }))
}
