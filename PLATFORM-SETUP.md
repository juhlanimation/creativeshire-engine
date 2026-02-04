# Platform Setup Guide

Instructions for creating `creativeshire-platform`, the Next.js application that hosts sites built with `@creativeshire/engine`.

## Architecture Overview

```
creativeshire-engine/          # This repo (library)
├── engine/                    # The exportable library
├── app/                       # Local testing only (not exported)
└── package.json

creativeshire-platform/        # New repo (application)
├── src/
│   ├── app/                   # Next.js App Router
│   ├── sites/                 # Site configurations
│   └── platform/              # Auth, billing, dashboard
└── package.json               # Depends on engine via Git URL
```

**Dependency flow:**
```
Platform → imports → Engine (pinned to tag)
Engine → knows nothing about → Platform
```

---

## Step 1: Create Platform Repo

```bash
# Create new private GitHub repo: creativeshire-platform
# Clone and initialize Next.js
git clone git@github.com:YOURORG/creativeshire-platform.git
cd creativeshire-platform
npx create-next-app@latest . --typescript --tailwind --app --src-dir --no-git
```

---

## Step 2: Add Engine Dependency

Edit `package.json`:

```json
{
  "dependencies": {
    "@creativeshire/engine": "github:YOURORG/creativeshire-engine#v0.1.0",
    "next": "^16.1.6",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  }
}
```

Then install:

```bash
npm install
```

---

## Step 3: Configure TypeScript

Update `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "moduleResolution": "bundler"
  }
}
```

---

## Step 4: Configure Styles (CRITICAL)

The engine exports **component styles only**. The platform owns global styles.

### What the engine provides

```
@creativeshire/engine/styles
├── Widget styles (primitives, layout, interactive)
├── Effect styles (fade, transform, mask)
├── Chrome styles (footer, modal, overlays)
└── Preset styles (section styling)
```

### What the platform must provide

1. **Tailwind initialization**
2. **Base resets** (box-sizing, margin, etc.)
3. **Next.js fonts** with correct variable names

### Platform's globals.css

Create `src/app/globals.css`:

```css
@import "tailwindcss";

/* Engine styles - includes site base, scrollbar, widgets, effects, chrome */
@import "@creativeshire/engine/styles";

/* If using a preset, import its styles too */
@import "@creativeshire/engine/presets/bojuhl/styles";

/* Tell Tailwind to scan engine components */
@source "../node_modules/@creativeshire/engine/**/*.tsx";

/* =============================================================================
 * PLATFORM RESETS ONLY
 * Site-specific styles (scrollbar, typography, media) come from engine.
 * These are generic resets for the platform itself.
 * ============================================================================= */

*, *::before, *::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}

h1, h2, h3, h4, h5, h6, p {
  margin: 0;
}

button {
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  font: inherit;
}
```

**Note:** The engine now provides site-scoped styles for:
- Scrollbar (themed via ThemeProvider)
- Scroll behavior (`smooth`)
- Font smoothing
- Link color inheritance
- Image/video block display

These are applied to `[data-site-renderer]` so they only affect the rendered site, not platform UI.

### Font Setup (Required)

The engine's ThemeProvider sets `--font-title` and `--font-paragraph` at runtime.
By default, these reference Next.js font variables that **you must define**:

```typescript
// src/app/layout.tsx
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',  // Engine default for --font-title
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',  // Engine default for --font-paragraph
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

### Alternative: Custom Font Mapping

If you use different fonts, configure the theme:

```typescript
// In your site config
const siteConfig: SiteSchema = {
  theme: {
    typography: {
      title: 'var(--your-heading-font), system-ui, sans-serif',
      paragraph: 'var(--your-body-font), system-ui, sans-serif',
    }
  },
  // ...
}
```

### Font Variable Fallbacks

Engine CSS now includes fallbacks (`system-ui, -apple-system, sans-serif`), so components will render even without custom fonts. But for proper branding, always define your fonts.

---

## Step 5: Configure Tailwind

Update `tailwind.config.ts` to scan engine:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/@creativeshire/engine/**/*.{ts,tsx}'
  ],
  // ... rest of config
}
```

---

## Step 6: Contained Mode (iframe/Preview)

When rendering the engine inside an iframe or preview canvas (like a CMS editor), wrap `SiteRenderer` with `ContainerProvider` in contained mode. This ensures all features work identically to fullpage mode:

- Fade-in animations (IntersectionObserver scoped to container)
- CursorLabel overlays (events scoped to container)
- Modal keyboard handling (Escape key, focus trap)
- Smooth scrolling (wheel lerp within container)
- Slideshow keyboard navigation

### Preview Canvas Component

```tsx
'use client'

import { useRef } from 'react'
import { SiteRenderer, ContainerProvider } from '@creativeshire/engine'
import type { SiteSchema, PageSchema } from '@creativeshire/engine/schema'

interface PreviewCanvasProps {
  site: SiteSchema
  page: PageSchema
}

export function PreviewCanvas({ site, page }: PreviewCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        overflow: 'auto',
        height: '100vh',
        width: '100%',
      }}
    >
      <ContainerProvider mode="contained" containerRef={containerRef}>
        <SiteRenderer site={site} page={page} />
      </ContainerProvider>
    </div>
  )
}
```

### How It Works

| Feature | Fullpage Mode | Contained Mode |
|---------|--------------|----------------|
| Scroll detection | `window` scroll | Container scroll |
| Visibility (fade-in) | Viewport intersection | Container intersection |
| Event listeners | `document` | `containerRef.current` |
| Portals (modals) | `document.body` | Container element |
| Smooth scroll | GSAP ScrollSmoother | Wheel lerp interpolation |

### Container Requirements

The container element must have:
- `position: relative` (for absolute-positioned children)
- `overflow: auto` or `overflow: scroll` (for scroll detection)
- Explicit height (e.g., `100vh`, `600px`, `100%`)

### Importing ContainerProvider

```typescript
import { ContainerProvider } from '@creativeshire/engine'
// or
import { ContainerProvider } from '@creativeshire/engine/interface'
```

---

## Step 6b: True iframe Mode (Optional)

If you need a true `<iframe>` (separate document), create a preview route with its own CSS.

### Why iframe?

Use true iframe when you need:
- Complete CSS isolation from platform UI
- Security sandbox for untrusted content
- Separate scroll context

For most CMS previews, the ContainerProvider approach (Step 6) is simpler and recommended.

### Preview Route Structure

```
src/app/
├── (platform)/           # Platform UI (dashboard, etc.)
│   └── layout.tsx        # Platform styles
├── preview/              # Engine preview (iframe target)
│   ├── layout.tsx        # Engine styles ONLY
│   ├── globals.css       # Minimal CSS for engine
│   └── [site]/
│       └── page.tsx      # SiteRenderer
```

### Preview Layout (iframe CSS)

Create `src/app/preview/layout.tsx`:

```tsx
import './globals.css'

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

### Preview Globals (engine-only CSS)

Create `src/app/preview/globals.css`:

```css
/* Tailwind for engine components */
@import "tailwindcss";

/* Engine core styles */
@import "@creativeshire/engine/styles";

/* Preset styles (if using bojuhl) */
@import "@creativeshire/engine/presets/bojuhl/styles";

/* Scan engine components for Tailwind classes */
@source "../../../node_modules/@creativeshire/engine/**/*.tsx";

/* Minimal resets for iframe */
*, *::before, *::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}
```

### Preview Page

Create `src/app/preview/[site]/page.tsx`:

```tsx
import { SiteRenderer } from '@creativeshire/engine'
import { bojuhlPreset } from '@creativeshire/engine/presets'

interface Props {
  params: Promise<{ site: string }>
}

export default async function PreviewPage({ params }: Props) {
  const { site } = await params

  if (site === 'bojuhl') {
    return <SiteRenderer config={bojuhlPreset.site} page={bojuhlPreset.pages.home} />
  }

  return <div>Site not found: {site}</div>
}
```

### Using the iframe in Platform

```tsx
// In your CMS editor component
export function EditorCanvas() {
  return (
    <iframe
      src="/preview/bojuhl"
      style={{ width: '100%', height: '100%', border: 'none' }}
    />
  )
}
```

### Tailwind Isolation

With this setup:
- **Platform CSS**: `src/app/(platform)/globals.css` - for dashboard, controls
- **Preview CSS**: `src/app/preview/globals.css` - for engine only

Each has its own Tailwind config, ensuring no class conflicts.

---

## Step 7: Create Site Route

Create `src/app/[site]/page.tsx`:

```typescript
import { SiteRenderer } from '@creativeshire/engine'
import { bojuhlPreset } from '@creativeshire/engine/presets'

interface Props {
  params: Promise<{ site: string }>
}

export default async function SitePage({ params }: Props) {
  const { site } = await params

  // For now, use bojuhl preset
  // Later: fetch site config from database
  if (site === 'bojuhl') {
    return <SiteRenderer config={bojuhlPreset.site} page={bojuhlPreset.pages.home} />
  }

  return <div>Site not found: {site}</div>
}
```

---

## Step 8: Create Platform CLAUDE.md

Create `CLAUDE.md` in platform repo:

```markdown
# Creativeshire Platform

Next.js application hosting sites built with @creativeshire/engine.

## This is an APPLICATION

- Imports engine as dependency (pinned to version tag)
- Handles: routing, auth, database, deployment
- Never modify engine code - update dependency instead

## Structure

\`\`\`
src/
├── app/                    # Next.js App Router
│   ├── [site]/             # Dynamic site routes
│   ├── api/                # API routes
│   └── layout.tsx
├── sites/                  # Site-specific configurations
├── lib/                    # Platform utilities
└── components/             # Platform UI (admin, dashboard)
\`\`\`

## Engine Usage

\`\`\`typescript
import { SiteRenderer } from '@creativeshire/engine'
import type { SiteSchema } from '@creativeshire/engine/schema'
\`\`\`

## Updating Engine

1. Check engine repo for new tags
2. Update package.json: \`#v0.1.0\` → \`#v0.2.0\`
3. \`rm -rf node_modules/.cache && npm install\`
4. Test and commit
```

---

## Daily Workflow

### Working on Engine

```bash
cd creativeshire-engine

# Make changes to widgets, behaviours, etc.
npm run dev    # Test locally

# Commit and push
git add . && git commit -m "feat: add new behaviour"
git push origin main

# Tag release
git tag v0.2.0
git push origin v0.2.0
```

### Working on Platform

```bash
cd creativeshire-platform

# Pull latest engine
npm update @creativeshire/engine

# Work on platform features
npm run dev

# Commit and push
git add . && git commit -m "feat: add dashboard"
git push origin main
```

---

## Troubleshooting

### "Module not found" errors

1. Check exports in `engine/index.ts`
2. Verify the path exists in `exports` field of package.json
3. Run `rm -rf node_modules && npm install`

### TypeScript errors with engine imports

1. Ensure platform's `tsconfig.json` has `"moduleResolution": "bundler"`
2. Restart TypeScript server in your IDE

### Changes not reflecting

1. Delete cache: `rm -rf node_modules/.cache`
2. Force update: `npm update @creativeshire/engine`
3. Restart dev server

---

## What Lives Where

| Concern | Engine | Platform |
|---------|--------|----------|
| Widgets, sections, chrome | ✅ | |
| Behaviours, effects, drivers | ✅ | |
| Schema types | ✅ | |
| Presets (templates) | ✅ | |
| SiteRenderer, PageRenderer | ✅ | |
| Site configurations | | ✅ |
| Routing (`/[site]/[page]`) | | ✅ |
| Authentication | | ✅ |
| Database/API | | ✅ |
| Admin dashboard | | ✅ |
| Deployment config | | ✅ |
