'use client'

/**
 * ContactPrompt widget - contact element with copy-to-clipboard.
 *
 * Two modes:
 * 1. Full mode (showPrompt=true, default):
 *    - Shows prompt text that flips to email on hover
 *    - Mix-blend-mode effects
 *    - Behaviour controls hover via CSS variables
 *
 * 2. Email-only mode (showPrompt=false):
 *    - Just shows email text with copy icon on hover
 *    - Local hover state controls icon visibility
 *    - Simpler, for use in Footer etc.
 *
 * State Machine:
 * [no hover] → [hover/idle] → [hover/copied] → [hover/idle] (after delay)
 *
 * CSS Variables (full mode, from behaviour):
 * - --text-reveal-y: Text flip position (hover-controlled)
 * - --icon-reveal-y: Icon flip position (click-controlled)
 * - --icon-opacity: Icon visibility (hover-controlled)
 * - --shift-color: Text color
 * - --shift-blend: Blend mode
 */

import React, { memo, forwardRef, useState, useCallback, type CSSProperties } from 'react'
import type { ContactPromptProps } from './types'
import './styles.css'

type CopyState = 'idle' | 'copied' | 'failed'

/**
 * Copy icon SVG component.
 */
function CopyIcon(): React.ReactElement {
  return (
    <svg
      className="contact-prompt__icon-svg"
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

/**
 * Check icon SVG component (for copy success feedback).
 */
function CheckIcon(): React.ReactElement {
  return (
    <svg
      className="contact-prompt__icon-svg"
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

/**
 * X icon SVG component (for copy failure feedback).
 */
function FailIcon(): React.ReactElement {
  return (
    <svg
      className="contact-prompt__icon-svg"
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

/**
 * ContactPrompt component renders contact with copy-to-clipboard.
 *
 * Full mode: BehaviourWrapper controls hover via CSS variables.
 * Email-only mode: Local hover state controls icon visibility.
 */
const ContactPrompt = memo(forwardRef<HTMLDivElement, ContactPromptProps>(function ContactPrompt(
  {
    email,
    promptText = 'How can I help you?',
    showPrompt = true,
    className,
    'data-behaviour': dataBehaviour,
  },
  ref
) {
  // Copy state is content-layer (action feedback)
  const [copyState, setCopyState] = useState<CopyState>('idle')
  // Hover state for email-only mode (full mode uses behaviour)
  const [isHovered, setIsHovered] = useState(false)

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

  // Email-only mode uses local hover, full mode uses behaviour
  const showHoverState = !showPrompt && isHovered && copyState === 'idle'

  const baseClass = showPrompt ? 'contact-prompt' : 'contact-prompt contact-prompt--email-only'
  const classNames = [baseClass, className].filter(Boolean).join(' ')

  // Build inline styles based on mode and state
  const style: CSSProperties = showPrompt
    ? // Full mode: CSS variables for behaviour
      isActive ? {
        '--icon-reveal-y': '-100%',
        '--shift-color': 'white',
        '--shift-blend': 'difference',
      } as CSSProperties : {
        '--icon-reveal-y': '0',
      } as CSSProperties
    : // Email-only mode: direct styles
      // Only purple on hover (idle), revert to default on click (matches full mode behavior)
      {
        color: showHoverState ? 'var(--interaction)' : 'inherit',
        '--icon-reveal-y': isActive ? '-100%' : '0',
      } as CSSProperties

  // Email-only mode: simple button with email + icon
  if (!showPrompt) {
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        className={classNames}
        style={style}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label={`Copy email: ${email}`}
      >
        <span>{isFailed ? 'Failed to copy' : email}</span>

        {/* Icon stack - visible on hover, flips on copy */}
        <div
          className="contact-prompt__icon-stack"
          style={{ opacity: isHovered ? 1 : 0 }}
        >
          <div className="contact-prompt__icon contact-prompt__icon--copy">
            <CopyIcon />
          </div>
          <div className="contact-prompt__icon contact-prompt__icon--check">
            {isCopied ? <CheckIcon /> : <FailIcon />}
          </div>
        </div>
      </button>
    )
  }

  // Full mode: prompt text that flips to email on hover
  return (
    <div
      ref={ref}
      className={classNames}
      style={style}
      data-behaviour={dataBehaviour}
      data-effect="color-shift"
      data-copy-state={copyState !== 'idle' ? copyState : undefined}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`Contact: ${email}. Click to copy.`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleClick()
        }
      }}
    >
      {/* Text stack - flips on hover */}
      <div className="contact-prompt__text-stack">
        <span className="contact-prompt__text contact-prompt__text--prompt" data-reveal="text-primary">
          {promptText}
        </span>
        <span className="contact-prompt__text contact-prompt__text--email" data-reveal="text-secondary">
          {isFailed ? 'Failed to copy' : email}
        </span>
      </div>

      {/* Icon stack - flips on click */}
      <div className="contact-prompt__icon-stack" data-reveal="icon-container">
        <div className="contact-prompt__icon contact-prompt__icon--copy" data-reveal="icon-primary">
          <CopyIcon />
        </div>
        <div className="contact-prompt__icon contact-prompt__icon--check" data-reveal="icon-secondary">
          {isCopied ? <CheckIcon /> : <FailIcon />}
        </div>
      </div>
    </div>
  )
}))

export default ContactPrompt
