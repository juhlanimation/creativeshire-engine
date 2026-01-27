/**
 * Chrome registry - maps component names to React components.
 * Content Layer (L1) - static component lookup.
 */

import type { ComponentType } from 'react'
import Footer from './regions/Footer'
import FloatingContact from './overlays/FloatingContact'

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Chrome props vary by type
type ChromeComponent = ComponentType<any>

/**
 * Registry mapping chrome component names to their implementations.
 */
export const chromeRegistry: Record<string, ChromeComponent> = {
  Footer,
  FloatingContact,
}

/**
 * Retrieves a chrome component by name.
 * @param name - Component name (e.g., 'Footer')
 * @returns The chrome component or undefined if not found
 */
export function getChromeComponent(name: string): ChromeComponent | undefined {
  return chromeRegistry[name]
}
