'use client'

/**
 * DriverProvider - distributes driver context.
 * Experience Layer (L2) - manages driver lifecycle and context.
 */

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Driver } from './drivers/types'
import { NoopDriver } from './drivers/NoopDriver'

/**
 * Driver context for driver distribution.
 */
const DriverContext = createContext<Driver | null>(null)

/**
 * Hook to access driver context.
 * Throws if used outside of DriverProvider.
 */
export function useDriver(): Driver {
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
 * Creates driver instance in useEffect for client-side only initialization.
 *
 * @param children - Child components
 */
export function DriverProvider({ children }: DriverProviderProps): ReactNode {
  const [driver, setDriver] = useState<Driver | null>(null)

  useEffect(() => {
    const d = new NoopDriver()
    d.start()
    setDriver(d)

    return () => {
      d.destroy()
    }
  }, [])

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
