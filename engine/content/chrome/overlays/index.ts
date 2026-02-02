/**
 * Chrome overlays barrel export.
 * Overlays are persistent UI elements that appear on top of page content.
 */

export { default as Modal, ModalRoot, useModalStore, openModal, closeModal } from './Modal'
export type { ModalConfig, TransitionPhase, RevealType } from './Modal/types'

export { default as CursorLabel } from './CursorLabel'

export { default as SlideIndicators } from './SlideIndicators'
export type { SlideIndicatorsProps } from './SlideIndicators/types'
