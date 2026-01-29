/**
 * contact-reveal behaviour - hover reveal animation for ContactPrompt.
 *
 * State Machine:
 * [no hover] → [hover/idle] → [hover/copied] → [hover/idle]
 *
 * Visual States:
 * - No hover: mix-blend (white/difference), prompt text, no icon
 * - Hover (idle): purple, email text (flip), copy icon (fade)
 * - Hover (copied): mix-blend, email text (stays), checkmark (flip)
 *
 * CSS Variables output:
 * - --text-reveal-y: Text flip ('0' default, '-100%' hovered)
 * - --icon-opacity: Icon visibility (0 default, 1 hovered)
 * - --shift-color: Text color (white default, purple when hover+idle)
 * - --flip-duration: Animation duration for flips (from options)
 * - --fade-duration: Animation duration for fades (from options)
 *
 * Options:
 * - flipDuration: Duration for flip animations in ms (default: 400)
 * - fadeDuration: Duration for fade animations in ms (default: 200)
 *
 * Note: --icon-reveal-y is set by the widget based on copyState
 * Note: mix-blend-mode is applied at chrome-overlay level (see chrome.css)
 */

import type { Behaviour } from '../types'
import { registerBehaviour } from '../registry'

interface ContactRevealOptions {
  flipDuration?: number
  fadeDuration?: number
}

const contactReveal: Behaviour = {
  id: 'contact-reveal',
  name: 'Contact Reveal',
  requires: ['prefersReducedMotion'],

  compute: (state, options) => {
    const isHovered = (state.isHovered as boolean) ?? false
    const { flipDuration = 400, fadeDuration = 200 } = (options as ContactRevealOptions) || {}

    // Reduced motion: instant state changes, no transitions
    if (state.prefersReducedMotion) {
      return {
        '--text-reveal-y': isHovered ? '-100%' : '0',
        '--icon-opacity': isHovered ? 1 : 0,
        '--shift-color': 'white',
        '--flip-duration': '0ms',
        '--fade-duration': '0ms',
      }
    }

    // Purple only when hovered and ready to copy (idle state)
    // Note: Widget will override to mix-blend when copyState is 'copied'
    // We default to purple on hover, widget handles the copied override
    const showPurple = isHovered

    return {
      // Text flip - controlled by hover
      '--text-reveal-y': isHovered ? '-100%' : '0',
      // Icon visibility - fade in on hover
      '--icon-opacity': isHovered ? 1 : 0,
      // Color - purple when hovered (widget overrides when copied)
      '--shift-color': showPurple ? 'var(--interaction, #9933FF)' : 'white',
      // Animation durations
      '--flip-duration': `${flipDuration}ms`,
      '--fade-duration': `${fadeDuration}ms`,
    }
  },
}

// Auto-register on module load
registerBehaviour(contactReveal)

export default contactReveal
