/**
 * ContactPrompt widget types.
 * A contact element with copy-to-clipboard functionality.
 *
 * Two modes:
 * - Full mode (default): Shows prompt text that flips to email on hover
 * - Email-only mode: Just shows email with copy icon on hover
 */

export interface ContactPromptProps {
  /** Email address to copy on click. Required. */
  email: string
  /** Prompt text shown by default. Only used when showPrompt=true. Default: "How can I help you?" */
  promptText?: string
  /** Show prompt text with flip animation. When false, just shows email. Default: true */
  showPrompt?: boolean
  /** Optional additional CSS class */
  className?: string
  /** Behaviour attribute for experience layer integration */
  'data-behaviour'?: string
}
