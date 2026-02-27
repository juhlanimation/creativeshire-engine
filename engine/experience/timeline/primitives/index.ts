/**
 * Effect primitives barrel export.
 *
 * IMPORTANT: All effect files must be imported here for auto-registration.
 * Effects call registerEffect() on import, so missing imports = unregistered effects.
 */

// ============================================
// Effect implementations (auto-register on import)
// ============================================
import './wipe-left'
import './wipe-right'
import './expand'
import './fade'
import './overlay-fade'

// ============================================
// Types
// ============================================
export type {
  EffectPrimitive,
  EffectRegistry,
  EffectContext,
  EffectOptions,
  GsapRealization,
  CssRealization,
  TweenVars,
} from './types'

// ============================================
// Registry
// ============================================
export {
  effectRegistry,
  registerEffect,
  unregisterEffect,
  resolveEffect,
  getEffectIds,
  getAllEffects,
} from './registry'

// ============================================
// Re-exports for explicit imports (optional)
// ============================================
export { default as wipeLeft } from './wipe-left'
export { default as wipeRight } from './wipe-right'
export { default as expand } from './expand'
export { default as fade } from './fade'
export { default as overlayFade } from './overlay-fade'
