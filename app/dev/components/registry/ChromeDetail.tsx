/**
 * Detail panel for a selected chrome component (region or overlay).
 * Shows meta info, settings editor, used widgets, and live preview.
 */

'use client'

import { useMemo } from 'react'
import type { ComponentMeta } from '../../../../engine/schema/meta'
import { SettingsEditor } from '../../../../engine/renderer/dev/DevToolsPanel/SettingsEditor'
import type { SettingsConfig, SettingConfig } from '../../../../engine/schema/settings'
import { usePreviewValues, useRegistryDetail } from './registry-store'
import { UsedWidgetsList } from './UsedWidgetsList'
import { ChromePreview } from './ChromePreview'

interface ChromeDetailProps {
  meta: ComponentMeta
}

export function ChromeDetail({ meta }: ChromeDetailProps) {
  const previewValues = usePreviewValues('chrome', meta.id)
  const { setPreviewValue } = useRegistryDetail()

  const settings = meta.settings as SettingsConfig<Record<string, unknown>> | undefined
  const values = buildValues(settings, previewValues)
  const hiddenKeys = useHiddenKeys(settings)

  return (
    <div className="cd-detail">
      <div className="cd-detail__header">
        <h3 className="cd-detail__name">{meta.name}</h3>
        <span className="cd-registry__item-badge">{meta.category}</span>
      </div>
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

      {/* Used Widgets */}
      {meta.usedWidgets && meta.usedWidgets.length > 0 && (
        <div className="cd-detail__section">
          <UsedWidgetsList widgets={meta.usedWidgets} />
        </div>
      )}

      {/* Settings */}
      {settings && Object.keys(settings).length > 0 && (
        <div className="cd-detail__section">
          <SettingsEditor
            settings={settings}
            values={values}
            onChange={(key, value) => setPreviewValue('chrome', meta.id, key, value)}
            header="Settings"
            hiddenKeys={hiddenKeys}
          />
        </div>
      )}

      {/* Preview */}
      <div className="cd-detail__section">
        <ChromePreview chromeId={meta.id} props={values} />
      </div>
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

function useHiddenKeys(
  settings: SettingsConfig<Record<string, unknown>> | undefined,
): Set<string> {
  return useMemo(() => {
    const keys = new Set<string>()
    if (!settings) return keys
    for (const [key, config] of Object.entries(settings)) {
      if ((config as SettingConfig | undefined)?.hidden) {
        keys.add(key)
      }
    }
    return keys
  }, [settings])
}
