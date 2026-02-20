import type { Preview } from '@storybook/react'

// Global resets (box-sizing, margin resets) — matches app/globals.css
import './styles/reset.css'

// Web fonts (Inter, Plus Jakarta Sans) — matches next/font loading in app/layout.tsx
import './styles/fonts.css'

// Import all engine styles (container queries, widgets, sections, chrome, renderer)
import '../engine/styles.css'

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',

    options: {
      storySort: {
        order: [
          'Presets',
          'L1 Content', ['Widgets', ['Primitives', 'Layout', 'Interactive', 'Repeaters'],
                         'Sections', ['Hero', 'About', 'Project', 'Content'],
                         'Chrome'],
          'L2 Experience', ['Experiences', 'Behaviours', 'Intros'],
          'Theme Showcase', ['Overview', 'Colors', 'Typography',
                            'Spacing Layout', 'Surfaces', 'Interaction'],
        ],
      },
    },

    a11y: {
      test: 'todo'
    }
  },

  globalTypes: {
    colorTheme: {
      toolbar: {
        title: 'Theme',
        items: [
          { value: 'contrast', title: 'Contrast' },
          { value: 'muted', title: 'Muted' },
          { value: 'editorial', title: 'Editorial' },
          { value: 'neon', title: 'Neon' },
          { value: 'earthy', title: 'Earthy' },
          { value: 'monochrome', title: 'Monochrome' },
          { value: 'crossroad', title: 'Crossroad' },
        ],
        dynamicTitle: true,
      },
    },
    colorMode: {
      toolbar: {
        title: 'Mode',
        items: [
          { value: 'dark', title: 'Dark', icon: 'moon' },
          { value: 'light', title: 'Light', icon: 'sun' },
        ],
        dynamicTitle: true,
      },
    },
  },

  initialGlobals: {
    colorTheme: 'contrast',
    colorMode: 'dark',
  },
}

export default preview
