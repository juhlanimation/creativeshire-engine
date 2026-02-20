/**
 * Chrome components barrel export.
 * Chrome provides persistent UI outside page content.
 */

// Registry
export {
  registerChromeComponent,
  getChromeComponent,
  getAllChromeMetas,
  getChromeComponentIds,
  ensureChromeRegistered,
} from './registry'

// Base metas
export { regionBaseMeta } from './region-base-meta'
export { overlayBaseMeta } from './overlay-base-meta'
