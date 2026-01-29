'use client'

/**
 * LogoLink widget - logo with hover color transition.
 * Content Layer (L1): Renders structure only with data-effect markers.
 * Experience Layer (L2): BehaviourWrapper with 'contact-reveal' handles hover state.
 *
 * Effects used:
 * - color-shift: Color and blend-mode transitions
 * - scale-hover: Press feedback scale
 *
 * CSS Variables (set by BehaviourWrapper via contact-reveal behaviour):
 * - --shift-color: text color
 * - --shift-blend: blend mode
 * - --scale: press feedback scale
 */

import React, { memo, forwardRef } from 'react'
import type { LogoLinkProps } from './types'
import './styles.css'

/**
 * LogoLink component renders a logo that links to homepage.
 * Pure content layer - no hover state management.
 * BehaviourWrapper handles hover and sets CSS variables.
 */
const LogoLink = memo(forwardRef<HTMLAnchorElement, LogoLinkProps>(function LogoLink(
  {
    text,
    imageSrc,
    imageAlt = 'Logo',
    href = '/',
    className,
    style,
    'data-behaviour': dataBehaviour,
  },
  ref
) {
  const classNames = ['logo-link', className].filter(Boolean).join(' ')

  return (
    <a
      ref={ref}
      href={href}
      className={classNames}
      style={style}
      data-behaviour={dataBehaviour}
      data-effect="color-shift scale-hover"
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={imageAlt}
          className="logo-link__image"
        />
      ) : (
        text
      )}
    </a>
  )
}))

export default LogoLink
