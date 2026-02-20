/**
 * Interactive widgets barrel.
 *
 * Interactive widgets are React components with internal state,
 * complex event handling, or multiple render modes.
 *
 * Unlike patterns (factory functions), these are actual React components
 * that use hooks, refs, and effects.
 *
 * For factory functions that compose widgets, see ../patterns/
 */

// Video - video with hover-play, visibility playback, modal integration
export { default as Video } from './Video'
export type { VideoProps } from './Video/types'

// VideoPlayer - full video player with controls, scrubber, fullscreen
export { default as VideoPlayer } from './VideoPlayer'
export type { VideoPlayerProps } from './VideoPlayer/types'

// EmailCopy - click-to-copy email with flip or reveal animation
export { default as EmailCopy } from './EmailCopy'
export type { EmailCopyProps, EmailCopyVariant } from './EmailCopy/types'
