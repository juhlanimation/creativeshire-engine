# Settings Layer

> Defines the schema for component customization: what settings exist, their types, constraints, defaults, and UI metadata for visual editors.

---

## Purpose

The Settings Layer bridges the gap between TypeScript prop interfaces (developer-facing) and CMS editor interfaces (user-facing). While `TextProps` tells developers what props the Text widget accepts, `TextSettings` tells the CMS editor what fields to show, how to validate input, and how to group related options.

This enables:
- **Visual editors** to render appropriate controls (text input, color picker, dropdown)
- **Runtime validation** of user-provided values
- **Default values** centralized and documented
- **Conditional settings** that appear based on other settings
- **Responsive settings** with per-breakpoint overrides

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    CREATIVESHIRE PLATFORM                    │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Visual Editor (future)                  │    │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐             │    │
│  │  │ TextBox │  │ Slider  │  │ Select  │   ...       │    │
│  │  └────┬────┘  └────┬────┘  └────┬────┘             │    │
│  └───────│────────────│────────────│───────────────────┘    │
│          │            │            │                         │
│          ▼            ▼            ▼                         │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              SettingsSchema (this layer)             │    │
│  │  • Field definitions (type, constraints, UI hints)  │    │
│  │  • Grouping and ordering                            │    │
│  │  • Conditional visibility                           │    │
│  │  • Default values                                   │    │
│  └───────────────────────────┬─────────────────────────┘    │
└──────────────────────────────│──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   CREATIVESHIRE ENGINE                       │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                    WidgetSchema                      │    │
│  │        props: Record<string, SerializableValue>     │    │
│  └───────────────────────────┬─────────────────────────┘    │
│                              │                               │
│                              ▼                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                   Widget Component                   │    │
│  │              (consumes props at render)             │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## Owns

```
creativeshire/settings/
├── index.ts                    # Barrel export
├── types.ts                    # Core setting field types
├── registry.ts                 # Settings schema registry
├── validate.ts                 # Runtime validation utilities
├── defaults.ts                 # Default value resolution
└── widgets/                    # Per-widget settings schemas
    ├── Text.settings.ts
    ├── Image.settings.ts
    ├── Flex.settings.ts
    └── ...
```

---

## Core Types

### SettingsSchema

The root type describing all settings for a component.

```typescript
// settings/types.ts

export interface SettingsSchema {
  /** Component this schema describes */
  component: string

  /** Human-readable name for UI */
  displayName: string

  /** Brief description of the component */
  description?: string

  /** Icon identifier for component picker */
  icon?: string

  /** Grouped settings fields */
  groups: SettingsGroup[]

  /** Ungrouped fields (shown at top) */
  fields?: SettingsField[]
}
```

### SettingsGroup

Organizes related settings into collapsible sections.

```typescript
export interface SettingsGroup {
  /** Unique identifier */
  id: string

  /** Display label */
  label: string

  /** Optional description */
  description?: string

  /** Collapsed by default? */
  collapsed?: boolean

  /** Fields in this group */
  fields: SettingsField[]

  /** Condition to show this group */
  showWhen?: SettingsCondition
}
```

### SettingsField

Individual setting with type, constraints, and UI metadata.

```typescript
export interface SettingsField {
  /** Maps to prop name */
  key: string

  /** Field type determines UI control */
  type: SettingsFieldType

  /** Display label */
  label: string

  /** Help text / description */
  description?: string

  /** Placeholder for text inputs */
  placeholder?: string

  /** Default value if not set */
  default?: SerializableValue

  /** Is this field required? */
  required?: boolean

  /** Condition to show this field */
  showWhen?: SettingsCondition

  /** Type-specific options */
  options?: FieldTypeOptions

  /** Supports responsive values? */
  responsive?: boolean
}
```

### SettingsFieldType

```typescript
export type SettingsFieldType =
  // Primitives
  | 'text'           // Single line text
  | 'textarea'       // Multi-line text
  | 'number'         // Numeric input
  | 'boolean'        // Toggle/checkbox
  | 'select'         // Dropdown single select
  | 'multiselect'    // Dropdown multi select
  | 'radio'          // Radio button group

  // Rich types
  | 'color'          // Color picker
  | 'image'          // Image upload/select
  | 'video'          // Video upload/select
  | 'icon'           // Icon picker
  | 'link'           // URL with optional target
  | 'richtext'       // WYSIWYG editor

  // Layout types
  | 'spacing'        // Margin/padding editor
  | 'size'           // Width/height editor
  | 'position'       // X/Y position
  | 'alignment'      // Alignment picker (9-grid)

  // Complex types
  | 'array'          // Repeatable items
  | 'object'         // Nested object
  | 'code'           // Code editor
  | 'json'           // JSON editor

  // Special
  | 'behaviour'      // Behaviour selector
  | 'effect'         // Effect selector
  | 'widget'         // Nested widget slot
```

### FieldTypeOptions

Type-specific constraints and configuration.

```typescript
export type FieldTypeOptions =
  | TextOptions
  | NumberOptions
  | SelectOptions
  | ColorOptions
  | ImageOptions
  | SpacingOptions
  | ArrayOptions
  | ObjectOptions

export interface TextOptions {
  minLength?: number
  maxLength?: number
  pattern?: string          // Regex pattern
  patternMessage?: string   // Validation message
}

export interface NumberOptions {
  min?: number
  max?: number
  step?: number
  unit?: string             // Display unit (px, %, em)
  slider?: boolean          // Show as slider
}

export interface SelectOptions {
  choices: SelectChoice[]
}

export interface SelectChoice {
  value: string | number
  label: string
  description?: string
  icon?: string
}

export interface ColorOptions {
  format?: 'hex' | 'rgb' | 'hsl'
  alpha?: boolean           // Allow transparency
  presets?: string[]        // Preset color swatches
  themeTokens?: boolean     // Show theme color tokens
}

export interface ImageOptions {
  accept?: string[]         // File types: ['image/png', 'image/jpeg']
  maxSize?: number          // Max file size in bytes
  aspectRatio?: number      // Required aspect ratio
  minWidth?: number
  minHeight?: number
}

export interface SpacingOptions {
  linked?: boolean          // Link all sides by default
  sides?: ('top' | 'right' | 'bottom' | 'left')[]
  units?: ('px' | 'rem' | 'em' | '%')[]
}

export interface ArrayOptions {
  itemSchema: SettingsField | SettingsField[]
  minItems?: number
  maxItems?: number
  addLabel?: string         // "Add item" button label
  sortable?: boolean        // Allow drag reordering
}

export interface ObjectOptions {
  fields: SettingsField[]
  collapsible?: boolean
}
```

### SettingsCondition

Show/hide fields based on other field values.

```typescript
export type SettingsCondition =
  | { field: string; equals: SerializableValue }
  | { field: string; notEquals: SerializableValue }
  | { field: string; in: SerializableValue[] }
  | { field: string; notIn: SerializableValue[] }
  | { field: string; exists: boolean }
  | { and: SettingsCondition[] }
  | { or: SettingsCondition[] }
```

---

## Responsive Settings

Settings can have per-breakpoint values when `responsive: true`.

```typescript
// Value types
export type ResponsiveValue<T> = T | {
  base: T               // Mobile-first default
  sm?: T                // >= 640px
  md?: T                // >= 768px
  lg?: T                // >= 1024px
  xl?: T                // >= 1280px
}

// Example usage in schema
props: {
  gap: { base: 16, md: 24, lg: 32 }
}
```

The editor shows a breakpoint toggle when `responsive: true` is set.

---

## Example: Text Widget Settings

```typescript
// settings/widgets/Text.settings.ts

import type { SettingsSchema } from '../types'

export const TextSettings: SettingsSchema = {
  component: 'Text',
  displayName: 'Text',
  description: 'Display text content with customizable styling',
  icon: 'type',

  fields: [
    {
      key: 'content',
      type: 'textarea',
      label: 'Content',
      description: 'The text to display',
      required: true,
      placeholder: 'Enter your text...',
    },
  ],

  groups: [
    {
      id: 'element',
      label: 'Element',
      fields: [
        {
          key: 'as',
          type: 'select',
          label: 'HTML Element',
          default: 'p',
          options: {
            choices: [
              { value: 'p', label: 'Paragraph', description: 'Standard body text' },
              { value: 'h1', label: 'Heading 1', description: 'Page title' },
              { value: 'h2', label: 'Heading 2', description: 'Section heading' },
              { value: 'h3', label: 'Heading 3', description: 'Subsection heading' },
              { value: 'h4', label: 'Heading 4' },
              { value: 'h5', label: 'Heading 5' },
              { value: 'h6', label: 'Heading 6' },
              { value: 'span', label: 'Span', description: 'Inline text' },
            ],
          },
        },
        {
          key: 'variant',
          type: 'text',
          label: 'Variant',
          description: 'CSS variant for custom styling (renders as data-variant)',
          placeholder: 'e.g., caption, label, quote',
        },
      ],
    },
    {
      id: 'formatting',
      label: 'Formatting',
      collapsed: true,
      fields: [
        {
          key: 'html',
          type: 'boolean',
          label: 'Render as HTML',
          description: 'Parse content as HTML (enables links, bold, etc.)',
          default: false,
        },
      ],
    },
    {
      id: 'style',
      label: 'Style',
      collapsed: true,
      fields: [
        {
          key: 'style.color',
          type: 'color',
          label: 'Text Color',
          options: { themeTokens: true },
        },
        {
          key: 'style.fontSize',
          type: 'number',
          label: 'Font Size',
          responsive: true,
          options: { min: 8, max: 200, unit: 'px' },
        },
        {
          key: 'style.fontWeight',
          type: 'select',
          label: 'Font Weight',
          options: {
            choices: [
              { value: 100, label: 'Thin' },
              { value: 300, label: 'Light' },
              { value: 400, label: 'Regular' },
              { value: 500, label: 'Medium' },
              { value: 600, label: 'Semibold' },
              { value: 700, label: 'Bold' },
              { value: 900, label: 'Black' },
            ],
          },
        },
        {
          key: 'style.textAlign',
          type: 'alignment',
          label: 'Alignment',
          responsive: true,
        },
      ],
    },
  ],
}
```

---

## Example: Flex Widget Settings

```typescript
// settings/widgets/Flex.settings.ts

export const FlexSettings: SettingsSchema = {
  component: 'Flex',
  displayName: 'Flex Container',
  description: 'Flexible container for arranging child elements',
  icon: 'layout',

  groups: [
    {
      id: 'layout',
      label: 'Layout',
      fields: [
        {
          key: 'direction',
          type: 'radio',
          label: 'Direction',
          default: 'row',
          responsive: true,
          options: {
            choices: [
              { value: 'row', label: 'Row', icon: 'arrow-right' },
              { value: 'column', label: 'Column', icon: 'arrow-down' },
            ],
          },
        },
        {
          key: 'wrap',
          type: 'boolean',
          label: 'Wrap',
          description: 'Allow items to wrap to new lines',
          default: false,
        },
        {
          key: 'gap',
          type: 'number',
          label: 'Gap',
          description: 'Space between items',
          responsive: true,
          options: { min: 0, max: 200, unit: 'px', slider: true },
        },
      ],
    },
    {
      id: 'alignment',
      label: 'Alignment',
      fields: [
        {
          key: 'justify',
          type: 'select',
          label: 'Justify (Main Axis)',
          default: 'start',
          options: {
            choices: [
              { value: 'start', label: 'Start' },
              { value: 'center', label: 'Center' },
              { value: 'end', label: 'End' },
              { value: 'between', label: 'Space Between' },
              { value: 'around', label: 'Space Around' },
            ],
          },
        },
        {
          key: 'align',
          type: 'select',
          label: 'Align (Cross Axis)',
          default: 'stretch',
          options: {
            choices: [
              { value: 'start', label: 'Start' },
              { value: 'center', label: 'Center' },
              { value: 'end', label: 'End' },
              { value: 'stretch', label: 'Stretch' },
            ],
          },
        },
      ],
    },
  ],
}
```

---

## Example: Section Pattern Settings

Section patterns (factories) also have settings schemas.

```typescript
// settings/sections/Hero.settings.ts

export const HeroSettings: SettingsSchema = {
  component: 'Hero',
  displayName: 'Hero Section',
  description: 'Full-screen hero with video background and title',
  icon: 'film',

  groups: [
    {
      id: 'content',
      label: 'Content',
      fields: [
        {
          key: 'introText',
          type: 'text',
          label: 'Intro Text',
          description: "Text before the title (e.g., \"I'm\")",
          placeholder: "I'm",
        },
        {
          key: 'roles',
          type: 'array',
          label: 'Roles / Titles',
          description: 'Role titles to display (one per line)',
          options: {
            itemSchema: {
              key: 'role',
              type: 'text',
              label: 'Role',
            },
            minItems: 1,
            maxItems: 5,
            addLabel: 'Add Role',
            sortable: true,
          },
        },
        {
          key: 'scrollIndicatorText',
          type: 'text',
          label: 'Scroll Indicator',
          placeholder: '(SCROLL)',
        },
      ],
    },
    {
      id: 'media',
      label: 'Media',
      fields: [
        {
          key: 'videoSrc',
          type: 'video',
          label: 'Background Video',
          required: true,
          options: {
            accept: ['video/mp4', 'video/webm'],
            maxSize: 50 * 1024 * 1024, // 50MB
          },
        },
      ],
    },
    {
      id: 'styles',
      label: 'Typography',
      collapsed: true,
      fields: [
        {
          key: 'styles.intro',
          type: 'object',
          label: 'Intro Text Style',
          options: {
            collapsible: true,
            fields: [
              { key: 'fontSize', type: 'number', label: 'Font Size', responsive: true },
              { key: 'color', type: 'color', label: 'Color' },
            ],
          },
        },
        {
          key: 'styles.roleTitle',
          type: 'object',
          label: 'Role Title Style',
          options: {
            collapsible: true,
            fields: [
              { key: 'fontSize', type: 'number', label: 'Font Size', responsive: true },
              { key: 'fontWeight', type: 'number', label: 'Font Weight' },
              { key: 'color', type: 'color', label: 'Color' },
            ],
          },
        },
      ],
    },
  ],
}
```

---

## Registry

Settings schemas are registered for lookup.

```typescript
// settings/registry.ts

import type { SettingsSchema } from './types'

const settingsRegistry = new Map<string, SettingsSchema>()

export function registerSettings(schema: SettingsSchema): void {
  settingsRegistry.set(schema.component, schema)
}

export function getSettings(component: string): SettingsSchema | undefined {
  return settingsRegistry.get(component)
}

export function getAllSettings(): SettingsSchema[] {
  return Array.from(settingsRegistry.values())
}

// Auto-discovery: import all *.settings.ts files
// This runs at build time via a Vite/webpack plugin
```

---

## Validation

Runtime validation of user-provided values.

```typescript
// settings/validate.ts

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
}

export interface ValidationError {
  field: string
  message: string
  code: 'required' | 'type' | 'min' | 'max' | 'pattern' | 'custom'
}

export function validateSettings(
  component: string,
  values: Record<string, unknown>
): ValidationResult {
  const schema = getSettings(component)
  if (!schema) {
    return { valid: false, errors: [{ field: '', message: 'Unknown component', code: 'custom' }] }
  }

  const errors: ValidationError[] = []

  // Validate all fields from schema
  for (const field of flattenFields(schema)) {
    const value = getNestedValue(values, field.key)
    const fieldErrors = validateField(field, value)
    errors.push(...fieldErrors)
  }

  return { valid: errors.length === 0, errors }
}

function validateField(field: SettingsField, value: unknown): ValidationError[] {
  const errors: ValidationError[] = []

  // Required check
  if (field.required && (value === undefined || value === null || value === '')) {
    errors.push({ field: field.key, message: `${field.label} is required`, code: 'required' })
    return errors // Skip other checks if required fails
  }

  // Skip validation for empty optional fields
  if (value === undefined || value === null) return errors

  // Type-specific validation
  switch (field.type) {
    case 'text':
    case 'textarea':
      if (typeof value !== 'string') {
        errors.push({ field: field.key, message: 'Must be text', code: 'type' })
      } else {
        const opts = field.options as TextOptions | undefined
        if (opts?.minLength && value.length < opts.minLength) {
          errors.push({ field: field.key, message: `Minimum ${opts.minLength} characters`, code: 'min' })
        }
        if (opts?.maxLength && value.length > opts.maxLength) {
          errors.push({ field: field.key, message: `Maximum ${opts.maxLength} characters`, code: 'max' })
        }
        if (opts?.pattern && !new RegExp(opts.pattern).test(value)) {
          errors.push({ field: field.key, message: opts.patternMessage || 'Invalid format', code: 'pattern' })
        }
      }
      break

    case 'number':
      if (typeof value !== 'number') {
        errors.push({ field: field.key, message: 'Must be a number', code: 'type' })
      } else {
        const opts = field.options as NumberOptions | undefined
        if (opts?.min !== undefined && value < opts.min) {
          errors.push({ field: field.key, message: `Minimum ${opts.min}`, code: 'min' })
        }
        if (opts?.max !== undefined && value > opts.max) {
          errors.push({ field: field.key, message: `Maximum ${opts.max}`, code: 'max' })
        }
      }
      break

    // ... other type validations
  }

  return errors
}
```

---

## Defaults Resolution

Apply default values when props are missing.

```typescript
// settings/defaults.ts

export function applyDefaults(
  component: string,
  values: Record<string, unknown>
): Record<string, unknown> {
  const schema = getSettings(component)
  if (!schema) return values

  const result = { ...values }

  for (const field of flattenFields(schema)) {
    if (field.default !== undefined) {
      const current = getNestedValue(result, field.key)
      if (current === undefined) {
        setNestedValue(result, field.key, field.default)
      }
    }
  }

  return result
}

export function getDefaultsFor(component: string): Record<string, unknown> {
  return applyDefaults(component, {})
}
```

---

## Interface Integration

The platform calls these functions to render editors and validate input.

```typescript
// creativeshire/interface/settings.ts

export interface SettingsInterface {
  /** Get schema for editor UI rendering */
  getSettingsSchema(component: string): SettingsSchema | undefined

  /** Validate user input against schema */
  validateSettings(component: string, values: Record<string, unknown>): ValidationResult

  /** Apply defaults to partial input */
  applyDefaults(component: string, values: Record<string, unknown>): Record<string, unknown>

  /** List all registered components */
  listComponents(): { component: string; displayName: string; icon?: string }[]
}
```

---

## File Naming Convention

| Type | Location | Pattern |
|------|----------|---------|
| Widget settings | `settings/widgets/` | `{Name}.settings.ts` |
| Section settings | `settings/sections/` | `{Name}.settings.ts` |
| Composite settings | `settings/composites/` | `{Name}.settings.ts` |
| Chrome settings | `settings/chrome/` | `{Name}.settings.ts` |

---

## Migration Path

### Phase 1: Types Only
Define `SettingsSchema` types. No runtime implementation yet.

### Phase 2: Widget Settings
Add `.settings.ts` files for all primitives and layouts.

### Phase 3: Validation
Implement `validateSettings()` with full type checking.

### Phase 4: Registry
Auto-discovery and registration of all settings schemas.

### Phase 5: Platform Integration
Expose `SettingsInterface` for visual editor consumption.

---

## Rules

### Must

1. Every widget MUST have a corresponding `.settings.ts` file
2. Every setting field MUST have a unique `key` matching the prop name
3. Required fields MUST set `required: true`
4. Enum fields MUST use `select` or `radio` with defined choices
5. All defaults MUST be serializable values
6. Responsive fields MUST work with the breakpoint system

### Must Not

1. Settings schemas MUST NOT contain functions or React elements
2. Settings schemas MUST NOT import runtime code
3. Validation MUST NOT have side effects
4. Defaults MUST NOT reference other fields (no computed defaults)

---

## Anti-Patterns

### Don't: Mix settings with component implementation

```typescript
// WRONG - settings in component file
export const Text = ({ content }) => <p>{content}</p>
export const textSettings = { ... }  // Don't do this

// RIGHT - separate files
// Text/index.tsx - component
// Text.settings.ts - settings schema
```

### Don't: Use generic types that hide options

```typescript
// WRONG - loses type specificity
{
  key: 'color',
  type: 'text',  // Should be 'color'
}

// RIGHT - use specific type
{
  key: 'color',
  type: 'color',
  options: { themeTokens: true },
}
```

### Don't: Duplicate validation logic

```typescript
// WRONG - validation in component
const Text = ({ content }) => {
  if (content.length > 100) throw new Error('Too long')  // Don't validate here
}

// RIGHT - validation in settings layer
{
  key: 'content',
  type: 'textarea',
  options: { maxLength: 100 },
}
```

---

## Testing

### Unit Tests

```typescript
describe('TextSettings', () => {
  it('validates required content field', () => {
    const result = validateSettings('Text', {})
    expect(result.valid).toBe(false)
    expect(result.errors).toContainEqual(
      expect.objectContaining({ field: 'content', code: 'required' })
    )
  })

  it('applies default element type', () => {
    const result = applyDefaults('Text', { content: 'Hello' })
    expect(result.as).toBe('p')
  })
})
```

### Definition of Done

A settings schema is complete when:

- [ ] All props have corresponding fields
- [ ] Required fields are marked
- [ ] Defaults match component defaults
- [ ] Responsive fields are marked
- [ ] Field types match prop types
- [ ] UI metadata (labels, descriptions) is helpful
- [ ] Validation passes for valid input
- [ ] Validation fails for invalid input

---

## Related Documents

- [schema.spec.md](schema.spec.md) - Base schema types
- [interface.spec.md](interface.spec.md) - Platform integration
- [widget.spec.md](../components/content/widget.spec.md) - Widget contracts
- [responsive-design.spec.md](../reference/responsive-design.spec.md) - Breakpoints
