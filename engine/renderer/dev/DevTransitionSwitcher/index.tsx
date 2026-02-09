'use client'

/**
 * DevTransitionSwitcher - development-only overlay for testing page transitions.
 * Shows a dropdown to switch between transition configs at runtime.
 *
 * Only renders in development mode (process.env.NODE_ENV === 'development').
 * Uses URL query param (?_transition=id) for persistence.
 *
 * Switching transitions requires a page reload since transitions
 * need a fresh setup.
 */

import { useState, useCallback, useMemo, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import {
  getAllRegisteredTransitionMetas,
  getTransitionOverride,
  setTransitionOverride,
  DEV_TRANSITION_PARAM,
} from '../../../experience/transitions/registry'
import { useSiteContainer } from '../../SiteContainerContext'
import './styles.css'

// Re-export for convenience
export { getTransitionOverride, DEV_TRANSITION_PARAM }

interface DevTransitionSwitcherProps {
  /** Current transition config ID from schema (or 'none' if disabled) */
  currentTransitionId: string
  /** Position on screen (or 'inline' when used in a flex container) */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'inline'
}

export function DevTransitionSwitcher({
  currentTransitionId,
  position = 'bottom-left',
}: DevTransitionSwitcherProps) {
  // Only render in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return <DevTransitionSwitcherInner currentTransitionId={currentTransitionId} position={position} />
}

function DevTransitionSwitcherInner({
  currentTransitionId,
  position,
}: DevTransitionSwitcherProps) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )
  const [isOpen, setIsOpen] = useState(false)
  const [override] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null
    return getTransitionOverride()
  })

  const { siteContainer } = useSiteContainer()

  // Get all available compiled transition configs
  const transitions = useMemo(() => getAllRegisteredTransitionMetas(), [])

  // Handle selection - triggers page reload
  const handleSelect = useCallback((id: string | null) => {
    setTransitionOverride(id) // This reloads the page
  }, [])

  // Current active transition (override or default)
  const activeId = override ?? currentTransitionId
  const activeMeta = transitions.find((t) => t.id === activeId)
  const activeLabel = activeId === 'none'
    ? 'No Transition'
    : (activeMeta?.name ?? activeId)

  if (!mounted) {
    return null
  }

  // For non-inline positions, require siteContainer for portal
  if (position !== 'inline' && !siteContainer) {
    return null
  }

  // Don't render if no transitions registered
  if (transitions.length === 0) {
    return null
  }

  const positionClasses: Record<string, string> = {
    'top-left': 'dev-transition-switcher--top-left',
    'top-right': 'dev-transition-switcher--top-right',
    'bottom-left': 'dev-transition-switcher--bottom-left',
    'bottom-right': 'dev-transition-switcher--bottom-right',
    'inline': 'dev-transition-switcher--inline',
  }

  const content = (
    <div className={`dev-transition-switcher ${positionClasses[position ?? 'bottom-left']}`}>
      <button
        className="dev-transition-switcher__trigger"
        onClick={() => setIsOpen(!isOpen)}
        title="Switch Page Transition (Dev Mode)"
      >
        <span className="dev-transition-switcher__icon">~</span>
        <span className="dev-transition-switcher__label">{activeLabel}</span>
        {override && <span className="dev-transition-switcher__badge">override</span>}
      </button>

      {isOpen && (
        <div className="dev-transition-switcher__menu">
          <div className="dev-transition-switcher__header">
            Switch Transition
            {override && (
              <button
                className="dev-transition-switcher__reset"
                onClick={() => handleSelect(null)}
                title="Reset to default"
              >
                Reset
              </button>
            )}
          </div>

          {/* "No Transition" option */}
          <button
            className={`dev-transition-switcher__option ${activeId === 'none' ? 'dev-transition-switcher__option--active' : ''}`}
            onClick={() => handleSelect('none')}
          >
            <span className="dev-transition-switcher__option-name">No Transition</span>
            <span className="dev-transition-switcher__option-desc">Disable page transitions</span>
            {currentTransitionId === 'none' && !override && (
              <span className="dev-transition-switcher__option-default">default</span>
            )}
          </button>

          {/* Registered compiled transition configs */}
          {transitions.map((transition) => (
            <button
              key={transition.id}
              className={`dev-transition-switcher__option ${transition.id === activeId ? 'dev-transition-switcher__option--active' : ''}`}
              onClick={() => handleSelect(transition.id)}
            >
              <span className="dev-transition-switcher__option-name">{transition.name}</span>
              <span className="dev-transition-switcher__option-desc">{transition.description}</span>
              {transition.id === currentTransitionId && !override && (
                <span className="dev-transition-switcher__option-default">default</span>
              )}
            </button>
          ))}

          <div className="dev-transition-switcher__footer">
            Switching transitions reloads the page
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

export default DevTransitionSwitcher
