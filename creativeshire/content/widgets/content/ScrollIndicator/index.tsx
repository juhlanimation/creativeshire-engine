'use client'

/**
 * ScrollIndicator widget - visual prompt encouraging users to scroll.
 * Content Layer (L1) - no scroll listeners or viewport units.
 */

import React, { memo, forwardRef } from 'react'
import type { ScrollIndicatorProps } from './types'
import './styles.css'

/**
 * ScrollIndicator component renders scroll prompt text.
 * Supports CSS variable animation via var() fallbacks in styles.css.
 */
const ScrollIndicator = memo(forwardRef<HTMLSpanElement, ScrollIndicatorProps>(function ScrollIndicator(
  { text = '(SCROLL)', useBlendMode = true, className, 'data-behaviour': dataBehaviour },
  ref
) {
  const classNames = [
    'scroll-indicator-widget',
    useBlendMode ? 'scroll-indicator-widget--blend' : '',
    className
  ].filter(Boolean).join(' ')

  return (
    <span
      ref={ref}
      className={classNames}
      data-behaviour={dataBehaviour}
      aria-hidden="true"
    >
      {text}
    </span>
  )
}))

export default ScrollIndicator
