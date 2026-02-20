/**
 * Walk a SectionSchema widget tree and extract unique widget types.
 */

import type { WidgetSchema } from '../../../../engine/schema/widget'
import type { SectionSchema } from '../../../../engine/schema/section'

export interface ExtractedWidget {
  type: string
  depth: number
}

/** DFS walk of the widget tree, collecting type + depth. */
export function extractWidgetsFromSection(schema: SectionSchema): ExtractedWidget[] {
  const result: ExtractedWidget[] = []

  function walk(widgets: WidgetSchema[], depth: number) {
    for (const w of widgets) {
      result.push({ type: w.type, depth })
      if (w.widgets && w.widgets.length > 0) {
        walk(w.widgets, depth + 1)
      }
    }
  }

  walk(schema.widgets, 0)
  return result
}

/** Get unique widget types from a section schema. */
export function getUniqueWidgetTypes(schema: SectionSchema): string[] {
  const seen = new Set<string>()
  const result: string[] = []

  function walk(widgets: WidgetSchema[]) {
    for (const w of widgets) {
      if (!seen.has(w.type)) {
        seen.add(w.type)
        result.push(w.type)
      }
      if (w.widgets && w.widgets.length > 0) {
        walk(w.widgets)
      }
    }
  }

  walk(schema.widgets)
  return result
}
