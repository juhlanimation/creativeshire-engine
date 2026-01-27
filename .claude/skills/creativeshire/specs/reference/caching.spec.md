# Caching Strategy

> Next.js 16 Cache Components for data fetching in creativeshire. Defines where caching applies and cache profiles.

---

## Overview

Next.js 16 introduced **Cache Components** - a caching model using the `"use cache"` directive.

| Feature | Purpose |
|---------|---------|
| `"use cache"` | Marks function/component as cacheable |
| `cacheLife()` | Sets cache duration profile |
| `cacheTag()` | Tags data for targeted revalidation |
| `revalidateTag()` | Invalidates tagged cache entries |

---

## Enabling Cache Components

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
};

export default nextConfig;
```

---

## Where Caching Applies

| Layer | Caching | Reason |
|-------|---------|--------|
| `site/data/` | **Yes** | Data fetching functions |
| `site/pages/` | **Yes** | Page schema definitions |
| `site/config.ts` | **Yes** | Site configuration |
| `creativeshire/content/` | **No** | Pure render, no data fetching |
| `creativeshire/experience/` | **No** | Client-side animation |
| `creativeshire/renderer/` | **No** | Receives data as props |

### The Rule

Only data-fetching code uses caching. Content and experience layers are pure render/animation.

```
site/data/         →  "use cache"  →  Fetches and caches
       ↓
site/pages/        →  "use cache"  →  Defines page schema
       ↓
creativeshire/renderer/  →  (no cache)  →  Receives props, renders
       ↓
creativeshire/content/   →  (no cache)  →  Pure components
       ↓
creativeshire/experience/  →  (no cache)  →  Client-side animation
```

---

## Cache Profiles

### Built-in Profiles

| Profile | Use Case | Stale | Revalidate | Expire |
|---------|----------|-------|------------|--------|
| `default` | Standard content | 5 min | 15 min | 1 year |
| `seconds` | Real-time data | 30 sec | 1 sec | 1 min |
| `minutes` | Frequently updated | 5 min | 1 min | 1 hour |
| `hours` | Multiple daily updates | 5 min | 1 hour | 1 day |
| `days` | Daily updates | 5 min | 1 day | 1 week |
| `weeks` | Weekly updates | 5 min | 1 week | 30 days |
| `max` | Rarely changes | 5 min | 30 days | 1 year |

### Profile Properties

| Property | Purpose |
|----------|---------|
| `stale` | How long client uses cached data without checking server |
| `revalidate` | After this time, next request triggers background refresh |
| `expire` | After this time with no requests, cache is cleared |

### Custom Profiles

Define in `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheLife: {
    portfolio: {
      stale: 60 * 60,           // 1 hour
      revalidate: 60 * 60 * 24, // 1 day
      expire: 60 * 60 * 24 * 7, // 1 week
    },
  },
};
```

---

## Pattern: Site Configuration

### Context

Site-wide configuration that rarely changes.

### Solution

```typescript
// site/config.ts
'use cache'
import { cacheLife } from 'next/cache';

export async function getSiteConfig() {
  cacheLife('max');

  return {
    title: 'Portfolio',
    description: '...',
    navigation: [...],
  };
}
```

### Why This Works

Site config is stable. `max` profile minimizes regeneration.

---

## Pattern: Page Data

### Context

Page schemas that update daily.

### Solution

```typescript
// site/pages/home.ts
'use cache'
import { cacheLife, cacheTag } from 'next/cache';

export async function getHomePage() {
  cacheLife('days');
  cacheTag('home-page');

  return {
    sections: [...],
  };
}
```

### Why This Works

`cacheTag` enables targeted revalidation when content changes.

---

## Pattern: Dynamic Content

### Context

Content from a CMS that updates throughout the day.

### Solution

```typescript
// site/data/projects.ts
'use cache'
import { cacheLife, cacheTag } from 'next/cache';

export async function getProjects() {
  cacheLife('hours');
  cacheTag('projects');

  const projects = await fetchFromCMS();
  return projects;
}
```

---

## Pattern: On-Demand Revalidation

### Context

CMS webhook triggers content refresh.

### Solution

```typescript
// app/api/revalidate/route.ts
import { revalidateTag } from 'next/cache';

export async function POST(request: Request) {
  const { tag } = await request.json();
  revalidateTag(tag);
  return Response.json({ revalidated: true });
}
```

### Usage

```bash
curl -X POST /api/revalidate -d '{"tag": "projects"}'
```

---

## Constraints

### Cannot Access Runtime APIs

Cached functions cannot directly use `cookies()`, `headers()`, or `searchParams`:

```typescript
// WRONG
async function getData() {
  'use cache'
  const cookieStore = await cookies();  // Error!
}

// CORRECT
async function getData(userId: string) {
  'use cache'
  // userId was read from cookies outside this function
  return fetchUserData(userId);
}
```

### Serializable Arguments Only

| Allowed | Not Allowed |
|---------|-------------|
| Primitives (`string`, `number`, `boolean`) | Class instances |
| Plain objects `{ key: value }` | Functions |
| Arrays | Symbols, WeakMaps |
| Dates, Maps, Sets | |

---

## Debugging

Enable verbose cache logging:

```bash
NEXT_PRIVATE_DEBUG_CACHE=1 npm run dev
```

---

## Quick Reference

| Scenario | Profile | Tag |
|----------|---------|-----|
| Site config | `max` | `site-config` |
| Navigation | `max` | `navigation` |
| Blog posts | `days` | `posts` |
| Product data | `hours` | `products` |
| User-specific | `minutes` | `user-{id}` |
| Real-time stats | `seconds` | `stats` |

---

## See Also

- [Schema Layer](../layers/schema.spec.md) - Type definitions
- [Site Instance Layer](../layers/site-instance.spec.md) - Site data organization
- [Next.js use cache docs](https://nextjs.org/docs/app/api-reference/directives/use-cache)
