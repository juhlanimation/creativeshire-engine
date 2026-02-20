/**
 * Scans widget trees for `on` event action IDs and triggerable widgets.
 * Used by the authoring tool to auto-inject required overlays and
 * build the trigger → response assignment UI.
 */

import type { WidgetSchema, WidgetEventMap, ActionBinding } from '../../schema/widget'
import type { SectionSchema } from '../../schema/section'
import type { PageSchema } from '../../schema/page'
import { getWidgetMeta } from '../widgets/meta-registry'
import { getDecorator } from '../decorators'

/**
 * Extract the action ID from an ActionBinding (string or object form).
 */
function getActionId(binding: ActionBinding): string {
  return typeof binding === 'string' ? binding : binding.action
}

/**
 * Recursively walk a widget tree and collect all action IDs from `on` event maps.
 * Handles both string and object ActionBinding forms.
 */
export function collectWidgetActions(widgets: WidgetSchema[]): Set<string> {
  const actions = new Set<string>()

  function walk(ws: WidgetSchema[]) {
    for (const w of ws) {
      if (w.on) {
        for (const bindingOrBindings of Object.values(w.on)) {
          const bindings = Array.isArray(bindingOrBindings) ? bindingOrBindings : [bindingOrBindings]
          for (const binding of bindings) {
            actions.add(getActionId(binding))
          }
        }
      }
      if (w.widgets) {
        walk(w.widgets)
      }
    }
  }

  walk(widgets)
  return actions
}

/**
 * Collect all action IDs from a section's widget tree.
 */
export function collectSectionActions(section: SectionSchema): Set<string> {
  return collectWidgetActions(section.widgets)
}

/**
 * Scan all sections across all pages and collect action IDs.
 * Returns a map of actionId → list of section IDs that reference it.
 */
export function collectPresetActions(
  pages: Record<string, PageSchema>,
): Map<string, string[]> {
  const actionSections = new Map<string, string[]>()

  for (const page of Object.values(pages)) {
    for (const section of page.sections) {
      const actions = collectSectionActions(section)
      for (const actionId of actions) {
        const existing = actionSections.get(actionId)
        if (existing) {
          if (!existing.includes(section.id)) existing.push(section.id)
        } else {
          actionSections.set(actionId, [section.id])
        }
      }
    }
  }

  return actionSections
}

// =============================================================================
// Triggerable Widget Scanner
// =============================================================================

/**
 * A widget that has triggers declared in its meta.
 * Used by the authoring UI to show the trigger → response assignment board.
 */
export interface TriggerableWidget {
  /** Page this widget lives in */
  pageId: string
  /** Section index within the page */
  sectionIndex: number
  /** Section ID */
  sectionId: string
  /** Path through nested widgets: ['flex-root', 'link-1'] */
  widgetPath: string[]
  /** Leaf widget ID */
  widgetId: string
  /** Widget type: 'Link', 'Video', etc. */
  widgetType: string
  /** Available trigger events from widget meta */
  triggers: string[]
  /** Current on assignments */
  currentOn: WidgetEventMap
}

/**
 * Scan all pages in a preset and collect all widgets that have triggers
 * declared in their meta. Returns a flat list of triggerable widgets
 * with their location breadcrumbs and current wiring.
 */
export function collectTriggerableWidgets(
  pages: Record<string, PageSchema>,
): TriggerableWidget[] {
  const result: TriggerableWidget[] = []

  for (const [pageId, page] of Object.entries(pages)) {
    for (let sectionIndex = 0; sectionIndex < page.sections.length; sectionIndex++) {
      const section = page.sections[sectionIndex]

      function walk(widgets: WidgetSchema[], path: string[]) {
        for (const w of widgets) {
          const meta = getWidgetMeta(w.type)
          if (meta?.triggers?.length) {
            const widgetId = w.id ?? `${w.type}-${path.length}`
            result.push({
              pageId,
              sectionIndex,
              sectionId: section.id,
              widgetPath: [...path, widgetId],
              widgetId,
              widgetType: w.type,
              triggers: meta.triggers,
              currentOn: w.on ?? {},
            })
          }
          if (w.widgets) {
            const id = w.id ?? `${w.type}-${path.length}`
            walk(w.widgets, [...path, id])
          }
        }
      }

      walk(section.widgets, [])
    }
  }

  return result
}

// =============================================================================
// Decorator Overlay Scanner
// =============================================================================

/**
 * Walk a widget tree and collect all requiredOverlays from decorator refs.
 * Returns a Set of chrome pattern IDs (e.g., 'VideoModal', 'CursorTracker').
 */
export function collectDecoratorOverlays(widgets: WidgetSchema[]): Set<string> {
  const overlays = new Set<string>()

  function walk(ws: WidgetSchema[]) {
    for (const w of ws) {
      // Use explicit decorators, or fall back to meta.defaultDecorators
      const refs = w.decorators ?? getWidgetMeta(w.type)?.defaultDecorators
      if (refs) {
        for (const ref of refs) {
          const definition = getDecorator(ref.id)
          if (definition?.requiredOverlays) {
            for (const overlay of definition.requiredOverlays) {
              overlays.add(overlay)
            }
          }
        }
      }
      if (w.widgets) {
        walk(w.widgets)
      }
    }
  }

  walk(widgets)
  return overlays
}
