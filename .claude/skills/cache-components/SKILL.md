---
name: cache-components
description: Next.js Cache Components and Partial Prerendering patterns. Use when implementing caching, data fetching, or optimizing server component rendering.
user-invocable: false
metadata:
  author: Vercel
  version: "1.0.0"
  upstream: https://github.com/vercel/next.js/tree/canary/.claude-plugin/plugins/cache-components
---

# Cache Components

Expert guidance for Next.js Cache Components and Partial Prerendering (PPR).

## When to Apply

Reference these guidelines when:
- Adding `'use cache'` to functions or components
- Configuring cache duration with `cacheLife()`
- Implementing cache invalidation with `cacheTag()`/`revalidateTag()`
- Building pages with mixed static/dynamic content
- Troubleshooting cache-related build errors

## Quick Reference

| API | Purpose |
|-----|---------|
| `'use cache'` | Mark function as cacheable |
| `cacheLife()` | Set cache duration profile |
| `cacheTag()` | Tag for targeted invalidation |
| `updateTag()` | Immediate invalidation (read-your-own-writes) |
| `revalidateTag()` | Background revalidation (stale-while-revalidate) |

## Documentation

| Topic | File |
|-------|------|
| Full API Reference | [REFERENCE.md](REFERENCE.md) |
| Implementation Patterns | [PATTERNS.md](PATTERNS.md) |
| Troubleshooting Guide | [TROUBLESHOOTING.md](TROUBLESHOOTING.md) |

## Core Concepts

### The Philosophy Shift

From segment-level to component-level caching:

```typescript
// OLD (deprecated)
export const revalidate = 3600

// NEW (Cache Components)
'use cache'
import { cacheLife } from 'next/cache'

export async function getData() {
  cacheLife('hours')
  return fetchData()
}
```

### Architecture Model

Pages combine three content types:

```
┌─────────────────────────────────────────────┐
│  Static Shell (build time)                   │
│  ├── Header, Footer, Layout                  │
│                                              │
│  ┌─────────────────────────────────────┐    │
│  │  Cached Content (revalidates)        │    │
│  │  ├── Featured items, Listings        │    │
│  └─────────────────────────────────────┘    │
│                                              │
│  ┌─────────────────────────────────────┐    │
│  │  Dynamic (streams at request)        │    │
│  │  ├── User data, Real-time content    │    │
│  │  └── Wrapped in <Suspense>           │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

### Decision Framework

```
Does it fetch data?
  └─ No → Pure static, no cache needed
  └─ Yes → Does it depend on request context (cookies/headers)?
      └─ Yes → Wrap in Suspense (dynamic streaming)
      └─ No → Can it be cached across users?
          └─ Yes → 'use cache' + cacheLife()
          └─ No → Wrap in Suspense (user-specific streaming)
```
