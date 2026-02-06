/**
 * video/frame behaviour - triggers on video timestamp/frame.
 *
 * Generic behaviour for syncing reveals to video playback.
 * Sets CSS variables when target frame/timestamp is reached.
 *
 * CSS Variables Output:
 * - --video-frame-reached: Whether target frame has been reached (0 or 1)
 * - --video-progress: Progress toward target frame (0-1)
 * - --video-time: Current video time in seconds
 */

import type { Behaviour } from '../types'
import { registerBehaviour } from '../registry'

interface VideoFrameOptions {
  /** Target frame number (at assumed fps, default 25) */
  targetFrame?: number
  /** Target time in seconds (takes precedence over targetFrame) */
  targetTime?: number
  /** Frames per second for frame-to-time conversion (default 25) */
  fps?: number
  /** Stay triggered once reached (default true) */
  latch?: boolean
}

const videoFrame: Behaviour = {
  id: 'video/frame',
  name: 'Video Frame Trigger',
  requires: ['videoTime', 'prefersReducedMotion'],

  compute: (state, options) => {
    const {
      targetFrame = 80,
      targetTime,
      fps = 25,
      latch = true
    } = (options as VideoFrameOptions) || {}

    // Calculate target time from frame if not explicitly provided
    const target = targetTime ?? (targetFrame / fps)

    // Video time comes from VideoDriver or direct state injection
    const currentTime = (state.videoTime as number) ?? 0
    const hasReached = (state.videoFrameReached as boolean) ?? false

    // Calculate progress toward target
    const progress = Math.min(1, currentTime / target)

    // Determine if frame is reached (with latching support)
    const reached = latch
      ? hasReached || currentTime >= target
      : currentTime >= target

    // Respect reduced motion - instant state
    if (state.prefersReducedMotion) {
      return {
        '--video-frame-reached': reached ? 1 : 0,
        '--video-progress': reached ? 1 : 0,
        '--video-time': currentTime
      }
    }

    return {
      '--video-frame-reached': reached ? 1 : 0,
      '--video-progress': progress,
      '--video-time': currentTime
    }
  },

  cssTemplate: `
    /* Applied via effects that consume these variables */
  `,

  optionConfig: {
    targetFrame: {
      type: 'range',
      label: 'Target Frame',
      default: 80,
      min: 1,
      max: 300,
      step: 1
    },
    targetTime: {
      type: 'range',
      label: 'Target Time (s)',
      default: 3.2,
      min: 0,
      max: 30,
      step: 0.1
    },
    fps: {
      type: 'range',
      label: 'Frames Per Second',
      default: 25,
      min: 24,
      max: 60,
      step: 1
    },
    latch: {
      type: 'toggle',
      label: 'Stay Triggered',
      default: true
    }
  }
}

// Auto-register on module load
registerBehaviour(videoFrame)

export default videoFrame
