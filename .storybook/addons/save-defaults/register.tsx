/**
 * "Save as Defaults" addon for Storybook.
 *
 * Intercepts Storybook's built-in "Save from Controls" so it also updates
 * meta.ts defaults (the built-in CSF rewriter can't handle function-based args).
 *
 * Saves two kinds of changes:
 * - Section/pattern settings → saved to the section/pattern meta.ts
 * - Layout widget overrides (__lw:*) → saved to the widget's own meta.ts
 */

import { addons } from 'storybook/manager-api'
import { SAVE_STORY_REQUEST } from 'storybook/internal/core-events'
import type { RequestData, SaveStoryRequestPayload } from 'storybook/internal/core-events'
import { ADDON_ID } from './constants'

interface LayoutWidgetKeyMapping {
  metaId: string
  settingKey: string
}

interface SaveDefaultsParam {
  id: string
  settingKeys: string[]
  defaults: Record<string, unknown>
  layoutWidgetKeys?: Record<string, LayoutWidgetKeyMapping>
}

interface SaveResult {
  ok: boolean
  updated: string[]
  skipped: string[]
  error?: string
}

async function postMetaChanges(
  id: string,
  changes: Record<string, unknown>,
): Promise<SaveResult> {
  const res = await fetch('/__save-meta-defaults', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, changes }),
  })
  return res.json()
}

/** Section container keys that are structural, not saveable to meta.ts */
const CONTAINER_KEYS = new Set([
  'constrained', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'sectionHeight',
])

addons.register(ADDON_ID, (api) => {
  const channel = addons.getChannel()

  // Intercept Storybook's built-in "Save from Controls" to also update meta.ts.
  channel.on(SAVE_STORY_REQUEST, async (request: RequestData<SaveStoryRequestPayload>) => {
    try {
      const argsJson = request?.payload?.args
      if (!argsJson) {
        console.debug('[save-defaults] SAVE_STORY_REQUEST received but no args in payload — skipping')
        return
      }

      const data = api.getCurrentStoryData()
      const saveDefaults = (data as { parameters?: Record<string, unknown> })
        ?.parameters?.saveDefaults as SaveDefaultsParam | undefined
      if (!saveDefaults) {
        console.debug('[save-defaults] No saveDefaults parameter on current story — skipping')
        return
      }

      const changedArgs: Record<string, unknown> = JSON.parse(argsJson)
      const layoutWidgetKeys = saveDefaults.layoutWidgetKeys ?? {}

      // Group all changes by target meta id
      const grouped = new Map<string, Record<string, unknown>>()

      for (const [key, value] of Object.entries(changedArgs)) {
        if (CONTAINER_KEYS.has(key)) continue

        if (saveDefaults.settingKeys.includes(key)) {
          // Section/pattern setting
          if (!grouped.has(saveDefaults.id)) grouped.set(saveDefaults.id, {})
          grouped.get(saveDefaults.id)![key] = value
        } else if (layoutWidgetKeys[key]) {
          // Layout widget override
          const mapping = layoutWidgetKeys[key]
          if (!grouped.has(mapping.metaId)) grouped.set(mapping.metaId, {})
          grouped.get(mapping.metaId)![mapping.settingKey] = value
        }
      }

      if (grouped.size === 0) {
        console.debug('[save-defaults] No saveable changes found in args:', Object.keys(changedArgs))
        return
      }

      console.info('[save-defaults] Saving to', grouped.size, 'meta file(s):', [...grouped.keys()])

      for (const [metaId, changes] of grouped) {
        if (Object.keys(changes).length === 0) continue
        try {
          const result = await postMetaChanges(metaId, changes)
          if (result.ok) {
            console.info(`[save-defaults] ${metaId}: updated [${result.updated.join(', ')}]`, result.skipped.length > 0 ? `skipped [${result.skipped.join(', ')}]` : '')
          } else {
            console.warn(`[save-defaults] ${metaId}: server returned error:`, result.error)
          }
        } catch (err) {
          console.error(`[save-defaults] ${metaId}: fetch failed:`, err)
        }
      }
    } catch (e) {
      console.error('[save-defaults] Failed to process SAVE_STORY_REQUEST:', e)
    }
  })
})
