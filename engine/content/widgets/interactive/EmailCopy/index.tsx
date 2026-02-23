'use client'

/**
 * EmailCopy widget - click-to-copy email with visual feedback.
 *
 * Two variants:
 *
 * FLIP (default):
 *   label controls content, not styling:
 *   - provided:  text-stack with two rows (label flips to email+icon on hover)
 *   - omitted:   single static row with email+icon (no flip)
 *   Visual props (blendMode, color) apply uniformly.
 *   Hover is handled by CSS: behaviour sets --text-reveal-y,
 *   or the :not([data-behaviour]):hover fallback does it.
 *
 *   Structure (with label):
 *     button.email-copy--flip (flex)
 *       div.text-stack (overflow:hidden, height = 1 row)
 *         div.row (prompt — in-flow, slides up on hover)
 *           span.text "How can I help you?"
 *         div.row.row--email (in-flow below, slides in on hover)
 *           span.text "hello@example.com"
 *           div.icon-stack (inline, copy→check sub-flip)
 *
 *   CSS Variables (from hover/reveal behaviour):
 *   - --text-reveal-y: Text flip position (hover-controlled)
 *   - --icon-reveal-y: Icon flip position (click-controlled, set by widget)
 *   - --shift-color: Text color (effect-controlled)
 *
 *   data-blend-mode drives mix-blend-mode on parent .chrome-overlay (see chrome.css).
 *
 * REVEAL:
 *   Horizontal max-width fold-out on hover reveals email in parentheses.
 *   Click copies email, swaps clipboard icon for checkmark.
 *   Uses React hover state (no behaviour CSS variables).
 *
 * hoverColor applies to BOTH variants — the color things turn on hover/interaction.
 */

import React, { memo, forwardRef, useState, useCallback, useRef, useEffect, type CSSProperties } from 'react'
import type { EmailCopyProps } from './types'

type CopyState = 'idle' | 'copied' | 'failed'

// =============================================================================
// Shared Icons
// =============================================================================

function CopyIcon(): React.ReactElement {
  return (
    <svg
      className="email-copy__icon-svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    </svg>
  )
}

function CheckIcon(): React.ReactElement {
  return (
    <svg
      className="email-copy__icon-svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  )
}

function FailIcon(): React.ReactElement {
  return (
    <svg
      className="email-copy__icon-svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
}

// =============================================================================
// Reveal variant icons (slightly different sizing from flip)
// =============================================================================

function RevealClipboardIcon(): React.ReactElement {
  return (
    <svg
      className="email-copy__reveal-icon-svg email-copy__reveal-icon--copy"
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

function RevealCheckmarkIcon(): React.ReactElement {
  return (
    <svg
      className="email-copy__reveal-icon-svg email-copy__reveal-icon--check"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
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

// =============================================================================
// Component
// =============================================================================

const EmailCopy = memo(forwardRef<HTMLButtonElement, EmailCopyProps>(function EmailCopy(
  {
    variant = 'flip',
    email,
    hoverColor = 'accent',
    label,
    blendMode = 'normal',
    color,
    className,
    style,
    'data-behaviour': dataBehaviour,
  },
  ref
) {
  if (variant === 'reveal') {
    return (
      <RevealVariant
        ref={ref}
        email={email}
        label={label || ''}
        hoverColor={hoverColor}
        className={className}
        style={style}
        dataBehaviour={dataBehaviour}
      />
    )
  }

  return (
    <FlipVariant
      ref={ref}
      email={email}
      label={label || ''}
      blendMode={blendMode}
      color={color}
      hoverColor={hoverColor}
      className={className}
      dataBehaviour={dataBehaviour}
    />
  )
}))

// =============================================================================
// Flip Variant
// =============================================================================

interface FlipVariantProps {
  email: string
  label: string
  blendMode: 'normal' | 'difference'
  color?: string
  hoverColor: 'accent' | 'interaction' | 'primary'
  className?: string
  dataBehaviour?: string
}

const FlipVariant = forwardRef<HTMLButtonElement, FlipVariantProps>(function FlipVariant(
  { email, label, blendMode, color, hoverColor, className, dataBehaviour },
  ref
) {
  const [copyState, setCopyState] = useState<CopyState>('idle')

  const handleClick = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopyState('copied')
      setTimeout(() => setCopyState('idle'), 2000)
    } catch {
      setCopyState('failed')
      setTimeout(() => setCopyState('idle'), 2000)
    }
  }, [email])

  const isCopied = copyState === 'copied'
  const isFailed = copyState === 'failed'
  const isActive = isCopied || isFailed
  const hasBlend = blendMode !== 'normal'
  const textColor = (!hasBlend && color) || undefined
  const hasLabel = !!label

  const style: CSSProperties = {
    '--icon-reveal-y': isActive ? '-100%' : '0',
    ...(isActive && { '--shift-color': 'white' }),
    ...(textColor && { color: textColor }),
  } as CSSProperties

  const iconStack = (
    <div className="email-copy__icon-stack">
      <div className="email-copy__icon email-copy__icon--copy">
        <CopyIcon />
      </div>
      <div className="email-copy__icon email-copy__icon--check">
        {isCopied ? <CheckIcon /> : <FailIcon />}
      </div>
    </div>
  )

  return (
    <button
      ref={ref}
      type="button"
      className={['email-copy', 'email-copy--flip', className].filter(Boolean).join(' ')}
      style={style}
      data-hover-color={hoverColor}
      data-behaviour={dataBehaviour}
      data-blend-mode={hasBlend ? blendMode : undefined}
      data-effect={hasBlend ? 'color-shift' : undefined}
      data-copy-state={copyState !== 'idle' ? copyState : undefined}
      onClick={handleClick}
      aria-label={`Contact: ${email}. Click to copy.`}
    >
      {hasLabel ? (
        <div className="email-copy__text-stack">
          <div className="email-copy__row">
            <span className="email-copy__text">{label}</span>
          </div>
          <div className="email-copy__row email-copy__row--email">
            <span className="email-copy__text">{isFailed ? 'Failed to copy' : email}</span>
            {iconStack}
          </div>
        </div>
      ) : (
        <div className="email-copy__row email-copy__row--email email-copy__row--static">
          <span className="email-copy__text">{isFailed ? 'Failed to copy' : email}</span>
          {iconStack}
        </div>
      )}
    </button>
  )
})

// =============================================================================
// Reveal Variant
// =============================================================================

interface RevealVariantProps {
  email: string
  label: string
  hoverColor: 'accent' | 'interaction' | 'primary'
  className?: string
  style?: CSSProperties
  dataBehaviour?: string
}

const RevealVariant = forwardRef<HTMLButtonElement, RevealVariantProps>(function RevealVariant(
  { email, label, hoverColor, className, style, dataBehaviour },
  ref
) {
  const [isHovered, setIsHovered] = useState(false)
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

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
    'email-copy',
    'email-copy--reveal',
    isHovered && 'email-copy--reveal-hovered',
    copied && 'email-copy--reveal-copied',
    className,
  ].filter(Boolean).join(' ')

  return (
    <button
      ref={ref}
      type="button"
      className={classNames}
      style={style}
      data-hover-color={hoverColor}
      data-behaviour={dataBehaviour}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`Copy email: ${email}`}
    >
      <span>{label}</span>

      <span className="email-copy__address">
        <span className="email-copy__address-text">({email})</span>
      </span>

      <span className="email-copy__reveal-icon">
        <RevealClipboardIcon />
        <RevealCheckmarkIcon />
      </span>
    </button>
  )
})

export default EmailCopy
