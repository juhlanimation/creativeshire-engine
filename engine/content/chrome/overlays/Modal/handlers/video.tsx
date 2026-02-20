/**
 * Video modal handler.
 * Creates the action handler that opens a video in the modal.
 *
 * Extracted from ModalRoot to keep it a thin mount point.
 * All video-specific logic (VideoPlayer JSX, dual-flag play/pause coordination)
 * lives here.
 */

import { openModal } from '../store'
import VideoPlayer from '../../../../widgets/interactive/VideoPlayer'

/**
 * Payload for the video modal open action.
 */
export interface OpenVideoModalPayload {
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
 * Creates a handler function for opening a video in the modal.
 * The handler creates VideoPlayer content and coordinates play/pause timing.
 *
 * @param actionId - Action ID for warning messages (e.g., 'modal.open')
 * @returns Action handler function
 */
export function createVideoModalHandler(actionId: string) {
  return (payload: unknown) => {
    const { videoUrl, rect, startTime, animationType, onComplete } = payload as OpenVideoModalPayload

    // Silently ignore bare dispatches from DOM fallback (just { element, event }).
    // The enriched dispatch from Video/ExpandRowImageRepeater includes videoUrl.
    if (!videoUrl) return

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
  }
}
