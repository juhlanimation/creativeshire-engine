'use client'

/**
 * ThemeProvider - Injects theme CSS variables at document root.
 * Handles scrollbar, colors, and other global visual tokens.
 * Exposes colorTheme ID via context for per-section palette resolution.
 */

import { createContext, useContext } from 'react'
import type { ThemeSchema } from '../schema'
import { useThemeVariables } from './hooks/useThemeVariables'

interface ThemeContextValue {
  /** Active color theme ID (e.g., 'contrast', 'muted') */
  colorTheme?: string
}

const ThemeContext = createContext<ThemeContextValue>({})

/** Access the active color theme ID for per-section palette resolution. */
export function useThemeContext() {
  return useContext(ThemeContext)
}

interface ThemeProviderProps {
  theme?: ThemeSchema
  children: React.ReactNode
}

export function ThemeProvider({ theme, children }: ThemeProviderProps): React.ReactNode {
  useThemeVariables(theme)
  return (
    <ThemeContext.Provider value={{ colorTheme: theme?.colorTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
