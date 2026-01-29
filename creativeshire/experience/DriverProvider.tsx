'use client'

/**
 * DriverProvider - distributes driver context.
 * Experience Layer (L2) - manages driver lifecycle and context.
 */

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Driver } from './drivers/types'
import { VisibilityDriver } from './drivers/VisibilityDriver'
import { useExperience } from './ExperienceProvider'

/**
 * Driver context for driver distribution.
 */
const DriverContext = createContext<VisibilityDriver | null>(null)

/**
 * Hook to access driver context.
 * Throws if used outside of DriverProvider.
 */
export function useDriver(): VisibilityDriver {
  const driver = useContext(DriverContext)
  if (!driver) {
    throw new Error('useDriver must be used within a DriverProvider')
  }
  return driver
}

/**
 * Props for DriverProvider component.
 */
export interface DriverProviderProps {
  children: ReactNode
}

/**
 * DriverProvider component.
 * Wraps app tree to provide driver context.
 * Creates VisibilityDriver instance that tracks section visibility.
 *
 * @param children - Child components
 */
export function DriverProvider({ children }: DriverProviderProps): ReactNode {
  const { store } = useExperience()
  const [driver, setDriver] = useState<VisibilityDriver | null>(null)

  useEffect(() => {
    const d = new VisibilityDriver(store)
    d.start()
    // Valid initialization pattern - setState on mount to trigger re-render with driver
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDriver(d)

    return () => {
      d.destroy()
    }
  }, [store])

  if (!driver) {
    return null
  }

  return (
    <DriverContext.Provider value={driver}>
      {children}
    </DriverContext.Provider>
  )
}

export default DriverProvider
