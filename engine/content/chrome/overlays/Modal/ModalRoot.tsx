'use client'

/**
 * ModalRoot - renders the single active modal.
 * Mount this once at the app root level.
 *
 * Thin mount point — registers action handlers and renders <Modal />.
 * Content-specific handlers live in handlers/ (e.g., handlers/video.tsx).
 *
 * Action ID uses overlayKey: `${overlayKey}.open` (e.g., 'modal.open').
 * Same convention as CursorLabel's `${overlayKey}.show`/`${overlayKey}.hide`.
 */

import { useEffect } from 'react'
import Modal from './index'
import {
  registerAction,
  unregisterAction,
} from '../../../actions'
import { createVideoModalHandler } from './handlers/video'

/**
 * ModalRoot component.
 * Mounts Modal and registers modal-related actions.
 *
 * @param overlayKey - Overlay key from ChromeRenderer (e.g., 'modal').
 *   Determines the action ID: `${overlayKey}.open`.
 */
export default function ModalRoot({ overlayKey }: { overlayKey: string }) {
  useEffect(() => {
    const actionId = `${overlayKey}.open`
    const handler = createVideoModalHandler(actionId)

    registerAction(actionId, handler)

    return () => {
      unregisterAction(actionId)
    }
  }, [overlayKey])

  return <Modal />
}
