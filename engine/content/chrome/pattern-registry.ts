/**
 * Chrome pattern registry.
 * Registers all chrome patterns for platform discovery and uniqueness validation.
 *
 * Note: This registry only imports metadata at module load time.
 * Factory functions are imported lazily to avoid pulling in renderer dependencies
 * during architecture tests.
 */

import type { ChromePatternMeta, ChromeSlot } from '../../schema/meta'
import type { PresetRegionConfig, PresetOverlayConfig } from '../../presets/types'

// Import chrome pattern metas only (safe - no renderer dependencies)
import { meta as MinimalNavMeta } from './patterns/MinimalNav/meta'
import { meta as FixedNavMeta } from './patterns/FixedNav/meta'
import { meta as CenteredNavMeta } from './patterns/CenteredNav/meta'
import { meta as ContactFooterMeta } from './patterns/ContactFooter/meta'
import { meta as BrandFooterMeta } from './patterns/BrandFooter/meta'
import { meta as CursorTrackerMeta } from './patterns/CursorTracker/meta'
import { meta as FloatingContactMeta } from './patterns/FloatingContact/meta'
import { meta as VideoModalMeta } from './patterns/VideoModal/meta'
import { meta as GlassNavMeta } from './patterns/GlassNav/meta'
import { meta as ColumnFooterMeta } from './patterns/ColumnFooter/meta'
import { meta as HaubjergNavMeta } from './patterns/HaubjergNav/meta'

// =============================================================================
// Types
// =============================================================================

type ChromePatternOutput = PresetRegionConfig | PresetOverlayConfig

/**
 * Registry entry for a chrome pattern.
 * Factory is provided as a getter to enable lazy loading.
 */
export interface ChromePatternEntry<T = unknown> {
  meta: ChromePatternMeta<T>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getFactory: () => Promise<(props: any) => ChromePatternOutput>
}

// =============================================================================
// Registry
// =============================================================================

export const chromePatternRegistry: Record<string, ChromePatternEntry> = {
  MinimalNav: {
    meta: MinimalNavMeta as ChromePatternMeta,
    getFactory: async () => (await import('./patterns/MinimalNav')).createMinimalNavRegion,
  },
  FixedNav: {
    meta: FixedNavMeta as ChromePatternMeta,
    getFactory: async () => (await import('./patterns/FixedNav')).createFixedNavRegion,
  },
  CenteredNav: {
    meta: CenteredNavMeta as ChromePatternMeta,
    getFactory: async () => (await import('./patterns/CenteredNav')).createCenteredNavRegion,
  },
  ContactFooter: {
    meta: ContactFooterMeta as ChromePatternMeta,
    getFactory: async () => (await import('./patterns/ContactFooter')).createContactFooterRegion,
  },
  BrandFooter: {
    meta: BrandFooterMeta as ChromePatternMeta,
    getFactory: async () => (await import('./patterns/BrandFooter')).createBrandFooterRegion,
  },
  CursorTracker: {
    meta: CursorTrackerMeta as ChromePatternMeta,
    getFactory: async () => (await import('./patterns/CursorTracker')).createCursorTrackerOverlay,
  },
  FloatingContact: {
    meta: FloatingContactMeta as ChromePatternMeta,
    getFactory: async () => (await import('./patterns/FloatingContact')).createFloatingContactRegion,
  },
  VideoModal: {
    meta: VideoModalMeta as ChromePatternMeta,
    getFactory: async () => (await import('./patterns/VideoModal')).createVideoModalOverlay,
  },
  GlassNav: {
    meta: GlassNavMeta as ChromePatternMeta,
    getFactory: async () => (await import('./patterns/GlassNav')).createGlassNavRegion,
  },
  ColumnFooter: {
    meta: ColumnFooterMeta as ChromePatternMeta,
    getFactory: async () => (await import('./patterns/ColumnFooter')).createColumnFooterRegion,
  },
  HaubjergNav: {
    meta: HaubjergNavMeta as ChromePatternMeta,
    getFactory: async () => (await import('./patterns/HaubjergNav')).createHaubjergNavRegion,
  },
}

// =============================================================================
// Query Functions
// =============================================================================

export function getChromePattern(id: string): ChromePatternEntry | undefined {
  return chromePatternRegistry[id]
}

export function getAllChromePatternMetas(): ChromePatternMeta[] {
  return Object.values(chromePatternRegistry).map((entry) => entry.meta)
}

export function getChromePatternsBySlot(slot: ChromeSlot): ChromePatternMeta[] {
  return getAllChromePatternMetas().filter((meta) => meta.chromeSlot === slot)
}

export function getOverlayPatternMetas(): ChromePatternMeta[] {
  return getAllChromePatternMetas().filter((meta) => meta.chromeSlot === null)
}

export function getUniqueSlots(): ChromeSlot[] {
  return ['header', 'footer']
}

// =============================================================================
// Typed Factory Helpers
// =============================================================================

// Re-export typed factory functions for type-safe usage
export { createMinimalNavRegion } from './patterns/MinimalNav'
export { createFixedNavRegion } from './patterns/FixedNav'
export { createCenteredNavRegion } from './patterns/CenteredNav'
export { createContactFooterRegion } from './patterns/ContactFooter'
export { createBrandFooterRegion } from './patterns/BrandFooter'
export { createCursorTrackerOverlay } from './patterns/CursorTracker'
export { createFloatingContactRegion } from './patterns/FloatingContact'
export { createVideoModalOverlay } from './patterns/VideoModal'
export { createGlassNavRegion } from './patterns/GlassNav'
export { createColumnFooterRegion } from './patterns/ColumnFooter'
export { createHaubjergNavRegion } from './patterns/HaubjergNav'

// Re-export types for convenience
export type { MinimalNavProps } from './patterns/MinimalNav/types'
export type { FixedNavProps } from './patterns/FixedNav/types'
export type { CenteredNavProps } from './patterns/CenteredNav/types'
export type { ContactFooterProps } from './patterns/ContactFooter/types'
export type { BrandFooterProps } from './patterns/BrandFooter/types'
export type { CursorTrackerProps } from './patterns/CursorTracker/types'
export type { FloatingContactProps } from './patterns/FloatingContact/types'
export type { VideoModalProps } from './patterns/VideoModal/types'
export type { GlassNavProps } from './patterns/GlassNav/types'
export type { ColumnFooterProps } from './patterns/ColumnFooter/types'
export type { HaubjergNavProps } from './patterns/HaubjergNav/types'
