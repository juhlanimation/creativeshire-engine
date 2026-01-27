'use client'

/**
 * HeroTitle widget - large display heading with mix-blend-mode effect.
 * Content Layer (L1) - no scroll listeners or viewport units.
 */

import React, { memo, forwardRef } from 'react'
import type { HeroTitleProps } from './types'
import './styles.css'

/**
 * HeroTitle component renders large display headings.
 * Supports CSS variable animation via var() fallbacks in styles.css.
 */
const HeroTitle = memo(forwardRef<HTMLHeadingElement, HeroTitleProps>(function HeroTitle(
  { text, as: Element = 'h1', useBlendMode = true, className, 'data-behaviour': dataBehaviour },
  ref
) {
  const classNames = [
    'hero-title-widget',
    useBlendMode ? 'hero-title-widget--blend' : '',
    className
  ].filter(Boolean).join(' ')

  return (
    <Element
      ref={ref}
      className={classNames}
      data-behaviour={dataBehaviour}
    >
      {text}
    </Element>
  )
}))

export default HeroTitle
