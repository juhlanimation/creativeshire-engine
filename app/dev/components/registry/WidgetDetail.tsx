/**
 * Detail panel for a selected widget — shows meta info, settings editor, and live preview.
 */

'use client'

import { useCallback, useMemo } from 'react'
import { getWidgetMeta } from '../../../../engine/content/widgets/meta-registry'
import { SettingsEditor } from '../../../../engine/renderer/dev/DevToolsPanel/SettingsEditor'
import type { SettingsConfig, SettingConfig } from '../../../../engine/schema/settings'
import { getPreviewConfig } from './preview-defaults'
import { usePreviewValues, useRegistryDetail } from './registry-store'
import { useVisibilityOverrides, useVisibilityStore } from './visibility-store'
import { WidgetPreview } from './WidgetPreview'

interface WidgetDetailProps {
  widgetType: string
}

export function WidgetDetail({ widgetType }: WidgetDetailProps) {
  const meta = getWidgetMeta(widgetType)
  const previewValues = usePreviewValues('widget', widgetType)
  const { setPreviewValue } = useRegistryDetail()
  const previewConfig = getPreviewConfig(widgetType)
  const { toggleHidden, getEffectiveHidden } = useVisibilityStore()
  const visibilityOverrides = useVisibilityOverrides(widgetType)

  if (!meta) {
    return <div className="cd-detail__empty">Unknown widget: {widgetType}</div>
  }

  const settings = meta.settings as SettingsConfig<Record<string, unknown>> | undefined
  const values = buildValues(settings, previewValues, previewConfig?.props)
  const hiddenKeys = useEffectiveHiddenKeys(widgetType, settings, getEffectiveHidden, visibilityOverrides)

  // Merge extra preview props (complex data not in settings) into rendered props
  const extraPreviewProps = previewConfig?.props
    ? Object.fromEntries(
        Object.entries(previewConfig.props).filter(
          ([key]) => !settings || !(key in settings),
        ),
      )
    : undefined
  const renderProps = extraPreviewProps
    ? { ...values, ...extraPreviewProps }
    : values

  const handleToggleHidden = useCallback(
    (key: string) => {
      const metaDefault = (settings?.[key] as SettingConfig | undefined)?.hidden ?? false
      toggleHidden(widgetType, key, metaDefault)
    },
    [widgetType, settings, toggleHidden],
  )

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
      {settings && Object.keys(settings).length > 0 && (
        <div className="cd-detail__section">
          <SettingsEditor
            settings={settings}
            values={values}
            onChange={(key, value) => setPreviewValue('widget', widgetType, key, value)}
            header="Settings"
            hiddenKeys={hiddenKeys}
            onToggleHidden={handleToggleHidden}
          />
        </div>
      )}
      <div className="cd-detail__section">
        <WidgetPreview
          widgetType={widgetType}
          props={renderProps}
          previewChildren={previewConfig?.children}
          wrapperStyle={previewConfig?.wrapperStyle}
        />
      </div>
    </div>
  )
}

/**
 * Build values with priority: user overrides > preview defaults > meta defaults.
 */
function buildValues(
  settings: SettingsConfig<Record<string, unknown>> | undefined,
  overrides: Record<string, unknown>,
  previewDefaults?: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  if (!settings) return result
  for (const [key, config] of Object.entries(settings)) {
    if (!config) continue
    result[key] = overrides[key] ?? previewDefaults?.[key] ?? config.default
  }
  return result
}

/**
 * Compute effective hidden keys using visibility store overrides + meta defaults.
 */
function useEffectiveHiddenKeys(
  widgetType: string,
  settings: SettingsConfig<Record<string, unknown>> | undefined,
  getEffectiveHidden: (componentId: string, settingKey: string, metaDefault: boolean) => boolean,
  visibilityOverrides: Record<string, boolean> | undefined,
): Set<string> {
  return useMemo(() => {
    const keys = new Set<string>()
    if (!settings) return keys
    for (const [key, config] of Object.entries(settings)) {
      const metaDefault = (config as SettingConfig | undefined)?.hidden ?? false
      if (getEffectiveHidden(widgetType, key, metaDefault)) {
        keys.add(key)
      }
    }
    return keys
    // visibilityOverrides triggers recomputation when overrides change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [widgetType, settings, getEffectiveHidden, visibilityOverrides])
}
