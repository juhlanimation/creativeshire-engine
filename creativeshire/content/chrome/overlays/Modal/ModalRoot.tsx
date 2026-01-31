'use client'

/**
 * ModalRoot - renders the single active modal.
 * Mount this once at the app root level.
 *
 * Responsibilities:
 * - Render Modal component (handles its own visibility)
 * - Register modal-related actions for widget → chrome communication
 *
 * Action pattern:
 * - Widgets declare intent: { on: { click: 'open-video-modal' } }
 * - WidgetRenderer wires: onClick → executeAction('open-video-modal', payload)
 * - This component registers the action implementation
 */

import { useEffect } from 'react'
import Modal from './index'
import { openModal } from './store'
import {
  registerAction,
  unregisterAction,
} from '@/creativeshire/experience/actions'
import { VideoPlayer } from '@/creativeshire/content/widgets/interactive'

/**
 * Payload for open-video-modal action.
 */
interface OpenVideoModalPayload {
  videoUrl: string
  poster?: string
  rect?: DOMRect
  startTime?: number
  /** Animation type for modal (wipe-left, wipe-right, expand) */
  animationType?: 'wipe-left' | 'wipe-right' | 'expand'
  /** Callback when modal closes (for widget state restoration) */
  onComplete?: () => void
}

/**
 * ModalRoot component.
 * Mounts Modal and registers modal-related actions.
 */
export default function ModalRoot() {
  // Register modal actions on mount
  useEffect(() => {
    // Action: open-video-modal
    // Triggered by Video widget when clicked with videoUrl
    registerAction('open-video-modal', (payload: unknown) => {
      const { videoUrl, poster, rect, startTime, animationType, onComplete } = payload as OpenVideoModalPayload

      if (!videoUrl) {
        console.warn('open-video-modal: videoUrl is required')
        return
      }

      // Generate unique modal ID based on video URL
      const modalId = `video-modal-${videoUrl.replace(/[^a-z0-9]/gi, '-')}`

      // Capture video controls for pause on close
      let videoControls: { pause: () => void } | null = null

      // Determine animation type:
      // 1. Use explicit animationType if provided (wipe-left, wipe-right)
      // 2. Default to 'wipe-left' if no animationType specified
      const resolvedAnimationType = animationType ?? 'wipe-left'

      openModal(modalId, {
        content: (
          <VideoPlayer
            src={videoUrl}
            poster={poster}
            autoPlay
            startTime={startTime}
            onInit={(controls) => {
              videoControls = controls
            }}
          />
        ),
        animationType: resolvedAnimationType,
        sourceRect: rect,
        sequenceContentFade: true,
        backdropColor: 'transparent',
        onBeforeClose: () => {
          // Pause video immediately before close animation starts
          videoControls?.pause()
        },
        onClose: () => {
          // Notify widget that modal has fully closed (for state restoration)
          onComplete?.()
        },
      })
    })

    // Cleanup on unmount
    return () => {
      unregisterAction('open-video-modal')
    }
  }, [])

  return <Modal />
}
