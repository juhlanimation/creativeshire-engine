/**
 * HeroVideo widget props interface.
 * Full-screen video hero with intro timing and text reveal.
 *
 * Features:
 * - Fixed full-viewport video with custom loop point
 * - Text overlay with timed reveal (mix-blend-mode: difference)
 * - Auto-pause when hero is not visible (IntersectionObserver)
 * - Responsive scroll indicator (text on desktop, arrow on touch)
 *
 * Cover progress tracking is handled externally by the scroll/cover-progress behaviour.
 */

import type { WidgetBaseProps } from '../../types'

/**
 * Props for the HeroVideo widget.
 */
export interface HeroVideoProps extends WidgetBaseProps {
  /** Video source URL */
  src: string
  /** Seconds to restart from after video ends (default: 0) */
  loopStartTime?: number
  /** Seconds when overlay text appears (default: 0 = immediate) */
  textRevealTime?: number
  /** Large brand title text */
  title: string
  /** Subtitle below title (e.g., "DRØM • DEL • SKAB") */
  tagline?: string
  /** Scroll indicator text for desktop (e.g., "(SCROLL)") */
  scrollIndicatorText?: string
}
