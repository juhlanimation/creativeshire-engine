/**
 * Earthy theme — nature-inspired warmth.
 * Manrope single-font system. Cream backgrounds,
 * forest green accent with green-tinted shadows. Calm, organic feel.
 */

import { createTheme } from '../utils'
import { registerTheme } from '../registry'

const earthy = createTheme({
  id: 'earthy',
  name: 'Earthy',
  description: 'Nature-inspired palette with cream and forest green.',
  defaultMode: 'light',

  typography: {
    title: 'var(--font-manrope), "Manrope", system-ui, -apple-system, sans-serif',
    heading: 'var(--font-manrope), "Manrope", system-ui, -apple-system, sans-serif',
    paragraph: 'var(--font-manrope), "Manrope", system-ui, -apple-system, sans-serif',
    ui: 'var(--font-manrope), "Manrope", system-ui, -apple-system, sans-serif',
    scale: {
      display: 'clamp(2.5rem, 5.5cqw, 5.5rem)',
      h1: '2rem',
      h2: '1.5rem',
      h3: '1.125rem',
      body: '1rem',
      small: '0.75rem',
      xs: '0.625rem',
    },
    fontWeights: { display: '700', heading: '600', body: '400', small: '400', xs: '400' },
    lineHeights: { display: '1.15', heading: '1.3', body: '1.6', small: '1.45', xs: '1.4' },
    letterSpacings: { display: '-0.01em', heading: '0em', body: '0em', small: '0.01em', xs: '0.01em' },
  },

  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '2rem',
    xl: '4rem',
    '2xl': '7rem',
    '3xl': '11rem',
    sectionX: 'clamp(2rem, 8cqw, 12rem)',
    sectionY: 'clamp(3.5rem, 7cqw, 7rem)',
  },

  radius: {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '16px',
    full: '9999px',
  },

  shadows: {
    none: 'none',
    sm: '0 1px 4px rgba(45, 95, 62, 0.08)',
    md: '0 4px 16px rgba(45, 95, 62, 0.1)',
    lg: '0 8px 32px rgba(45, 95, 62, 0.14)',
  },

  borders: {
    width: '1px',
    style: 'solid',
    color: 'currentColor',
    dividerOpacity: '0.15',
  },

  motion: {
    durationFast: '200ms',
    durationNormal: '400ms',
    durationSlow: '650ms',
    easeDefault: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  },

  textDecoration: {
    style: 'solid',
    thickness: '1px',
    offset: '5px',
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
      tight: 'clamp(0.75rem, 1.5cqw, 1.5rem)',
      normal: 'clamp(2rem, 3.5cqw, 3.5rem)',
      loose: 'clamp(3.5rem, 6cqw, 6rem)',
    },
    padding: {
      none: '0',
      tight: 'clamp(2rem, 3.5cqw, 3.5rem) clamp(1rem, 4cqw, 6rem)',
      normal: 'clamp(3.5rem, 7cqw, 7rem) clamp(2rem, 8cqw, 12rem)',
      loose: 'clamp(5.5rem, 11cqw, 11rem) clamp(3rem, 12cqw, 16rem)',
    },
  },

  scrollbar: { type: 'pill' },

  light: {
    background: '#FAF7F2',
    text: '#1C1F1A',
    textPrimary: '#1C1F1A',
    textSecondary: '#6B6E66',
    accent: '#2D5F3E',
    interaction: '#2D5F3E',
    colorPrimary: '#2D5F3E',
    colorPrimaryContrast: '#ffffff',
    colorSecondary: '#EDE9E0',
    colorSecondaryContrast: '#1C1F1A',
    colorLink: '#2D5F3E',
    colorFocus: '#2D5F3E',
    scrollbarThumb: '#A8A599',
    scrollbarTrack: '#FAF7F2',
    statusSuccess: '#2D7A3E',
    statusError: '#B83D2E',
  },

  dark: {
    background: '#1C1F1A',
    text: '#E5E2DA',
    textPrimary: '#E5E2DA',
    textSecondary: '#928F87',
    accent: '#6DB88A',
    interaction: '#6DB88A',
    colorPrimary: '#6DB88A',
    colorPrimaryContrast: '#1C1F1A',
    colorSecondary: '#272A24',
    colorSecondaryContrast: '#E5E2DA',
    colorLink: '#6DB88A',
    colorFocus: '#6DB88A',
    scrollbarThumb: '#4A4D44',
    scrollbarTrack: '#1C1F1A',
    statusSuccess: '#4ade80',
    statusError: '#f87171',
  },
})

registerTheme(earthy)
