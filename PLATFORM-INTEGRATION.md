# Platform-Engine Integration Prompt

You are building a CMS platform that connects to `@creativeshire/engine`. The architecture follows Unity's pattern: **Preview** (scene), **Hierarchy** (tree), **Inspector** (settings).

## Architecture

```
PLATFORM (you build this)
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   PREVIEW   │◄───│  HIERARCHY  │───►│  INSPECTOR  │
│  (iframe)   │    │   (tree)    │    │  (settings) │
└─────────────┘    └─────────────┘    └─────────────┘
       ▲                  ▲                  │
       └──────────────────┴──────────────────┘
                         │
                   SiteSchema (JSON)
                         │
                         ▼
              ENGINE (library) renders it
```

**Data flow:**
1. Load `SiteSchema` from DB
2. Render hierarchy tree from schema structure
3. User selects node → Inspector shows that node's editable props
4. User edits value → Update `SiteSchema` (immutable)
5. Pass updated schema to engine → Preview re-renders

## Schema Structure (DB Storage)

```typescript
interface StoredSite {
  id: string
  presetId: string              // "bojuhl", "minimal", etc.
  schema: SiteSchema            // Full JSON schema
  createdAt: Date
  updatedAt: Date
  publishedAt?: Date
}

interface SiteSchema {
  id: string
  theme: ThemeSchema
  experience: ExperienceConfig
  chrome: ChromeConfig
  pages: Record<string, PageSchema>
  behaviours: Record<string, string>
}
```

## Hierarchy Structure

```
📁 SITE
├── 🎨 theme                    → Theme inspector
├── ⚡ experience               → Experience inspector
├── 🖼️ chrome
│   ├── 📌 header              → Region inspector (inherit|hidden|custom)
│   ├── 📌 footer              → Region inspector
│   └── 📌 overlays
│       ├── floatingContact    → Overlay inspector
│       └── modal              → Modal settings inspector
│
└── 📄 pages
    └── 📄 home (/)
        ├── 📦 SECTION: hero    → Section inspector
        │   ├── 🎬 Video        → Widget inspector (Video props)
        │   ├── 📐 Flex         → Widget inspector (Layout props)
        │   │   ├── 📝 Text     → Widget inspector (Text props)
        │   │   └── ...
        │   └── 📝 Text
        └── 📦 SECTION: about
            └── ...
```

## Inspector Field Definitions

### Theme Inspector

```typescript
interface ThemeSchema {
  scrollbar?: {
    width?: number              // Range: 4-12px, default: 6
    thumb?: string              // Color picker
    track?: string              // Color picker
    thumbDark?: string          // Color picker (dark mode)
    trackDark?: string          // Color picker (dark mode)
  }
  smoothScroll?: {
    enabled?: boolean           // Toggle, default: true
    smooth?: number             // Range: 0.5-2.0, default: 1.2
    smoothMac?: number          // Range: 0.2-1.0, default: 0.5
    effects?: boolean           // Toggle, default: true
  }
  typography?: {
    title?: string              // Font picker → --font-title
    paragraph?: string          // Font picker → --font-paragraph
    ui?: string                 // Font picker → --font-ui
  }
  sectionTransition?: {
    fadeDuration?: string       // Text input, e.g., '0.15s'
    fadeEasing?: string         // Select: ease-out, ease-in-out, etc.
  }
}
```

### Chrome Region Inspector

```typescript
// Each region: header, footer, sidebar
type RegionValue = 'inherit' | 'hidden' | RegionSchema

interface RegionSchema {
  widgets?: WidgetSchema[]      // Widget tree (recommended)
  behaviour?: BehaviourConfig
  // OR
  component?: string            // Component name
  props?: Record<string, any>
}
```

### Chrome Overlay Inspector

```typescript
interface OverlaySchema {
  widget?: WidgetSchema
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  trigger?: TriggerCondition
  behaviour?: BehaviourConfig
}

// Discriminated union - show relevant fields based on type
type TriggerCondition =
  | { type: 'scroll'; threshold: number; direction?: 'up'|'down'|'both' }
  | { type: 'click'; target: string }
  | { type: 'hover'; target: string }
  | { type: 'load'; delay?: number }
  | { type: 'visibility'; threshold: number; rootMargin?: string }
  | { type: 'timer'; delay: number; repeat?: boolean; interval?: number }
  | { type: 'device'; device: 'desktop'|'tablet'|'mobile' }
  | { type: 'custom'; customId: string }
```

### Modal Settings Inspector

```typescript
interface ModalConfig {
  animationType?: 'wipe-left' | 'wipe-right' | 'expand' | 'fade' | 'none'
  animationDuration?: number    // Range: 200-2000ms, default: 800
  animationEase?: string        // Select: power3.inOut, ease-out, etc.
  sequenceContentFade?: boolean // Toggle, default: true
  closeOnBackdrop?: boolean     // Toggle, default: true
  closeOnEsc?: boolean          // Toggle, default: true
  backdropColor?: string        // Color picker with opacity
}
```

### Experience Inspector

```typescript
interface ExperienceConfig {
  mode: 'stacking' | 'scroll' | 'paginated'  // Radio
  behaviours?: Record<string, string>         // Widget type → behaviour ID mapping
}
```

## Widget Inspector Fields

Every widget has base fields plus type-specific props:

```typescript
interface WidgetSchema {
  id?: string                   // Text input
  type: string                  // Locked/display only
  props?: Record<string, any>   // Type-specific (below)
  style?: CSSProperties         // Advanced panel
  className?: string            // Text input
  behaviour?: BehaviourConfig   // Behaviour selector + options
  widgets?: WidgetSchema[]      // Children (layout widgets only)
  on?: { [event]: actionId }    // Event → action mapping
}
```

### Primitives

**Text**
| Field | Type | Control |
|-------|------|---------|
| content | string | Textarea (required) |
| as | 'p'\|'h1'\|'h2'\|'h3'\|'h4'\|'h5'\|'h6'\|'span' | Radio, default: 'p' |
| html | boolean | Toggle (enables rich text) |

**Image**
| Field | Type | Control |
|-------|------|---------|
| src | string | File picker (required) |
| alt | string | Text input (required) |
| aspectRatio | string | Select: 16/9, 4/3, 1/1, 9/16, custom |
| objectFit | 'cover'\|'contain'\|'fill'\|'none' | Select, default: 'cover' |
| objectPosition | string | Text/select |
| decorative | boolean | Toggle |

**Button**
| Field | Type | Control |
|-------|------|---------|
| label | string | Text input (required) |
| variant | 'primary'\|'secondary'\|'ghost' | Radio, default: 'primary' |
| disabled | boolean | Toggle |
| type | 'button'\|'submit'\|'reset' | Select |

**Link**
| Field | Type | Control |
|-------|------|---------|
| href | string | Text input (required) |
| target | '_blank'\|'_self' | Radio, default: '_self' |
| variant | 'default'\|'underline'\|'hover-underline' | Select |

**Icon**
| Field | Type | Control |
|-------|------|---------|
| name | string | Icon picker (required) |
| size | number\|string | Number + unit, default: 24 |
| color | string | Color picker |
| decorative | boolean | Toggle, default: true |
| label | string | Text (shows when decorative=false) |

### Layout Widgets

**Flex**
| Field | Type | Control |
|-------|------|---------|
| direction | 'row'\|'column' | Radio, default: 'row' |
| align | 'start'\|'center'\|'end'\|'stretch' | Visual selector |
| justify | 'start'\|'center'\|'end'\|'between'\|'around' | Visual selector |
| wrap | boolean | Toggle |
| gap | number\|string | Number + unit |

**Stack** (= Flex column)
| Field | Type | Control |
|-------|------|---------|
| gap | number\|string | Number + unit |
| align | 'start'\|'center'\|'end'\|'stretch' | Visual selector |

**Grid**
| Field | Type | Control |
|-------|------|---------|
| columns | number\|string | Number or CSS |
| rows | number\|string | Number or CSS |
| gap | number\|string | Number + unit |
| columnGap | number\|string | Number + unit (advanced) |
| rowGap | number\|string | Number + unit (advanced) |

**Box**
| Field | Type | Control |
|-------|------|---------|
| width | number\|string | Number + unit |
| height | number\|string | Number + unit |
| minWidth | number\|string | Number + unit |
| maxWidth | number\|string | Number + unit |
| flexGrow | number | Number input |
| flexShrink | number | Number input |

**Container**
| Field | Type | Control |
|-------|------|---------|
| maxWidth | number\|string | Number + unit |
| padding | number\|string | Number + unit |
| center | boolean | Toggle |

**Split**
| Field | Type | Control |
|-------|------|---------|
| ratio | '1:1'\|'2:1'\|'1:2'\|'3:1'\|'1:3'\|'3:2'\|'2:3' | Visual selector |
| gap | number\|string | Number + unit |
| reverse | boolean | Toggle |
| align | 'start'\|'center'\|'end'\|'stretch' | Visual selector |

### Interactive Widgets

**Video**
| Field | Type | Control |
|-------|------|---------|
| src | string | File picker (required) |
| poster | string | File picker |
| hoverPlay | boolean | Toggle |
| autoplay | boolean | Toggle (hidden when hoverPlay=true) |
| loop | boolean | Toggle |
| muted | boolean | Toggle |
| objectFit | 'cover'\|'contain'\|'fill' | Select |
| background | boolean | Toggle |
| aspectRatio | string | Select |
| videoUrl | string | File picker (full video for modal) |
| modalAnimationType | 'wipe-left'\|'wipe-right'\|'expand' | Select |

**ContactPrompt**
| Field | Type | Control |
|-------|------|---------|
| email | string | Email input (required) |
| promptText | string | Text input, default: "How can I help you?" |
| showPrompt | boolean | Toggle, default: true |

**ExpandableGalleryRow**
| Field | Type | Control |
|-------|------|---------|
| projects | GalleryProject[] | List editor (required) |
| height | string | Text + unit, default: '32rem' |
| gap | string | Text + unit, default: '4px' |
| expandedWidth | string | Text + unit, default: '32rem' |
| transitionDuration | number | Slider 100-1000, default: 400 |
| cursorLabel | string | Text, default: 'WATCH' |
| modalAnimationType | 'wipe-left'\|'wipe-right'\|'expand' | Select |

**GalleryProject** (sub-editor)
| Field | Type | Control |
|-------|------|---------|
| id | string | Auto-generated |
| thumbnailSrc | string | File picker (required) |
| thumbnailAlt | string | Text (required) |
| videoSrc | string | File picker (hover) |
| videoUrl | string | File picker (modal) |
| title | string | Text (required) |
| client | string | Text (required) |
| studio | string | Text (required) |
| year | string | Text (required) |
| role | string | Text (required) |

## Behaviour System

Behaviours animate widgets. They're named by TRIGGER type.

```typescript
interface BehaviourConfig {
  id: string                    // e.g., 'scroll/fade', 'hover/scale'
  options?: Record<string, any> // Behaviour-specific
}
```

| Behaviour | Options |
|-----------|---------|
| `scroll/fade` | threshold, duration |
| `scroll/progress` | startOffset, endOffset |
| `scroll/color-shift` | startColor, endColor, threshold |
| `hover/scale` | scale, duration |
| `hover/reveal` | flipDuration, fadeDuration |
| `visibility/fade` | threshold, rootMargin |
| `animation/marquee` | duration, direction |

## Event System

Widgets can trigger actions via `on` property:

```typescript
on?: {
  click?: string    // Action ID
  hover?: string
}
```

Available actions:
- `open-video-modal` - Opens video in modal
- `navigate-to-project` - Navigate to project page
- `copy-to-clipboard` - Copy text

## Key Rules

1. **All props must be JSON-serializable** - No functions in schema
2. **Events use `on` mapping** - Not onClick props
3. **Layout widgets have `widgets[]`** - For nesting children
4. **Dual units** - Size props accept number (px) or string (CSS)
5. **Behaviours set CSS variables** - L2 animation via CSS, not React state
6. **Inspector is type-aware** - Show different fields per widget type
7. **Presets are starting points** - Users can customize everything
