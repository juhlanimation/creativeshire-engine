/**
 * Simple with transitions experience metadata.
 * Loaded eagerly for UI listings without loading full experience.
 */

import { defineExperienceMeta } from '../registry'

/**
 * Configurable settings for the Simple + Transitions experience.
 */
interface SimpleTransitionsSettings {
  exitDuration: number
  entryDuration: number
  respectReducedMotion: boolean
}

export const meta = defineExperienceMeta<SimpleTransitionsSettings>({
  id: 'simple-transitions',
  name: 'Simple + Transitions',
  description: 'Simple layout with page fade transitions. For testing multi-page navigation.',
  icon: 'transition',
  tags: ['simple', 'transitions', 'fade', 'multi-page'],
  category: 'simple',
  settings: {
    exitDuration: {
      type: 'number',
      label: 'Exit Duration',
      description: 'Duration of page exit animation in milliseconds',
      default: 600,
      validation: { min: 0, max: 2000 },
      group: 'Animation',
    },
    entryDuration: {
      type: 'number',
      label: 'Entry Duration',
      description: 'Duration of page entry animation in milliseconds',
      default: 600,
      validation: { min: 0, max: 2000 },
      group: 'Animation',
    },
    respectReducedMotion: {
      type: 'toggle',
      label: 'Respect Reduced Motion',
      description: 'Skip transitions when user prefers reduced motion',
      default: true,
      group: 'Accessibility',
    },
  },
})
