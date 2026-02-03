'use client'

/**
 * TriggerInitializer - orchestrates all experience triggers.
 *
 * Place this component in the provider hierarchy (after ExperienceProvider).
 * It initializes all triggers that write browser events to the store.
 *
 * Architecture:
 * Browser Event → Triggers → Store → Behaviours → CSS Variables
 *
 * Container-aware:
 * In contained mode (e.g., CMS canvas preview), triggers observe the container
 * element instead of the window/document.
 */

import type { ReactNode } from 'react'
import { useExperience } from '../experiences'
import { useContainer } from '../../interface/ContainerContext'
import {
  useScrollProgress,
  useIntersection,
  usePrefersReducedMotion,
  useViewport,
  useCursorPosition,
} from './'

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
 * - useCursorPosition: cursor x, y coordinates
 */
export function TriggerInitializer({ children }: TriggerInitializerProps): ReactNode {
  const { store } = useExperience()
  const { mode: containerMode, containerRef } = useContainer()

  // Initialize all triggers with container context
  useScrollProgress({ store, containerMode, containerRef })
  useIntersection({ store, containerMode, containerRef })
  usePrefersReducedMotion({ store })
  useViewport({ store, containerMode, containerRef })
  useCursorPosition({ store, containerMode, containerRef })

  return children
}

export default TriggerInitializer
