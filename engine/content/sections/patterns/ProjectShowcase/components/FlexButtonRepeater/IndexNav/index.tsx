'use client'

import React, { memo, forwardRef, useCallback, useState } from 'react'
import type { IndexNavProps } from './types'

const IndexNav = memo(forwardRef<HTMLDivElement, IndexNavProps>(function IndexNav(
  {
    items,
    activeIndex: activeIndexProp,
    onSelect,
    prefix = '',
    direction = 'row',
    className,
    'data-behaviour': dataBehaviour,
  },
  ref
) {
  // Internal state for uncontrolled mode (no onSelect provided)
  const [internalActive, setInternalActive] = useState(activeIndexProp ?? 0)
  const resolvedActive = onSelect ? activeIndexProp : internalActive

  const handleClick = useCallback((index: number) => {
    const item = items?.[index]
    if (!item) return
    if (onSelect) {
      onSelect(index, item)
    } else {
      setInternalActive(index)
    }
  }, [onSelect, items])

  // Empty state
  if (!items || items.length === 0) {
    return null
  }

  const classNames = ['index-nav', direction === 'column' ? 'index-nav--column' : '', className].filter(Boolean).join(' ')

  return (
    <div
      ref={ref}
      className={classNames}
      data-behaviour={dataBehaviour}
      aria-label="Index navigation"
    >
      {prefix && <span className="index-nav__prefix">{prefix}</span>}
      {items.map((item, index) => {
        const isActive = index === resolvedActive
        return (
          <button
            key={`${item.label}-${index}`}
            className={`index-nav__button ${isActive ? 'index-nav__button--active' : ''}`}
            onClick={() => handleClick(index)}
            aria-label={`Go to ${item.label}`}
            aria-current={isActive ? 'true' : undefined}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}))

export default IndexNav
