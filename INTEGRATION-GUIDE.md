# Engine-Platform Integration Guide

This guide documents how to set up the creativeshire-engine as a standalone library that can be imported by the creativeshire-platform via Git URL dependency.

## Architecture Overview

```
creativeshire-engine/          # Private GitHub repo
├── creativeshire/             # The library (exported)
│   ├── index.ts               # Main entry point
│   ├── renderer/
│   ├── schema/
│   ├── content/
│   ├── experience/
│   └── presets/
├── app/                       # Local testing only (not exported)
├── package.json
└── CLAUDE.md

creativeshire-platform/        # Separate private GitHub repo
├── src/
│   ├── app/                   # Next.js App Router
│   ├── sites/                 # Site configurations
│   └── api/                   # Platform API (auth, billing)
├── package.json               # Depends on engine via Git URL
└── CLAUDE.md
```

**Dependency flow:**
```
Platform → imports → Engine
Engine → knows nothing about → Platform
```

---

## Part 1: Prepare Engine for Export

### 1.1 Create Main Entry Point

Create `creativeshire/index.ts`:

```typescript
// creativeshire/index.ts

// Renderer (what platform uses to render sites)
export * from './renderer'

// Schema (types for configuration)
export * from './schema'

// Content (widgets, sections, chrome)
export * from './content/widgets'
export * from './content/sections'
export * from './content/chrome'

// Experience (behaviours, drivers, modes)
export * from './experience'

// Presets (site templates)
export * from './presets'
```

### 1.2 Update package.json

Update the root `package.json` for library export:

```json
{
  "name": "@creativeshire/engine",
  "version": "0.1.0",
  "private": true,
  "main": "./creativeshire/index.ts",
  "types": "./creativeshire/index.ts",
  "exports": {
    ".": "./creativeshire/index.ts",
    "./renderer": "./creativeshire/renderer/index.ts",
    "./schema": "./creativeshire/schema/index.ts",
    "./content/*": "./creativeshire/content/*/index.ts",
    "./experience": "./creativeshire/experience/index.ts",
    "./presets": "./creativeshire/presets/index.ts"
  },
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "dependencies": {
    "@gsap/react": "^2.1.2",
    "clsx": "^2.1.1",
    "gsap": "^3.14.1",
    "tailwind-merge": "^3.4.0",
    "zustand": "^5.0.10"
  },
  "devDependencies": {
    "next": "^16.1.6",
    "react": "19.2.1",
    "react-dom": "19.2.1",
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "tailwindcss": "^4",
    "typescript": "^5",
    "vitest": "^4.0.18"
  },
  "scripts": {
    "test": "vitest run",
    "test:arch": "vitest run __tests__/architecture/",
    "dev": "next dev",
    "build": "next build"
  }
}
```

**Key changes explained:**
- `name`: Scoped package name `@creativeshire/engine`
- `main` / `types`: Point to library entry
- `exports`: Allows subpath imports like `@creativeshire/engine/renderer`
- `peerDependencies`: React provided by consuming app (platform)
- `devDependencies`: Next.js only for local testing, not required by consumers

### 1.3 Verify Exports

Ensure each export path has a proper `index.ts` with exports. Check these files exist and export correctly:

- `creativeshire/renderer/index.ts`
- `creativeshire/schema/index.ts`
- `creativeshire/content/widgets/index.ts`
- `creativeshire/content/sections/index.ts`
- `creativeshire/content/chrome/index.ts`
- `creativeshire/experience/index.ts`
- `creativeshire/presets/index.ts`

### 1.4 Update CLAUDE.md

Add to the top of the engine's CLAUDE.md:

```markdown
## Package Info

This is a **library package** (`@creativeshire/engine`).

- Exports components for use by creativeshire-platform
- Does NOT know about platform (auth, routing, API)
- React is a peer dependency (platform provides it)

## Importing

```typescript
// Full import
import { SiteRenderer, PageRenderer } from '@creativeshire/engine'

// Subpath imports
import { SiteRenderer } from '@creativeshire/engine/renderer'
import { SiteConfig } from '@creativeshire/engine/schema'
```
```

### 1.5 Commit and Push

```bash
cd creativeshire-engine
git add .
git commit -m "feat: configure engine as importable library"
git push origin main
git tag v0.1.0
git push origin v0.1.0
```

---

## Part 2: Create Platform Repo

### 2.1 Create GitHub Repo

1. Go to GitHub
2. Create new **private** repository: `creativeshire-platform`
3. Do not initialize with README (we'll set up locally)

### 2.2 Initialize Locally

```bash
# Clone empty repo
git clone git@github.com:YOURORG/creativeshire-platform.git
cd creativeshire-platform

# Initialize Next.js
npx create-next-app@latest . --typescript --tailwind --app --src-dir --no-git
```

### 2.3 Add Engine Dependency

Edit `package.json` to add the engine:

```json
{
  "dependencies": {
    "@creativeshire/engine": "github:YOURORG/creativeshire-engine#main",
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

### 2.4 Configure TypeScript

Update `tsconfig.json` to resolve the engine properly:

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

### 2.5 Create Basic Structure

```bash
mkdir -p src/sites
mkdir -p src/lib
```

### 2.6 Create Example Page Using Engine

Create `src/app/[site]/page.tsx`:

```typescript
import { SiteRenderer } from '@creativeshire/engine'
import { bojuhl } from '@creativeshire/engine/presets'

interface Props {
  params: Promise<{ site: string }>
}

export default async function SitePage({ params }: Props) {
  const { site } = await params

  // For now, just use bojuhl preset
  // Later: fetch site config from database
  if (site === 'bojuhl') {
    return <SiteRenderer config={bojuhl.site} page={bojuhl.pages.home} />
  }

  return <div>Site not found: {site}</div>
}
```

### 2.7 Create Platform CLAUDE.md

Create `CLAUDE.md`:

```markdown
# Creativeshire Platform

Next.js application that hosts sites built with @creativeshire/engine.

## Structure

```
src/
├── app/                    # Next.js App Router
│   ├── [site]/             # Dynamic site routes
│   ├── api/                # API routes
│   └── layout.tsx
├── sites/                  # Site-specific configurations
├── lib/                    # Platform utilities
└── components/             # Platform UI (admin, dashboard)
```

## Engine Usage

The engine is imported as a dependency:

```typescript
import { SiteRenderer } from '@creativeshire/engine'
import { SiteConfig } from '@creativeshire/engine/schema'
```

**Rules:**
1. Engine is a dependency - treat as read-only
2. Never modify engine code from this repo
3. Use engine schema types for site configurations
4. Platform handles: auth, routing, data fetching, deployment

## Updating Engine

```bash
# Pull latest engine changes
npm update @creativeshire/engine

# Or pin to specific version
# In package.json: "github:YOURORG/creativeshire-engine#v0.2.0"
npm install
```

## What Platform Handles

- Authentication & authorization
- Site routing & dynamic paths
- Database & data fetching
- Admin dashboard
- Deployment & hosting
- Billing & subscriptions
```

### 2.8 Initial Commit

```bash
git add .
git commit -m "feat: initialize platform with engine integration"
git push origin main
```

---

## Part 3: Daily Workflow

### Working on Engine

```bash
cd creativeshire-engine

# Make changes to widgets, behaviours, etc.
code .

# Test locally (uses app/ folder)
npm run dev

# Commit and push
git add .
git commit -m "feat: add new scroll behaviour"
git push origin main

# Optional: tag release
git tag v0.2.0
git push origin v0.2.0
```

### Working on Platform

```bash
cd creativeshire-platform

# Pull latest engine (if needed)
npm update @creativeshire/engine

# Work on platform features
code .

# Run dev server
npm run dev

# Commit and push
git add .
git commit -m "feat: add site dashboard"
git push origin main
```

### Updating Engine Version in Platform

**Option A: Always latest (main branch)**
```json
"@creativeshire/engine": "github:YOURORG/creativeshire-engine#main"
```
Then `npm update @creativeshire/engine` pulls latest.

**Option B: Pinned version (recommended for stability)**
```json
"@creativeshire/engine": "github:YOURORG/creativeshire-engine#v0.2.0"
```
Change version in package.json, then `npm install`.

---

## Part 4: Troubleshooting

### "Module not found" errors

1. Check exports in `creativeshire/index.ts`
2. Verify the path exists in `exports` field of package.json
3. Run `npm install` again in platform

### TypeScript errors with engine imports

1. Ensure platform's `tsconfig.json` has `"moduleResolution": "bundler"`
2. Check engine's types are exported correctly

### Changes not reflecting

1. In platform: `rm -rf node_modules/.cache`
2. Run `npm update @creativeshire/engine`
3. Restart dev server

### CSS not loading from engine

Engine CSS must be imported explicitly in platform's layout:
```typescript
// src/app/layout.tsx
import '@creativeshire/engine/styles.css' // if engine exports CSS
```

Or configure Tailwind to scan engine files:
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{ts,tsx}',
    './node_modules/@creativeshire/engine/**/*.{ts,tsx}'
  ]
}
```

---

## Summary

| Task | Repo | Command |
|------|------|---------|
| Edit widgets/behaviours | engine | Edit, test, commit, push |
| Edit site rendering | engine | Edit, test, commit, push |
| Edit platform features | platform | Edit, test, commit, push |
| Update engine in platform | platform | `npm update @creativeshire/engine` |
| Release engine version | engine | `git tag v0.x.0 && git push --tags` |
