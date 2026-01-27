/**
 * video-modal behaviour - manages fullscreen video player modal state.
 * Note: This behaviour provides CSS variables for modal animation.
 * The actual modal logic is handled by a React component/context.
 */

import type { Behaviour } from '../types'
import { registerBehaviour } from '../registry'

const videoModal: Behaviour = {
  id: 'video-modal',
  name: 'Video Modal',
  requires: ['prefersReducedMotion'],

  compute: (state, options) => {
    // Modal state is managed via external context
    // This behaviour provides CSS variable hooks for animation
    const isOpen = (state.modalOpen as boolean) ?? false

    // Respect reduced motion preference
    if (state.prefersReducedMotion) {
      return {
        '--modal-opacity': isOpen ? 1 : 0,
        '--modal-scale': 1
      }
    }

    return {
      '--modal-opacity': isOpen ? 1 : 0,
      '--modal-scale': isOpen ? 1 : 0.95
    }
  },

  cssTemplate: `
    opacity: var(--modal-opacity, 0);
    transform: scale(var(--modal-scale, 1));
    will-change: opacity, transform;
  `
}

// Auto-register on module load
registerBehaviour(videoModal)

export default videoModal
