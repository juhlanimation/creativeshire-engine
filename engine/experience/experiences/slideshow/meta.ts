/**
 * Slideshow experience metadata.
 * Loaded eagerly for UI listings without loading full experience.
 */

import { defineExperienceMeta } from '../registry'

/**
 * Configurable settings for the Slideshow experience.
 */
interface SlideshowSettings {
  transitionDuration: number
  transitionEasing: string
  loop: boolean
  indicatorPosition: 'left' | 'right'
  indicatorStyle: 'dots' | 'lines' | 'numbers'
  showIndicators: boolean
  hideFooter: boolean
}

export const meta = defineExperienceMeta<SlideshowSettings>({
  id: 'slideshow',
  name: 'Slideshow',
  description: 'Full-screen slides with navigation. Sections become slides.',
  icon: 'presentation',
  tags: ['slides', 'fullscreen', 'navigation', 'presentation'],
  category: 'presentation',
  settings: {
    transitionDuration: {
      type: 'number',
      label: 'Transition Duration',
      description: 'Duration of slide transitions in milliseconds',
      default: 600,
      min: 200,
      max: 2000,
      group: 'Animation',
    },
    transitionEasing: {
      type: 'select',
      label: 'Transition Easing',
      description: 'Easing function for slide transitions',
      default: 'ease-out',
      choices: [
        { value: 'ease', label: 'Ease' },
        { value: 'ease-in', label: 'Ease In' },
        { value: 'ease-out', label: 'Ease Out' },
        { value: 'ease-in-out', label: 'Ease In-Out' },
        { value: 'linear', label: 'Linear' },
      ],
      group: 'Animation',
    },
    loop: {
      type: 'toggle',
      label: 'Loop Slides',
      description: 'Loop back to first slide after last slide',
      default: false,
      group: 'Navigation',
    },
    showIndicators: {
      type: 'toggle',
      label: 'Show Indicators',
      description: 'Display slide position indicators',
      default: true,
      group: 'UI',
    },
    indicatorPosition: {
      type: 'select',
      label: 'Indicator Position',
      description: 'Position of slide indicators on screen',
      default: 'right',
      choices: [
        { value: 'left', label: 'Left' },
        { value: 'right', label: 'Right' },
      ],
      group: 'UI',
      condition: 'showIndicators === true',
    },
    indicatorStyle: {
      type: 'select',
      label: 'Indicator Style',
      description: 'Visual style of slide indicators',
      default: 'dots',
      choices: [
        { value: 'dots', label: 'Dots' },
        { value: 'lines', label: 'Lines' },
        { value: 'numbers', label: 'Numbers' },
      ],
      group: 'UI',
      condition: 'showIndicators === true',
    },
    hideFooter: {
      type: 'toggle',
      label: 'Hide Footer',
      description: 'Hide the footer in slideshow mode',
      default: true,
      group: 'Layout',
    },
  },
})
