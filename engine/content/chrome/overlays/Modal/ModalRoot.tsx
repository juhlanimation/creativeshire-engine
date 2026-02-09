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
} from '../../../../experience/actions'
import { VideoPlayer } from '../../../widgets/interactive'

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
      const { videoUrl, rect, startTime, animationType, onComplete } = payload as OpenVideoModalPayload

      if (!videoUrl) {
        console.warn('open-video-modal: videoUrl is required')
        return
      }

      // Generate unique modal ID based on video URL
      const modalId = `video-modal-${videoUrl.replace(/[^a-z0-9]/gi, '-')}`

      // Capture video controls for play on open complete, pause on close.
      // Both flags needed: onInit (canPlay) and onOpenComplete (animation end)
      // can fire in either order depending on network speed vs animation duration.
      let videoControls: { play: () => void; pause: () => void; suppressUI: () => void } | null = null
      let animationComplete = false

      // Determine animation type:
      // 1. Use explicit animationType if provided (wipe-left, wipe-right)
      // 2. Default to 'wipe-left' if no animationType specified
      const resolvedAnimationType = animationType ?? 'wipe-left'

      openModal(modalId, {
        content: (
          <VideoPlayer
            src={videoUrl}
            // Don't pass poster - let video show first frame instead
            // autoPlay={false}: video loads during wipe but does NOT play.
            // Playback is controlled by onInit/onOpenComplete dual-flag
            // pattern below — starts only after animation completes.
            autoPlay={false}
            startTime={startTime}
            onInit={(controls) => {
              videoControls = controls
              if (animationComplete) controls.play()
            }}
          />
        ),
        animationType: resolvedAnimationType,
        sourceRect: rect,
        sequenceContentFade: true,
        backdropColor: 'transparent',
        onOpenComplete: () => {
          // Play video AFTER transition completes
          animationComplete = true
          videoControls?.play()
        },
        onBeforeClose: () => {
          // Hide UI overlay first, then pause — prevents controls flash during close animation
          videoControls?.suppressUI()
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
