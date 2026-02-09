'use client'

/**
 * IntroProvider - manages intro state, scroll locking, overlay, and content gate.
 *
 * Wraps ExperienceProvider in the hierarchy:
 * ThemeProvider -> IntroProvider -> ExperienceProvider -> ...
 *
 * Renders two layers when an overlay is configured:
 * 1. Overlay component (rendered FIRST, covers viewport)
 * 2. Content gate (wraps children, controls content opacity)
 *
 * L1/L2 boundary: IntroProvider (L2) does NOT import overlay components.
 * It receives the resolved React component via props from SiteRenderer.
 */

import { useMemo, useEffect, useSyncExternalStore, type ReactNode, type ComponentType } from 'react'
import { createStore, type StoreApi } from 'zustand'
import { useContainer } from '../interface/ContainerContext'
import { useSiteContainer } from '../renderer/SiteContainerContext'
import { IntroContext, type IntroStore } from './IntroContext'
import { IntroTriggerInitializer } from './IntroTriggerInitializer'
import type { IntroPattern, IntroPhase, IntroState } from './types'

export interface IntroProviderProps {
  /** Intro pattern to use (null for no intro) */
  pattern: IntroPattern | null
  /** Pattern-specific settings */
  settings?: Record<string, unknown>
  /** Resolved overlay React component (from chrome registry) */
  overlayComponent?: ComponentType<Record<string, unknown>> | null
  /** Props for the overlay component */
  overlayProps?: Record<string, unknown>
  /** Children to render */
  children: ReactNode
}

/**
 * Default intro state.
 */
const DEFAULT_STATE: IntroState = {
  phase: 'locked',
  videoTime: 0,
  timerElapsed: 0,
  revealProgress: 0,
  currentStep: 0,
  stepProgress: 0,
  isScrollLocked: true,
  chromeVisible: false,
  introCompleted: false,
}

/**
 * Create intro store with actions.
 * @param lockScroll - Whether to lock scroll during intro (default: true)
 */
function createIntroStore(pattern: IntroPattern | null, lockScroll = true): StoreApi<IntroStore> {
  // If no pattern, start in ready state (no intro)
  const initialState: IntroState = pattern
    ? { ...DEFAULT_STATE, chromeVisible: !pattern.hideChrome, isScrollLocked: lockScroll }
    : {
        ...DEFAULT_STATE,
        phase: 'ready',
        isScrollLocked: false,
        chromeVisible: true,
        introCompleted: true,
      }

  return createStore<IntroStore>((set) => ({
    ...initialState,

    setPhase: (phase: IntroPhase) =>
      set(() => {
        // Update related state based on phase
        if (phase === 'revealing') {
          return { phase, isScrollLocked: false }
        }
        if (phase === 'ready') {
          return {
            phase,
            isScrollLocked: false,
            chromeVisible: true,
            introCompleted: true,
            revealProgress: 1,
          }
        }
        return { phase }
      }),

    setVideoTime: (videoTime: number) => set({ videoTime }),

    setTimerElapsed: (timerElapsed: number) => set({ timerElapsed }),

    setRevealProgress: (revealProgress: number) => set({ revealProgress }),

    setCurrentStep: (currentStep: number) => set({ currentStep }),

    setStepProgress: (stepProgress: number) => set({ stepProgress }),

    setScrollLocked: (isScrollLocked: boolean) => set({ isScrollLocked }),

    setChromeVisible: (chromeVisible: boolean) => set({ chromeVisible }),

    completeIntro: () =>
      set({
        phase: 'ready',
        isScrollLocked: false,
        chromeVisible: true,
        introCompleted: true,
        revealProgress: 1,
      }),
  }))
}

/**
 * IntroContentGate - wraps children and controls content opacity during intro.
 *
 * For sequence patterns: opacity = 0 before contentFadeStep, fades with
 * stepProgress at that step, 1 after.
 *
 * Always renders a stable wrapper div to avoid DOM re-parenting when intro
 * completes (which would trigger ScrollSmoother recalculation and layout jump).
 * When opacity is 1, no inline style is applied — no stacking context.
 * SSR: renders with opacity: 0 (content hidden from first paint).
 */
function IntroContentGate({
  store,
  settings,
  children,
}: {
  store: StoreApi<IntroStore>
  settings?: Record<string, unknown>
  children: ReactNode
}) {
  const contentFadeStep = (settings?.contentFadeStep as number) ?? 1

  const introCompleted = useSyncExternalStore(
    store.subscribe,
    () => store.getState().introCompleted,
    () => false,
  )
  const currentStep = useSyncExternalStore(
    store.subscribe,
    () => store.getState().currentStep,
    () => 0,
  )
  const stepProgress = useSyncExternalStore(
    store.subscribe,
    () => store.getState().stepProgress,
    () => 0,
  )

  // Compute content opacity
  let contentOpacity: number
  if (introCompleted || currentStep > contentFadeStep) {
    contentOpacity = 1
  } else if (currentStep === contentFadeStep) {
    contentOpacity = stepProgress
  } else {
    contentOpacity = 0
  }

  // Always render wrapper div to avoid DOM re-parenting (which triggers ScrollSmoother recalc).
  // When opacity is 1, pass no inline style — no stacking context, no layout impact.
  return (
    <div style={contentOpacity < 1 ? { opacity: contentOpacity } : undefined}>
      {children}
    </div>
  )
}

/**
 * IntroProvider component.
 * Manages intro state, scroll locking, overlay rendering, and content gating.
 */
export function IntroProvider({
  pattern,
  settings,
  overlayComponent: OverlayComponent,
  overlayProps,
  children,
}: IntroProviderProps): ReactNode {
  // Resolve lockScroll setting (default: true)
  const lockScroll = (settings?.lockScroll as boolean) ?? true

  // Container-aware scroll locking
  const { mode, containerRef } = useContainer()
  const { siteContainer } = useSiteContainer()

  // Create store (memoized)
  const store = useMemo(() => createIntroStore(pattern, lockScroll), [pattern, lockScroll])

  // Apply scroll locking (container-aware)
  // In contained mode, use containerRef; in fullpage mode, use siteContainer
  // Never use document.body - breaks iframe/container support
  useEffect(() => {
    // Resolve scroll target: container element in contained mode, site container in fullpage
    const resolveScrollTarget = (): HTMLElement | null => {
      if (mode === 'contained' && containerRef?.current) {
        return containerRef.current
      }
      return siteContainer
    }

    const scrollTarget = resolveScrollTarget()

    // Skip if no scroll target yet (SSR or before mount)
    if (!scrollTarget) return

    // Subscribe to scroll lock changes
    const unsubscribe = store.subscribe((state) => {
      const target = resolveScrollTarget()
      if (target) {
        target.style.overflow = state.isScrollLocked ? 'hidden' : ''
      }
    })

    // Apply initial state
    if (store.getState().isScrollLocked) {
      scrollTarget.style.overflow = 'hidden'
    }

    // Cleanup
    return () => {
      unsubscribe()
      scrollTarget.style.overflow = ''
    }
  }, [store, mode, containerRef, siteContainer])

  // If no pattern, render children directly (no context overhead)
  if (!pattern) {
    return <>{children}</>
  }

  return (
    <IntroContext.Provider value={{ pattern, store }}>
      {/* Overlay renders FIRST, outside content tree, covers viewport */}
      {OverlayComponent && (
        <OverlayComponent {...(overlayProps ?? {})} />
      )}
      <IntroTriggerInitializer
        pattern={pattern}
        store={store}
        settings={settings}
      >
        {/* Content gate controls content opacity during intro */}
        <IntroContentGate store={store} settings={settings}>
          {children}
        </IntroContentGate>
      </IntroTriggerInitializer>
    </IntroContext.Provider>
  )
}

export default IntroProvider
