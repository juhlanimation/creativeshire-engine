/**
 * Chrome registry - maps component names to React components.
 * Content Layer (L1) - static component lookup.
 *
 * NOTE: Prefer widget-based overlays over component-based.
 * Widget-based: ChromeRenderer handles positioning, widget handles content.
 * Component-based: Legacy approach where component handles everything.
 *
 * See chrome.spec.md for the recommended widget-based pattern.
 */

import type { ComponentType } from 'react'
import Footer from './regions/Footer'
import CursorLabel from './overlays/CursorLabel'
import Modal from './overlays/Modal'

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Chrome props vary by type
type ChromeComponent = ComponentType<any>

/**
 * Registry mapping chrome component names to their implementations.
 *
 * Regions (Footer, Header, Sidebar): Component-based is fine, they're complex.
 * Overlays: Prefer widget-based approach via OverlaySchema.widget
 */
export const chromeRegistry: Record<string, ChromeComponent> = {
  Footer,
  CursorLabel,
  Modal,
}

/**
 * Retrieves a chrome component by name.
 * @param name - Component name (e.g., 'Footer')
 * @returns The chrome component or undefined if not found
 */
export function getChromeComponent(name: string): ChromeComponent | undefined {
  return chromeRegistry[name]
}
