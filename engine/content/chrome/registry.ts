/**
 * Chrome registry - maps component names to React components.
 * Content Layer (L1) - component lookup with meta support.
 *
 * Supports two registration modes:
 * 1. Eager: Component registered directly (current default)
 * 2. Lazy: Loader function registered, component loaded on demand
 */

import type { ComponentType } from 'react'
import type { ComponentMeta } from '../../schema/meta'

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Chrome props vary by type, registry lookup is untyped
type ChromeComponent = ComponentType<any>

/** Registry entry - either loaded component or lazy loader */
type RegistryEntry =
  | { type: 'loaded'; component: ChromeComponent; meta?: ComponentMeta }
  | { type: 'lazy'; meta: ComponentMeta; loader: () => Promise<ChromeComponent> }

/** Registry of chrome components by ID */
const registry = new Map<string, RegistryEntry>()

/**
 * Register a chrome component eagerly.
 */
export function registerChromeComponent(
  id: string,
  component: ChromeComponent,
  meta?: ComponentMeta
): void {
  if (registry.has(id)) {
    console.warn(`Chrome component "${id}" is already registered. Overwriting.`)
  }
  registry.set(id, { type: 'loaded', component, meta })
}

/**
 * Register a chrome component lazily with metadata.
 * Component code loads only when getChromeComponentAsync() is called.
 */
export function registerLazyChromeComponent(
  meta: ComponentMeta,
  loader: () => Promise<ChromeComponent>
): void {
  if (registry.has(meta.id)) {
    console.warn(`Chrome component "${meta.id}" is already registered. Overwriting.`)
  }
  registry.set(meta.id, { type: 'lazy', meta, loader })
}

/**
 * Get a chrome component by name (sync).
 * Returns undefined for lazy components that haven't loaded yet.
 */
export function getChromeComponent(name: string): ChromeComponent | undefined {
  const entry = registry.get(name)
  if (!entry) return undefined
  if (entry.type === 'loaded') return entry.component
  return undefined // Lazy not yet loaded
}

/**
 * Get a chrome component by name (async to support lazy loading).
 * Loads and caches lazy components on first access.
 */
export async function getChromeComponentAsync(name: string): Promise<ChromeComponent | undefined> {
  const entry = registry.get(name)
  if (!entry) return undefined

  if (entry.type === 'loaded') {
    return entry.component
  }

  // Lazy: load and cache
  const component = await entry.loader()
  registry.set(name, { type: 'loaded', component, meta: entry.meta })
  return component
}

/**
 * Get all chrome component metadata (without loading lazy components).
 */
export function getAllChromeMetas(): ComponentMeta[] {
  return Array.from(registry.values())
    .map((entry) => {
      if (entry.type === 'loaded') return entry.meta
      return entry.meta
    })
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
// Eager registrations (chrome components are always needed)
// =============================================================================

import Footer from './regions/Footer'
import { meta as footerMeta } from './regions/Footer/meta'
import Header from './regions/Header'
import { meta as headerMeta } from './regions/Header/meta'
import CursorLabel from './overlays/CursorLabel'
import { meta as cursorLabelMeta } from './overlays/CursorLabel/meta'
import { ModalRoot } from './overlays/Modal'
import { meta as modalMeta } from './overlays/Modal/meta'
import SlideIndicators from './overlays/SlideIndicators'
import { meta as slideIndicatorsMeta } from './overlays/SlideIndicators/meta'
import NavTimeline from './overlays/NavTimeline'
import { meta as navTimelineMeta } from './overlays/NavTimeline/meta'
import IntroOverlay from './overlays/IntroOverlay'
import { meta as introOverlayMeta } from './overlays/IntroOverlay/meta'

registerChromeComponent('Footer', Footer, footerMeta)
registerChromeComponent('Header', Header, headerMeta)
registerChromeComponent('CursorLabel', CursorLabel, cursorLabelMeta)
registerChromeComponent('ModalRoot', ModalRoot, modalMeta)
registerChromeComponent('SlideIndicators', SlideIndicators, slideIndicatorsMeta)
registerChromeComponent('NavTimeline', NavTimeline, navTimelineMeta)
registerChromeComponent('IntroOverlay', IntroOverlay, introOverlayMeta)
