/**
 * Bojuhl preset floating contact configuration.
 * "How can I help you?" CTA overlay.
 *
 * Uses widget-based approach: ChromeRenderer handles positioning,
 * ContactPrompt widget handles the reveal-on-hover interaction.
 */

import type { PresetOverlayConfig } from '../../types'

/**
 * Floating contact overlay configuration.
 * Widget-based: ContactPrompt widget with copy-to-clipboard action.
 * Positioned top-right on tablet+, hidden on mobile.
 *
 * Animation: 2x speed (200ms flip, 100ms fade) for snappy interaction.
 */
export const floatingContactConfig: PresetOverlayConfig = {
  widget: {
    id: 'floating-contact',
    type: 'ContactPrompt',
    props: {
      promptText: '{{ content.contact.promptText }}',
      email: '{{ content.contact.email }}',
    },
    behaviour: {
      id: 'hover/reveal',
      options: {
        flipDuration: 200,
        fadeDuration: 100,
      },
    },
  },
  position: 'top-right',
}
