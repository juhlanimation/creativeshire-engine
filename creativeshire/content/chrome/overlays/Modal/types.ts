/**
 * Modal overlay types.
 * GSAP-powered modal container with wipe and expand transitions.
 */

import type { ReactNode } from 'react'
import type { RevealType, UseGsapRevealOptions } from '@/creativeshire/experience/hooks/useGsapReveal'

// Re-export for convenience
export type { RevealType } from '@/creativeshire/experience/hooks/useGsapReveal'

/**
 * Transition phase for modal open/close animation.
 */
export type TransitionPhase = 'closed' | 'opening' | 'open' | 'closing'

/**
 * Configuration when opening a modal.
 */
export interface ModalConfig {
  /** Content to render inside modal */
  content: ReactNode

  /**
   * Animation type for modal open/close.
   * - 'wipe-left': Reveal left-to-right (for left-aligned content)
   * - 'wipe-right': Reveal right-to-left (for right-aligned content)
   * - 'expand': Expand from sourceRect to fullscreen
   * - 'fade': Simple opacity fade
   * @default 'wipe-left'
   */
  animationType?: RevealType

  /**
   * Source element bounds for 'expand' animation.
   * Required when animationType is 'expand'.
   * Get this from element.getBoundingClientRect() before opening modal.
   */
  sourceRect?: DOMRect | null

  /**
   * Animation duration in seconds.
   * @default 0.8 for wipe/expand, 0.3 for fade
   */
  animationDuration?: number

  /**
   * GSAP easing function.
   * @default 'power3.inOut'
   */
  animationEase?: string

  /**
   * Whether to sequence content fade after wipe animation.
   * When true, modal content fades in after wipe completes (for video modals).
   * @default true
   */
  sequenceContentFade?: boolean

  /** Called when open animation completes */
  onOpenComplete?: () => void
  /** Called IMMEDIATELY when close is requested (before animation) - use to pause video */
  onBeforeClose?: () => void
  /** Called when close animation completes */
  onClose?: () => void
  /** Whether clicking backdrop closes modal (default: true) */
  closeOnBackdrop?: boolean
  /** Whether ESC key closes modal (default: true) */
  closeOnEsc?: boolean
  /** Backdrop background color (default: 'rgba(0, 0, 0, 0.5)') */
  backdropColor?: string
}

/**
 * Props for Modal component.
 */
export interface ModalProps {
  /** Unique modal ID */
  id: string
}
