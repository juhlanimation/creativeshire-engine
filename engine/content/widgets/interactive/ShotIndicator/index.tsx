'use client'

import React, { memo, forwardRef, useCallback } from 'react'
import type { ShotIndicatorProps } from './types'
import './styles.css'

const ShotIndicator = memo(forwardRef<HTMLDivElement, ShotIndicatorProps>(function ShotIndicator(
  {
    shots,
    activeShot,
    onSelect,
    prefix = 'sh',
    position = 'top-right',
    className,
    'data-behaviour': dataBehaviour,
  },
  ref
) {
  const handleClick = useCallback((shot: number) => {
    onSelect?.(shot)
  }, [onSelect])

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
