/**
 * State Controls for Behaviour Stories.
 * Maps BehaviourState fields to Storybook argTypes based on a behaviour's `requires` array.
 *
 * Usage:
 *   const argTypes = stateArgTypes(behaviour.requires ?? [])
 *   const defaults = stateDefaults(behaviour.requires ?? [])
 */

interface ArgType {
  control: { type: string; min?: number; max?: number; step?: number }
  description?: string
  options?: string[]
  table?: { category?: string }
}

/**
 * Known BehaviourState fields and their Storybook control mappings.
 * Each entry defines how a state field should appear in the Storybook controls panel.
 */
const STATE_FIELD_MAP: Record<string, { argType: ArgType; defaultValue: unknown }> = {
  // Scroll state
  scrollProgress: {
    argType: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      description: 'Global scroll progress (0 = top, 1 = bottom)',
      table: { category: 'State' },
    },
    defaultValue: 0.5,
  },
  scrollVelocity: {
    argType: {
      control: { type: 'range', min: -2, max: 2, step: 0.05 },
      description: 'Scroll speed and direction (positive = down)',
      table: { category: 'State' },
    },
    defaultValue: 0,
  },
  sectionProgress: {
    argType: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      description: 'Progress within current section (0-1)',
      table: { category: 'State' },
    },
    defaultValue: 0.5,
  },
  sectionVisibility: {
    argType: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      description: 'Intersection ratio of section (0 = hidden, 1 = fully visible)',
      table: { category: 'State' },
    },
    defaultValue: 0.5,
  },
  sectionIndex: {
    argType: {
      control: { type: 'number', min: 0, max: 20, step: 1 },
      description: 'Position in section list (0-indexed)',
      table: { category: 'State' },
    },
    defaultValue: 0,
  },
  totalSections: {
    argType: {
      control: { type: 'number', min: 1, max: 20, step: 1 },
      description: 'Total section count',
      table: { category: 'State' },
    },
    defaultValue: 5,
  },
  isActive: {
    argType: {
      control: { type: 'boolean' },
      description: 'Section currently active',
      table: { category: 'State' },
    },
    defaultValue: true,
  },

  // Hover/press state
  isHovered: {
    argType: {
      control: { type: 'boolean' },
      description: 'Whether element is hovered',
      table: { category: 'State' },
    },
    defaultValue: false,
  },
  isPressed: {
    argType: {
      control: { type: 'boolean' },
      description: 'Whether element is pressed',
      table: { category: 'State' },
    },
    defaultValue: false,
  },

  // User preferences
  prefersReducedMotion: {
    argType: {
      control: { type: 'boolean' },
      description: 'User prefers reduced motion (a11y)',
      table: { category: 'State' },
    },
    defaultValue: false,
  },

  // Intro state
  introPhase: {
    argType: {
      control: { type: 'select' },
      options: ['locked', 'revealing', 'ready'],
      description: 'Intro phase lifecycle',
      table: { category: 'State' },
    },
    defaultValue: 'locked',
  },
  introProgress: {
    argType: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      description: 'Intro reveal progress (0-1)',
      table: { category: 'State' },
    },
    defaultValue: 0,
  },
  isIntroLocked: {
    argType: {
      control: { type: 'boolean' },
      description: 'Whether intro is locking scroll',
      table: { category: 'State' },
    },
    defaultValue: true,
  },

  // Intro behaviour aliases (some behaviours use 'phase' / 'revealProgress' instead)
  phase: {
    argType: {
      control: { type: 'select' },
      options: ['intro-locked', 'intro-revealing', 'ready'],
      description: 'Phase (locked / revealing / ready)',
      table: { category: 'State' },
    },
    defaultValue: 'intro-locked',
  },
  revealProgress: {
    argType: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      description: 'Reveal progress (0-1)',
      table: { category: 'State' },
    },
    defaultValue: 0,
  },

  // Video state
  videoTime: {
    argType: {
      control: { type: 'range', min: 0, max: 10, step: 0.1 },
      description: 'Video playback time in seconds',
      table: { category: 'State' },
    },
    defaultValue: 0,
  },
}

/**
 * Generate Storybook argTypes for the state fields a behaviour requires.
 * Only includes controls for fields the behaviour actually reads.
 */
export function stateArgTypes(requires: string[]): Record<string, ArgType> {
  const argTypes: Record<string, ArgType> = {}
  for (const field of requires) {
    const mapping = STATE_FIELD_MAP[field]
    if (mapping) {
      argTypes[field] = mapping.argType
    }
  }
  return argTypes
}

/**
 * Generate default values for the state fields a behaviour requires.
 */
export function stateDefaults(requires: string[]): Record<string, unknown> {
  const defaults: Record<string, unknown> = {}
  for (const field of requires) {
    const mapping = STATE_FIELD_MAP[field]
    if (mapping) {
      defaults[field] = mapping.defaultValue
    }
  }
  return defaults
}
