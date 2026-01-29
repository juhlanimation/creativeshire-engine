'use client'

/**
 * ModalRoot - renders the single active modal.
 * Mount this once at the app root level.
 *
 * Simplified for single-modal pattern:
 * - No longer iterates over multiple modals
 * - Just renders Modal component which handles its own visibility
 */

import Modal from './index'

/**
 * ModalRoot component.
 * Simply mounts Modal, which handles visibility internally.
 */
export default function ModalRoot() {
  return <Modal />
}
