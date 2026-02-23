'use client'

/**
 * Link widget - renders a navigation link with CSS variable support.
 * Content Layer (L1) - no scroll listeners or viewport units.
 *
 * Uses Next.js Link for internal routes (href starts with /),
 * native <a> element for external URLs.
 *
 * Supports page transitions via PageTransitionContext (EffectTimeline):
 * - If PageTransitionProvider exists, intercepts navigation to play exit timeline
 * - Empty timeline = navigate immediately (no fallback timeout)
 * - Multiple effects can register tracks (hero slide, content blur, etc.)
 * - Navigation waits for the LONGEST track to finish
 */

import React, { memo, forwardRef, useCallback, useRef, type MouseEvent } from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { usePageTransition } from '../../../../experience/navigation/PageTransitionContext'
import { prefersReducedMotion } from '../../../../experience/timeline/animateElement'
import type { LinkProps } from './types'

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
 * Dev query params to preserve during navigation.
 */
const DEV_PARAMS = ['_preset', '_experience', '_intro', '_transition']

/**
 * Get href with preserved dev query params from current URL.
 * Only active in development mode.
 */
function getHrefWithDevParams(href: string): string {
  if (process.env.NODE_ENV !== 'development') return href
  if (typeof window === 'undefined') return href

  const currentParams = new URLSearchParams(window.location.search)
  const devParams = DEV_PARAMS.filter((p) => currentParams.has(p))

  if (devParams.length === 0) return href

  // Parse the href to handle existing query params
  const [path, existingQuery] = href.split('?')
  const newParams = new URLSearchParams(existingQuery || '')

  // Add dev params
  devParams.forEach((p) => {
    const value = currentParams.get(p)
    if (value) newParams.set(p, value)
  })

  const queryString = newParams.toString()
  return queryString ? `${path}?${queryString}` : path
}

/**
 * Strip trailing slash for pathname comparison (but keep "/" as-is).
 */
function stripTrailingSlash(p: string): string {
  return p.length > 1 && p.endsWith('/') ? p.slice(0, -1) : p
}

/**
 * Link component renders a navigation link.
 * Supports CSS variable animation via var() fallbacks in styles.css.
 *
 * When PageTransitionProvider is available, coordinates page transitions:
 * 1. Intercepts click
 * 2. Plays exit timeline (all registered tracks in parallel)
 * 3. Waits for ALL tracks to complete
 * 4. Navigates via router.push
 * 5. Entry animation plays on new page mount
 */
const Link = memo(forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  {
    id,
    href,
    children,
    target,
    rel,
    variant = 'hover-underline',
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
  const transitionContext = usePageTransition()

  // Version counter — incremented on each click so stale async
  // continuations (from a previous click's await) can detect they're
  // outdated and bail before calling router.push a second time.
  const versionRef = useRef(0)

  const computedClassName = className ? `link-widget ${className}` : 'link-widget'

  // For external links, automatically add security attributes
  const isExternal = !isInternalLink(href)
  const computedRel = rel ?? (isExternal && target === '_blank' ? 'noopener noreferrer' : undefined)

  /**
   * Handle click - intercept for page transition or dev param preservation.
   */
  const handleClick = useCallback(
    async (e: MouseEvent<HTMLAnchorElement>) => {
      // Call user's onClick first
      onClick?.(e)
      if (e.defaultPrevented) return

      // Standard behavior for modifier keys (new tab)
      if (hasModifierKey(e)) return

      // Standard behavior for external/new tab
      if (isExternal || target === '_blank') return

      // Get href with dev params preserved (only affects dev mode)
      const navHref = getHrefWithDevParams(href)

      // Skip transition for same-page navigation
      if (typeof window !== 'undefined') {
        const hrefPath = stripTrailingSlash(href.split('?')[0].split('#')[0])
        if (stripTrailingSlash(window.location.pathname) === hrefPath) {
          e.preventDefault()
          return
        }
      }

      // Determine if we should use transitions
      const shouldTransition =
        transitionContext &&
        !skipTransition &&
        !prefersReducedMotion()

      if (shouldTransition && transitionContext) {
        e.preventDefault()

        const { getExitTimeline, startTransition, endTransition } = transitionContext
        const exitTimeline = getExitTimeline()

        // If an exit animation is already in-flight (user clicked rapidly),
        // skip exit and navigate immediately
        if (exitTimeline.playing) {
          router.push(navHref)
          return
        }

        // Stamp this click so we can detect stale continuations after await
        const version = ++versionRef.current

        // Signal transition is starting
        startTransition()

        // If timeline has tracks, play them and wait for ALL to complete
        if (!exitTimeline.isEmpty) {
          await exitTimeline.play()
        }
        // Empty timeline = navigate immediately (no fallback timeout)

        // A newer click happened while we were waiting — abort
        if (versionRef.current !== version) return

        // Navigate to new page
        router.push(navHref)

        // Clear timeline for next transition
        exitTimeline.clear()

        // Signal transition ended
        endTransition()
        return
      }

      // No transition — in dev mode, intercept to preserve query params
      if (navHref !== href) {
        e.preventDefault()
        router.push(navHref)
      }
    },
    [onClick, href, target, isExternal, skipTransition, transitionContext, router]
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
    // Note: We don't modify the href attribute here to avoid hydration mismatch.
    // Dev query params (_preset, _experience, _intro, _transition) are added in handleClick instead.
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
