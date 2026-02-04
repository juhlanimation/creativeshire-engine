# Collections Pattern Spec

> Widgets that render arrays MUST use `__repeat` children for hierarchy panel visibility.

## Purpose

When building a CMS like Squarespace/Webflow, users need to see, select, reorder, and edit individual items in collections (projects, logos, team members, etc.) through the hierarchy panel. This requires items to be **schema nodes**, not hidden inside array props.

## The Rule

**Any widget that renders a collection MUST receive items as `__repeat` children, NOT as array props.**

## Why This Matters

### Array Props (Bad)

```typescript
// Schema - items hidden from hierarchy
{
  type: 'LogoMarquee',
  props: { logos: '{{ content.logos }}' }  // ← Black box!
}
```

```
Hierarchy Panel:
└─ 🎠 LogoMarquee
   (no children visible)
```

Users cannot:
- See individual logos
- Select a specific logo
- Reorder logos via drag/drop
- Edit one logo's properties

### `__repeat` Children (Good)

```typescript
// Schema - items visible in hierarchy
{
  type: 'LogoMarquee',
  props: { duration: 30 },
  widgets: [{
    __repeat: '{{ content.logos }}',
    id: 'logo',
    type: 'LogoItem',
    props: {
      src: '{{ item.src }}',
      alt: '{{ item.alt }}',
      href: '{{ item.href }}'
    }
  }]
}
```

```
Hierarchy Panel:
└─ 🎠 LogoMarquee
    ├─ 🖼️ logo-0 [LogoItem]    ⋮⋮ drag
    ├─ 🖼️ logo-1 [LogoItem]    ⋮⋮ drag
    ├─ 🖼️ logo-2 [LogoItem]    ⋮⋮ drag
    └─ ➕ Add Logo
```

Users can:
- See all logos listed
- Click to select and edit in Inspector
- Drag to reorder
- Add/duplicate/delete items

## How `__repeat` Works

The `__repeat` directive tells the platform to expand a template widget for each item in the bound array:

```typescript
{
  __repeat: '{{ content.projects }}',  // Source array (binding expression)
  id: 'project',                        // Base ID (becomes project-0, project-1, etc.)
  type: 'ProjectCard',                  // Widget type for each item
  props: {
    title: '{{ item.title }}',          // item.* accesses current array element
    image: '{{ item.thumbnailSrc }}'
  }
}
```

### Binding Context

| Variable | Resolves To |
|----------|-------------|
| `{{ content.* }}` | Site content from CMS |
| `{{ item.* }}` | Current array element (inside `__repeat`) |
| `{{ index }}` | Current iteration index (0, 1, 2...) |

## Affected Widgets

Widgets with array props that MUST use `__repeat`:

| Widget | Array Prop | Child Type |
|--------|-----------|------------|
| `LogoMarquee` | `logos` | `LogoItem` |
| `ExpandableGalleryRow` | `projects` | `GalleryThumbnail` |
| `FeaturedProjectsGrid` | `projects` | `ProjectCard` |
| `HeroRoles` | `roles` | `Text` |

## Implementation Pattern

### 1. Widget Accepts Children

```typescript
// Widget component
interface LogoMarqueeProps extends WidgetBaseProps {
  duration?: number
  logoWidth?: number
  logoGap?: number
  widgets?: WidgetSchema[]  // Children, not logos array
}

function LogoMarquee({ duration, widgets, ...props }: LogoMarqueeProps) {
  return (
    <div className="logo-marquee">
      <WidgetRenderer widgets={widgets} />
    </div>
  )
}
```

### 2. Schema Uses `__repeat`

```typescript
// Preset schema
{
  id: 'client-logos',
  type: 'LogoMarquee',
  props: { duration: 30 },
  widgets: [{
    __repeat: '{{ content.about.clientLogos }}',
    id: 'logo',
    type: 'Image',
    props: {
      src: '{{ item.src }}',
      alt: '{{ item.alt }}'
    }
  }]
}
```

### 3. Platform Expands at Runtime

```typescript
// After platform resolves bindings
{
  id: 'client-logos',
  type: 'LogoMarquee',
  props: { duration: 30 },
  widgets: [
    { id: 'logo-0', type: 'Image', props: { src: '/nike.svg', alt: 'Nike' } },
    { id: 'logo-1', type: 'Image', props: { src: '/apple.svg', alt: 'Apple' } },
    { id: 'logo-2', type: 'Image', props: { src: '/google.svg', alt: 'Google' } },
  ]
}
```

## Architecture Test

This pattern is enforced by `__tests__/architecture/collections.test.ts`:

1. **Registry enforcement**: New widgets with array props must be added to `COLLECTION_WIDGETS`
2. **Schema validation**: Schemas using collection widgets must use `__repeat`, not direct array props

```bash
npm run test:arch
```

## Inspector Integration

When a collection item is selected in hierarchy:

```
┌─────────────────────────────────────────┐
│  INSPECTOR: logo-1                      │
├─────────────────────────────────────────┤
│                                         │
│  Type: LogoItem (in LogoMarquee)        │
│  Index: 1 of 3           [⬆️] [⬇️] [🗑️] │
│                                         │
│  ─── Content ────────────────────────   │
│                                         │
│  src     [🖼️ /logos/apple.svg     ]     │
│  alt     [Apple                   ]     │
│  href    [https://apple.com       ]     │
│                                         │
│  ─── Actions ────────────────────────   │
│  [📋 Duplicate]  [🗑️ Delete]            │
│                                         │
└─────────────────────────────────────────┘
```

## Anti-Patterns

### Don't: Pass arrays as props

```typescript
// WRONG - items not visible in hierarchy
{
  type: 'TeamGrid',
  props: { members: '{{ content.team }}' }
}
```

### Don't: Hardcode arrays

```typescript
// WRONG - no CMS integration
{
  type: 'LogoMarquee',
  props: { logos: [{ src: '/a.svg' }, { src: '/b.svg' }] }
}
```

### Do: Use `__repeat` with bindings

```typescript
// CORRECT - hierarchy visibility + CMS integration
{
  type: 'TeamGrid',
  widgets: [{
    __repeat: '{{ content.team }}',
    type: 'TeamMember',
    props: { name: '{{ item.name }}', photo: '{{ item.photo }}' }
  }]
}
```

## Testing

### Architecture Test

```bash
# Runs collection pattern enforcement
npm run test:arch
```

### Manual Verification

1. Open hierarchy panel in platform editor
2. Expand collection widget node
3. Verify each item appears as child
4. Drag items to reorder
5. Click item to edit in Inspector

## Related Specs

- [Schema Spec](../components/schema/schema.spec.md) - `__repeat` is a schema directive
- [Widget Spec](../components/content/widget.spec.md) - Widget accepts `widgets` children
- [Preset Spec](../components/preset/preset.spec.md) - Presets define schemas with `__repeat`
