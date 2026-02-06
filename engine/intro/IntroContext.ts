'use client'

/**
 * Intro context - provides intro state and pattern to consumers.
 */

import { createContext, useContext } from 'react'
import type { StoreApi } from 'zustand'
import type { IntroState, IntroActions, IntroPattern } from './types'

/**
 * Combined store type with state and actions.
 */
export type IntroStore = IntroState & IntroActions

/**
 * Context value provided by IntroProvider.
 */
export interface IntroContextValue {
  /** The intro pattern being used */
  pattern: IntroPattern
  /** Zustand store for intro state */
  store: StoreApi<IntroStore>
}

/**
 * React context for intro state.
 * null when no intro is configured.
 */
export const IntroContext = createContext<IntroContextValue | null>(null)

/**
 * Hook to access intro context.
 * Returns null if no IntroProvider in tree.
 * Use this to check if intro is active.
 */
export function useIntro(): IntroContextValue | null {
  return useContext(IntroContext)
}

/**
 * Hook to access intro context, throws if not available.
 * Use when intro is required.
 */
export function useIntroRequired(): IntroContextValue {
  const context = useContext(IntroContext)
  if (!context) {
    throw new Error('useIntroRequired must be used within IntroProvider')
  }
  return context
}
