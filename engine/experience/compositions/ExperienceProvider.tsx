'use client'

/**
 * ExperienceProvider - distributes experience and store context.
 * Experience Layer (L2) - provides state for behaviours and drivers.
 */

import { createContext, useContext, useMemo, type ReactNode } from 'react'
import type { ExperienceContextValue, ExperienceProviderProps } from './types'

/**
 * Experience context for experience and store distribution.
 */
const ExperienceContext = createContext<ExperienceContextValue | null>(null)

/**
 * Hook to access experience context.
 * Throws if used outside of ExperienceProvider.
 */
export function useExperience(): ExperienceContextValue {
  const context = useContext(ExperienceContext)
  if (!context) {
    throw new Error('useExperience must be used within an ExperienceProvider')
  }
  return context
}

/**
 * ExperienceProvider component.
 * Wraps app tree to provide experience and store context.
 *
 * @param experience - The experience configuration
 * @param store - The Zustand store instance
 * @param children - Child components
 */
export function ExperienceProvider({
  experience,
  store,
  children,
}: ExperienceProviderProps): ReactNode {
  const value = useMemo(
    () => ({ experience, store }),
    [experience, store],
  )
  return (
    <ExperienceContext.Provider value={value}>
      {children}
    </ExperienceContext.Provider>
  )
}

export default ExperienceProvider
