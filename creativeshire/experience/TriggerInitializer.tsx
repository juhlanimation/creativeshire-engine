'use client'

/**
 * TriggerInitializer - orchestrates all experience triggers.
 *
 * Place this component in the provider hierarchy (after ExperienceProvider).
 * It initializes all triggers that write browser events to the store.
 *
 * Architecture:
 * Browser Event → Triggers → Store → Behaviours → CSS Variables
 */

import type { ReactNode } from 'react'
import { useExperience } from './ExperienceProvider'
import {
  useScrollProgress,
  useIntersection,
  usePrefersReducedMotion,
  useViewport,
} from './triggers'

export interface TriggerInitializerProps {
  children: ReactNode
}

/**
 * TriggerInitializer component.
 * Initializes all experience triggers that write to the store.
 *
 * Triggers:
 * - useScrollProgress: scroll position (0-1)
 * - useIntersection: section visibility ratios
 * - usePrefersReducedMotion: a11y motion preference
 * - useViewport: viewport dimensions
 */
export function TriggerInitializer({ children }: TriggerInitializerProps): ReactNode {
  const { store } = useExperience()

  // Initialize all triggers
  useScrollProgress({ store })
  useIntersection({ store })
  usePrefersReducedMotion({ store })
  useViewport({ store })

  return children
}

export default TriggerInitializer
