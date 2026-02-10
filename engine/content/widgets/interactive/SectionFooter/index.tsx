'use client'

/**
 * SectionFooter widget - footer bar for project sections.
 * Content Layer (L1) - renders social icons, email copy, and display name.
 *
 * Features:
 * - Centered social icons (Instagram, LinkedIn) as external links
 * - Email with click-to-copy and check feedback
 * - Optional display name in bottom-left corner
 * - Light/dark text color modes
 */

import React, { memo, forwardRef, useState, useCallback } from 'react'
import type { SectionFooterProps } from './types'
import './styles.css'

type CopyState = 'idle' | 'copied' | 'failed'

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function EmailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 7l-10 7L2 7" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 13l4 4L19 7" />
    </svg>
  )
}

const SectionFooter = memo(forwardRef<HTMLDivElement, SectionFooterProps>(function SectionFooter(
  {
    email,
    instagram,
    linkedin,
    displayName,
    height,
    textColor = 'light',
    className,
    'data-behaviour': dataBehaviour,
  },
  ref
) {
  const [copyState, setCopyState] = useState<CopyState>('idle')

  const handleEmailClick = useCallback(async () => {
    if (!email) return
    try {
      await navigator.clipboard.writeText(email)
      setCopyState('copied')
      setTimeout(() => setCopyState('idle'), 2000)
    } catch {
      setCopyState('failed')
      setTimeout(() => setCopyState('idle'), 2000)
    }
  }, [email])

  const hasIcons = !!(instagram || linkedin || email)

  const classNames = [
    'section-footer',
    `section-footer--${textColor}`,
    className,
  ].filter(Boolean).join(' ')

  const style = height ? { '--sf-height': height } as React.CSSProperties : undefined

  return (
    <div
      ref={ref}
      className={classNames}
      style={style}
      data-behaviour={dataBehaviour}
    >
      {/* Centered social/contact icons */}
      {hasIcons && (
        <div className="section-footer__icons">
          {instagram && (
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="section-footer__icon-link"
              aria-label="Instagram"
            >
              <InstagramIcon />
            </a>
          )}
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="section-footer__icon-link"
              aria-label="LinkedIn"
            >
              <LinkedInIcon />
            </a>
          )}
          {email && (
            <button
              type="button"
              className="section-footer__icon-link section-footer__email-btn"
              onClick={handleEmailClick}
              aria-label={`Copy email: ${email}`}
              data-copy-state={copyState !== 'idle' ? copyState : undefined}
            >
              {copyState === 'copied' ? <CheckIcon /> : <EmailIcon />}
            </button>
          )}
        </div>
      )}

      {/* Display name in bottom-left corner */}
      {displayName && (
        <span className="section-footer__display-name">{displayName}</span>
      )}
    </div>
  )
}))

export default SectionFooter
