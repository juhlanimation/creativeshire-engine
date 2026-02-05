/**
 * Infinite Carousel experience metadata.
 * Loaded eagerly for UI listings without loading full experience.
 */

import { defineExperienceMeta } from '../registry'

/**
 * Configurable settings for the Infinite Carousel experience.
 */
interface InfiniteCarouselSettings {
  showNavigation: boolean
  navigationPosition: 'left' | 'center' | 'right'
  showArrows: boolean
  autohideNavigation: boolean
  hideFooter: boolean
}

export const meta = defineExperienceMeta<InfiniteCarouselSettings>({
  id: 'infinite-carousel',
  name: 'Infinite Carousel',
  description: 'Vertical infinite scroll with momentum physics and snap-to-section.',
  icon: 'scroll',
  tags: ['carousel', 'infinite', 'momentum', 'physics', 'scroll'],
  category: 'physics',
  settings: {
    showNavigation: {
      type: 'toggle',
      label: 'Show Navigation',
      description: 'Display the navigation timeline indicator',
      default: true,
      group: 'UI',
    },
    navigationPosition: {
      type: 'select',
      label: 'Navigation Position',
      description: 'Position of the navigation timeline',
      default: 'center',
      choices: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' },
      ],
      group: 'UI',
      condition: 'showNavigation === true',
    },
    showArrows: {
      type: 'toggle',
      label: 'Show Arrows',
      description: 'Display navigation arrows on the timeline',
      default: true,
      group: 'UI',
      condition: 'showNavigation === true',
    },
    autohideNavigation: {
      type: 'toggle',
      label: 'Auto-hide Navigation',
      description: 'Hide navigation after inactivity',
      default: true,
      group: 'UI',
      condition: 'showNavigation === true',
    },
    hideFooter: {
      type: 'toggle',
      label: 'Hide Footer',
      description: 'Hide the footer in carousel mode',
      default: true,
      group: 'Layout',
    },
  },
})
