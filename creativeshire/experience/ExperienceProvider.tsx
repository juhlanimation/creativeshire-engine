'use client'

/**
 * ExperienceProvider - distributes mode and store context.
 * Experience Layer (L2) - provides state for behaviours and drivers.
 */

import { createContext, useContext, type ReactNode } from 'react'
import type { ExperienceContextValue, ExperienceProviderProps } from './types'

/**
 * Experience context for mode and store distribution.
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
 * Wraps app tree to provide mode and store context.
 *
 * @param mode - The mode configuration
 * @param store - The Zustand store instance
 * @param children - Child components
 */
export function ExperienceProvider({
  mode,
  store,
  children,
}: ExperienceProviderProps): ReactNode {
  return (
    <ExperienceContext.Provider value={{ mode, store }}>
      {children}
    </ExperienceContext.Provider>
  )
}

export default ExperienceProvider
