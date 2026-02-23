/**
 * Muted theme — warm understated palette.
 * Charcoal on warm beige, Scandinavian-inspired.
 * Flat, sharp, spacious. Dashed line accents.
 */

import { createTheme } from '../utils'
import { registerTheme } from '../registry'

const muted = createTheme({
  id: 'muted',
  name: 'Muted',
  description: 'Warm understated palette with charcoal and beige.',
  defaultMode: 'light',

  typography: {
    title: '"BBH Sans Hegarty", system-ui, sans-serif',
    heading: 'var(--font-inter), Inter, system-ui, sans-serif',
    paragraph: 'var(--font-plus-jakarta), Plus Jakarta Sans, system-ui, sans-serif',
    ui: 'var(--font-plus-jakarta), Plus Jakarta Sans, system-ui, sans-serif',
    scale: {
      display: 'clamp(4.5rem, 8cqw, 6rem)',
      h1: '2.25rem',
      h2: '1.5rem',
      h3: '1rem',
      body: '0.875rem',
      small: '0.75rem',
      xs: '0.625rem',
    },
    fontWeights: { display: '400', heading: '500', body: '400', small: '400', xs: '400' },
    lineHeights: { display: '1.1', heading: '1.25', body: '1.6', small: '1.4', xs: '1.4' },
    letterSpacings: { display: '-0.01em', heading: '0em', body: '0em', small: '0.04em', xs: '0.04em' },
  },

  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '2rem',
    xl: '4rem',
    '2xl': '8rem',
    '3xl': '12rem',
    sectionX: 'clamp(1.5rem, 10cqw, 12rem)',
    sectionY: 'clamp(4rem, 8cqw, 8rem)',
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
    style: 'dashed',
    color: 'currentColor',
    dividerOpacity: '0.5',
  },

  motion: {
    durationFast: '150ms',
    durationNormal: '300ms',
    durationSlow: '500ms',
    easeDefault: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  },

  textDecoration: {
    style: 'dashed',
    thickness: '1px',
    offset: '4px',
    opacity: '0.6',
    dashLength: '9px',
    gapLength: '6px',
  },

  interaction: {
    hoverOpacity: '1',
    activeScale: '1',
    focusRingWidth: '2px',
    focusRingOffset: '3px',
  },

  layout: {
    gap: {
      none: '0',
      tight: 'clamp(0.75rem, 1.5cqw, 1.5rem)',
      normal: 'clamp(2rem, 4cqw, 4rem)',
      loose: 'clamp(4rem, 6cqw, 6rem)',
    },
    padding: {
      none: '0',
      tight: 'clamp(2rem, 4cqw, 4rem) clamp(1rem, 5cqw, 6rem)',
      normal: 'clamp(4rem, 8cqw, 8rem) clamp(1.5rem, 10cqw, 12rem)',
      loose: 'clamp(6rem, 12cqw, 12rem) clamp(2rem, 14cqw, 16rem)',
    },
  },

  scrollbar: { type: 'pill' },

  light: {
    background: '#d8d8d5',
    text: '#27272A',
    textPrimary: '#27272A',
    textSecondary: '#71717A',
    accent: '#27272A',
    interaction: '#27272A',
    colorPrimary: '#27272A',
    colorPrimaryContrast: '#ffffff',
    colorSecondary: '#c8c8c5',
    colorSecondaryContrast: '#27272A',
    colorLink: '#27272A',
    colorFocus: '#27272A',
    scrollbarThumb: '#27272A',
    scrollbarTrack: '#d8d8d5',
    statusSuccess: '#16a34a',
    statusError: '#dc2626',
  },

  dark: {
    background: '#27272A',
    text: '#d8d8d5',
    textPrimary: '#d8d8d5',
    textSecondary: '#a1a1aa',
    accent: '#d8d8d5',
    interaction: '#d8d8d5',
    colorPrimary: '#d8d8d5',
    colorPrimaryContrast: '#27272A',
    colorSecondary: '#3f3f46',
    colorSecondaryContrast: '#d8d8d5',
    colorLink: '#d8d8d5',
    colorFocus: '#d8d8d5',
    scrollbarThumb: '#d8d8d5',
    scrollbarTrack: '#27272A',
    statusSuccess: '#4ade80',
    statusError: '#f87171',
  },
})

registerTheme(muted)
