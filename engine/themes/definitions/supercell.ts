/**
 * Supercell theme — pure black, high contrast.
 * Dark-first with monochrome palette. Bold, clean,
 * game-studio aesthetic. Inspired by Supercell/Clash Royale.
 */

import { createTheme } from '../utils'
import { registerTheme } from '../registry'

const supercell = createTheme({
  id: 'supercell',
  name: 'Supercell',
  description: 'Pure black palette with high contrast white. Game-studio aesthetic.',
  defaultMode: 'dark',

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
    lg: '4px',
    full: '9999px',
  },

  shadows: {
    none: 'none',
    sm: '0 1px 3px rgba(0, 0, 0, 0.2)',
    md: '0 4px 12px rgba(0, 0, 0, 0.3)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.5)',
  },

  borders: {
    width: '1px',
    style: 'solid',
    color: 'currentColor',
    dividerOpacity: '0.15',
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

  dark: {
    background: '#000000',
    text: '#ffffff',
    textPrimary: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.6)',
    accent: '#ffffff',
    interaction: '#ffffff',
    colorPrimary: '#ffffff',
    colorPrimaryContrast: '#000000',
    colorSecondary: '#1a1a1a',
    colorSecondaryContrast: '#ffffff',
    colorLink: '#ffffff',
    colorFocus: '#ffffff',
    scrollbarThumb: 'rgba(255, 255, 255, 0.4)',
    scrollbarTrack: '#000000',
    statusSuccess: '#4ade80',
    statusError: '#fbbf24',
  },

  light: {
    background: '#ffffff',
    text: '#000000',
    textPrimary: '#000000',
    textSecondary: '#666666',
    accent: '#000000',
    interaction: '#000000',
    colorPrimary: '#000000',
    colorPrimaryContrast: '#ffffff',
    colorSecondary: '#f0f0f0',
    colorSecondaryContrast: '#000000',
    colorLink: '#000000',
    colorFocus: '#000000',
    scrollbarThumb: '#000000',
    scrollbarTrack: '#ffffff',
    statusSuccess: '#2D7A3E',
    statusError: '#C03540',
  },
})

registerTheme(supercell)
