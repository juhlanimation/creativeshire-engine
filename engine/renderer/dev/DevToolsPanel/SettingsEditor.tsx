'use client'

/**
 * SettingsEditor - renders editable setting controls for dev tools.
 * Controlled: values come from props, changes propagate via onChange.
 */

import type { SettingsConfig, SettingConfig, SettingChoice } from '../../../schema/settings'

interface SettingsEditorProps {
  settings: SettingsConfig<Record<string, unknown>>
  /** Current values (defaults merged with overrides) */
  values: Record<string, unknown>
  /** Called when a value changes */
  onChange: (key: string, value: unknown) => void
  /** Optional header text (default: 'Settings') */
  header?: string
}

export function SettingsEditor({ settings, values, onChange, header }: SettingsEditorProps) {
  const entries = Object.entries(settings) as [string, SettingConfig][]
  if (entries.length === 0) return null

  return (
    <div className="dt-settings">
      <div className="dt-settings__header">{header ?? 'Settings'}</div>
      {entries.map(([key, config]) => (
        <div key={key} className="dt-settings__field">
          <label className="dt-settings__label">
            {config.label}
            {config.description && (
              <span className="dt-settings__hint" title={config.description}>?</span>
            )}
          </label>
          <div className="dt-settings__control">
            {renderControl(config, values[key] ?? config.default, (v) => onChange(key, v))}
          </div>
        </div>
      ))}
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
