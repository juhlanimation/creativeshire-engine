/**
 * Link widget - renders a navigation link with CSS variable support.
 * Content Layer (L1) - no scroll listeners or viewport units.
 *
 * Uses Next.js Link for internal routes (href starts with /),
 * native <a> element for external URLs.
 */

import React, { memo, forwardRef } from 'react'
import NextLink from 'next/link'
import type { LinkProps } from './types'
import './styles.css'

/**
 * Determines if a URL is internal (starts with / but not //).
 */
function isInternalLink(href: string): boolean {
  return href.startsWith('/') && !href.startsWith('//')
}

/**
 * Link component renders a navigation link.
 * Supports CSS variable animation via var() fallbacks in styles.css.
 */
const Link = memo(forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  {
    id,
    href,
    children,
    target,
    rel,
    variant = 'default',
    style,
    className,
    'data-behaviour': dataBehaviour,
    'data-effect': dataEffect
  },
  ref
) {
  const computedClassName = className ? `link-widget ${className}` : 'link-widget'

  // For external links, automatically add security attributes
  const isExternal = !isInternalLink(href)
  const computedRel = rel ?? (isExternal && target === '_blank' ? 'noopener noreferrer' : undefined)

  const commonProps = {
    id,
    className: computedClassName,
    style,
    'data-variant': variant,
    'data-behaviour': dataBehaviour,
    'data-effect': dataEffect
  }

  // Use Next.js Link for internal navigation
  if (isInternalLink(href)) {
    return (
      <NextLink
        ref={ref}
        href={href}
        {...commonProps}
      >
        {children}
      </NextLink>
    )
  }

  // Use native anchor for external URLs
  return (
    <a
      ref={ref}
      href={href}
      target={target}
      rel={computedRel}
      {...commonProps}
    >
      {children}
    </a>
  )
}))

export default Link
