'use client'

/**
 * IntroProvider - manages intro state, scroll locking, and overlay.
 *
 * Wraps ExperienceProvider in the hierarchy:
 * ThemeProvider -> IntroProvider -> ExperienceProvider -> ...
 *
 * Content gating (opacity fade) is handled by IntroContentGate,
 * placed inside SmoothScrollProvider's #smooth-content to avoid
 * the CSS containing block issue (opacity < 1 breaks position: fixed).
 *
 * L1/L2 boundary: IntroProvider (L2) does NOT import overlay components.
 * It receives the resolved React component via props from SiteRenderer.
 */

import { useMemo, useEffect, type ReactNode, type ComponentType } from 'react'
import { createStore, type StoreApi } from 'zustand'
import { useScrollLock } from '../experience/drivers/ScrollLockContext'
import { IntroContext, type IntroStore } from './IntroContext'
import { IntroTriggerInitializer } from './IntroTriggerInitializer'
import type { IntroConfig, IntroPhase, IntroState } from './types'

export interface IntroProviderProps {
  /** Intro config to use (null for no intro) */
  config: IntroConfig | null
  /** Resolved overlay React component (from chrome registry) */
  overlayComponent?: ComponentType<Record<string, unknown>> | null
  /** Props for the overlay component */
  overlayProps?: Record<string, unknown>
  /** Children to render */
  children: ReactNode
}

// =============================================================================
// Config → Runtime Derivation
// =============================================================================

/** Gate type for trigger wiring */
type GateType = 'video-time' | 'timer' | 'sequence' | 'none'

/** Derive gate type from IntroConfig.pattern */
function resolveGateType(pattern: string): GateType {
  switch (pattern) {
    case 'video-gate': return 'video-time'
    case 'timed': return 'timer'
    case 'sequence-timed': return 'sequence'
    default: return 'none'
  }
}

/** Derive default revealDuration from pattern type */
function resolveRevealDuration(pattern: string, settings?: Record<string, unknown>): number {
  if (typeof settings?.revealDuration === 'number') return settings.revealDuration
  return pattern === 'scroll-reveal' ? 600 : 800
}

/** Derive hideChrome from pattern type */
function resolveHideChrome(pattern: string): boolean {
  return pattern !== 'scroll-reveal'
}

// =============================================================================
// Store
// =============================================================================

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
 * @param config - The intro config (null = no intro)
 * @param lockScroll - Whether to lock scroll during intro (default: true)
 */
function createIntroStore(config: IntroConfig | null, lockScroll = true): StoreApi<IntroStore> {
  // If no config, start in ready state (no intro)
  const initialState: IntroState = config
    ? { ...DEFAULT_STATE, chromeVisible: !resolveHideChrome(config.pattern), isScrollLocked: lockScroll }
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

// =============================================================================
// Provider
// =============================================================================

/**
 * IntroProvider component.
 * Manages intro state, scroll locking, overlay rendering, and content gating.
 */
export function IntroProvider({
  config,
  overlayComponent: OverlayComponent,
  overlayProps,
  children,
}: IntroProviderProps): ReactNode {
  // Resolve lockScroll setting (default: true)
  const lockScroll = (config?.settings?.lockScroll as boolean) ?? true

  // Create store (memoized)
  const store = useMemo(() => createIntroStore(config, lockScroll), [config, lockScroll])

  // Delegate scroll locking to generic ScrollLockContext.
  // IntroProvider still owns its isScrollLocked state — it just calls
  // lock('intro') / unlock('intro') on the shared service.
  const scrollLock = useScrollLock()

  useEffect(() => {
    if (!scrollLock) return

    const unsubscribe = store.subscribe((state, prev) => {
      if (state.isScrollLocked !== prev.isScrollLocked) {
        if (state.isScrollLocked) {
          scrollLock.lock('intro')
        } else {
          scrollLock.unlock('intro')
        }
      }
    })

    // Apply initial state
    if (store.getState().isScrollLocked) {
      scrollLock.lock('intro')
    }

    return () => {
      unsubscribe()
      scrollLock.unlock('intro')
    }
  }, [store, scrollLock])

  // Memo the context value. When config is non-null (the only case where
  // we provide the context), IntroConfig is guaranteed.
  const contextValue = useMemo(
    () => config ? { config, store } : null,
    [config, store],
  )

  // If no config, render children directly (no context overhead)
  if (!config || !contextValue) {
    return <>{children}</>
  }

  return (
    <IntroContext.Provider value={contextValue}>
      {/* Overlay renders FIRST, outside content tree, covers viewport */}
      {OverlayComponent && (
        <OverlayComponent {...(overlayProps ?? {})} />
      )}
      <IntroTriggerInitializer
        gate={resolveGateType(config.pattern)}
        revealDuration={resolveRevealDuration(config.pattern, config.settings)}
        store={store}
        settings={config.settings}
      >
        {children}
      </IntroTriggerInitializer>
    </IntroContext.Provider>
  )
}

export default IntroProvider
