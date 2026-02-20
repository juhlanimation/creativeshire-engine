/**
 * Detail panel for a selected behaviour.
 * Shows meta info and interactive settings editor (no preview — behaviours are CSS-variable-only).
 */

'use client'

import type { BehaviourMeta } from '../../../../engine/experience/behaviours/types'
import { SettingsEditor } from '../../../../engine/renderer/dev/DevToolsPanel/SettingsEditor'
import type { SettingsConfig } from '../../../../engine/schema/settings'
import { usePreviewValues, useRegistryDetail } from './registry-store'

interface BehaviourDetailProps {
  meta: BehaviourMeta
}

export function BehaviourDetail({ meta }: BehaviourDetailProps) {
  const previewValues = usePreviewValues('behaviour', meta.id)
  const { setPreviewValue } = useRegistryDetail()

  const settings = meta.settings as SettingsConfig<Record<string, unknown>> | undefined
  const values = buildValues(settings, previewValues)

  return (
    <div className="cd-detail">
      <div className="cd-detail__header">
        <h3 className="cd-detail__name">{meta.name}</h3>
        <span className="cd-registry__item-badge">{meta.category}</span>
      </div>
      <div className="cd-detail__id">{meta.id}</div>
      {meta.description && (
        <p className="cd-detail__desc">{meta.description}</p>
      )}
      {meta.tags && meta.tags.length > 0 && (
        <div className="cd-detail__tags">
          {meta.tags.map((tag) => (
            <span key={tag} className="cd-detail__tag">{tag}</span>
          ))}
        </div>
      )}

      {/* Settings */}
      {settings && Object.keys(settings).length > 0 && (
        <div className="cd-detail__section">
          <SettingsEditor
            settings={settings}
            values={values}
            onChange={(key, value) => setPreviewValue('behaviour', meta.id, key, value)}
            header="Settings"
          />
        </div>
      )}

      {!settings || Object.keys(settings).length === 0 ? (
        <div className="cd-detail__note">
          This behaviour has no configurable settings.
        </div>
      ) : null}
    </div>
  )
}

function buildValues(
  settings: SettingsConfig<Record<string, unknown>> | undefined,
  overrides: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  if (!settings) return result
  for (const [key, config] of Object.entries(settings)) {
    if (!config) continue
    result[key] = overrides[key] ?? config.default
  }
  return result
}
