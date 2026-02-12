'use client'

/**
 * IntroTriggerInitializer - sets up triggers based on pattern.
 *
 * Initializes the correct trigger hooks (video-time, timer, etc.)
 * based on the intro pattern's trigger configuration.
 */

import { type ReactNode } from 'react'
import type { IntroPattern } from './types'
import type { IntroStore } from './IntroContext'
import type { StoreApi } from 'zustand'
import { useVideoTime } from './triggers/useVideoTime'
import { useTimer } from './triggers/useTimer'
import { useSequence } from './triggers/useSequence'
import { usePhaseController } from './triggers/usePhaseController'
import type { SequenceStepConfig } from './types'

export interface IntroTriggerInitializerProps {
  /** The intro pattern */
  pattern: IntroPattern
  /** The intro store */
  store: StoreApi<IntroStore>
  /** Pattern settings */
  settings?: Record<string, unknown>
  /** Children to render */
  children: ReactNode
}

/**
 * Initializes triggers based on intro pattern.
 */
export function IntroTriggerInitializer({
  pattern,
  store,
  settings,
  children,
}: IntroTriggerInitializerProps): ReactNode {
  // Set up phase controller
  const { triggerReveal } = usePhaseController(store, { pattern, settings })

  // Check if pattern has a specific trigger type
  const hasTrigger = (type: string) =>
    pattern.triggers.some((t) => t.type === type)

  // Video time trigger
  // Selector priority: settings.source (element-ref picker) → trigger options → fallback
  const videoTrigger = pattern.triggers.find((t) => t.type === 'video-time')
  const videoSelector =
    (settings?.source as string) ??
    (videoTrigger?.options?.selector as string) ??
    '[data-intro-video]'
  useVideoTime(store, {
    selector: videoSelector,
    targetTime: (settings?.targetTime as number) ?? 3,
    onTargetReached: hasTrigger('video-time') ? triggerReveal : undefined,
  })

  // Timer trigger
  useTimer(store, {
    duration: (settings?.duration as number) ?? 2000,
    enabled: hasTrigger('timer'),
    onComplete: hasTrigger('timer') ? triggerReveal : undefined,
  })

  // Sequence trigger
  useSequence(store, {
    steps: (settings?.steps as SequenceStepConfig[]) ?? [],
    enabled: hasTrigger('sequence'),
    onComplete: hasTrigger('sequence') ? triggerReveal : undefined,
  })

  return <>{children}</>
}
