'use client'

/**
 * IntroOverlay - chrome overlay for intro sequences.
 *
 * Renders a full-screen overlay during intro phase. Children (e.g. TextMask)
 * are shown during the intro and fade out via step-driven opacity.
 *
 * Two-layer model:
 * 1. Background layer (solid maskColor) — fades at bgFadeStep, revealing
 *    content through TextMask cutouts
 * 2. Overlay layer (TextMask) — fades at overlayFadeStep
 *
 * SSR-safe: renders in server HTML with full opacity (no flash).
 * Unmounts after intro completes to remove from DOM entirely.
 */

import { memo, useSyncExternalStore } from 'react'
import { useIntro } from '../../../../intro/IntroContext'
import TextMask from '../../../widgets/interactive/TextMask'
import type { IntroOverlayProps } from './types'

// SSR-safe subscriptions
const subscribeNoop = () => () => {}

const IntroOverlay = memo(function IntroOverlay({
  text = '',
  maskColor = 'black',
  fontSize = '25vw',
  fontWeight = 900,
  fontFamily,
  letterSpacing,
  bgFadeStep = 1,
  overlayFadeStep = 2,
}: IntroOverlayProps) {
  const introCtx = useIntro()

  // Subscribe to intro store for completion state
  // SSR snapshot: false (overlay renders during SSR — no flash)
  const introCompleted = useSyncExternalStore(
    introCtx?.store.subscribe ?? subscribeNoop,
    () => introCtx?.store.getState().introCompleted ?? true,
    () => false,
  )

  // Subscribe to step state for opacity computation
  const currentStep = useSyncExternalStore(
    introCtx?.store.subscribe ?? subscribeNoop,
    () => introCtx?.store.getState().currentStep ?? 0,
    () => 0,
  )
  const stepProgress = useSyncExternalStore(
    introCtx?.store.subscribe ?? subscribeNoop,
    () => introCtx?.store.getState().stepProgress ?? 0,
    () => 0,
  )

  // Background opacity: 1 before bgFadeStep, fades during bgFadeStep, 0 after
  let bgOpacity = 1
  if (currentStep > bgFadeStep) {
    bgOpacity = 0
  } else if (currentStep === bgFadeStep) {
    bgOpacity = 1 - stepProgress
  }

  // Overlay opacity: 1 before overlayFadeStep, fades during overlayFadeStep, 0 after
  let overlayOpacity = 1
  if (currentStep > overlayFadeStep) {
    overlayOpacity = 0
  } else if (currentStep === overlayFadeStep) {
    overlayOpacity = 1 - stepProgress
  }

  // Don't render if no intro context, intro completed, or no text
  if (!introCtx || introCompleted || !text) {
    return null
  }

  return (
    <div
      className="intro-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        pointerEvents: 'none',
        opacity: overlayOpacity,
      }}
    >
      {/* Background layer — solid color behind TextMask, fades to reveal content through cutouts */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: maskColor,
          opacity: bgOpacity,
        }}
      />
      <TextMask
        text={text}
        maskColor={maskColor}
        fontSize={fontSize}
        fontWeight={fontWeight}
        fontFamily={fontFamily}
        letterSpacing={letterSpacing}
      />
    </div>
  )
})

export default IntroOverlay
