'use client'

/**
 * IntroContentGate - controls content opacity during intro.
 *
 * Extracted as standalone component so it can be placed INSIDE
 * SmoothScrollProvider's #smooth-content div. This prevents the
 * opacity < 1 wrapper from creating a CSS containing block around
 * ScrollSmoother's position: fixed #smooth-wrapper.
 *
 * For sequence patterns: opacity = 0 before contentFadeStep, fades with
 * stepProgress at that step, 1 after.
 *
 * Always renders a stable wrapper div to avoid DOM re-parenting when intro
 * completes. When opacity is 1, no inline style is applied — no stacking context.
 */

import { useEffect, useSyncExternalStore, type ReactNode, type CSSProperties } from 'react'
import { useIntro } from './IntroContext'

// SSR-safe subscription
const subscribeNoop = () => () => {}

export interface IntroContentGateProps {
  /** Pattern-specific settings (contentFadeStep, contentVisible) */
  settings?: Record<string, unknown>
  children: ReactNode
}

export function IntroContentGate({ settings, children }: IntroContentGateProps): ReactNode {
  const intro = useIntro()

  const contentFadeStep = (settings?.contentFadeStep as number) ?? 1

  // Server snapshots read from the store (same as client) — the store exists during
  // SSR because IntroProvider creates it in useMemo. This prevents the SSR HTML from
  // rendering content as "completed" (visible) when an intro is active, which would
  // cause a blink: server paints visible → hydration corrects to hidden.
  const introCompleted = useSyncExternalStore(
    intro?.store.subscribe ?? subscribeNoop,
    () => intro?.store.getState().introCompleted ?? true,
    () => intro?.store.getState().introCompleted ?? true,
  )
  const currentStep = useSyncExternalStore(
    intro?.store.subscribe ?? subscribeNoop,
    () => intro?.store.getState().currentStep ?? 0,
    () => intro?.store.getState().currentStep ?? 0,
  )
  const stepProgress = useSyncExternalStore(
    intro?.store.subscribe ?? subscribeNoop,
    () => intro?.store.getState().stepProgress ?? 0,
    () => intro?.store.getState().stepProgress ?? 0,
  )

  // contentVisible: skip opacity gating (e.g. video-gate where video IS the intro)
  const contentVisible = (settings?.contentVisible as boolean) ?? false

  // Also propagate --intro-complete to document root for portalled content
  // (e.g., pinned sections in backdrop escape this wrapper's CSS cascade)
  useEffect(() => {
    if (!intro) return
    document.documentElement.style.setProperty('--intro-complete', introCompleted ? '1' : '0')
    return () => {
      document.documentElement.style.removeProperty('--intro-complete')
    }
  }, [intro, introCompleted])

  // No intro active — render children directly (no wrapper div needed)
  if (!intro) {
    return <>{children}</>
  }

  // Compute content opacity
  let contentOpacity: number
  if (contentVisible || introCompleted || currentStep > contentFadeStep) {
    contentOpacity = 1
  } else if (currentStep === contentFadeStep) {
    contentOpacity = stepProgress
  } else {
    contentOpacity = 0
  }

  // Build wrapper style:
  // - opacity for content gating (only when < 1 to avoid stacking context)
  // - --intro-complete CSS variable bridge for L1 widgets (e.g., Hero title layout intro-gated text)
  //   Set here (not on siteContainer) so it's a direct ancestor — no inheritance chain issues.
  const gateStyle: CSSProperties | undefined = (() => {
    const s: Record<string, string | number> = {
      '--intro-complete': introCompleted ? '1' : '0',
    }
    if (contentOpacity < 1) s.opacity = contentOpacity
    return s as CSSProperties
  })()

  // Always render wrapper div to avoid DOM re-parenting (which triggers ScrollSmoother recalc).
  return (
    <div style={gateStyle}>
      {children}
    </div>
  )
}
