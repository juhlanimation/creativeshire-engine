# Multi-Site CMS Architecture

> Planning document for multi-site hosting, domain routing, versioning, and Engine/CMS separation.

---

## Status: Planning

**Created:** 2026-01-31
**Last Updated:** 2026-01-31

---

## Executive Summary

The Creativeshire Engine is designed as a generic CMS engine (like Squarespace/Webflow). This document outlines:

1. How to host multiple sites under one deployment
2. Domain-to-site routing architecture
3. Engine vs CMS responsibility separation
4. Widget versioning and migration strategy
5. Shared "Creativeshire wrapper" for cross-site data

---

## 1. Engine vs CMS Separation

### Principle

The **Engine** (this repo) is a library/package. The **CMS** (separate system) consumes it.

```
ENGINE (creativeshire-engine)         CMS (separate repo/system)
──────────────────────────────────────────────────────────────
Generic widgets                       Domain routing
Sections, chrome                      Site registry/database
Behaviours, effects                   Content management UI
Renderer pipeline                     Asset hosting
Schema/types                          User accounts
Presets (templates)                   Deployment orchestration
                                      Multi-site middleware
                                      Version tracking per site
```

### Key Insight

The Engine should NOT know about:
- Specific domains
- Site configurations
- Routing between sites
- User authentication

The Engine provides **capabilities**. The CMS provides **orchestration**.

---

## 2. Multi-Site Architecture (CMS Layer)

### Proposed Structure

```
cms-repo/
├── sites/                          # All site instances
│   ├── bojuhl.com/
│   │   ├── config.ts               # SiteSchema
│   │   ├── pages/
│   │   └── data/
│   ├── anotherclient.com/
│   │   ├── config.ts
│   │   ├── pages/
│   │   └── data/
│   └── index.ts                    # Site registry (domain → config)
│
├── middleware.ts                   # Domain → site routing
└── app/
    └── [[...slug]]/page.tsx        # Uses resolved site from middleware
```

### Site Registry

```typescript
// sites/index.ts
import { bojuhlConfig } from './bojuhl.com/config'
import { anotherConfig } from './anotherclient.com/config'

export const siteRegistry: Record<string, SiteSchema> = {
  'bojuhl.com': bojuhlConfig,
  'www.bojuhl.com': bojuhlConfig,
  'anotherclient.com': anotherConfig,
  'localhost:3000': bojuhlConfig,  // Dev default
}

export function getSiteByDomain(domain: string): SiteSchema | undefined {
  return siteRegistry[domain]
}
```

### Middleware (Domain Routing)

```typescript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import { siteRegistry } from './sites'

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? 'localhost:3000'
  const domain = host.replace(/:\d+$/, '') // Strip port

  const site = siteRegistry[host] ?? siteRegistry[domain]

  if (!site) {
    return NextResponse.rewrite(new URL('/404', request.url))
  }

  // Pass site ID to app via header
  const response = NextResponse.next()
  response.headers.set('x-site-id', site.id)
  return response
}

export const config = {
  matcher: ['/((?!_next|api|static|favicon.ico).*)'],
}
```

### App Router Integration

```typescript
// app/[[...slug]]/page.tsx
import { headers } from 'next/headers'
import { getSiteById, getPageRegistry } from '@/sites'

export default async function Page({ params }: Props) {
  const headersList = await headers()
  const siteId = headersList.get('x-site-id') ?? 'default'

  const site = getSiteById(siteId)
  const pages = getPageRegistry(siteId)
  const page = pages.getPageBySlug(slugToPath(params.slug))

  if (!page) return notFound()

  return <SiteRenderer site={site} page={page} />
}
```

### Request Flow

```
Request: bojuhl.com/about
         ↓
    Middleware
         ↓ (reads Host header)
    siteRegistry['bojuhl.com'] → bojuhlConfig
         ↓ (sets x-site-id: bojuhl)
    App Router [[...slug]]
         ↓ (reads header)
    getSiteById('bojuhl') + pages/index
         ↓
    SiteRenderer(bojuhlConfig, aboutPage)
         ↓
    Renders ONLY bojuhl content
```

---

## 3. Creativeshire Wrapper (Shared Data)

For data that should update across ALL sites hosted under Creativeshire:

```typescript
// creativeshire/shared/wrapper.tsx
import { creativeshireData } from './data'

export function CreativeshireWrapper({ children, site }) {
  return (
    <CreativeshireProvider data={creativeshireData}>
      {children}
    </CreativeshireProvider>
  )
}

// creativeshire/shared/data.ts
export const creativeshireData = {
  branding: {
    poweredBy: 'Built with Creativeshire',
    logo: '/creativeshire/logo.svg',
  },
  analytics: {
    // Shared tracking config
  },
  // When you update this, ALL sites get the update
}
```

---

## 4. Versioning Strategy

### Principle: Engine-Level, Not Widget-Level

Don't version individual widgets. Version the **engine as a whole**.

```
creativeshire-engine/
├── package.json              ← "version": "2.1.0" (single source of truth)
├── creativeshire/
│   ├── content/widgets/      ← No version metadata in individual files
│   ├── schema/
│   │   └── version.ts        ← Schema version + migration map
│   └── migrations/           ← Migration functions by version
```

**Why?** Widgets are interdependent. A Text widget update might require a matching Stack update. Individual versioning creates combinatorial nightmares.

### Site Schema Version

Sites track which engine version their config was written for:

```typescript
// In CMS: sites/bojuhl.com/config.ts
export const bojuhlConfig: SiteSchema = {
  id: 'bojuhl',
  schemaVersion: '2.1.0',        // ← Engine version this config targets
  theme: { ... },
  // ...
}
```

### Engine Version File (Proposed)

```typescript
// creativeshire/schema/version.ts

export const ENGINE_VERSION = '2.1.0'  // Synced with package.json

export const SCHEMA_CHANGELOG = {
  '2.0.0': 'Widget types lowercase, section padding split',
  '2.1.0': 'Added text truncation, new grid responsive props',
  '2.1.1': 'BUGFIX: Stack gap calculation',
}

export const BREAKING_CHANGES: Record<string, string[]> = {
  '2.0.0': ['widget-type-lowercase', 'padding-split'],
  '2.1.0': [],  // No breaking changes, just additions
}
```

### CMS Migration on Load

```typescript
// CMS code (not engine)
function loadSite(config: SiteSchema) {
  const currentVersion = getEngineVersion()

  if (semver.lt(config.schemaVersion, currentVersion)) {
    config = migrate(config, config.schemaVersion, currentVersion)
    config.schemaVersion = currentVersion
  }

  return config
}
```

---

## 5. Widget Updates: Compatibility Rules

### Non-Breaking Changes (Safe)

| Change | Example | Migration? |
|--------|---------|------------|
| New optional prop with default | `maxLines?: number` | No |
| Bug fix in rendering | Gap calculation fix | No |
| Performance improvement | Memoization | No |
| New component | `VideoPlayer` widget | No |

```typescript
// BEFORE
interface TextWidgetProps {
  content: string
  variant?: TextVariant
}

// AFTER - backwards compatible
interface TextWidgetProps {
  content: string
  variant?: TextVariant
  truncate?: {                 // NEW - optional, undefined = no truncation
    lines?: number
    indicator?: string         // default: '...'
  }
}
```

### Breaking Changes (Require Migration)

| Change | Example | Migration? |
|--------|---------|------------|
| Rename prop | `padding` → `paddingX/Y` | Yes |
| Change prop type | `gap: string` → `gap: number` | Yes |
| Remove prop | Delete `legacyMode` | Yes |
| Restructure schema | Flatten nested object | Yes |

### Migration File Structure

```
creativeshire/migrations/
├── index.ts                  # Migration runner
├── 2.0.0.ts                  # Migrations for 2.0.0
├── 2.1.0.ts
└── 2.2.0.ts
```

```typescript
// creativeshire/migrations/2.0.0.ts
export const migration = {
  widgets: (widget) => ({
    ...widget,
    type: widget.type.toLowerCase()  // 'Image' → 'image'
  }),

  sections: (section) => {
    if (section.settings?.padding) {
      const p = section.settings.padding
      return {
        ...section,
        settings: {
          ...section.settings,
          paddingX: p,
          paddingY: p,
          padding: undefined
        }
      }
    }
    return section
  }
}
```

---

## 6. Critical Bug Fixes

### Scenario A: Bug in rendering (no schema change)

1. Fix the code
2. Bump patch version: `2.1.0` → `2.1.1`
3. All sites get fix immediately on next deploy
4. No migration needed

### Scenario B: Bug requires schema change

1. Fix the schema
2. Add migration in `migrations/X.X.X.ts`
3. Bump minor version: `2.1.1` → `2.2.0`
4. CMS auto-migrates sites on load

---

## 7. Version Bump Reference

| Change Type | Version Bump | Migration? | Sites Updated |
|-------------|--------------|------------|---------------|
| Bug fix (rendering) | Patch (2.1.1) | No | Immediately |
| New optional prop | Minor (2.2.0) | No | Immediately |
| Schema structure change | Minor (2.2.0) | Yes | On load |
| Breaking change | Major (3.0.0) | Yes | On load |

---

## 8. Current State vs Target

### What Exists Now

| Component | Status |
|-----------|--------|
| Generic widgets | ✅ Exists |
| Presets system | ✅ Exists |
| Renderer pipeline | ✅ Exists |
| L1/L2 separation | ✅ Exists |
| Single site deployment | ✅ Current state |

### What Needs to Be Built

| Component | Location | Priority |
|-----------|----------|----------|
| `schemaVersion` in SiteSchema | Engine | High |
| `creativeshire/schema/version.ts` | Engine | High |
| `creativeshire/migrations/` folder | Engine | Medium |
| Versioning spec doc | Engine | Medium |
| Site registry | CMS | High |
| Domain middleware | CMS | High |
| Creativeshire wrapper | CMS | Medium |
| Migration runner | CMS | Medium |

---

## 9. Next Steps

### Phase 1: Engine Versioning Foundation

1. [ ] Add `schemaVersion` field to `SiteSchema`
2. [ ] Create `creativeshire/schema/version.ts` with `ENGINE_VERSION`
3. [ ] Create `creativeshire/migrations/` folder structure
4. [ ] Write `specs/core/versioning.spec.md`
5. [ ] Update `package.json` version to follow semver strictly

### Phase 2: CMS Multi-Site (Separate Repo)

1. [ ] Create CMS repository structure
2. [ ] Implement site registry (`sites/index.ts`)
3. [ ] Implement domain middleware
4. [ ] Refactor current `site/` folder into `sites/bojuhl.com/`
5. [ ] Implement Creativeshire wrapper for shared data

### Phase 3: Migration System

1. [ ] Implement migration runner in CMS
2. [ ] Create first migration (if needed)
3. [ ] Add migration tests
4. [ ] Document migration authoring process

---

## 10. Open Questions

1. **Database-driven sites?** Should site configs eventually live in a database rather than files?
2. **Preview/staging domains?** How to handle `preview.bojuhl.com` or `staging.bojuhl.com`?
3. **Asset separation?** Should each site have isolated asset storage?
4. **Cache invalidation?** When engine updates, how to invalidate CDN caches per-site?
5. **Rollback strategy?** If a migration breaks a site, how to rollback?

---

## References

| Topic | Location |
|-------|----------|
| Engine Architecture | [SKILL.md](skills/creativeshire/SKILL.md) |
| Site Schema | [specs/components/site/site.spec.md](skills/creativeshire/specs/components/site/site.spec.md) |
| Renderer | [specs/components/renderer/renderer.spec.md](skills/creativeshire/specs/components/renderer/renderer.spec.md) |
