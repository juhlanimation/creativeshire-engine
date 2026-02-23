/**
 * Crossroad theme — technical monospace palette.
 * JetBrains Mono + Noto Sans Mono dual-monospace system.
 * Near-black backgrounds, warm white text, periwinkle accent.
 * Zero radius, no shadows, thin borders.
 */

import { createTheme } from '../utils'
import { registerTheme } from '../registry'

const crossroad = createTheme({
  id: 'crossroad',
  name: 'Crossroad',
  description: 'Technical monospace palette with periwinkle accent.',
  defaultMode: 'dark',

  typography: {
    title:
      'var(--font-jetbrains-mono), "JetBrains Mono", monospace',
    heading:
      'var(--font-jetbrains-mono), "JetBrains Mono", monospace',
    paragraph:
      'var(--font-noto-sans-mono), "Noto Sans Mono", monospace',
    ui: 'var(--font-noto-sans-mono), "Noto Sans Mono", monospace',
    scale: {
      display: 'clamp(2.5rem, 6cqw, 6rem)',
      h1: '2.25rem',
      h2: '1.5rem',
      h3: '1.125rem',
      body: '1rem',
      small: '0.75rem',
      xs: '0.625rem',
    },
    fontWeights: { display: '700', heading: '500', body: '400', small: '400', xs: '400' },
    lineHeights: { display: '1.1', heading: '1.25', body: '1.6', small: '1.4', xs: '1.4' },
    letterSpacings: { display: '-0.02em', heading: '0em', body: '0em', small: '0.03em', xs: '0.03em' },
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
    width: '1px',
    style: 'solid',
    color: 'currentColor',
    dividerOpacity: '0.15',
  },

  motion: {
    durationFast: '150ms',
    durationNormal: '300ms',
    durationSlow: '500ms',
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

  scrollbar: { type: 'thin' },

  dark: {
    background: '#141413',
    text: '#E2DEDC',
    textPrimary: '#E2DEDC',
    textSecondary: '#A0A0A0',
    accent: '#8897ED',
    interaction: '#8897ED',
    colorPrimary: '#8897ED',
    colorPrimaryContrast: '#141413',
    colorSecondary: '#4B4C4C',
    colorSecondaryContrast: '#E2DEDC',
    colorLink: '#8897ED',
    colorFocus: '#8897ED',
    scrollbarThumb: '#E2DEDC',
    scrollbarTrack: '#141413',
    statusSuccess: '#4ade80',
    statusError: '#f87171',
  },

  light: {
    background: '#E2DEDC',
    text: '#141413',
    textPrimary: '#141413',
    textSecondary: '#4B4C4C',
    accent: '#5C6BC0',
    interaction: '#5C6BC0',
    colorPrimary: '#5C6BC0',
    colorPrimaryContrast: '#ffffff',
    colorSecondary: '#D0CCC8',
    colorSecondaryContrast: '#141413',
    colorLink: '#5C6BC0',
    colorFocus: '#5C6BC0',
    scrollbarThumb: '#A0A0A0',
    scrollbarTrack: '#E2DEDC',
    statusSuccess: '#16a34a',
    statusError: '#dc2626',
  },
})

registerTheme(crossroad)
