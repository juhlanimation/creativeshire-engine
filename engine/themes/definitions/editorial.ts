/**
 * Editorial theme — elegant serif-forward.
 * Instrument Serif + DM Sans. Warm ivory backgrounds,
 * deep navy accent. Magazine-inspired, refined feel.
 */

import { createTheme } from '../utils'
import { registerTheme } from '../registry'

const editorial = createTheme({
  id: 'editorial',
  name: 'Editorial',
  description: 'Elegant serif-forward palette with warm ivory and deep navy.',
  defaultMode: 'light',

  typography: {
    title: 'var(--font-instrument-serif), "Instrument Serif", Georgia, serif',
    heading: 'var(--font-instrument-serif), "Instrument Serif", Georgia, serif',
    paragraph: 'var(--font-dm-sans), "DM Sans", system-ui, -apple-system, sans-serif',
    ui: 'var(--font-dm-sans), "DM Sans", system-ui, -apple-system, sans-serif',
    scale: {
      display: 'clamp(3rem, 7cqw, 7rem)',
      h1: '2.5rem',
      h2: '1.625rem',
      h3: '1.25rem',
      body: '1.0625rem',
      small: '0.75rem',
      xs: '0.625rem',
    },
    fontWeights: { display: '400', heading: '400', body: '400', small: '400', xs: '400' },
    lineHeights: { display: '1.15', heading: '1.3', body: '1.6', small: '1.4', xs: '1.4' },
    letterSpacings: { display: '-0.01em', heading: '0em', body: '0em', small: '0.03em', xs: '0.03em' },
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
    sm: '4px',
    md: '8px',
    lg: '12px',
    full: '9999px',
  },

  shadows: {
    none: 'none',
    sm: '0 1px 3px rgba(20, 18, 24, 0.06)',
    md: '0 4px 12px rgba(20, 18, 24, 0.08)',
    lg: '0 8px 24px rgba(20, 18, 24, 0.12)',
  },

  borders: {
    width: '1px',
    style: 'solid',
    color: 'currentColor',
    dividerOpacity: '0.12',
  },

  motion: {
    durationFast: '180ms',
    durationNormal: '350ms',
    durationSlow: '600ms',
    easeDefault: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    easeIn: 'cubic-bezier(0.42, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.58, 1)',
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

  light: {
    background: '#F5F2ED',
    text: '#1A1A1A',
    textPrimary: '#1A1A1A',
    textSecondary: '#6B6460',
    accent: '#1B2B5A',
    interaction: '#1B2B5A',
    colorPrimary: '#1B2B5A',
    colorPrimaryContrast: '#ffffff',
    colorSecondary: '#E8E4DE',
    colorSecondaryContrast: '#1A1A1A',
    colorLink: '#1B2B5A',
    colorFocus: '#1B2B5A',
    scrollbarThumb: '#B0ADA8',
    scrollbarTrack: '#F5F2ED',
    statusSuccess: '#22804A',
    statusError: '#C03030',
  },

  dark: {
    background: '#141218',
    text: '#E8E4DE',
    textPrimary: '#E8E4DE',
    textSecondary: '#9A958F',
    accent: '#8FA7D4',
    interaction: '#8FA7D4',
    colorPrimary: '#8FA7D4',
    colorPrimaryContrast: '#141218',
    colorSecondary: '#1E1C22',
    colorSecondaryContrast: '#E8E4DE',
    colorLink: '#8FA7D4',
    colorFocus: '#8FA7D4',
    scrollbarThumb: '#4A4650',
    scrollbarTrack: '#141218',
    statusSuccess: '#4ade80',
    statusError: '#f87171',
  },
})

registerTheme(editorial)
