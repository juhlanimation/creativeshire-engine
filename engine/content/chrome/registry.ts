/**
 * Chrome registry - maps component names to React components.
 * Content Layer (L1) - component lookup with meta support.
 *
 * Only overlay components are registered here (they need React state).
 * Regions use widget-based patterns (factory functions → WidgetSchema).
 */

import type { ComponentType } from 'react'
import type { ComponentMeta } from '../../schema/meta'

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Chrome props vary by type, registry lookup is untyped
type ChromeComponent = ComponentType<any>

/** Registry entry */
interface RegistryEntry {
  component: ChromeComponent
  meta?: ComponentMeta
}

/** Registry of chrome components by ID */
const registry = new Map<string, RegistryEntry>()

/**
 * Register a chrome component.
 */
export function registerChromeComponent(
  id: string,
  component: ChromeComponent,
  meta?: ComponentMeta
): void {
  if (registry.has(id)) {
    console.warn(`Chrome component "${id}" is already registered. Overwriting.`)
  }
  registry.set(id, { component, meta })
}

/**
 * Get a chrome component by name.
 */
export function getChromeComponent(name: string): ChromeComponent | undefined {
  return registry.get(name)?.component
}

/**
 * Get all chrome component metadata.
 */
export function getAllChromeMetas(): ComponentMeta[] {
  return Array.from(registry.values())
    .map((e) => e.meta)
    .filter((meta): meta is ComponentMeta => meta !== undefined)
}

/**
 * Get all registered chrome component IDs.
 */
export function getChromeComponentIds(): string[] {
  return Array.from(registry.keys())
}

/**
 * Ensures all chrome components are registered.
 * Call at engine entry point to guarantee registration before lookups.
 */
export function ensureChromeRegistered(): void {
  // Eager registrations already ran on import below.
  // This function exists so bundlers don't tree-shake them.
}

// =============================================================================
// Eager registrations (overlay components — need React state)
// =============================================================================

import CursorLabel from './overlays/CursorLabel'
import { meta as cursorLabelMeta } from './overlays/CursorLabel/meta'
import { ModalRoot } from './overlays/Modal'
import { meta as modalMeta } from './overlays/Modal/meta'
import SlideIndicators from './overlays/SlideIndicators'
import { meta as slideIndicatorsMeta } from './overlays/SlideIndicators/meta'
import NavTimeline from './overlays/NavTimeline'
import { meta as navTimelineMeta } from './overlays/NavTimeline/meta'
import FixedCard from './overlays/FixedCard'
import { meta as fixedCardMeta } from './overlays/FixedCard/meta'

registerChromeComponent('CursorLabel', CursorLabel, cursorLabelMeta)
registerChromeComponent('ModalRoot', ModalRoot, modalMeta)
registerChromeComponent('SlideIndicators', SlideIndicators, slideIndicatorsMeta)
registerChromeComponent('NavTimeline', NavTimeline, navTimelineMeta)
registerChromeComponent('FixedCard', FixedCard, fixedCardMeta)
