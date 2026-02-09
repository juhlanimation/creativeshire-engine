'use client'

/**
 * EmailReveal widget - hover-triggered email reveal with copy-to-clipboard.
 *
 * Animation: max-width fold-out on hover reveals email address in parentheses.
 * Click: copies email to clipboard, swaps clipboard icon for checkmark.
 * Reset: checkmark reverts to clipboard after 2 seconds.
 *
 * State Machine:
 * [no hover] → [hover/idle] → [click/copied] → [hover/idle] (after 2s)
 */

import React, { memo, forwardRef, useState, useCallback, useRef, useEffect } from 'react'
import type { EmailRevealProps } from './types'
import './styles.css'

/**
 * Clipboard SVG icon.
 */
function ClipboardIcon(): React.ReactElement {
  return (
    <svg
      className="email-reveal__icon-svg email-reveal__icon--copy"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" strokeWidth={1.5} />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"
      />
    </svg>
  )
}

/**
 * Checkmark SVG icon (copy success feedback).
 */
function CheckmarkIcon({ color }: { color: string }): React.ReactElement {
  return (
    <svg
      className="email-reveal__icon-svg email-reveal__icon--check"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      style={{ color }}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  )
}

const EmailReveal = memo(forwardRef<HTMLButtonElement, EmailRevealProps>(function EmailReveal(
  {
    email,
    label = 'Email',
    accentColor = '#ffffff',
    className,
    style,
    'data-behaviour': dataBehaviour,
  },
  ref
) {
  const [isHovered, setIsHovered] = useState(false)
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const handleClick = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      // Silently fail - clipboard may not be available
    }
  }, [email])

  const classNames = [
    'email-reveal',
    isHovered && 'email-reveal--hovered',
    copied && 'email-reveal--copied',
    className,
  ].filter(Boolean).join(' ')

  return (
    <button
      ref={ref}
      type="button"
      className={classNames}
      style={{ ...style, color: isHovered ? accentColor : undefined }}
      data-behaviour={dataBehaviour}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`Copy email: ${email}`}
    >
      <span>{label}</span>

      {/* Email address - fold-out on hover */}
      <span className="email-reveal__address">
        <span className="email-reveal__address-text">({email})</span>
      </span>

      {/* Icon - clipboard / checkmark swap */}
      <span className="email-reveal__icon">
        <ClipboardIcon />
        <CheckmarkIcon color={accentColor} />
      </span>
    </button>
  )
}))

export default EmailReveal
