'use client'

/**
 * SectionChrome context — provides per-section chrome widgets to SectionRenderer.
 * Resolution order:
 * 1. sectionChrome[sectionId] — if present (even empty []), use it
 * 2. sectionChrome['*'] — wildcard fallback for all sections
 * 3. Empty array — no sectionChrome at all
 */

import { createContext, useContext, type ReactNode } from 'react'
import type { WidgetSchema } from '../schema'

interface SectionChromeContextValue {
  sectionChrome?: Record<string, WidgetSchema[]>
}

const SectionChromeContext = createContext<SectionChromeContextValue>({})

interface SectionChromeProviderProps {
  sectionChrome?: Record<string, WidgetSchema[]>
  children: ReactNode
}

export function SectionChromeProvider({ sectionChrome, children }: SectionChromeProviderProps) {
  return (
    <SectionChromeContext.Provider value={{ sectionChrome }}>
      {children}
    </SectionChromeContext.Provider>
  )
}

/**
 * Get chrome widgets for a specific section.
 * Resolution: exact section ID → '*' wildcard → empty array.
 */
export function useSectionChrome(sectionId: string): WidgetSchema[] {
  const { sectionChrome } = useContext(SectionChromeContext)
  if (!sectionChrome) return []
  // Exact match takes priority (even empty array is intentional — means "no chrome for this section")
  if (sectionId in sectionChrome) return sectionChrome[sectionId]
  // Wildcard fallback
  if ('*' in sectionChrome) return sectionChrome['*']
  return []
}
