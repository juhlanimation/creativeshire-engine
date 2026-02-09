'use client'

/**
 * DevIntroSwitcher - development-only overlay for testing intro patterns.
 * Shows a dropdown to switch between intro patterns at runtime.
 *
 * Only renders in development mode (process.env.NODE_ENV === 'development').
 * Uses URL query param (?_intro=id) for persistence.
 *
 * Switching intros requires a page reload since intros are one-shot
 * sequences that run on page load.
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'
import {
  getAllRegisteredIntroMetas,
  getIntroOverride,
  setIntroOverride,
  DEV_INTRO_PARAM,
} from '../../../intro/registry'
import { useSiteContainer } from '../../SiteContainerContext'
import './styles.css'

// Re-export for convenience
export { getIntroOverride, DEV_INTRO_PARAM }

interface DevIntroSwitcherProps {
  /** Current intro pattern ID from schema (or 'none' if disabled) */
  currentIntroId: string
  /** Position on screen (or 'inline' when used in a flex container) */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'inline'
}

export function DevIntroSwitcher({
  currentIntroId,
  position = 'bottom-left',
}: DevIntroSwitcherProps) {
  // Only render in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return <DevIntroSwitcherInner currentIntroId={currentIntroId} position={position} />
}

function DevIntroSwitcherInner({
  currentIntroId,
  position,
}: DevIntroSwitcherProps) {
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [override, setOverride] = useState<string | null>(null)

  const { siteContainer } = useSiteContainer()

  // Get all available compiled intros
  const intros = useMemo(() => getAllRegisteredIntroMetas(), [])

  // Read initial override from URL
  useEffect(() => {
    setMounted(true)
    setOverride(getIntroOverride())
  }, [])

  // Handle selection - triggers page reload
  const handleSelect = useCallback((id: string | null) => {
    setIntroOverride(id) // This reloads the page
  }, [])

  // Current active intro (override or default)
  const activeId = override ?? currentIntroId
  const activeMeta = intros.find((p) => p.id === activeId)
  const activeLabel = activeId === 'none'
    ? 'No Intro'
    : (activeMeta?.name ?? activeId)

  if (!mounted) {
    return null
  }

  // For non-inline positions, require siteContainer for portal
  if (position !== 'inline' && !siteContainer) {
    return null
  }

  // Don't render if no intros registered
  if (intros.length === 0) {
    return null
  }

  const positionClasses: Record<string, string> = {
    'top-left': 'dev-intro-switcher--top-left',
    'top-right': 'dev-intro-switcher--top-right',
    'bottom-left': 'dev-intro-switcher--bottom-left',
    'bottom-right': 'dev-intro-switcher--bottom-right',
    'inline': 'dev-intro-switcher--inline',
  }

  const content = (
    <div className={`dev-intro-switcher ${positionClasses[position ?? 'bottom-left']}`}>
      <button
        className="dev-intro-switcher__trigger"
        onClick={() => setIsOpen(!isOpen)}
        title="Switch Intro Pattern (Dev Mode)"
      >
        <span className="dev-intro-switcher__icon">🎭</span>
        <span className="dev-intro-switcher__label">{activeLabel}</span>
        {override && <span className="dev-intro-switcher__badge">override</span>}
      </button>

      {isOpen && (
        <div className="dev-intro-switcher__menu">
          <div className="dev-intro-switcher__header">
            Switch Intro
            {override && (
              <button
                className="dev-intro-switcher__reset"
                onClick={() => handleSelect(null)}
                title="Reset to default"
              >
                Reset
              </button>
            )}
          </div>

          {/* "No Intro" option */}
          <button
            className={`dev-intro-switcher__option ${activeId === 'none' ? 'dev-intro-switcher__option--active' : ''}`}
            onClick={() => handleSelect('none')}
          >
            <span className="dev-intro-switcher__option-name">No Intro</span>
            <span className="dev-intro-switcher__option-desc">Disable intro sequence</span>
            {currentIntroId === 'none' && !override && (
              <span className="dev-intro-switcher__option-default">default</span>
            )}
          </button>

          {/* Registered compiled intros */}
          {intros.map((intro) => (
            <button
              key={intro.id}
              className={`dev-intro-switcher__option ${intro.id === activeId ? 'dev-intro-switcher__option--active' : ''}`}
              onClick={() => handleSelect(intro.id)}
            >
              <span className="dev-intro-switcher__option-name">{intro.name}</span>
              <span className="dev-intro-switcher__option-desc">{intro.description}</span>
              {intro.id === currentIntroId && !override && (
                <span className="dev-intro-switcher__option-default">default</span>
              )}
            </button>
          ))}

          <div className="dev-intro-switcher__footer">
            Switching intros reloads the page
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

export default DevIntroSwitcher
