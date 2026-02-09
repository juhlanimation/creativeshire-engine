'use client'

/**
 * Header chrome component - global site header with navigation.
 * Content Layer (L1) - no scroll listeners or viewport units.
 */

import React, { memo, forwardRef, type CSSProperties } from 'react'
import { TransitionLink } from '../../../widgets/interactive/TransitionLink'
import type { HeaderProps } from './types'
import './styles.css'

/**
 * Header component renders the site header with navigation links.
 * Fixed positioning by default, with optional logo and title.
 */
const Header = memo(forwardRef<HTMLElement, HeaderProps>(function Header(
  {
    navLinks,
    logo,
    siteTitle,
    fixed = true,
    background,
    color,
    className,
    'data-behaviour': dataBehaviour,
  },
  ref
) {
  const classNames = ['header-chrome', className].filter(Boolean).join(' ')

  // Build CSS custom properties for theming
  const style = {
    '--header-background': background,
    '--header-color': color,
  } as CSSProperties

  // Ensure navLinks is an array (might be a binding expression)
  const links = Array.isArray(navLinks) ? navLinks : []

  return (
    <header
      ref={ref}
      className={classNames}
      style={style}
      data-behaviour={dataBehaviour}
      data-fixed={fixed}
      role="banner"
    >
      {/* Brand section (logo + title) */}
      <div className="header-chrome__brand">
        {logo && (
          // eslint-disable-next-line @next/next/no-img-element -- Engine library uses native img
          <img
            src={logo}
            alt=""
            className="header-chrome__logo"
            aria-hidden="true"
          />
        )}
        {siteTitle && (
          <TransitionLink href="/" className="header-chrome__title">
            {siteTitle}
          </TransitionLink>
        )}
      </div>

      {/* Navigation - uses TransitionLink for page fade transitions */}
      <nav className="header-chrome__nav" aria-label="Main navigation">
        {links.map((link) => (
          <TransitionLink
            key={link.href}
            href={link.href}
            className="header-chrome__nav-link"
          >
            {link.label}
          </TransitionLink>
        ))}
      </nav>
    </header>
  )
}))

export default Header
