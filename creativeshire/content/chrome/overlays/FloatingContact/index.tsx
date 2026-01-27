'use client'

/**
 * FloatingContact chrome component - floating contact CTA.
 * Content Layer (L1) - no scroll listeners or viewport units.
 * Mobile: inline in page flow. Tablet+: fixed position overlay.
 */

import React, { memo, forwardRef, type CSSProperties } from 'react'
import type { FloatingContactProps } from './types'
import './styles.css'

/**
 * FloatingContact component renders a contact prompt CTA.
 * Inline on mobile, fixed overlay on tablet+.
 */
const FloatingContact = memo(forwardRef<HTMLAnchorElement, FloatingContactProps>(function FloatingContact(
  {
    promptText = 'How can I help you?',
    email,
    backgroundColor,
    className,
    'data-behaviour': dataBehaviour
  },
  ref
) {
  const classNames = ['floating-contact-chrome', className].filter(Boolean).join(' ')

  const style: CSSProperties | undefined = backgroundColor
    ? { '--floating-contact-bg': backgroundColor } as CSSProperties
    : undefined

  return (
    <a
      ref={ref}
      href={`mailto:${email}`}
      className={classNames}
      style={style}
      data-behaviour={dataBehaviour}
      aria-label="Contact"
    >
      <span className="floating-contact-chrome__text">{promptText}</span>
    </a>
  )
}))

export default FloatingContact
