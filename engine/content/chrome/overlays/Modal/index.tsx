'use client'

/**
 * Modal overlay component.
 * GSAP-powered fullscreen modal with wipe and expand transitions.
 *
 * Architecture:
 * - L1 (Content): Portal mounting, focus trap, accessibility
 * - L2 (Experience): GSAP transitions via RevealTransition
 *
 * Key features:
 * - Single modal at a time
 * - Transition phase tracking (closed -> opening -> open -> closing -> closed)
 * - GSAP-powered wipe/expand transitions (matching bojuhl.com)
 * - Focus trap and scroll lock
 * - ARIA attributes and keyboard support
 * - Sequenced content fade after wipe
 */

import { useEffect, useCallback, useRef, memo } from 'react'
import { createPortal } from 'react-dom'
import { useStore } from 'zustand'
import { useModalStore } from './store'
import { useSmoothScroll, useSmoothScrollContainer } from '../../../../experience'
import { useContainer } from '../../../../interface/ContainerContext'
// ARCHITECTURE EXCEPTION: Overlays may import driver utilities for enter/exit animations.
// RevealTransition is driver infrastructure (not a behaviour), providing GSAP timeline
// control for sequenced modal transitions that CSS cannot achieve.
import { RevealTransition } from '../../../../experience/drivers/gsap'
import type { RevealType } from '../../../../experience/drivers/gsap'
import './styles.css'

/**
 * Close icon (X) SVG.
 */
function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

/**
 * Modal component.
 * Renders when activeModal is set in the store.
 */
const Modal = memo(function Modal() {
  const activeModal = useStore(useModalStore, (s) => s.activeModal)
  const transitionPhase = useStore(useModalStore, (s) => s.transitionPhase)
  const close = useModalStore((s) => s.close)
  const setTransitionPhase = useModalStore((s) => s.setTransitionPhase)

  const modalContainerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const smoothScroll = useSmoothScroll()
  const { mode, containerRef, portalTarget } = useContainer()

  // Apply GSAP smooth scrolling to modal content (uses site-wide settings)
  useSmoothScrollContainer(contentRef, { enabled: transitionPhase === 'open' })

  const config = activeModal?.config
  const closeOnBackdrop = config?.closeOnBackdrop ?? true
  const closeOnEsc = config?.closeOnEsc ?? true
  const backdropColor = config?.backdropColor ?? 'rgba(0, 0, 0, 0.5)'

  // Animation config with defaults
  const animationType: RevealType = config?.animationType ?? 'wipe-left'
  const animationDuration = config?.animationDuration ?? 0.8
  const animationEase = config?.animationEase ?? 'power3.inOut'
  const sequenceContentFade = config?.sequenceContentFade ?? true
  const sourceRect = config?.sourceRect

  // Whether modal is revealed (for RevealTransition)
  const revealed = transitionPhase === 'opening' || transitionPhase === 'open'

  // Handle close request
  const handleClose = useCallback(() => {
    if (transitionPhase === 'open') {
      close()
    }
  }, [transitionPhase, close])

  // Store previous focus when opening
  useEffect(() => {
    if (transitionPhase === 'opening') {
      previousFocusRef.current = document.activeElement as HTMLElement
    }
  }, [transitionPhase])

  // Handle open animation complete
  const handleOpenComplete = useCallback(() => {
    setTransitionPhase('open')
    config?.onOpenComplete?.()
  }, [setTransitionPhase, config])

  // Handle close animation complete (reverse)
  const handleCloseComplete = useCallback(() => {
    setTransitionPhase('closed')
    config?.onClose?.()
    previousFocusRef.current?.focus()
  }, [setTransitionPhase, config])

  // ESC key to close
  useEffect(() => {
    if (!activeModal || !closeOnEsc) return
    if (transitionPhase !== 'open') return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [activeModal, closeOnEsc, transitionPhase, handleClose])

  // Lock scroll when visible (container-aware)
  useEffect(() => {
    if (transitionPhase === 'closed') return

    // Use container in contained mode, otherwise document.body
    const scrollTarget = mode === 'contained' && containerRef?.current
      ? containerRef.current
      : document.body

    const originalOverflow = scrollTarget.style.overflow
    const originalPaddingRight = scrollTarget.style.paddingRight

    // Calculate scrollbar width to prevent layout shift (only relevant for body)
    const scrollbarWidth = mode === 'contained'
      ? 0
      : window.innerWidth - document.documentElement.clientWidth
    scrollTarget.style.overflow = 'hidden'
    if (scrollbarWidth > 0) {
      scrollTarget.style.paddingRight = `${scrollbarWidth}px`
    }

    return () => {
      scrollTarget.style.overflow = originalOverflow
      scrollTarget.style.paddingRight = originalPaddingRight
    }
  }, [transitionPhase, mode, containerRef])

  // Pause ScrollSmoother when modal is visible
  useEffect(() => {
    if (transitionPhase === 'closed') return

    // Pause smooth scrolling so modal scroll works
    smoothScroll?.stop()

    return () => {
      // Resume smooth scrolling when modal closes
      smoothScroll?.start()
    }
  }, [transitionPhase, smoothScroll])

  // Focus trap within modal
  useEffect(() => {
    if (transitionPhase !== 'open') return

    const container = modalContainerRef.current
    if (!container) return

    const focusableSelector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    const focusableElements = container.querySelectorAll<HTMLElement>(focusableSelector)

    // Focus first focusable element
    if (focusableElements.length > 0) {
      focusableElements[0].focus()
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      const elements = container.querySelectorAll<HTMLElement>(focusableSelector)
      if (!elements.length) return

      const first = elements[0]
      const last = elements[elements.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [transitionPhase])

  // Handle backdrop click
  const handleBackdropClick = useCallback(() => {
    if (closeOnBackdrop && transitionPhase === 'open') {
      handleClose()
    }
  }, [closeOnBackdrop, transitionPhase, handleClose])

  // Don't render if closed or not in browser
  if (transitionPhase === 'closed' || typeof window === 'undefined') {
    return null
  }

  return createPortal(
    <div className="modal" role="dialog" aria-modal="true">
      {/* Backdrop - simple fade */}
      <RevealTransition
        type="fade"
        revealed={revealed}
        options={{ duration: 0.3 }}
        className="modal__backdrop"
        style={{ backgroundColor: backdropColor }}
      >
        <div
          className="modal__backdrop-inner"
          onClick={handleBackdropClick}
          aria-hidden="true"
        />
      </RevealTransition>

      {/* Main content - wipe/expand with sequenced content fade */}
      <RevealTransition
        type={animationType}
        revealed={revealed}
        options={{
          duration: animationDuration,
          ease: animationEase,
          sourceRect,
          sequenceContentFade,
        }}
        onComplete={handleOpenComplete}
        onReverseComplete={handleCloseComplete}
        className="modal__container"
      >
        <div ref={modalContainerRef} className="modal__container-inner">
          {/* Content wrapper - scrollable with GSAP smooth scroll */}
          <div ref={contentRef} className="modal__content">
            {/* Close button */}
            <button
              type="button"
              className="modal__close"
              onClick={handleClose}
              aria-label="Close modal"
              disabled={transitionPhase !== 'open'}
              data-effect="button-hover"
            >
              <CloseIcon />
            </button>

            {/* User content */}
            {config?.content}
          </div>
        </div>
      </RevealTransition>
    </div>,
    portalTarget || document.body
  )
})

export default Modal
export { default as ModalRoot } from './ModalRoot'
export { useModalStore, openModal, closeModal } from './store'
export type {
  ModalConfig,
  TransitionPhase,
  RevealType,
} from './types'
