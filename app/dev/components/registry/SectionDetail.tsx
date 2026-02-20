/**
 * Detail panel for a selected section pattern.
 * Shows meta info, settings editor, used widgets, and live preview.
 */

'use client'

import { useState, useEffect, useMemo } from 'react'
import { getSectionPattern } from '../../../../engine/content/sections/registry'
import { SettingsEditor } from '../../../../engine/renderer/dev/DevToolsPanel/SettingsEditor'
import type { SettingsConfig, SettingConfig } from '../../../../engine/schema/settings'
import type { SectionSchema } from '../../../../engine/schema/section'
import { usePreviewValues, useRegistryDetail } from './registry-store'
import { getUniqueWidgetTypes } from './extractWidgets'
import { UsedWidgetsList } from './UsedWidgetsList'
import { SectionPreview } from './SectionPreview'

interface SectionDetailProps {
  sectionId: string
}

export function SectionDetail({ sectionId }: SectionDetailProps) {
  const entry = getSectionPattern(sectionId)
  const previewValues = usePreviewValues('section', sectionId)
  const { setPreviewValue } = useRegistryDetail()
  const [usedWidgets, setUsedWidgets] = useState<string[] | null>(null)
  const [widgetError, setWidgetError] = useState<string | null>(null)

  useEffect(() => {
    if (!entry) return
    let cancelled = false

    async function loadWidgets() {
      try {
        const factory = await entry!.getFactory()
        const defaults = buildDefaults(entry!.meta.settings as SettingsConfig<Record<string, unknown>> | undefined)
        const schema: SectionSchema = factory(defaults)
        if (!cancelled) {
          setUsedWidgets(getUniqueWidgetTypes(schema))
        }
      } catch (err) {
        if (!cancelled) {
          setWidgetError(err instanceof Error ? err.message : 'Failed to load section factory')
        }
      }
    }

    loadWidgets()
    return () => { cancelled = true }
  }, [entry, sectionId])

  if (!entry) {
    return <div className="cd-detail__empty">Unknown section: {sectionId}</div>
  }

  const { meta } = entry
  const settings = meta.settings as SettingsConfig<Record<string, unknown>> | undefined
  const values = buildValues(settings, previewValues)
  const hiddenKeys = useHiddenKeys(settings)

  return (
    <div className="cd-detail">
      <div className="cd-detail__header">
        <h3 className="cd-detail__name">{meta.name}</h3>
        <span className="cd-registry__item-badge">{meta.sectionCategory}</span>
        {meta.unique && <span className="cd-registry__item-badge">unique</span>}
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
      <div className="cd-detail__section">
        {usedWidgets === null && !widgetError && (
          <div className="cd-detail__loading">Loading widgets...</div>
        )}
        {widgetError && (
          <div className="cd-detail__error">Error: {widgetError}</div>
        )}
        {usedWidgets && <UsedWidgetsList widgets={usedWidgets} />}
      </div>

      {/* Settings */}
      {settings && Object.keys(settings).length > 0 && (
        <div className="cd-detail__section">
          <SettingsEditor
            settings={settings}
            values={values}
            onChange={(key, value) => setPreviewValue('section', sectionId, key, value)}
            header="Settings"
            hiddenKeys={hiddenKeys}
          />
        </div>
      )}

      {/* Preview */}
      <div className="cd-detail__section">
        <SectionPreview sectionId={sectionId} props={values} />
      </div>
    </div>
  )
}

function buildDefaults(
  settings: SettingsConfig<Record<string, unknown>> | undefined,
): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  if (!settings) return result
  for (const [key, config] of Object.entries(settings)) {
    if (!config) continue
    result[key] = config.default
  }
  return result
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
