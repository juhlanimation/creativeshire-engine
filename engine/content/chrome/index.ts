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
