/**
 * SelectorCard types.
 * Internal component of FlexGalleryCardRepeater — not a standalone widget.
 */

/**
 * Payload sent when a selector card is clicked.
 * Consumed by action system (e.g. 'modal.open').
 */
export interface SelectorCardClickPayload {
  /** Index of the clicked card */
  index: number
  /** Video source URL (if available) */
  videoSrc?: string
  /** Project title */
  title?: string
}

/**
 * Props for the SelectorCard component.
 * Internal to FlexGalleryCardRepeater — not a standalone widget.
 */
export interface SelectorCardProps {
  // Data (from parent)
  /** Thumbnail image or video source */
  thumbnailSrc: string
  /** Thumbnail alt text */
  thumbnailAlt?: string
  /** Project title */
  title?: string
  /** Project year */
  year?: string
  /** Studio name */
  studio?: string
  /** Role in project */
  role?: string
  /** Video source (for poster frame seeking) */
  videoSrc?: string
  /** Time in seconds to seek to for video poster frame */
  posterTime?: number

  // Coordination (from parent)
  /** Whether this card is the active/selected one */
  isActive?: boolean
  /** Whether the info overlay is visible */
  showInfo?: boolean
  /** Progress of the associated media (0-100), drives the bottom progress bar width */
  progress?: number

  // Visual settings (forwarded from parent)
  /** Semantic accent color for progress bar and indicators */
  accentColor?: 'accent' | 'interaction' | 'primary'
  /** Show "Playing" indicator on active card */
  showPlayingIndicator?: boolean
  /** Show play icon on hover for inactive cards */
  showPlayIcon?: boolean
  /** Show dark overlay on active/hover cards */
  showOverlay?: boolean
  /** Semantic border radius for thumbnail */
  thumbnailBorderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'full'

  // Callbacks (from parent)
  /** Called when mouse enters the card */
  onMouseEnter?: () => void
  /** Called when mouse leaves the card */
  onMouseLeave?: () => void
  /** Called when the card is clicked */
  onClick?: () => void
  /** Additional CSS class */
  className?: string
}
