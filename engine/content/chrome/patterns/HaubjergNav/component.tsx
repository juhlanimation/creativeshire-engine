'use client'

/**
 * HaubjergNav React component.
 * Dark fixed navbar with brand text, desktop nav links, and mobile hamburger menu.
 *
 * Brand: two-part text (dimmed prefix + bright suffix).
 * Desktop: horizontal link bar with active state (white + border-b).
 * Mobile: fullscreen overlay menu triggered by hamburger icon.
 *
 * Uses inline SVG for Menu/X icons (no external icon library).
 * Active link detection via window.location.pathname comparison.
 */

import React, { forwardRef, memo, useState, useEffect, useCallback } from 'react'
import type { WidgetBaseProps } from '../../../widgets/types'

export interface HaubjergNavComponentProps extends WidgetBaseProps {
  brandParts?: [string, string]
  navLinks?: Array<{ label: string; href: string }>
}

const FONT_HEADING = "'DM Sans', sans-serif"

/**
 * Determine if a nav link is active based on the current pathname.
 * Exact match for most links. Project sub-pages keep their parent active.
 */
function isLinkActive(href: string, pathname: string): boolean {
  if (href === pathname) return true
  // Sub-page matching: /kerneprodukter/* keeps /kerneprodukter active
  if (href !== '/' && pathname.startsWith(href + '/')) return true
  return false
}

/** Inline SVG hamburger menu icon (3 horizontal lines). */
function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

/** Inline SVG close icon (X). */
function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

const HaubjergNavComponent = memo(forwardRef<HTMLElement, HaubjergNavComponentProps>(
  function HaubjergNavComponent(
    {
      brandParts = ['Studio', 'Dokumentar'],
      navLinks = [],
      className,
      style,
      'data-behaviour': dataBehaviour,
    },
    ref
  ) {
    const [mobileOpen, setMobileOpen] = useState(false)
    const [pathname, setPathname] = useState('/')

    // Read current pathname on mount and on popstate
    useEffect(() => {
      if (typeof window !== 'undefined') {
        setPathname(window.location.pathname)
      }
      const handlePopState = () => {
        setPathname(window.location.pathname)
      }
      window.addEventListener('popstate', handlePopState)
      return () => window.removeEventListener('popstate', handlePopState)
    }, [])

    // Lock body scroll when mobile menu is open
    useEffect(() => {
      if (mobileOpen) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
      return () => {
        document.body.style.overflow = ''
      }
    }, [mobileOpen])

    const toggleMobile = useCallback(() => {
      setMobileOpen(prev => !prev)
    }, [])

    const closeMobile = useCallback(() => {
      setMobileOpen(false)
    }, [])

    const [brandPrefix, brandSuffix] = brandParts

    return (
      <nav
        ref={ref}
        className={['haubjerg-nav', className].filter(Boolean).join(' ')}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          backgroundColor: 'rgba(10, 10, 10, 0.9)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          ...style,
        }}
        data-behaviour={dataBehaviour}
      >
        {/* Brand */}
        <a
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            textDecoration: 'none',
            fontFamily: FONT_HEADING,
            fontSize: '11px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase' as const,
          }}
        >
          <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>{brandPrefix}</span>
          <span style={{ color: '#ffffff' }}>{brandSuffix}</span>
        </a>

        {/* Desktop nav links */}
        <div
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '2rem',
          }}
          className="haubjerg-nav__desktop"
        >
          {navLinks.map((link, i) => {
            const active = isLinkActive(link.href, pathname)
            return (
              <a
                key={i}
                href={link.href}
                style={{
                  fontFamily: FONT_HEADING,
                  fontSize: '11px',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase' as const,
                  textDecoration: 'none',
                  color: active ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
                  paddingBottom: '2px',
                  borderBottom: active ? '1px solid #ffffff' : '1px solid transparent',
                  transition: 'color 0.2s ease, border-color 0.2s ease',
                }}
              >
                {link.label}
              </a>
            )
          })}
        </div>

        {/* Mobile hamburger button */}
        <button
          onClick={toggleMobile}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          className="haubjerg-nav__hamburger"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            border: 'none',
            color: '#ffffff',
            cursor: 'pointer',
            padding: 0,
            zIndex: 60,
          }}
        >
          {mobileOpen ? <CloseIcon /> : <MenuIcon />}
        </button>

        {/* Mobile fullscreen menu */}
        {mobileOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 55,
              backgroundColor: 'rgba(10, 10, 10, 0.98)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2rem',
            }}
          >
            {navLinks.map((link, i) => {
              const active = isLinkActive(link.href, pathname)
              return (
                <a
                  key={i}
                  href={link.href}
                  onClick={closeMobile}
                  style={{
                    fontFamily: FONT_HEADING,
                    fontSize: '18px',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase' as const,
                    textDecoration: 'none',
                    color: active ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
                    paddingBottom: '4px',
                    borderBottom: active ? '1px solid #ffffff' : '1px solid transparent',
                    transition: 'color 0.2s ease',
                  }}
                >
                  {link.label}
                </a>
              )
            })}
          </div>
        )}
      </nav>
    )
  }
))

export default HaubjergNavComponent
