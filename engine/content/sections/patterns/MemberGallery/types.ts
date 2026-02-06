/**
 * MemberGallery section props.
 * Fullscreen video showcase with list of members/items.
 * Video layer switches based on selection (hover on desktop, viewport-center on mobile).
 */

import type { CSSProperties } from 'react'

/**
 * Individual member item.
 */
export interface MemberItem {
  /** Unique identifier */
  id: string
  /** Display name */
  name: string
  /** Optional subtitle (role, title, etc.) */
  subtitle?: string
  /** Video source URL */
  videoSrc: string
  /** Video poster/thumbnail */
  videoPoster?: string
  /** Optional link URL */
  href?: string
}

/**
 * Text style configuration for member gallery elements.
 */
export interface MemberGalleryTextStyles {
  /** Style for member name */
  name?: CSSProperties
  /** Style for member subtitle */
  subtitle?: CSSProperties
  /** Style for section title */
  title?: CSSProperties
}

/**
 * Default styles used when not overridden by preset.
 */
export const DEFAULT_MEMBER_GALLERY_STYLES: MemberGalleryTextStyles = {
  name: {
    fontFamily: 'var(--font-display, Inter, system-ui, sans-serif)',
    fontSize: 'clamp(2rem, 5vw, 4rem)',
    fontWeight: 700,
    color: 'white',
    mixBlendMode: 'difference',
    cursor: 'pointer',
    transition: 'opacity 200ms ease'
  },
  subtitle: {
    fontFamily: 'var(--font-paragraph, Plus Jakarta Sans, system-ui, sans-serif)',
    fontSize: '0.875rem',
    fontWeight: 500,
    color: 'white',
    mixBlendMode: 'difference',
    opacity: 0.7
  },
  title: {
    fontFamily: 'var(--font-paragraph, Plus Jakarta Sans, system-ui, sans-serif)',
    fontSize: '0.875rem',
    fontWeight: 500,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'white',
    mixBlendMode: 'difference'
  }
}

/**
 * Props for the createMemberGallerySection factory.
 */
export interface MemberGalleryProps {
  /** Section ID override (default: 'member-gallery') */
  id?: string

  // === Content (what to display) ===
  /** Section title (e.g., "Our Members", "Community") */
  title?: string
  /** Array of member items - supports binding expressions */
  members: MemberItem[] | string
  /** Initial selected member index (default: 0) */
  initialIndex?: number

  // === Layout ===
  /** Names layout direction (default: 'column') */
  namesDirection?: 'row' | 'column'
  /** Names position relative to video (default: 'overlay') */
  namesPosition?: 'overlay' | 'left' | 'right' | 'bottom'
  /** Gap between name items */
  namesGap?: string | number

  // === Behavior ===
  /** Selection mode (default: 'hover' on desktop, 'scroll' on mobile) */
  selectionMode?: 'hover' | 'scroll' | 'auto'
  /** Video crossfade duration in ms (default: 400) */
  crossfadeDuration?: number
  /** Show video controls */
  showControls?: boolean

  // === Styles (how to display - from preset) ===
  /** Text style configuration - overrides defaults */
  styles?: MemberGalleryTextStyles
  /** Background color (visible between video transitions) */
  backgroundColor?: string
}
