# Settings Layer

> Platform UI configuration for components.

---

## Overview

The Settings Layer provides metadata for the platform to understand what settings each component exposes and how to render UI controls for them.

---

## Architecture

```
Engine (capability)           Platform (exposure)
      │                             │
      ▼                             ▼
ComponentMeta<T>              Platform UI decides
 - what CAN be configured      which settings to show
 - type-safe over props        (may hide advanced)
```

**Separation of Concerns:**
- Engine = provides capability (what CAN be configured)
- Platform = decides exposure (what to SHOW in UI)

---

## Key Types

### SettingConfig

Configuration for a single setting exposed to the platform UI.

```typescript
interface SettingConfig {
  type: SettingType        // UI control type
  label: string            // Display label
  default: SettingValue    // Default value
  description?: string     // Help text
  group?: string           // UI grouping (e.g., "Layout", "Typography")
  advanced?: boolean       // Hide in basic mode
  condition?: string       // Show when: "otherSetting === 'value'"

  // Type-specific options
  min?: number             // For range/number
  max?: number             // For range/number
  step?: number            // For range/number
  choices?: SettingChoice[]  // For select
  validation?: SettingValidation  // Input validation
}
```

### SettingType

Available UI control types:

| Type | UI Control | Example |
|------|------------|---------|
| `range` | Slider | Font size 12-48px |
| `select` | Dropdown | Element type h1-h6 |
| `toggle` | Switch | Enable/disable feature |
| `color` | Color picker | Background color |
| `text` | Text input | Alt text, labels |
| `textarea` | Multi-line text | Bio, description |
| `number` | Number input | Grid columns |
| `image` | Image picker | Thumbnail source |
| `video` | Video picker | Background video |
| `icon` | Icon picker | Icon name |
| `spacing` | Spacing control | Gap, padding |
| `alignment` | Alignment picker | Align start/center/end |
| `custom` | Platform-defined | Complex arrays, objects |

### ComponentMeta<T>

Metadata for a component, type-safe over its props interface.

```typescript
interface ComponentMeta<T = unknown> {
  id: string               // Unique identifier
  name: string             // Display name
  description: string      // Component description
  category: ComponentCategory
  icon?: string            // Icon identifier
  tags?: string[]          // Searchable tags
  component?: boolean      // true = React, false = factory
  settings?: SettingsConfig<T>
  preview?: string         // Preview image URL
  docs?: string            // Documentation link
  minVersion?: string      // Minimum engine version
  deprecated?: { message: string; alternative?: string }
}
```

### ComponentCategory

```typescript
type ComponentCategory =
  | 'primitive'     // Leaf widgets (Text, Image, etc.)
  | 'layout'        // Containers (Flex, Grid, etc.)
  | 'pattern'       // Factory functions (ProjectCard, etc.)
  | 'interactive'   // Stateful components (Video, etc.)
  | 'section'       // Section patterns (Hero, About, etc.)
  | 'region'        // Chrome regions (Header, Footer)
  | 'overlay'       // Chrome overlays (Modal, Tooltip)
  | 'behaviour'     // Experience behaviours
```

---

## File Structure

Every component folder should have a `meta.ts`:

```
{Component}/
├── index.tsx          # Component implementation
├── types.ts           # Props interface
├── meta.ts            # ComponentMeta definition ← required
└── styles.css         # Optional styling
```

---

## Example: Text Widget Meta

```typescript
// engine/content/widgets/primitives/Text/meta.ts

import { defineMeta } from '@/engine/schema/meta'
import type { TextProps } from './types'

export const meta = defineMeta<TextProps>({
  id: 'Text',
  name: 'Text',
  description: 'Displays text content with semantic HTML elements',
  category: 'primitive',
  icon: 'text',
  tags: ['content', 'typography', 'heading', 'paragraph'],
  component: true,

  settings: {
    content: {
      type: 'textarea',
      label: 'Content',
      default: '',
      description: 'Text content to display',
      validation: { required: true },
    },
    as: {
      type: 'select',
      label: 'Element',
      default: 'p',
      description: 'HTML element to render',
      choices: [
        { value: 'p', label: 'Paragraph' },
        { value: 'h1', label: 'Heading 1' },
        { value: 'h2', label: 'Heading 2' },
        // ...
      ],
    },
    variant: {
      type: 'text',
      label: 'Variant',
      default: '',
      description: 'Semantic variant for CSS styling',
      advanced: true,
    },
  },
})
```

---

## Pattern vs Interactive

**Patterns** (factory functions) have `component: false`:
```typescript
export const meta = defineMeta<ProjectCardConfig>({
  id: 'ProjectCard',
  category: 'pattern',
  component: false,  // Factory function, returns WidgetSchema
  // ...
})
```

**Interactive** (React components) have `component: true`:
```typescript
export const meta = defineMeta<VideoProps>({
  id: 'Video',
  category: 'interactive',
  component: true,  // React component with state
  // ...
})
```

---

## Conditional Settings

Use `condition` to show settings only when other settings have specific values:

```typescript
settings: {
  hoverPlay: {
    type: 'toggle',
    label: 'Hover Play',
    default: false,
  },
  autoplay: {
    type: 'toggle',
    label: 'Autoplay',
    default: true,
    condition: 'hoverPlay === false',  // Only show when hoverPlay is disabled
  },
}
```

---

## Grouped Settings

Use `group` to organize settings in the UI:

```typescript
settings: {
  contactEmail: {
    type: 'text',
    label: 'Email',
    group: 'Contact',
  },
  contactLinkedin: {
    type: 'text',
    label: 'LinkedIn',
    group: 'Contact',
  },
  studioUrl: {
    type: 'text',
    label: 'Website',
    group: 'Studio',
  },
}
```

---

## Validation

```typescript
settings: {
  email: {
    type: 'text',
    label: 'Email',
    validation: {
      required: true,
      pattern: '^[^@]+@[^@]+\\.[^@]+$',
      message: 'Please enter a valid email address',
    },
  },
}
```

---

## Advanced Settings

Mark settings as `advanced: true` to hide them in basic mode:

```typescript
settings: {
  objectPosition: {
    type: 'text',
    label: 'Object Position',
    default: 'center',
    advanced: true,  // Hidden in basic mode
  },
}
```

---

## Architecture Tests

The engine enforces meta.ts through architecture tests:

```typescript
// __tests__/architecture/meta.test.ts

it('every primitive widget has meta.ts')
it('every layout widget has meta.ts')
it('every pattern has meta.ts with component: false')
it('every interactive has meta.ts with component: true')
it('all meta.ts files have required fields')
```

---

## See Also

- [Folder Structure](../reference/folders.spec.md) - File organization
- [Content Layer](./content.spec.md) - Widgets, sections, chrome
- [Schema Layer](./schema.spec.md) - Type definitions
