'use client'

/**
 * ThemeProvider - Injects theme CSS variables at document root.
 * Handles scrollbar, colors, and other global visual tokens.
 */

import type { ThemeSchema } from '../schema'
import { useThemeVariables } from './hooks/useThemeVariables'

interface ThemeProviderProps {
  theme?: ThemeSchema
  children: React.ReactNode
}

export function ThemeProvider({ theme, children }: ThemeProviderProps): React.ReactNode {
  useThemeVariables(theme)
  return <>{children}</>
}
