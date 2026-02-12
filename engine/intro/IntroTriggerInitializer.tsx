'use client'

/**
 * IntroTriggerInitializer - sets up triggers based on gate type.
 *
 * Initializes the correct trigger hooks (video-time, timer, etc.)
 * based on the resolved gate type from IntroConfig.pattern.
 */

import { type ReactNode } from 'react'
import type { IntroStore } from './IntroContext'
import type { StoreApi } from 'zustand'
import { useVideoTime } from './triggers/useVideoTime'
import { useTimer } from './triggers/useTimer'
import { useSequence } from './triggers/useSequence'
import { usePhaseController } from './triggers/usePhaseController'
import type { SequenceStepConfig } from './types'

/** Gate type for trigger wiring */
type GateType = 'video-time' | 'timer' | 'sequence' | 'none'

export interface IntroTriggerInitializerProps {
  /** Gate type that determines which trigger drives the reveal */
  gate: GateType
  /** Reveal animation duration (ms) */
  revealDuration: number
  /** The intro store */
  store: StoreApi<IntroStore>
  /** Pattern settings */
  settings?: Record<string, unknown>
  /** Children to render */
  children: ReactNode
}

/**
 * Initializes triggers based on gate type.
 */
export function IntroTriggerInitializer({
  gate,
  revealDuration,
  store,
  settings,
  children,
}: IntroTriggerInitializerProps): ReactNode {
  // Set up phase controller
  const { triggerReveal } = usePhaseController(store, { revealDuration, hasBlockingGate: gate !== 'none' })

  // Video time trigger
  const videoSelector = (settings?.source as string) ?? '[data-intro-video]'
  useVideoTime(store, {
    selector: videoSelector,
    targetTime: (settings?.targetTime as number) ?? 3,
    onTargetReached: gate === 'video-time' ? triggerReveal : undefined,
  })

  // Timer trigger
  useTimer(store, {
    duration: (settings?.duration as number) ?? 2000,
    enabled: gate === 'timer',
    onComplete: gate === 'timer' ? triggerReveal : undefined,
  })

  // Sequence trigger
  useSequence(store, {
    steps: (settings?.steps as SequenceStepConfig[]) ?? [],
    enabled: gate === 'sequence',
    onComplete: gate === 'sequence' ? triggerReveal : undefined,
  })

  return <>{children}</>
}
