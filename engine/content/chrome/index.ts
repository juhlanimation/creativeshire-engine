/**
 * Chrome components barrel export.
 * Chrome provides persistent UI outside page content.
 */

export { default as Footer } from './regions/Footer'
export * from './types'

// Registry
export {
  registerChromeComponent,
  registerLazyChromeComponent,
  getChromeComponent,
  getChromeComponentAsync,
  getAllChromeMetas,
  getChromeComponentIds,
  ensureChromeRegistered,
} from './registry'

// Base metas
export { regionBaseMeta } from './region-base-meta'
export { overlayBaseMeta } from './overlay-base-meta'
