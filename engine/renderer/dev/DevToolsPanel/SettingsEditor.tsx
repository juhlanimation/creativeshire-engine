'use client'

/**
 * SettingsEditor - renders editable setting controls for dev tools.
 * Controlled: values come from props, changes propagate via onChange.
 */

import { useState } from 'react'
import type { SettingsConfig, SettingConfig, SettingChoice } from '../../../schema/settings'

interface SettingsEditorProps {
  settings: SettingsConfig<Record<string, unknown>>
  /** Current values (defaults merged with overrides) */
  values: Record<string, unknown>
  /** Called when a value changes */
  onChange: (key: string, value: unknown) => void
  /** Optional header text (default: 'Settings') */
  header?: string
  /** Which setting keys have explicit preset overrides (shows indicator) */
  overriddenKeys?: Set<string>
  /** Clear a single override, reverting to default */
  onReset?: (key: string) => void
  /** Which setting keys are hidden from CMS (shows badge in dev tools) */
  hiddenKeys?: Set<string>
  /** Toggle CMS visibility for a setting key. When provided, renders eye icon per row. */
  onToggleHidden?: (key: string) => void
}

export function SettingsEditor({ settings, values, onChange, header, overriddenKeys, onReset, hiddenKeys, onToggleHidden }: SettingsEditorProps) {
  const entries = Object.entries(settings) as [string, SettingConfig][]
  if (entries.length === 0) return null

  const mainEntries = entries.filter(([, config]) => !config.advanced)
  const advancedEntries = entries.filter(([, config]) => config.advanced)

  return (
    <div className="dt-settings">
      <div className="dt-settings__header">{header ?? 'Settings'}</div>
      {mainEntries.map(([key, config]) =>
        <SettingField
          key={key}
          settingKey={key}
          config={config}
          value={values[key] ?? config.default}
          onChange={onChange}
          overriddenKeys={overriddenKeys}
          onReset={onReset}
          hiddenKeys={hiddenKeys}
          onToggleHidden={onToggleHidden}
        />
      )}
      {advancedEntries.length > 0 && (
        <AdvancedGroup>
          {advancedEntries.map(([key, config]) =>
            <SettingField
              key={key}
              settingKey={key}
              config={config}
              value={values[key] ?? config.default}
              onChange={onChange}
              overriddenKeys={overriddenKeys}
              onReset={onReset}
              hiddenKeys={hiddenKeys}
              onToggleHidden={onToggleHidden}
            />
          )}
        </AdvancedGroup>
      )}
    </div>
  )
}

function AdvancedGroup({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="dt-settings__advanced">
      <button
        className="dt-settings__advanced-toggle"
        onClick={() => setOpen(!open)}
      >
        <span className="dt-settings__advanced-arrow" data-open={open || undefined}>&#9656;</span>
        Advanced
      </button>
      {open && <div className="dt-settings__advanced-body">{children}</div>}
    </div>
  )
}

interface SettingFieldProps {
  settingKey: string
  config: SettingConfig
  value: unknown
  onChange: (key: string, value: unknown) => void
  overriddenKeys?: Set<string>
  onReset?: (key: string) => void
  hiddenKeys?: Set<string>
  onToggleHidden?: (key: string) => void
}

function SettingField({ settingKey, config, value, onChange, overriddenKeys, onReset, hiddenKeys, onToggleHidden }: SettingFieldProps) {
  const isOverridden = overriddenKeys?.has(settingKey) ?? false
  const isHidden = hiddenKeys?.has(settingKey) ?? false

  return (
    <div className="dt-settings__field" data-overridden={isOverridden || undefined}>
      {isOverridden && <span className="dt-settings__override-dot" />}
      <label className="dt-settings__label">
        {config.label}
        {isHidden && !onToggleHidden && <span className="dt-settings__hidden-badge">hidden</span>}
        {config.description && (
          <span className="dt-settings__hint" title={config.description}>?</span>
        )}
      </label>
      <div className="dt-settings__control">
        {renderControl(config, value, (v) => onChange(settingKey, v))}
        {isOverridden && onReset && (
          <button
            className="dt-settings__reset"
            onClick={() => onReset(settingKey)}
            title="Reset to default"
          >
            &times;
          </button>
        )}
        {onToggleHidden && (
          <button
            className="dt-settings__visibility"
            data-hidden={isHidden || undefined}
            onClick={() => onToggleHidden(settingKey)}
            title={isHidden ? 'Hidden from CMS — click to show' : 'Visible in CMS — click to hide'}
          >
            {isHidden ? '\u{1F6AB}' : '\u{1F441}'}
          </button>
        )}
      </div>
    </div>
  )
}

function renderControl(
  config: SettingConfig,
  value: unknown,
  onChange: (value: unknown) => void,
) {
  switch (config.type) {
    case 'toggle':
      return (
        <input
          type="checkbox"
          checked={value as boolean}
          onChange={(e) => onChange(e.target.checked)}
          className="dt-settings__checkbox"
        />
      )

    case 'number':
      return (
        <input
          type="number"
          value={value as number}
          min={config.min}
          max={config.max}
          step={config.step}
          onChange={(e) => onChange(Number(e.target.value))}
          className="dt-settings__input dt-settings__input--number"
        />
      )

    case 'range':
      return (
        <div className="dt-settings__range-wrap">
          <input
            type="range"
            value={value as number}
            min={config.min}
            max={config.max}
            step={config.step}
            onChange={(e) => onChange(Number(e.target.value))}
            className="dt-settings__range"
          />
          <span className="dt-settings__range-value">{String(value)}</span>
        </div>
      )

    case 'select':
      return (
        <select
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          className="dt-settings__select"
        >
          {config.choices.map((c: SettingChoice) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      )

    case 'text':
    case 'textarea':
      return (
        <input
          type="text"
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          className="dt-settings__input"
        />
      )

    case 'color':
      return (
        <input
          type="color"
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
          className="dt-settings__color"
        />
      )

    default:
      return (
        <span className="dt-settings__value">
          {String(value)}
        </span>
      )
  }
}
