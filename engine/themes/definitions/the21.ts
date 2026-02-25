/**
 * The 21 theme — cinematic olive and cream.
 * Light-first with warm cream and olive accents.
 * Elegant, editorial feel. Inspired by THE 21 project.
 */

import { createTheme } from '../utils'
import { registerTheme } from '../registry'

const the21 = createTheme({
  id: 'the21',
  name: 'The 21',
  description: 'Cinematic olive and cream palette with editorial feel.',
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
    lg: '4px',
    full: '9999px',
  },

  shadows: {
    none: 'none',
    sm: '0 1px 3px rgba(59, 61, 46, 0.06)',
    md: '0 4px 12px rgba(59, 61, 46, 0.10)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.2)',
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

  light: {
    background: '#FDF9F0',
    text: '#2A2520',
    textPrimary: '#2A2520',
    textSecondary: '#6B6458',
    accent: '#3B3D2E',
    interaction: '#3B3D2E',
    colorPrimary: '#3B3D2E',
    colorPrimaryContrast: '#FDF9F0',
    colorSecondary: '#EDE8DA',
    colorSecondaryContrast: '#2A2520',
    colorLink: '#3B3D2E',
    colorFocus: '#3B3D2E',
    scrollbarThumb: '#3B3D2E',
    scrollbarTrack: '#FDF9F0',
    statusSuccess: '#2D7A3E',
    statusError: '#C03540',
  },

  dark: {
    background: '#3B3D2E',
    text: '#FDF9F0',
    textPrimary: '#FDF9F0',
    textSecondary: 'rgba(253, 249, 240, 0.7)',
    accent: '#FDF9F0',
    interaction: '#FDF9F0',
    colorPrimary: '#FDF9F0',
    colorPrimaryContrast: '#3B3D2E',
    colorSecondary: '#4A4C3A',
    colorSecondaryContrast: '#FDF9F0',
    colorLink: '#FDF9F0',
    colorFocus: '#FDF9F0',
    scrollbarThumb: 'rgba(253, 249, 240, 0.5)',
    scrollbarTrack: '#3B3D2E',
    statusSuccess: '#4ade80',
    statusError: '#fbbf24',
  },
})

registerTheme(the21)
