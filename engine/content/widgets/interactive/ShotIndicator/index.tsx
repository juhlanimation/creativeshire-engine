'use client'

import React, { memo, forwardRef, useCallback, useMemo } from 'react'
import type { ShotIndicatorProps } from './types'
import type { WidgetSchema } from '../../../../schema'
import './styles.css'

/**
 * Extract shot numbers from widget children.
 * Children should be Button widgets with frame number in label or data-frame prop.
 */
function extractShotsFromWidgets(widgets: WidgetSchema[]): number[] {
  return widgets.map((widget) => {
    const props = widget.props ?? {}
    // Try label first (used as frame number), then data-frame, then parse from id
    const frame = props.label ?? props['data-frame'] ?? props.frame
    if (typeof frame === 'number') return frame
    if (typeof frame === 'string') {
      const parsed = parseInt(frame, 10)
      if (!isNaN(parsed)) return parsed
    }
    return 0
  }).filter(shot => shot > 0)
}

const ShotIndicator = memo(forwardRef<HTMLDivElement, ShotIndicatorProps>(function ShotIndicator(
  {
    shots: shotsProp,
    widgets,
    activeShot,
    onSelect,
    prefix = 'sh',
    position = 'top-right',
    className,
    'data-behaviour': dataBehaviour,
  },
  ref
) {
  // Prefer widgets (children via __repeat) over shots prop
  const shots = useMemo(() => {
    if (widgets && widgets.length > 0) {
      return extractShotsFromWidgets(widgets)
    }
    return shotsProp ?? []
  }, [widgets, shotsProp])

  const handleClick = useCallback((shot: number) => {
    onSelect?.(shot)
  }, [onSelect])

  // Empty state
  if (shots.length === 0) {
    return null
  }

  const classNames = ['shot-indicator', `shot-indicator--${position}`, className].filter(Boolean).join(' ')

  return (
    <div
      ref={ref}
      className={classNames}
      data-behaviour={dataBehaviour}
      aria-label="Shot navigation"
    >
      {prefix && <span className="shot-indicator__prefix">{prefix}</span>}
      {shots.map((shot) => {
        const isActive = shot === activeShot
        return (
          <button
            key={shot}
            className={`shot-indicator__shot ${isActive ? 'shot-indicator__shot--active' : ''}`}
            onClick={() => handleClick(shot)}
            aria-label={`Go to shot ${shot}`}
            aria-current={isActive ? 'true' : undefined}
          >
            {shot}
          </button>
        )
      })}
    </div>
  )
}))

export default ShotIndicator
