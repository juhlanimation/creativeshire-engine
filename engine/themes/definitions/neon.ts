/**
 * Neon theme — electric dark-first.
 * Syne + Space Grotesk. Near-black backgrounds,
 * electric cyan accent with glow shadows. Agency/tech feel.
 */

import { createTheme } from '../utils'
import { registerTheme } from '../registry'

const neon = createTheme({
  id: 'neon',
  name: 'Neon',
  description: 'Electric dark-first palette with cyan neon glow.',
  defaultMode: 'dark',

  typography: {
    title: 'var(--font-syne), "Syne", system-ui, -apple-system, sans-serif',
    heading: 'var(--font-syne), "Syne", system-ui, -apple-system, sans-serif',
    paragraph: 'var(--font-space-grotesk), "Space Grotesk", system-ui, -apple-system, sans-serif',
    ui: 'var(--font-space-grotesk), "Space Grotesk", system-ui, -apple-system, sans-serif',
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
    letterSpacings: { display: '-0.03em', heading: '-0.01em', body: '0em', small: '0.02em', xs: '0.02em' },
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
    sm: '6px',
    md: '12px',
    lg: '20px',
    full: '9999px',
  },

  shadows: {
    none: 'none',
    sm: '0 0 8px rgba(0, 255, 224, 0.15)',
    md: '0 0 20px rgba(0, 255, 224, 0.2)',
    lg: '0 0 40px rgba(0, 255, 224, 0.25)',
  },

  borders: {
    width: '1px',
    style: 'solid',
    color: 'rgba(255, 255, 255, 0.12)',
    dividerOpacity: '0.12',
  },

  motion: {
    durationFast: '120ms',
    durationNormal: '250ms',
    durationSlow: '400ms',
    easeDefault: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
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
    hoverOpacity: '0.9',
    activeScale: '0.97',
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

  dark: {
    background: '#0A0A0A',
    text: '#E0E0E0',
    textPrimary: '#E0E0E0',
    textSecondary: '#808080',
    accent: '#00FFE0',
    interaction: '#00FFE0',
    colorPrimary: '#00FFE0',
    colorPrimaryContrast: '#0A0A0A',
    colorSecondary: '#1A1A1A',
    colorSecondaryContrast: '#E0E0E0',
    colorLink: '#00FFE0',
    colorFocus: '#00FFE0',
    scrollbarThumb: '#00FFE0',
    scrollbarTrack: '#0A0A0A',
    statusSuccess: '#00FF88',
    statusError: '#FF4466',
  },

  light: {
    background: '#F2F2F0',
    text: '#141414',
    textPrimary: '#141414',
    textSecondary: '#5A5A5A',
    accent: '#00B8A3',
    interaction: '#00B8A3',
    colorPrimary: '#00B8A3',
    colorPrimaryContrast: '#ffffff',
    colorSecondary: '#E0E0DE',
    colorSecondaryContrast: '#141414',
    colorLink: '#00B8A3',
    colorFocus: '#00B8A3',
    scrollbarThumb: '#00B8A3',
    scrollbarTrack: '#F2F2F0',
    statusSuccess: '#16a34a',
    statusError: '#dc2626',
  },
})

registerTheme(neon)
