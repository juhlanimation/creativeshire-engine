/**
 * IntroOverlay chrome overlay types.
 * Wraps intro content (e.g. TextMask) during intro sequence.
 */

export interface IntroOverlayProps {
  /** Text for TextMask (resolved from binding) */
  text?: string
  /** Mask color (default: 'black') */
  maskColor?: string
  /** Font size for mask text (default: '25cqw') */
  fontSize?: string
  /** Font weight (default: 900) */
  fontWeight?: number
  /** Font family (default: 'var(--font-title)') */
  fontFamily?: string
  /** Letter spacing (CSS value, e.g. '-0.02em') */
  letterSpacing?: string
  /** Step at which background fades, revealing content through text (default: 1) */
  bgFadeStep?: number
  /** Step at which the overlay mask fades out (default: 2) */
  overlayFadeStep?: number
}
