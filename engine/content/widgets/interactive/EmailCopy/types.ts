/**
 * EmailCopy widget types.
 * Click-to-copy email with visual feedback.
 *
 * Two variants:
 * - 'flip' (default): Shows label that flips to email on hover
 * - 'reveal': Horizontal fold-out that reveals email on hover
 */

import type { WidgetBaseProps } from '../../types'

export type EmailCopyVariant = 'flip' | 'reveal'

export interface EmailCopyProps extends WidgetBaseProps {
  /** Animation variant. Default: 'flip' */
  variant?: EmailCopyVariant
  /** Email address to copy on click. Required. */
  email: string
  /** Semantic color for hover/interaction state. Maps to theme tokens. Default: 'accent' */
  hoverColor?: 'accent' | 'interaction' | 'primary'
  /** Label text shown alongside the email. Flip: shown as prompt that flips to email on hover. Reveal: shown before fold-out email. When omitted, both variants show email directly. */
  label?: string
  // -- Flip-specific --
  /** Blend mode for overlay stacking context. 'difference' makes text adapt to any background. Default: 'normal' */
  blendMode?: 'normal' | 'difference'
  /** Base text color. Empty string or omitted = inherit from theme. Ignored when blendMode is 'difference'. */
  color?: string
  /** Optional additional CSS class */
  className?: string
  /** Behaviour attribute for experience layer integration */
  'data-behaviour'?: string
}
