/**
 * hover/reveal behaviour - hover-triggered reveal animation.
 *
 * Generic behaviour for hover reveal effects with optional press feedback.
 * Sets CSS variables for opacity, scale, and color based on hover/press state.
 *
 * CSS Variables Output:
 * - --hover-reveal-opacity: Reveal layer opacity (0-1)
 * - --hover-reveal-icon-opacity: Icon visibility (0-1)
 * - --hover-reveal-scale: Scale transform value
 * - --text-reveal-y: Text flip position (0 or -100%)
 * - --shift-color: Color shift value (for text color changes)
 * - --flip-duration: Animation duration for flips
 * - --fade-duration: Animation duration for fades
 */

import type { Behaviour } from '../types'
import { registerBehaviour } from '../registry'

interface HoverRevealOptions {
  hoverScale?: number
  pressScale?: number
  flipDuration?: number
  fadeDuration?: number
  hoverColor?: string
  defaultColor?: string
}

const hoverReveal: Behaviour = {
  id: 'hover/reveal',
  name: 'Hover Reveal',
  requires: ['isHovered', 'isPressed', 'prefersReducedMotion'],

  compute: (state, options) => {
    const isHovered = (state.isHovered as boolean) ?? false
    const isPressed = (state.isPressed as boolean) ?? false
    const {
      hoverScale = 1.02,
      pressScale = 0.98,
      flipDuration = 400,
      fadeDuration = 200,
      hoverColor = 'var(--interaction, #9933FF)',
      defaultColor = 'white'
    } = (options as HoverRevealOptions) || {}

    // Respect reduced motion preference
    if (state.prefersReducedMotion) {
      return {
        '--hover-reveal-opacity': isHovered ? 1 : 0,
        '--hover-reveal-icon-opacity': isHovered ? 1 : 0,
        '--hover-reveal-scale': 1,
        '--text-reveal-y': isHovered ? '-100%' : '0',
        '--icon-opacity': isHovered ? 1 : 0,
        '--shift-color': defaultColor,
        '--flip-duration': '0ms',
        '--fade-duration': '0ms',
      }
    }

    // Scale feedback
    let scale = 1
    if (isPressed) {
      scale = pressScale
    } else if (isHovered) {
      scale = hoverScale
    }

    return {
      // Generic reveal vars
      '--hover-reveal-opacity': isHovered ? 1 : 0,
      '--hover-reveal-icon-opacity': isHovered ? 1 : 0,
      '--hover-reveal-scale': scale,
      // Text flip - controlled by hover
      '--text-reveal-y': isHovered ? '-100%' : '0',
      // Icon visibility - fade in on hover
      '--icon-opacity': isHovered ? 1 : 0,
      // Color - changes on hover
      '--shift-color': isHovered ? hoverColor : defaultColor,
      // Animation durations
      '--flip-duration': `${flipDuration}ms`,
      '--fade-duration': `${fadeDuration}ms`,
    }
  },

  cssTemplate: `
    transform: scale(var(--hover-reveal-scale, 1));
    will-change: transform;
  `,

  optionConfig: {
    hoverScale: {
      type: 'range',
      label: 'Hover Scale',
      default: 1.02,
      min: 1,
      max: 1.1,
      step: 0.01
    },
    pressScale: {
      type: 'range',
      label: 'Press Scale',
      default: 0.98,
      min: 0.9,
      max: 1,
      step: 0.01
    },
    flipDuration: {
      type: 'range',
      label: 'Flip Duration (ms)',
      default: 400,
      min: 100,
      max: 800,
      step: 50
    },
    fadeDuration: {
      type: 'range',
      label: 'Fade Duration (ms)',
      default: 200,
      min: 50,
      max: 500,
      step: 25
    }
  }
}

// Auto-register on module load
registerBehaviour(hoverReveal)

export default hoverReveal
