# Cache Components API Reference

> Complete API documentation for Next.js Cache Components.

---

## Core Directive

### `'use cache'`

Marks async functions as cacheable for Partial Prerendering.

```typescript
'use cache'

export async function getCachedData() {
  return await fetchData()
}
```

**Variants:**
- `'use cache'` - Uses default + remote handlers
- `'use cache: remote'` - Distributed cache only

**Requirements:**
- Must be async function
- First statement in function body
- Serializable arguments and return values
- Cannot directly call `cookies()`, `headers()`, or `searchParams`

---

## Cache Duration

### `cacheLife()`

Controls cache behavior through profiles or custom options.

```typescript
'use cache'
import { cacheLife } from 'next/cache'

export async function getData() {
  cacheLife('hours')  // Predefined profile
  return fetchData()
}
```

**Predefined Profiles:**

| Profile | Stale | Revalidate | Expire |
|---------|-------|------------|--------|
| `default` | 5 min | 15 min | 1 year |
| `seconds` | 30 sec | 1 sec | 1 min |
| `minutes` | 5 min | 1 min | 1 hour |
| `hours` | 5 min | 1 hour | 1 day |
| `days` | 5 min | 1 day | 1 week |
| `weeks` | 5 min | 1 week | 30 days |
| `max` | 5 min | 30 days | 1 year |

**Custom Options:**

```typescript
cacheLife({
  stale: 60 * 60,           // 1 hour
  revalidate: 60 * 60 * 24, // 1 day
  expire: 60 * 60 * 24 * 7, // 1 week
})
```

**Properties:**

| Property | Purpose |
|----------|---------|
| `stale` | Client uses cached data without server check |
| `revalidate` | After this time, next request triggers background refresh |
| `expire` | After this time with no requests, cache cleared |

**Important:** Entries with `expire < 300` seconds are treated as dynamic holes—they stream at request time.

---

## Cache Invalidation

### `cacheTag()`

Tags cached data for targeted invalidation.

```typescript
'use cache'
import { cacheLife, cacheTag } from 'next/cache'

export async function getPost(postId: string) {
  cacheLife('days')
  cacheTag('posts', `post-${postId}`)  // Multiple tags allowed

  return fetchPost(postId)
}
```

**Constraints:**
- Max 256 characters per tag
- Max 128 total tags per function

### `updateTag()`

Immediately invalidates cache. Use when the triggering user needs fresh data.

```typescript
'use server'
import { updateTag } from 'next/cache'

export async function updatePost(postId: string, data: PostData) {
  await savePost(postId, data)
  updateTag(`post-${postId}`)  // Immediate invalidation
}
```

**Use cases:** Cart updates, profile changes, content the user just edited.

### `revalidateTag()`

Marks entries stale for background refresh. Use for eventual consistency.

```typescript
'use server'
import { revalidateTag } from 'next/cache'

export async function updateInventory() {
  await syncInventory()
  revalidateTag('inventory')  // Stale-while-revalidate
}
```

**Use cases:** Analytics, inventory sync, admin batch updates.

### `revalidatePath()`

Invalidates all cache entries for a specific route.

```typescript
import { revalidatePath } from 'next/cache'

// Invalidate page and all its cached components
revalidatePath('/blog/[slug]', 'page')
```

---

## Cache Key Composition

Cache keys combine: `[buildId, functionId, serializedArgs, hmrRefreshHash]`

```typescript
// Different arguments = different cache entries
getData('user-1')  // Entry 1
getData('user-2')  // Entry 2 (separate cache)
```

Objects serialize structurally—identical content produces identical keys.

---

## Implicit Tags

Each route segment automatically receives an internal tag. `revalidatePath()` works without explicit `cacheTag()` calls.

---

## Configuration

### Enable Cache Components

```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  cacheComponents: true,
}

export default nextConfig
```

### Custom Profiles

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  cacheComponents: true,
  cacheLife: {
    portfolio: {
      stale: 60 * 60,           // 1 hour
      revalidate: 60 * 60 * 24, // 1 day
      expire: 60 * 60 * 24 * 7, // 1 week
    },
  },
}
```

---

## Deprecated Patterns

| Deprecated | Replacement |
|------------|-------------|
| `export const revalidate` | `'use cache'` + `cacheLife()` |
| `export const dynamic` | `<Suspense>` for dynamic zones |
| Segment-level config | Component-level caching |

---

## See Also

- [Patterns](PATTERNS.md) - Implementation patterns
- [Troubleshooting](TROUBLESHOOTING.md) - Error solutions
