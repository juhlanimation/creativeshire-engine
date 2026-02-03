/**
 * Link widget - renders a navigation link with CSS variable support.
 * Content Layer (L1) - no scroll listeners or viewport units.
 *
 * Uses Next.js Link for internal routes (href starts with /),
 * native <a> element for external URLs.
 *
 * Supports page transitions via TransitionProvider:
 * - If TransitionProvider exists, intercepts navigation to run exit tasks
 * - Falls back to standard navigation if no provider
 */

import React, { memo, forwardRef, useCallback, type MouseEvent } from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { useTransitionOptional } from '../../../../experience/navigation'
import type { LinkProps } from './types'
import './styles.css'

/**
 * Determines if a URL is internal (starts with / but not //).
 */
function isInternalLink(href: string): boolean {
  return href.startsWith('/') && !href.startsWith('//')
}

/**
 * Check if event has modifier keys (should open in new tab).
 */
function hasModifierKey(e: MouseEvent): boolean {
  return e.metaKey || e.ctrlKey || e.shiftKey || e.altKey
}

/**
 * Link component renders a navigation link.
 * Supports CSS variable animation via var() fallbacks in styles.css.
 *
 * When TransitionProvider is available, coordinates page transitions:
 * 1. Intercepts click
 * 2. Executes exit stack
 * 3. Navigates via router.push
 * 4. Entry stack runs on new page mount
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
    'data-effect': dataEffect,
    skipTransition = false,
    onClick,
  },
  ref
) {
  const router = useRouter()
  const transitionContext = useTransitionOptional()

  const computedClassName = className ? `link-widget ${className}` : 'link-widget'

  // For external links, automatically add security attributes
  const isExternal = !isInternalLink(href)
  const computedRel = rel ?? (isExternal && target === '_blank' ? 'noopener noreferrer' : undefined)

  // Determine if we should use transitions
  const shouldTransition =
    transitionContext &&
    !skipTransition &&
    !isExternal &&
    target !== '_blank'

  /**
   * Handle click - intercept for transition if applicable.
   */
  const handleClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      // Call user's onClick first
      onClick?.(e)
      if (e.defaultPrevented) return

      // Standard behavior for modifier keys (new tab)
      if (hasModifierKey(e)) return

      // Standard behavior for external/new tab
      if (isExternal || target === '_blank') return

      // If transitions enabled, intercept and run transition
      if (shouldTransition && transitionContext) {
        e.preventDefault()
        transitionContext.startTransition(href, () => {
          router.push(href)
        })
      }
    },
    [onClick, href, target, isExternal, shouldTransition, transitionContext, router]
  )

  const commonProps = {
    id,
    className: computedClassName,
    style,
    'data-variant': variant,
    'data-behaviour': dataBehaviour,
    'data-effect': dataEffect,
  }

  // Use Next.js Link for internal navigation
  if (isInternalLink(href)) {
    return (
      <NextLink
        ref={ref}
        href={href}
        onClick={handleClick}
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
      onClick={onClick}
      {...commonProps}
    >
      {children}
    </a>
  )
}))

export default Link
