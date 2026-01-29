/**
 * Modal transition behaviours.
 * Import this module to register all modal behaviours.
 */

import './modal-mask-wipe'
import './modal-fade'
import './modal-scale'

export { default as modalMaskWipe } from './modal-mask-wipe'
export { default as modalFade } from './modal-fade'
export { default as modalScale } from './modal-scale'

/**
 * Map transition type to behaviour ID.
 * Used by ModalBehaviourWrapper to resolve the correct behaviour.
 */
export const TRANSITION_BEHAVIOURS: Record<string, string> = {
  'mask-wipe': 'modal-mask-wipe',
  'mask-expand': 'modal-mask-wipe', // Use mask-wipe for now, can add expand later
  'fade': 'modal-fade',
  'scale': 'modal-scale',
  'none': 'none',
}

/**
 * Get behaviour ID for a transition type.
 */
export function getModalBehaviourId(transition: string): string {
  return TRANSITION_BEHAVIOURS[transition] ?? 'modal-fade'
}
