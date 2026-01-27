# Preset Layer

> Bundles content patterns and experience configuration into ready-to-use site starting points.

---

## Purpose

The Preset Layer provides full site configurations combining content structure with experience settings. Presets define page layouts, chrome configuration, widget behaviour mappings, and mode selection. Sites extend presets rather than building from scratch.

Presets are products, not templates. Select a preset and override specific values. The preset provides sensible defaults for everything else.

---

## Owns

```
creativeshire/presets/
├── types.ts              # SitePreset interface
├── starter/              # Minimal, clean slate
│   ├── index.ts
│   ├── site.ts
│   ├── pages/
│   └── chrome/
├── showcase/             # Visual-heavy, gallery-focused
├── editorial/            # Text-focused, content-heavy
└── immersive/            # Full-screen, storytelling
```

**Concepts owned:**
- SitePreset interface and structure
- Preset-level behaviour mappings
- Preset page structures
- Preset chrome configurations

---

## Receives From

| From Layer | What | Shape |
|------------|------|-------|
| **Experience (L2)** | Mode definitions | `Mode` |
| **Content (L1)** | Section composites | `createHeroSection()` |
| **Content (L1)** | Widget composites | `createProjectCard()` |
| **Schema** | Type definitions | `SiteSchema`, `PageSchema` |

---

## Provides To

| To Layer | What | Shape |
|----------|------|-------|
| **Site** | Full configuration | `SitePreset` |
| **Site** | Page structures | `PageSchema` |
| **Site** | Chrome defaults | `ChromeSchema` |
| **Site** | Behaviour mappings | `Record<string, string>` |

---

## Internal Structure

### SitePreset Interface

```typescript
// creativeshire/presets/types.ts
export interface SitePreset {
  experience: {
    mode: string
    options?: Record<string, any>
  }
  chrome: ChromeSchema
  pages: {
    [pageId: string]: PageSchema
  }
  behaviours?: {
    [widgetType: string]: string
  }
}
```

### Preset Components

| Component | Purpose |
|-----------|---------|
| `experience` | Mode selection and options |
| `chrome` | Header, footer, overlay defaults |
| `pages` | Page structures with section layouts |
| `behaviours` | Widget-to-behaviour mappings |

### Available Presets

| Preset | Mode | Use Case |
|--------|------|----------|
| **starter** | `static` | Minimal, no animations |
| **showcase** | `parallax` | Visual-heavy, gallery-focused |
| **editorial** | `reveal` | Text-focused, content-heavy |
| **immersive** | `cinematic` | Full-screen, storytelling |

---

## Preset Example

```typescript
// creativeshire/presets/showcase/index.ts
export const showcasePreset: SitePreset = {
  experience: {
    mode: 'parallax',
    options: { intensity: 60 }
  },

  chrome: {
    regions: {
      header: {
        widgets: [
          { type: 'Text', props: { content: 'Logo' } },
          { type: 'Button', props: { content: 'Contact' } }
        ],
        behaviour: 'hide-on-scroll-down'
      },
      footer: {
        widgets: [{ type: 'Text', props: { content: '© 2024' } }]
      }
    },
    overlays: {
      cursor: {
        trigger: { device: 'desktop' },
        widget: { type: 'SVG', props: { src: '/cursor.svg' } }
      }
    }
  },

  pages: {
    home: {
      id: 'home',
      slug: '/',
      sections: [
        createHeroSection({ headline: 'Welcome' }),
        createGallerySection({ layout: 'masonry', items: [] })
      ]
    }
  },

  behaviours: {
    Image: 'depth-layer',
    Video: 'mask-reveal',
    Text: 'fade-on-scroll'
  }
}
```

---

## Site Extension Pattern

Sites extend presets using spread syntax. Override specific values while inheriting defaults.

```typescript
// site/config.ts
export const siteConfig: SiteSchema = {
  id: 'my-site',
  experience: {
    ...showcasePreset.experience,
    mode: 'reveal'  // Override mode
  },
  chrome: { ...showcasePreset.chrome },
  pages: [
    { id: 'home', slug: '/' },
    { id: 'about', slug: '/about' }
  ]
}
```

### Page Extension

```typescript
// site/pages/home.ts
export const homePage: PageSchema = {
  id: 'home',
  slug: '/',
  sections: [
    {
      ...showcasePreset.pages.home.sections[0],
      widgets: [
        { type: 'Text', props: { content: 'My Headline' } }
      ]
    }
  ]
}
```

---

## Creating a New Preset

1. **Create preset folder** in `creativeshire/presets/{name}/`

2. **Define site defaults** in `site.ts`

3. **Create page structures** in `pages/`

4. **Define chrome** in `chrome/`

5. **Export preset** in `index.ts`:
   ```typescript
   export const myPreset: SitePreset = {
     experience: { mode: 'parallax' },
     chrome: { regions: { header, footer } },
     pages: { home: homePage },
     behaviours: { Image: 'depth-layer' }
   }
   ```

---

## Boundaries

### This layer CAN:

- Bundle mode selection with content patterns
- Define default page structures
- Map widget types to behaviours
- Configure chrome regions and overlays
- Compose section and widget composites

### This layer CANNOT:

- Define new modes - belongs in **Experience Layer (L2)**
- Define new behaviours - belongs in **Experience Layer (L2)**
- Define new widgets - belongs in **Content Layer (L1)**
- Define new section composites - belongs in **Content Layer (L1)**
- Implement rendering logic - belongs in **Renderer**

---

## Resolution Flow

```
Preset defines defaults
        │
        ▼
Site extends preset
        │
        ▼
Page extends preset page
        │
        ▼
Renderer consumes merged config
        │
        ▼
Mode defaults resolve behaviours
```

---

## Related Documents

- Philosophy: [philosophy.spec.md](../core/philosophy.spec.md)
- Content Layer: [content.spec.md](./content.spec.md)
- Experience Layer: [experience.spec.md](./experience.spec.md)
- Folder Structure: [creativeshire-folder-structure_v2.md](../creativeshire-folder-structure_v2.md)
