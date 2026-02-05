'use client'

/**
 * TransitionLink - a link that triggers page fade transitions.
 *
 * Uses the EffectTimeline system for reliable animation orchestration:
 * 1. Click intercepted
 * 2. Start transition (signal context)
 * 3. Play exit timeline (all registered tracks run in parallel)
 * 4. Wait for ALL tracks to complete (Promise.all)
 * 5. Navigate via router.push()
 * 6. New page mounts and fades in
 *
 * Key improvements:
 * - Uses animationend events via EffectTimeline (not setTimeout)
 * - Multiple effects can register tracks (e.g., hero slide, content blur)
 * - Navigation only happens when LONGEST track finishes
 * - Classes are added/removed dynamically (not persistent)
 */

import { useCallback, type MouseEvent } from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { usePageTransition } from '../../../../experience/navigation/PageTransitionContext'
import { prefersReducedMotion } from '../../../../experience/navigation/animateElement'
import type { TransitionLinkProps } from './types'
import './styles.css'

// Re-export types for consumers
export type { TransitionLinkProps } from './types'

// =============================================================================
// Utilities
// =============================================================================

/**
 * Get dev query params to preserve during navigation.
 */
function getDevParams(): string {
  if (process.env.NODE_ENV !== 'development') return ''
  if (typeof window === 'undefined') return ''

  const params = new URLSearchParams(window.location.search)
  const devParams = new URLSearchParams()

  const DEV_PARAM_KEYS = ['_preset', '_experience']
  DEV_PARAM_KEYS.forEach((key) => {
    const value = params.get(key)
    if (value) devParams.set(key, value)
  })

  const str = devParams.toString()
  return str ? `?${str}` : ''
}

/**
 * Build href with dev params preserved.
 */
function buildHref(href: string): string {
  const devParams = getDevParams()
  if (!devParams) return href

  // Handle existing query params
  const hasQuery = href.includes('?')
  if (hasQuery) {
    return `${href}&${devParams.slice(1)}` // Remove leading ?
  }
  return `${href}${devParams}`
}

// =============================================================================
// Component
// =============================================================================

/**
 * Link with page transition support.
 *
 * Plays the exit timeline (all registered tracks in parallel),
 * waits for completion, then navigates.
 */
export function TransitionLink({
  href,
  children,
  className,
  duration = 400,
  skipTransition = false,
}: TransitionLinkProps) {
  const router = useRouter()
  const transitionContext = usePageTransition()

  const handleClick = useCallback(
    async (e: MouseEvent<HTMLAnchorElement>) => {
      // Allow modifier keys to work normally (open in new tab)
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

      // Skip transition if disabled or user prefers reduced motion
      if (skipTransition || prefersReducedMotion()) {
        return // Let default navigation happen
      }

      // Prevent default navigation
      e.preventDefault()

      const targetHref = buildHref(href)

      // If no transition context, just navigate
      if (!transitionContext) {
        router.push(targetHref)
        return
      }

      const { exitTimeline, startTransition, endTransition } = transitionContext

      // Signal transition is starting
      startTransition()

      // If timeline has tracks, play them and wait for ALL to complete
      if (!exitTimeline.isEmpty) {
        await exitTimeline.play()
      } else {
        // No tracks registered, use duration as fallback
        await new Promise((resolve) => setTimeout(resolve, duration))
      }

      // Navigate to new page
      router.push(targetHref)

      // Clear timeline for next transition
      exitTimeline.clear()

      // Signal transition ended (context will be re-created on new page anyway)
      endTransition()
    },
    [href, duration, skipTransition, router, transitionContext]
  )

  const classNames = ['transition-link', className].filter(Boolean).join(' ')

  return (
    <NextLink href={href} onClick={handleClick} className={classNames}>
      {children}
    </NextLink>
  )
}

export default TransitionLink
