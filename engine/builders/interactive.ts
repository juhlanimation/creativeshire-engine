/**
 * Widget builders for interactive widgets.
 * Each builder returns a WidgetSchema for interactive content types.
 */

import type { WidgetSchema, WidgetEventMap } from '../schema/widget'

// ---------------------------------------------------------------------------
// Auto-ID
// ---------------------------------------------------------------------------

let _counter = 0

function autoId(prefix: string, explicit?: string): string {
  if (explicit) return explicit
  return `${prefix}-${++_counter}`
}

// ---------------------------------------------------------------------------
// Shared builder type for behaviour
// ---------------------------------------------------------------------------

interface BehaviourOption {
  id: string
  options?: Record<string, string | number | boolean>
}

// ---------------------------------------------------------------------------
// Video
// ---------------------------------------------------------------------------

export interface VideoBuilderOptions {
  src: string
  poster?: string
  background?: boolean
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  style?: Record<string, unknown>
  id?: string
  className?: string
  behaviour?: BehaviourOption
  on?: WidgetEventMap
}

/**
 * Build a Video widget schema.
 */
export function video(options: VideoBuilderOptions): WidgetSchema {
  return {
    id: autoId('video', options.id),
    type: 'Video',
    props: {
      src: options.src,
      ...(options.poster && { poster: options.poster }),
      ...(options.background != null && { background: options.background }),
      ...(options.autoplay != null && { autoplay: options.autoplay }),
      ...(options.loop != null && { loop: options.loop }),
      ...(options.muted != null && { muted: options.muted }),
    },
    ...(options.style && { style: options.style as WidgetSchema['style'] }),
    ...(options.className && { className: options.className }),
    ...(options.behaviour && { behaviour: options.behaviour }),
    ...(options.on && { on: options.on }),
  }
}

// ---------------------------------------------------------------------------
// VideoPlayer
// ---------------------------------------------------------------------------

export interface VideoPlayerBuilderOptions {
  src: string
  poster?: string
  style?: Record<string, unknown>
  id?: string
  className?: string
}

/**
 * Build a VideoPlayer widget schema.
 */
export function videoPlayer(options: VideoPlayerBuilderOptions): WidgetSchema {
  return {
    id: autoId('videoPlayer', options.id),
    type: 'VideoPlayer',
    props: {
      src: options.src,
      ...(options.poster && { poster: options.poster }),
    },
    ...(options.style && { style: options.style as WidgetSchema['style'] }),
    ...(options.className && { className: options.className }),
  }
}

// ---------------------------------------------------------------------------
// EmailCopy
// ---------------------------------------------------------------------------

export interface EmailCopyBuilderOptions {
  email: string
  style?: Record<string, unknown>
  id?: string
  className?: string
}

/**
 * Build an EmailCopy widget schema.
 */
export function emailCopy(options: EmailCopyBuilderOptions): WidgetSchema {
  return {
    id: autoId('emailCopy', options.id),
    type: 'EmailCopy',
    props: {
      email: options.email,
    },
    ...(options.style && { style: options.style as WidgetSchema['style'] }),
    ...(options.className && { className: options.className }),
  }
}

// ---------------------------------------------------------------------------
// ArrowLink
// ---------------------------------------------------------------------------

export interface ArrowLinkBuilderOptions {
  email: string
  label?: string
  variant?: 'swap' | 'slide'
  arrowDirection?: 'right' | 'down'
  href?: string
  style?: Record<string, unknown>
  id?: string
  className?: string
}

/**
 * Build an ArrowLink widget schema.
 */
export function arrowLink(options: ArrowLinkBuilderOptions): WidgetSchema {
  return {
    id: autoId('arrowLink', options.id),
    type: 'ArrowLink',
    props: {
      email: options.email,
      ...(options.label && { label: options.label }),
      ...(options.variant && { variant: options.variant }),
      ...(options.arrowDirection && { arrowDirection: options.arrowDirection }),
      ...(options.href && { href: options.href }),
    },
    ...(options.style && { style: options.style as WidgetSchema['style'] }),
    ...(options.className && { className: options.className }),
  }
}
