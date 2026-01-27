/**
 * Bojuhl preset floating contact configuration.
 * "How can I help you?" CTA overlay.
 */

import type { PresetOverlayConfig } from '../../types'

/**
 * Floating contact overlay configuration.
 * Purple accent background, positioned top-right on tablet+.
 */
export const floatingContactConfig: PresetOverlayConfig = {
  component: 'FloatingContact',
  props: {
    promptText: 'How can I help you?',
    email: 'hello@example.com',
    backgroundColor: '#9933FF',
  },
  position: 'top-right',
}
