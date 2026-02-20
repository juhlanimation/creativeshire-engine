/**
 * Monochrome theme — brutalist-minimal.
 * Archivo single-font system. Pure black/white,
 * electric orange accent. Zero radius, zero shadows, thick borders.
 */

import { createTheme } from '../utils'
import { registerTheme } from '../registry'

const monochrome = createTheme({
  id: 'monochrome',
  name: 'Monochrome',
  description: 'Brutalist-minimal with pure black/white and electric orange.',
  defaultMode: 'dark',

  typography: {
    title: 'var(--font-archivo), "Archivo", system-ui, -apple-system, sans-serif',
    heading: 'var(--font-archivo), "Archivo", system-ui, -apple-system, sans-serif',
    paragraph: 'var(--font-archivo), "Archivo", system-ui, -apple-system, sans-serif',
    ui: 'var(--font-archivo), "Archivo", system-ui, -apple-system, sans-serif',
    scale: {
      display: 'clamp(2.5rem, 7cqw, 8rem)',
      h1: '2.25rem',
      h2: '1.5rem',
      h3: '1.125rem',
      body: '0.9375rem',
      small: '0.75rem',
      xs: '0.625rem',
    },
    fontWeights: { display: '900', heading: '700', body: '400', small: '500', xs: '500' },
    lineHeights: { display: '1', heading: '1.15', body: '1.5', small: '1.4', xs: '1.4' },
    letterSpacings: { display: '-0.03em', heading: '-0.02em', body: '0em', small: '0.05em', xs: '0.05em' },
  },

  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '2rem',
    xl: '4rem',
    '2xl': '6rem',
    '3xl': '10rem',
    sectionX: 'clamp(1.5rem, 6cqw, 10rem)',
    sectionY: 'clamp(2.5rem, 5cqw, 5rem)',
  },

  radius: {
    none: '0',
    sm: '0',
    md: '0',
    lg: '0',
    full: '9999px',
  },

  shadows: {
    none: 'none',
    sm: 'none',
    md: 'none',
    lg: 'none',
  },

  borders: {
    width: '2px',
    style: 'solid',
    color: 'currentColor',
    dividerOpacity: '0.25',
  },

  motion: {
    durationFast: '100ms',
    durationNormal: '200ms',
    durationSlow: '350ms',
    easeDefault: 'cubic-bezier(0.25, 0, 0.75, 1)',
    easeIn: 'cubic-bezier(0.5, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.5, 1)',
  },

  textDecoration: {
    style: 'solid',
    thickness: '2px',
    offset: '3px',
    opacity: '1',
  },

  interaction: {
    hoverOpacity: '0.75',
    activeScale: '0.96',
    focusRingWidth: '2px',
    focusRingOffset: '0px',
  },

  layout: {
    gap: {
      none: '0',
      tight: 'clamp(0.5rem, 0.75cqw, 0.75rem)',
      normal: 'clamp(1rem, 2cqw, 2rem)',
      loose: 'clamp(2rem, 4cqw, 4rem)',
    },
    padding: {
      none: '0',
      tight: 'clamp(1.25rem, 2.5cqw, 2.5rem) clamp(1rem, 3cqw, 5rem)',
      normal: 'clamp(2.5rem, 5cqw, 5rem) clamp(1.5rem, 6cqw, 10rem)',
      loose: 'clamp(4rem, 8cqw, 8rem) clamp(2rem, 9cqw, 14rem)',
    },
  },

  dark: {
    background: '#000000',
    text: '#ffffff',
    textPrimary: '#ffffff',
    textSecondary: '#999999',
    accent: '#FF4D00',
    interaction: '#FF4D00',
    colorPrimary: '#FF4D00',
    colorPrimaryContrast: '#000000',
    colorSecondary: '#1A1A1A',
    colorSecondaryContrast: '#ffffff',
    colorLink: '#FF4D00',
    colorFocus: '#FF4D00',
    scrollbarThumb: '#ffffff',
    scrollbarTrack: '#000000',
    statusSuccess: '#00FF00',
    statusError: '#FF0000',
  },

  light: {
    background: '#ffffff',
    text: '#000000',
    textPrimary: '#000000',
    textSecondary: '#666666',
    accent: '#FF4D00',
    interaction: '#FF4D00',
    colorPrimary: '#FF4D00',
    colorPrimaryContrast: '#ffffff',
    colorSecondary: '#E5E5E5',
    colorSecondaryContrast: '#000000',
    colorLink: '#FF4D00',
    colorFocus: '#FF4D00',
    scrollbarThumb: '#000000',
    scrollbarTrack: '#ffffff',
    statusSuccess: '#00CC00',
    statusError: '#CC0000',
  },
})

registerTheme(monochrome)
