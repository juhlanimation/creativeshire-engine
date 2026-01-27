/**
 * FloatingContact chrome component props interface.
 * "How can I help you?" floating CTA button.
 */

import type { ChromeBaseProps } from '../../types'

/**
 * Props for the FloatingContact chrome component.
 */
export interface FloatingContactProps extends ChromeBaseProps {
  /** Prompt text (default: "How can I help you?") */
  promptText?: string
  /** Email address for contact */
  email: string
  /** Background color (default: purple accent) */
  backgroundColor?: string
}
