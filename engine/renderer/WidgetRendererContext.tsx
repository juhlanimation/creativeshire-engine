'use client'

/**
 * WidgetRendererContext
 *
 * Breaks the circular dependency between layout widgets and WidgetRenderer.
 *
 * Problem: registry.ts → Layout widgets → WidgetRenderer → registry.ts
 * Solution: WidgetRenderer provides itself via context. Layout widgets consume
 * the context instead of importing WidgetRenderer directly.
 *
 * This context is populated once by WidgetRenderer at the top of the render tree
 * (SiteRenderer wraps everything). Layout widgets call useWidgetRenderer() to
 * get the component reference without a direct import.
 */

import { createContext, useContext, type ComponentType } from 'react'
import type { WidgetRendererProps } from './types'

type WidgetRendererComponent = ComponentType<WidgetRendererProps>

const WidgetRendererContext = createContext<WidgetRendererComponent | null>(null)

/**
 * Provider that makes WidgetRenderer available to nested layout widgets.
 * Called once by SiteRenderer at the root.
 */
export function WidgetRendererProvider({
  renderer,
  children,
}: {
  renderer: WidgetRendererComponent
  children: React.ReactNode
}) {
  return (
    <WidgetRendererContext.Provider value={renderer}>
      {children}
    </WidgetRendererContext.Provider>
  )
}

/**
 * Hook for layout widgets to get WidgetRenderer without a direct import.
 * Throws if used outside of WidgetRendererProvider (should never happen
 * since SiteRenderer always provides it).
 */
export function useWidgetRenderer(): WidgetRendererComponent {
  const renderer = useContext(WidgetRendererContext)
  if (!renderer) {
    throw new Error(
      'useWidgetRenderer() called outside WidgetRendererProvider. ' +
      'Ensure SiteRenderer wraps all content.'
    )
  }
  return renderer
}
