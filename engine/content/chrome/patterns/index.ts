/**
 * Chrome patterns barrel export.
 * Factory functions that return PresetRegionConfig or PresetOverlayConfig.
 */

// Header patterns
export { createMinimalNavRegion } from './MinimalNav'
export type { MinimalNavProps } from './MinimalNav/types'

export { createFixedNavRegion } from './FixedNav'
export type { FixedNavProps } from './FixedNav/types'

export { createCenteredNavRegion } from './CenteredNav'
export type { CenteredNavProps } from './CenteredNav/types'

// Footer patterns
export { createContactFooterRegion } from './ContactFooter'
export type { ContactFooterProps } from './ContactFooter/types'

export { createBrandFooterRegion } from './BrandFooter'
export type { BrandFooterProps } from './BrandFooter/types'

// Cursor patterns
export { createCursorTrackerOverlay } from './CursorTracker'
export type { CursorTrackerProps } from './CursorTracker/types'

// Floating region patterns
export { createFloatingContactRegion } from './FloatingContact'
export type { FloatingContactProps } from './FloatingContact/types'

export { createVideoModalOverlay } from './VideoModal'
export type { VideoModalProps } from './VideoModal/types'
