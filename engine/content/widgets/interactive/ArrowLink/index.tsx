'use client'

/**
 * ArrowLink widget — Mailto link with animated arrow icon.
 *
 * SWAP variant:
 *   Overflow-hidden strip with two text spans stacked vertically.
 *   Default shows label, hover slides to reveal email. Arrow rotates.
 *
 * SLIDE variant:
 *   Arrow + email text shift right on hover. Simpler animation.
 *
 * Both render <a href="mailto:..."> — this is navigation, not clipboard.
 */

import React, { memo, forwardRef } from 'react'
import type { ArrowLinkProps, ArrowLinkSize } from './types'
import './styles.css'

// Small arrow — simple chevron (24×24)
function SmallArrow() {
  return (
    <svg
      className="arrow-link__icon arrow-link__icon--small"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="M12 5l7 7-7 7" />
    </svg>
  )
}

// Medium arrow — thicker chevron (38×20)
function MediumArrow() {
  return (
    <svg
      className="arrow-link__icon arrow-link__icon--medium"
      width="38"
      height="20"
      viewBox="0 0 38 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M0 10h36" />
      <path d="M28 2l8 8-8 8" />
    </svg>
  )
}

// Large arrow — S-curve arrow (92×38)
function LargeArrow() {
  return (
    <svg
      className="arrow-link__icon arrow-link__icon--large"
      width="92"
      height="38"
      viewBox="0 0 92 38"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M0 34c16 0 24-8 24-16S40 2 56 2h32" />
      <path d="M80 10l8-8-8-8" transform="translate(0 10)" />
    </svg>
  )
}

function ArrowIcon({ size = 'small', direction = 'right' }: { size?: ArrowLinkSize; direction?: 'right' | 'down' }) {
  const dirClass = direction === 'down' ? ' arrow-link__icon--down' : ''
  const arrow = size === 'large' ? <LargeArrow /> : size === 'medium' ? <MediumArrow /> : <SmallArrow />

  if (dirClass) {
    return <span className={dirClass}>{arrow}</span>
  }
  return arrow
}

const ArrowLink = memo(forwardRef<HTMLAnchorElement, ArrowLinkProps>(function ArrowLink(
  {
    variant = 'swap',
    email = '',
    label = '',
    href,
    arrowDirection = 'right',
    arrowSize = 'small',
    className,
    style,
    'data-behaviour': dataBehaviour,
  },
  ref
) {
  const mailtoHref = href || (email ? `mailto:${email}` : undefined)

  if (variant === 'slide') {
    return (
      <a
        ref={ref}
        href={mailtoHref}
        className={['arrow-link', 'arrow-link--slide', className].filter(Boolean).join(' ')}
        style={style}
        data-behaviour={dataBehaviour}
      >
        <ArrowIcon size={arrowSize} direction={arrowDirection} />
        <span className="arrow-link__text">{label || email}</span>
      </a>
    )
  }

  // Swap variant
  return (
    <a
      ref={ref}
      href={mailtoHref}
      className={['arrow-link', 'arrow-link--swap', className].filter(Boolean).join(' ')}
      style={style}
      data-behaviour={dataBehaviour}
    >
      <div className="arrow-link__strip">
        <span className="arrow-link__label">{label || 'Get in touch'}</span>
        <span className="arrow-link__email">{email}</span>
      </div>
      <ArrowIcon size={arrowSize} direction={arrowDirection} />
    </a>
  )
}))

export default ArrowLink
