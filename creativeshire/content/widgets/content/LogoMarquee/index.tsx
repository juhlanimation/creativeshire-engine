'use client'

/**
 * LogoMarquee widget - animated horizontal scroll of client logos.
 * Content Layer (L1) - no scroll listeners or viewport units.
 * Hidden on mobile, visible on tablet+.
 */

import React, { memo, forwardRef, type CSSProperties } from 'react'
import type { LogoMarqueeProps } from './types'
import './styles.css'

/**
 * LogoMarquee component renders an infinite scrolling logo strip.
 * Logos are duplicated for seamless looping.
 * Supports CSS variable animation via var() fallbacks in styles.css.
 */
const LogoMarquee = memo(forwardRef<HTMLDivElement, LogoMarqueeProps>(function LogoMarquee(
  { logos, speed = 30, direction = 'left', gap = '4px', className, 'data-behaviour': dataBehaviour },
  ref
) {
  const classNames = [
    'logo-marquee-widget',
    direction === 'right' ? 'logo-marquee-widget--reverse' : '',
    className
  ].filter(Boolean).join(' ')

  const trackStyle: CSSProperties = {
    '--marquee-duration': `${speed}s`,
    '--marquee-gap': gap
  } as CSSProperties

  // Render logo group (used twice for seamless loop)
  const renderLogoGroup = (keyPrefix: string) => (
    <div className="logo-marquee-widget__group" key={keyPrefix}>
      {logos.map((logo, index) => (
        <img
          key={`${keyPrefix}-${index}`}
          className="logo-marquee-widget__logo"
          src={logo.src}
          alt={logo.alt}
        />
      ))}
    </div>
  )

  return (
    <div
      ref={ref}
      className={classNames}
      data-behaviour={dataBehaviour}
      aria-hidden="true"
    >
      <div className="logo-marquee-widget__track" style={trackStyle}>
        {/* Duplicate content for seamless infinite scroll */}
        {renderLogoGroup('group-1')}
        {renderLogoGroup('group-2')}
      </div>
    </div>
  )
}))

export default LogoMarquee
