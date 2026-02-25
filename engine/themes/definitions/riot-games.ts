/**
 * Riot Games theme — near-black with crimson accents.
 * Dark-first with deep blacks and bold red highlights.
 * Intense, cinematic feel. Inspired by Riot Games branding.
 */

import { createTheme } from '../utils'
import { registerTheme } from '../registry'

const riotGames = createTheme({
  id: 'riot-games',
  name: 'Riot Games',
  description: 'Near-black palette with crimson red accents. Cinematic intensity.',
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
    sm: '0 1px 3px rgba(209, 54, 57, 0.08)',
    md: '0 4px 12px rgba(209, 54, 57, 0.12)',
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
    background: '#0B0A0A',
    text: '#ffffff',
    textPrimary: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.6)',
    accent: '#D13639',
    interaction: '#D13639',
    colorPrimary: '#D13639',
    colorPrimaryContrast: '#ffffff',
    colorSecondary: '#1a1818',
    colorSecondaryContrast: '#ffffff',
    colorLink: '#D13639',
    colorFocus: '#D13639',
    scrollbarThumb: 'rgba(255, 255, 255, 0.4)',
    scrollbarTrack: '#0B0A0A',
    statusSuccess: '#4ade80',
    statusError: '#D13639',
  },

  light: {
    background: '#F5F0EB',
    text: '#0B0A0A',
    textPrimary: '#0B0A0A',
    textSecondary: '#555050',
    accent: '#D13639',
    interaction: '#D13639',
    colorPrimary: '#D13639',
    colorPrimaryContrast: '#ffffff',
    colorSecondary: '#E8E2DC',
    colorSecondaryContrast: '#0B0A0A',
    colorLink: '#D13639',
    colorFocus: '#D13639',
    scrollbarThumb: '#D13639',
    scrollbarTrack: '#F5F0EB',
    statusSuccess: '#2D7A3E',
    statusError: '#D13639',
  },
})

registerTheme(riotGames)
