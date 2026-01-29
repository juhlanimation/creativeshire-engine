'use client'

/**
 * RevealTransition - GSAP-powered reveal animation wrapper.
 *
 * Provides wipe and expand transitions matching bojuhl.com:
 * - wipe-left: clip from right, reveal left-to-right
 * - wipe-right: clip from left, reveal right-to-left
 * - expand: clip from sourceRect, expand to fullscreen
 * - fade: simple opacity transition
 *
 * Features:
 * - GSAP timeline for precise control
 * - Sequenced content fade (content fades in after wipe)
 * - timeline.reverse() for smooth close animations
 * - sourceRect support for expand-from-element
 *
 * @example
 * ```tsx
 * <RevealTransition
 *   type="wipe-left"
 *   revealed={isOpen}
 *   options={{ duration: 0.8 }}
 *   onComplete={() => setPhase('open')}
 *   onReverseComplete={() => setPhase('closed')}
 * >
 *   <ModalContent />
 * </RevealTransition>
 * ```
 */

import { type ReactNode, type CSSProperties } from 'react'
import { useGsapReveal, type UseGsapRevealOptions } from './use-gsap-reveal'

// Re-export types for convenience
export type { RevealType, UseGsapRevealOptions } from './use-gsap-reveal'

/**
 * Props for RevealTransition component.
 */
export interface RevealTransitionProps {
  /** The reveal type: 'wipe-left' | 'wipe-right' | 'expand' | 'fade' */
  type: 'wipe-left' | 'wipe-right' | 'expand' | 'fade'
  /** Whether content is revealed (true) or hidden (false) */
  revealed: boolean
  /** Called when reveal animation completes */
  onComplete?: () => void
  /** Called when reverse (close) animation completes */
  onReverseComplete?: () => void
  /** Animation options */
  options?: UseGsapRevealOptions
  /** Content to reveal */
  children: ReactNode
  /** Additional class names */
  className?: string
  /** Additional inline styles */
  style?: CSSProperties
}

/**
 * RevealTransition component.
 *
 * GSAP-powered reveal animation that works for modals, drawers, tooltips, etc.
 * Consumer passes `revealed` state; this component handles the animation.
 *
 * Uses GSAP timelines for:
 * - Precise sequencing (wipe -> then content fade)
 * - True reversal on close (timeline.reverse())
 * - sourceRect-based expand animations
 */
export function RevealTransition({
  type,
  revealed,
  onComplete,
  onReverseComplete,
  options,
  children,
  className,
  style,
}: RevealTransitionProps): ReactNode {
  const { containerRef, contentRef } = useGsapReveal({
    type,
    revealed,
    options,
    onComplete,
    onReverseComplete,
  })

  return (
    <div ref={containerRef} className={className} style={style}>
      {options?.sequenceContentFade ? (
        <div ref={contentRef}>{children}</div>
      ) : (
        children
      )}
    </div>
  )
}

export default RevealTransition
