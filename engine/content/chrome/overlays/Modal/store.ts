/**
 * Modal store - manages single modal open/close state with transition phases.
 * Colocated with Modal component per architecture guidelines.
 *
 * Key design:
 * - Single modal at a time (not multiple concurrent)
 * - Tracks transitionPhase for behaviour system integration
 * - Modal data stays during close animation (clears on 'closed' phase)
 */

import { create } from 'zustand'
import type { ModalConfig, TransitionPhase } from './types'

/**
 * Active modal state.
 */
interface ActiveModal {
  id: string
  config: ModalConfig
}

/**
 * Modal store state and actions.
 */
interface ModalState {
  /** Currently active modal (null when fully closed) */
  activeModal: ActiveModal | null

  /** Current transition phase for behaviour system */
  transitionPhase: TransitionPhase

  /** Open a modal - sets phase to 'opening' */
  open: (id: string, config: ModalConfig) => void

  /** Request close - sets phase to 'closing' (modal stays for animation) */
  close: () => void

  /** Set transition phase (called by useTransitionComplete) */
  setTransitionPhase: (phase: TransitionPhase) => void

  /** Get current config (for compatibility) */
  getConfig: () => ModalConfig | undefined

  /** Check if modal is visible (opening, open, or closing) */
  isVisible: () => boolean
}

/**
 * Modal store instance.
 * Use openModal/closeModal helpers for imperative control.
 */
export const useModalStore = create<ModalState>((set, get) => ({
  activeModal: null,
  transitionPhase: 'closed',

  open: (id, config) => {
    const current = get()

    // If already opening/open, ignore
    if (current.transitionPhase === 'opening' || current.transitionPhase === 'open') {
      console.warn(`Modal already open, ignoring open request for: ${id}`)
      return
    }

    // If closing, we could queue this, but for now just warn
    if (current.transitionPhase === 'closing') {
      console.warn(`Modal is closing, cannot open: ${id}`)
      return
    }

    set({
      activeModal: { id, config },
      transitionPhase: 'opening',
    })
  },

  close: () => {
    const current = get()

    // Only allow close from 'open' state
    if (current.transitionPhase !== 'open') {
      return
    }

    // Call onBeforeClose IMMEDIATELY (e.g., to pause video before animation)
    current.activeModal?.config.onBeforeClose?.()

    // Keep activeModal for close animation, just change phase
    set({ transitionPhase: 'closing' })
  },

  setTransitionPhase: (phase) => {
    set((state) => {
      // When fully closed, clear modal data
      if (phase === 'closed') {
        return {
          transitionPhase: phase,
          activeModal: null,
        }
      }
      return { transitionPhase: phase }
    })
  },

  getConfig: () => get().activeModal?.config,

  isVisible: () => {
    const phase = get().transitionPhase
    return phase === 'opening' || phase === 'open' || phase === 'closing'
  },
}))

/**
 * Helper to open a modal imperatively.
 * Returns a close function.
 */
export function openModal(id: string, config: ModalConfig): () => void {
  useModalStore.getState().open(id, config)
  return () => useModalStore.getState().close()
}

/**
 * Helper to close the current modal imperatively.
 */
export function closeModal(): void {
  useModalStore.getState().close()
}
