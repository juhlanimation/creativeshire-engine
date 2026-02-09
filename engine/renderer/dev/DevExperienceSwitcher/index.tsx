'use client'

/**
 * DevExperienceSwitcher - development-only overlay for testing experiences.
 * Shows a dropdown to switch between experiences at runtime.
 *
 * Only renders in development mode (process.env.NODE_ENV === 'development').
 * Uses URL query param (?_experience=id) for persistence and sharing.
 */

import { useState, useCallback, useMemo, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { getAllExperienceMetas } from '../../../experience'
import { useSiteContainer } from '../../SiteContainerContext'
import './styles.css'

/** Query param name for experience override */
export const DEV_EXPERIENCE_PARAM = '_experience'

/**
 * Get current experience override from URL.
 */
export function getExperienceOverride(): string | null {
  if (typeof window === 'undefined') return null
  const params = new URLSearchParams(window.location.search)
  return params.get(DEV_EXPERIENCE_PARAM)
}

/**
 * Set experience override in URL without full page reload.
 */
function setExperienceOverride(id: string | null): void {
  if (typeof window === 'undefined') return

  const url = new URL(window.location.href)
  if (id) {
    url.searchParams.set(DEV_EXPERIENCE_PARAM, id)
  } else {
    url.searchParams.delete(DEV_EXPERIENCE_PARAM)
  }

  // Update URL without reload, then trigger re-render via custom event
  window.history.replaceState({}, '', url.toString())
  window.dispatchEvent(new CustomEvent('experienceOverrideChange', { detail: id }))
}

interface DevExperienceSwitcherProps {
  /** Current experience ID (from schema) */
  currentExperienceId: string
  /** Position on screen (or 'inline' when used in a flex container) */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'inline'
}

export function DevExperienceSwitcher({
  currentExperienceId,
  position = 'bottom-right',
}: DevExperienceSwitcherProps) {
  // Only render in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return <DevExperienceSwitcherInner currentExperienceId={currentExperienceId} position={position} />
}

function DevExperienceSwitcherInner({
  currentExperienceId,
  position,
}: DevExperienceSwitcherProps) {
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )
  const [isOpen, setIsOpen] = useState(false)
  const [override, setOverride] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null
    return getExperienceOverride()
  })

  const { siteContainer } = useSiteContainer()

  // Get all available experiences
  const experiences = useMemo(() => getAllExperienceMetas(), [])

  // Handle selection
  const handleSelect = useCallback((id: string | null) => {
    setOverride(id)
    setExperienceOverride(id)
    setIsOpen(false)
  }, [])

  // Current active experience (override or schema)
  const activeId = override ?? currentExperienceId
  const activeMeta = experiences.find((e) => e.id === activeId)

  if (!mounted) {
    return null
  }

  // For non-inline positions, require siteContainer for portal
  if (position !== 'inline' && !siteContainer) {
    return null
  }

  const positionClasses: Record<string, string> = {
    'top-left': 'dev-switcher--top-left',
    'top-right': 'dev-switcher--top-right',
    'bottom-left': 'dev-switcher--bottom-left',
    'bottom-right': 'dev-switcher--bottom-right',
    'inline': 'dev-switcher--inline',
  }

  const content = (
    <div className={`dev-switcher ${positionClasses[position ?? 'bottom-right']}`}>
      <button
        className="dev-switcher__trigger"
        onClick={() => setIsOpen(!isOpen)}
        title="Switch Experience (Dev Mode)"
      >
        <span className="dev-switcher__icon">🎬</span>
        <span className="dev-switcher__label">{activeMeta?.name ?? activeId}</span>
        {override && <span className="dev-switcher__badge">override</span>}
      </button>

      {isOpen && (
        <div className="dev-switcher__menu">
          <div className="dev-switcher__header">
            Switch Experience
            {override && (
              <button
                className="dev-switcher__reset"
                onClick={() => handleSelect(null)}
                title="Reset to schema default"
              >
                Reset
              </button>
            )}
          </div>

          {experiences.map((exp) => (
            <button
              key={exp.id}
              className={`dev-switcher__option ${exp.id === activeId ? 'dev-switcher__option--active' : ''}`}
              onClick={() => handleSelect(exp.id)}
            >
              <span className="dev-switcher__option-name">{exp.name}</span>
              <span className="dev-switcher__option-id">{exp.id}</span>
              {exp.id === currentExperienceId && !override && (
                <span className="dev-switcher__option-default">default</span>
              )}
            </button>
          ))}
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

export default DevExperienceSwitcher
