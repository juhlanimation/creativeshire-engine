/**
 * Boy Mole theme — warm, earthy, storybook-inspired.
 * Light-first with cream tones and earthy browns.
 * Gentle, hand-drawn feel. Inspired by The Boy, The Mole, The Fox and The Horse.
 */

import { createTheme } from '../utils'
import { registerTheme } from '../registry'

const boyMole = createTheme({
  id: 'boy-mole',
  name: 'Boy Mole',
  description: 'Warm cream palette with earthy browns. Storybook-inspired.',
  defaultMode: 'light',

  typography: {
    title: 'var(--font-inter), Inter, system-ui, -apple-system, sans-serif',
    heading: 'var(--font-inter), Inter, system-ui, -apple-system, sans-serif',
    paragraph: 'var(--font-plus-jakarta), Plus Jakarta Sans, system-ui, -apple-system, sans-serif',
    ui: 'var(--font-inter), Inter, system-ui, -apple-system, sans-serif',
    scale: {
      display: 'clamp(2.5rem, 6.5cqw, 6.5rem)',
      h1: '2.25rem',
      h2: '1.5rem',
      h3: '1.125rem',
      body: '1rem',
      small: '0.75rem',
      xs: '0.625rem',
    },
    fontWeights: { display: '800', heading: '700', body: '400', small: '400', xs: '400' },
    lineHeights: { display: '1.05', heading: '1.2', body: '1.5', small: '1.4', xs: '1.4' },
    letterSpacings: { display: '-0.02em', heading: '-0.01em', body: '0em', small: '0.02em', xs: '0.02em' },
  },

  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '2rem',
    xl: '4rem',
    '2xl': '6rem',
    '3xl': '10rem',
    sectionX: 'clamp(2rem, 8cqw, 12rem)',
    sectionY: 'clamp(3rem, 6cqw, 6rem)',
  },

  radius: {
    none: '0',
    sm: '2px',
    md: '4px',
    lg: '8px',
    full: '9999px',
  },

  shadows: {
    none: 'none',
    sm: '0 1px 3px rgba(42, 37, 32, 0.06)',
    md: '0 4px 12px rgba(42, 37, 32, 0.10)',
    lg: '0 8px 24px rgba(42, 37, 32, 0.15)',
  },

  borders: {
    width: '1px',
    style: 'solid',
    color: 'currentColor',
    dividerOpacity: '0.12',
  },

  motion: {
    durationFast: '120ms',
    durationNormal: '250ms',
    durationSlow: '400ms',
    easeDefault: 'cubic-bezier(0.16, 1, 0.3, 1)',
    easeIn: 'cubic-bezier(0.55, 0, 1, 0.45)',
    easeOut: 'cubic-bezier(0, 0.55, 0.45, 1)',
  },

  textDecoration: {
    style: 'solid',
    thickness: '1px',
    offset: '4px',
    opacity: '1',
  },

  interaction: {
    hoverOpacity: '0.85',
    activeScale: '0.98',
    focusRingWidth: '2px',
    focusRingOffset: '2px',
  },

  layout: {
    gap: {
      none: '0',
      tight: 'clamp(0.5rem, 1cqw, 1rem)',
      normal: 'clamp(1.5rem, 3cqw, 3rem)',
      loose: 'clamp(3rem, 5cqw, 5rem)',
    },
    padding: {
      none: '0',
      tight: 'clamp(1.5rem, 3cqw, 3rem) clamp(1rem, 4cqw, 6rem)',
      normal: 'clamp(3rem, 6cqw, 6rem) clamp(2rem, 8cqw, 12rem)',
      loose: 'clamp(5rem, 10cqw, 10rem) clamp(3rem, 12cqw, 16rem)',
    },
  },

  scrollbar: { type: 'thin' },

  light: {
    background: '#FAF6ED',
    text: '#2A2520',
    textPrimary: '#2A2520',
    textSecondary: '#6B5E56',
    accent: '#8B6B47',
    interaction: '#8B6B47',
    colorPrimary: '#8B6B47',
    colorPrimaryContrast: '#FAF6ED',
    colorSecondary: '#EDE6D8',
    colorSecondaryContrast: '#2A2520',
    colorLink: '#8B6B47',
    colorFocus: '#8B6B47',
    scrollbarThumb: '#8B6B47',
    scrollbarTrack: '#FAF6ED',
    statusSuccess: '#2D7A3E',
    statusError: '#C03540',
  },

  dark: {
    background: '#2A2520',
    text: '#FAF6ED',
    textPrimary: '#FAF6ED',
    textSecondary: 'rgba(250, 246, 237, 0.7)',
    accent: '#C4A882',
    interaction: '#C4A882',
    colorPrimary: '#C4A882',
    colorPrimaryContrast: '#2A2520',
    colorSecondary: '#3D3530',
    colorSecondaryContrast: '#FAF6ED',
    colorLink: '#C4A882',
    colorFocus: '#C4A882',
    scrollbarThumb: 'rgba(250, 246, 237, 0.5)',
    scrollbarTrack: '#2A2520',
    statusSuccess: '#4ade80',
    statusError: '#fbbf24',
  },
})

registerTheme(boyMole)
