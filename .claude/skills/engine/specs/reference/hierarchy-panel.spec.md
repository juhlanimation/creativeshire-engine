# Hierarchy Panel Spec

> Unity-style hierarchy panel for the Creativeshire platform editor.

## Purpose

The hierarchy panel displays the site structure as a tree, allowing users to:
- See all elements (pages, sections, widgets)
- Select items to edit in the Inspector
- Reorder items via drag/drop
- Add, duplicate, and delete items

## Structure Overview

```
📦 Site
├─ ⚡ Experience
├─ 🎨 Theme
├─ 🖼️ Chrome
│   ├─ 📍 Regions
│   └─ 🔲 Overlays
└─ 📄 Pages
    └─ 🏠 Page
        └─ 📑 Section
            └─ 📦 Widget
                └─ (nested widgets)
```

## Full Hierarchy Example

Based on the Bojuhl preset with all `__repeat` collections expanded:

```
┌─────────────────────────────────────────────────────────────────┐
│  HIERARCHY                                              🔍 ⚙️   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📦 Site: bojuhl                                                │
│  │                                                              │
│  ├─ ⚡ Experience: stacking                                     │
│  │                                                              │
│  ├─ 🎨 Theme                                                    │
│  │   ├─ Colors                                                  │
│  │   └─ Typography                                              │
│  │                                                              │
│  ├─ 🖼️ Chrome                                                   │
│  │   ├─ 📍 Regions                                              │
│  │   │   └─ Footer                                              │
│  │   └─ 🔲 Overlays                                             │
│  │       ├─ Modal                                               │
│  │       ├─ CursorLabel                                         │
│  │       ├─ NavTimeline                                         │
│  │       └─ SlideIndicators                                     │
│  │                                                              │
│  └─ 📄 Pages                                                    │
│      │                                                          │
│      └─ 🏠 home (/)                                             │
│          │                                                      │
│          ├─ 📑 hero                                             │
│          │   ├─ 🎬 hero-video [Video]                           │
│          │   ├─ 📦 hero-content [Flex]                          │
│          │   │   ├─ 📝 hero-intro [Text]                        │
│          │   │   └─ ✨ hero-roles [StackTextRepeater]                 │
│          │   │       ├─ 📝 role-0 [Text]           ⋮⋮ drag      │
│          │   │       │   └─ "MOTION DESIGNER"                   │
│          │   │       ├─ 📝 role-1 [Text]           ⋮⋮ drag      │
│          │   │       │   └─ "CREATIVE DIRECTOR"                 │
│          │   │       ├─ 📝 role-2 [Text]           ⋮⋮ drag      │
│          │   │       │   └─ "VISUAL ARTIST"                     │
│          │   │       └─ ➕ Add Role                              │
│          │   └─ 📝 hero-scroll [Text]                           │
│          │                                                      │
│          ├─ 📑 about                              🔄 scroll/fade│
│          │   ├─ 📦 about-mobile-bg [Box]                        │
│          │   │   └─ 🖼️ about-mobile-bg-image [Image]            │
│          │   ├─ 📦 about-content [Flex]                         │
│          │   │   ├─ 📦 about-bio-column [Box]                   │
│          │   │   │   └─ 📦 about-bio-inner [Box]                │
│          │   │   │       ├─ 📝 about-bio-text [Text]            │
│          │   │   │       └─ 📝 about-signature [Text]           │
│          │   │   └─ 📦 about-image-column [Box]                 │
│          │   │       └─ 🖼️ about-image [Image]                  │
│          │   ├─ 📦 about-gradient [Box]                         │
│          │   └─ 🎠 about-logos [MarqueeImageRepeater]                    │
│          │       ├─ 🖼️ logo-0 [Image]              ⋮⋮ drag      │
│          │       │   └─ Nike                                    │
│          │       ├─ 🖼️ logo-1 [Image]              ⋮⋮ drag      │
│          │       │   └─ Apple                                   │
│          │       ├─ 🖼️ logo-2 [Image]              ⋮⋮ drag      │
│          │       │   └─ Google                                  │
│          │       ├─ 🖼️ logo-3 [Image]              ⋮⋮ drag      │
│          │       │   └─ Spotify                                 │
│          │       └─ ➕ Add Logo                                  │
│          │                                                      │
│          ├─ 📑 projects (Featured)                              │
│          │   └─ 📦 featured-projects-content [Flex]             │
│          │       ├─ 🎬 project-card-0 [Flex]       ⋮⋮ drag      │
│          │       │   ├─ 📦 thumbnail-col [Box]                  │
│          │       │   │   ├─ 🎬 thumbnail [Video]                │
│          │       │   │   └─ 📦 meta [Flex]                      │
│          │       │   │       ├─ 📝 client [Text]                │
│          │       │   │       └─ 📝 studio [Text]                │
│          │       │   └─ 📦 content [Box]                        │
│          │       │       ├─ 📝 title [Text]                     │
│          │       │       ├─ 📝 description [Text]               │
│          │       │       ├─ 📝 year [Text]                      │
│          │       │       └─ 📝 role [Text]                      │
│          │       ├─ 🎬 project-card-1 [Flex]       ⋮⋮ drag      │
│          │       │   └─ ...                                     │
│          │       ├─ 🎬 project-card-2 [Flex]       ⋮⋮ drag      │
│          │       │   └─ ...                                     │
│          │       └─ ➕ Add Featured Project                      │
│          │                                                      │
│          └─ 📑 other-projects                                   │
│              ├─ 📦 other-projects-header [Flex]                 │
│              │   ├─ 📝 other-projects-heading [Text]            │
│              │   └─ 📝 other-projects-year-range [Text]         │
│              └─ 🎠 other-projects-gallery [ExpandRowImageRepeater]│
│                  ├─ 🎬 gallery-item-0 [ExpandRowThumbnail] ⋮⋮ drag│
│                  │   └─ 📋 Nike / 2024                          │
│                  ├─ 🎬 gallery-item-1 [ExpandRowThumbnail] ⋮⋮ drag│
│                  │   └─ 📋 Apple / 2023                         │
│                  ├─ 🎬 gallery-item-2 [ExpandRowThumbnail] ⋮⋮ drag│
│                  │   └─ 📋 Google / 2023                        │
│                  └─ ➕ Add Project                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Icon Legend

### Structure Levels

| Icon | Type | Description |
|------|------|-------------|
| 📦 | Site | Root container |
| ⚡ | Experience | L2 animation system |
| 🎨 | Theme | Design tokens (colors, typography) |
| 🖼️ | Chrome | Site-wide UI |
| 📍 | Region | Chrome region (header, footer) |
| 🔲 | Overlay | Chrome overlay (modal, cursor) |
| 📄 | Pages | Page collection |
| 🏠 | Page | Individual route |
| 📑 | Section | Page section |

### Widget Types

| Icon | Category | Examples |
|------|----------|----------|
| 📦 | Layout | Box, Flex, Stack, Grid, Container |
| 📝 | Text | Text, headings, paragraphs |
| 🖼️ | Image | Static images |
| 🎬 | Video | Video, ExpandRowThumbnail |
| 🔗 | Link | Hyperlinks, buttons |
| 🎠 | Carousel | MarqueeImageRepeater, ExpandRowImageRepeater |
| ✨ | Interactive | StackTextRepeater, ContactPrompt |
| 📋 | Info | Inline metadata preview |

### Indicators

| Symbol | Meaning |
|--------|---------|
| ⋮⋮ drag | Item can be reordered via drag/drop |
| 🔄 | Has behaviour attached |
| ➕ | Add new item button |

## Inspector Panel

When an item is selected in hierarchy, the Inspector shows its editable properties.

### Section Inspector

```
┌─────────────────────────────────────────┐
│  INSPECTOR: hero                        │
├─────────────────────────────────────────┤
│                                         │
│  Type: Section                          │
│  ID: hero                               │
│                                         │
│  ─── Layout ─────────────────────────   │
│                                         │
│  type        [stack            ▼]       │
│  direction   [column           ▼]       │
│  align       [start            ▼]       │
│                                         │
│  ─── Behaviour ──────────────────────   │
│                                         │
│  behaviour   [(none)           ▼]       │
│                                         │
│  ─── Style Override ─────────────────   │
│  [+ Add Style]                          │
│                                         │
└─────────────────────────────────────────┘
```

### Widget Inspector

```
┌─────────────────────────────────────────┐
│  INSPECTOR: hero-video                  │
├─────────────────────────────────────────┤
│                                         │
│  Type: Video                            │
│  ID: hero-video                         │
│                                         │
│  ─── Content ────────────────────────   │
│                                         │
│  src         [🎬 /hero-bg.mp4      ]    │
│  poster      [🖼️ (none)            ]    │
│  alt         [                     ]    │
│                                         │
│  ─── Playback ───────────────────────   │
│                                         │
│  autoplay    [✓]                        │
│  loop        [✓]                        │
│  muted       [✓]                        │
│  background  [✓]                        │
│                                         │
│  ─── Behaviour ──────────────────────   │
│                                         │
│  behaviour   [(none)           ▼]       │
│                                         │
└─────────────────────────────────────────┘
```

### Collection Item Inspector

```
┌─────────────────────────────────────────┐
│  INSPECTOR: gallery-item-1              │
├─────────────────────────────────────────┤
│                                         │
│  Type: ExpandRowThumbnail                 │
│  Parent: ExpandRowImageRepeater       │
│  Index: 1 of 5           [⬆️] [⬇️] [🗑️] │
│                                         │
│  ─── Media ──────────────────────────   │
│                                         │
│  thumbnailSrc [🖼️ /projects/nike.jpg]   │
│  thumbnailAlt [Nike campaign        ]   │
│  videoSrc     [🎬 /projects/nike.mp4]   │
│  videoUrl     [vimeo.com/12345...   ]   │
│                                         │
│  ─── Metadata ───────────────────────   │
│                                         │
│  title        [Air Max Campaign     ]   │
│  client       [Nike                 ]   │
│  studio       [Creativeshire        ]   │
│  year         [2024                 ]   │
│  role         [Director             ]   │
│                                         │
│  ─── Actions ────────────────────────   │
│  [📋 Duplicate]  [🗑️ Delete]            │
│                                         │
└─────────────────────────────────────────┘
```

## Collection Pattern

Collections use `__repeat` in schemas so items appear in hierarchy:

```typescript
// Schema definition
{
  type: 'MarqueeImageRepeater',
  props: { duration: 30 },
  widgets: [{
    __repeat: '{{ content.logos }}',
    id: 'logo',
    type: 'Image',
    props: {
      src: '{{ item.src }}',
      alt: '{{ item.alt }}'
    }
  }]
}
```

```
// Resulting hierarchy
└─ 🎠 MarqueeImageRepeater
    ├─ 🖼️ logo-0 [Image]    ⋮⋮
    ├─ 🖼️ logo-1 [Image]    ⋮⋮
    └─ ➕ Add Logo
```

See: [Collections Pattern Spec](../patterns/collections.spec.md)

## Interactions

### Selection

- Click item → Select and show in Inspector
- Cmd/Ctrl + Click → Multi-select
- Click elsewhere → Deselect

### Reordering

- Drag items with ⋮⋮ handle
- Drop indicator shows insertion point
- Only siblings can be reordered

### Add/Remove

- ➕ button adds new item of parent's child type
- Right-click → Context menu (Add, Duplicate, Delete)
- Delete key removes selected items

### Expand/Collapse

- Click arrow to toggle children visibility
- Double-click to expand all descendants
- Cmd/Ctrl + Click arrow to collapse all

## Implementation Notes

### Data Model

The hierarchy is derived from the site schema:

```typescript
interface HierarchyNode {
  id: string
  type: 'site' | 'experience' | 'theme' | 'chrome' | 'page' | 'section' | 'widget'
  label: string
  icon: string
  schema: SiteSchema | PageSchema | SectionSchema | WidgetSchema
  children?: HierarchyNode[]
  isCollection?: boolean      // Can add/reorder children
  isCollectionItem?: boolean  // Is item in __repeat collection
  parentPath?: string[]       // Path to parent for updates
}
```

### Updates

When hierarchy changes (reorder, add, delete):

1. Update the schema at `parentPath`
2. Emit change event to EngineProvider
3. Schema change triggers re-render
4. Hierarchy rebuilds from new schema

### Platform Integration

The platform provides:
- Content data (via `{{ content.* }}` bindings)
- Persistence (save schema changes)
- Preview (render site with changes)

Engine provides:
- Schema structure
- Widget registry (for Add menus)
- Validation (ensure valid structure)
