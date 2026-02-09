'use client'

/**
 * DevPresetSwitcher - development-only overlay for testing presets.
 * Shows a dropdown to switch between presets at runtime.
 *
 * Only renders in development mode (process.env.NODE_ENV === 'development').
 * Uses URL query param (?_preset=id) for persistence.
 *
 * Unlike experiences, switching presets requires a page reload since
 * presets define the entire site structure (pages, chrome, theme).
 *
 * Usage in consuming app:
 * ```typescript
 * import { getPresetOverride, getPreset } from '@creativeshire/engine/presets'
 *
 * const presetId = getPresetOverride() ?? 'bojuhl'
 * const preset = getPreset(presetId) ?? bojuhlPreset
 * ```
 */

import { useState, useCallback, useMemo, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import {
  getAllPresetMetas,
  getPresetOverride,
  setPresetOverride,
  DEV_PRESET_PARAM,
} from '../../../presets/registry'
import { useSiteContainer } from '../../SiteContainerContext'
import './styles.css'

// Re-export for convenience
export { getPresetOverride, DEV_PRESET_PARAM }

interface DevPresetSwitcherProps {
  /** Current preset ID (from site config) */
  currentPresetId: string
  /** Position on screen (or 'inline' when used in a flex container) */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'inline'
}

export function DevPresetSwitcher({
  currentPresetId,
  position = 'bottom-left',
}: DevPresetSwitcherProps) {
  // Only render in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return <DevPresetSwitcherInner currentPresetId={currentPresetId} position={position} />
}

function DevPresetSwitcherInner({
  currentPresetId,
  position,
}: DevPresetSwitcherProps) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )
  const [isOpen, setIsOpen] = useState(false)
  const [override] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null
    return getPresetOverride()
  })

  const { siteContainer } = useSiteContainer()

  // Get all available presets
  const presets = useMemo(() => getAllPresetMetas(), [])

  // Handle selection - triggers page reload
  const handleSelect = useCallback((id: string | null) => {
    setPresetOverride(id) // This reloads the page
  }, [])

  // Current active preset (override or default)
  const activeId = override ?? currentPresetId
  const activeMeta = presets.find((p) => p.id === activeId)

  if (!mounted) {
    return null
  }

  // For non-inline positions, require siteContainer for portal
  if (position !== 'inline' && !siteContainer) {
    return null
  }

  // Don't render if no presets registered
  if (presets.length === 0) {
    return null
  }

  const positionClasses: Record<string, string> = {
    'top-left': 'dev-preset-switcher--top-left',
    'top-right': 'dev-preset-switcher--top-right',
    'bottom-left': 'dev-preset-switcher--bottom-left',
    'bottom-right': 'dev-preset-switcher--bottom-right',
    'inline': 'dev-preset-switcher--inline',
  }

  const content = (
    <div className={`dev-preset-switcher ${positionClasses[position ?? 'bottom-left']}`}>
      <button
        className="dev-preset-switcher__trigger"
        onClick={() => setIsOpen(!isOpen)}
        title="Switch Preset (Dev Mode)"
      >
        <span className="dev-preset-switcher__icon">🎨</span>
        <span className="dev-preset-switcher__label">{activeMeta?.name ?? activeId}</span>
        {override && <span className="dev-preset-switcher__badge">override</span>}
      </button>

      {isOpen && (
        <div className="dev-preset-switcher__menu">
          <div className="dev-preset-switcher__header">
            Switch Preset
            {override && (
              <button
                className="dev-preset-switcher__reset"
                onClick={() => handleSelect(null)}
                title="Reset to default"
              >
                Reset
              </button>
            )}
          </div>

          {presets.map((preset) => (
            <button
              key={preset.id}
              className={`dev-preset-switcher__option ${preset.id === activeId ? 'dev-preset-switcher__option--active' : ''}`}
              onClick={() => handleSelect(preset.id)}
            >
              <span className="dev-preset-switcher__option-name">{preset.name}</span>
              <span className="dev-preset-switcher__option-desc">{preset.description}</span>
              {preset.id === currentPresetId && !override && (
                <span className="dev-preset-switcher__option-default">default</span>
              )}
            </button>
          ))}

          <div className="dev-preset-switcher__footer">
            Switching presets reloads the page
          </div>
        </div>
      )}
    </div>
  )

  // Inline mode renders directly, others use portal
  if (position === 'inline') {
    return content
  }

  return createPortal(content, siteContainer!)
}

export default DevPresetSwitcher
