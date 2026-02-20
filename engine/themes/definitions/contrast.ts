/**
 * Contrast theme — bold dark/light palette.
 * Purple accent on high-contrast backgrounds.
 * Sharp, flat, editorial feel. Generous section spacing.
 */

import { createTheme } from '../utils'
import { registerTheme } from '../registry'

const contrast = createTheme({
  id: 'contrast',
  name: 'Contrast',
  description: 'Bold dark/light palette with purple accent.',
  defaultMode: 'dark',

  typography: {
    title: 'var(--font-inter), Inter, system-ui, -apple-system, sans-serif',
    heading: 'var(--font-inter), Inter, system-ui, -apple-system, sans-serif',
    paragraph: 'var(--font-plus-jakarta), Plus Jakarta Sans, system-ui, -apple-system, sans-serif',
    ui: 'var(--font-inter), Inter, system-ui, -apple-system, sans-serif',
    scale: {
      display: 'clamp(2rem, 6cqw, 6rem)',
      h1: '2.25rem',
      h2: '1.5rem',
      h3: '1.125rem',
      body: '1rem',
      small: '0.75rem',
      xs: '0.625rem',
    },
    fontWeights: { display: '700', heading: '600', body: '400', small: '400', xs: '400' },
    lineHeights: { display: '1.1', heading: '1.2', body: '1.5', small: '1.4', xs: '1.4' },
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
    sm: 'none',
    md: 'none',
    lg: '0 2px 8px rgba(0, 0, 0, 0.3)',
  },

  borders: {
    width: '1px',
    style: 'solid',
    color: 'currentColor',
    dividerOpacity: '0.15',
  },

  motion: {
    durationFast: '150ms',
    durationNormal: '300ms',
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
    hoverOpacity: '0.8',
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

  dark: {
    background: '#0a0a0a',
    text: '#ededed',
    textPrimary: '#ededed',
    textSecondary: '#999999',
    accent: '#9933FF',
    interaction: '#9933FF',
    colorPrimary: '#9933FF',
    colorPrimaryContrast: '#ffffff',
    colorSecondary: '#1a1a1a',
    colorSecondaryContrast: '#ffffff',
    colorLink: '#9933FF',
    colorFocus: '#9933FF',
    scrollbarThumb: '#ffffff',
    scrollbarTrack: '#0a0a0a',
    statusSuccess: '#4ade80',
    statusError: '#f87171',
  },

  light: {
    background: '#ffffff',
    text: '#171717',
    textPrimary: '#171717',
    textSecondary: '#666666',
    accent: '#9933FF',
    interaction: '#9933FF',
    colorPrimary: '#9933FF',
    colorPrimaryContrast: '#ffffff',
    colorSecondary: '#e0e0e0',
    colorSecondaryContrast: '#333333',
    colorLink: '#9933FF',
    colorFocus: '#9933FF',
    scrollbarThumb: '#cccccc',
    scrollbarTrack: '#f5f5f5',
    statusSuccess: '#22c55e',
    statusError: '#ef4444',
  },
})

registerTheme(contrast)
