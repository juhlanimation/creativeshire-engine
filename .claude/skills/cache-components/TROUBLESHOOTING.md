# Cache Components Troubleshooting

> Debugging guide for Cache Components. Core philosophy: **"If it builds, it's correct."**

---

## Essential Checklist

Before debugging, verify:

- [ ] `cacheComponents: true` in `next.config.ts`
- [ ] Function is `async`
- [ ] `'use cache'` is first statement
- [ ] All arguments are serializable (no functions/class instances)
- [ ] No `cookies()`/`headers()` access inside cached functions

---

## Error: UseCacheTimeoutError

### Symptom

```
Error: A cache scope was created with "use cache" but no cache entry was created
```

### Cause

Cached function accesses request-specific data (cookies, headers, searchParams).

### Solution

Move request-specific logic outside cached function:

```typescript
// WRONG
'use cache'
async function getData() {
  const session = await cookies()  // Request-specific!
  return fetchUserData(session.get('userId'))
}

// CORRECT
async function getData(userId: string) {
  'use cache'
  return fetchUserData(userId)
}

// Call site
const userId = (await cookies()).get('userId')
const data = await getData(userId)
```

---

## Error: Sync Function with 'use cache'

### Symptom

```
Error: Functions marked with "use cache" must be async
```

### Cause

Cache Components requires async functions for streaming.

### Solution

```typescript
// WRONG
'use cache'
function getData() { ... }

// CORRECT
'use cache'
async function getData() { ... }
```

---

## Error: Dynamic Data Outside Suspense

### Symptom

```
Error: Route "/path" has dynamic data that was not wrapped in a Suspense boundary
```

### Cause

Request-specific APIs (`cookies()`, `headers()`) used without Suspense boundary.

### Solution

```typescript
// WRONG
export default async function Page() {
  const user = await getCurrentUser()  // Uses cookies internally
  return <Profile user={user} />
}

// CORRECT
export default function Page() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <Profile />
    </Suspense>
  )
}

async function Profile() {
  const user = await getCurrentUser()
  return <ProfileView user={user} />
}
```

---

## Error: Uncached Data Outside Suspense

### Symptom

```
Error: Async function without "use cache" called outside Suspense boundary
```

### Cause

All async I/O must either be cached or wrapped in Suspense.

### Solution

Option A: Add caching

```typescript
'use cache'
async function getData() {
  return fetchData()
}
```

Option B: Wrap in Suspense

```typescript
<Suspense fallback={<Loading />}>
  <AsyncComponent />
</Suspense>
```

---

## Error: Empty generateStaticParams

### Symptom

```
Error: generateStaticParams() returned an empty array
```

### Cause

At least one parameter set required for static generation.

### Solution

```typescript
export async function generateStaticParams() {
  const items = await fetchItems()

  // Ensure at least one entry
  if (items.length === 0) {
    return [{ slug: 'placeholder' }]
  }

  return items.map(item => ({ slug: item.slug }))
}
```

---

## Stale Data After Mutation

### Symptom

User updates data but sees old values.

### Checklist

1. **Correct function called?**
   - `updateTag()` for immediate updates
   - `revalidateTag()` for background refresh

2. **Tags match?**
   ```typescript
   // Data function
   cacheTag('posts', `post-${postId}`)

   // Mutation
   updateTag(`post-${postId}`)  // Must match exactly
   ```

3. **Using updateTag for user-facing changes?**
   ```typescript
   // WRONG - User sees stale data
   revalidateTag('posts')

   // CORRECT - Immediate invalidation
   updateTag('posts')
   ```

---

## Cache Not Working

### Symptom

Data always fetches, never serves from cache.

### Checklist

1. **Function is async?**
2. **'use cache' is first statement?**
3. **Arguments serializable?**
   ```typescript
   // WRONG - Functions not serializable
   getData({ onSuccess: () => {} })

   // CORRECT
   getData({ id: '123' })
   ```

4. **Not accessing request APIs inside cache?**

---

## Performance Issues

### Symptom

Pages slow despite caching.

### Solutions

1. **Use fine-grained caching:**
   ```typescript
   // WRONG - Monolithic cache
   'use cache'
   async function getPageData() {
     return {
       header: await fetchHeader(),
       posts: await fetchPosts(),
       sidebar: await fetchSidebar(),
     }
   }

   // CORRECT - Independent cached components
   <Header />    {/* Cached separately */}
   <Posts />     {/* Cached separately */}
   <Sidebar />   {/* Cached separately */}
   ```

2. **Use hierarchical tags:**
   ```typescript
   cacheTag('content', 'posts', `post-${id}`)

   // Invalidate at appropriate level
   updateTag(`post-${id}`)    // Single post
   updateTag('posts')          // All posts
   updateTag('content')        // All content
   ```

3. **Adjust cacheLife for data volatility:**
   ```typescript
   cacheLife('max')      // Rarely changes
   cacheLife('days')     // Daily updates
   cacheLife('hours')    // Multiple daily updates
   cacheLife('minutes')  // Frequently updated
   cacheLife('seconds')  // Near real-time
   ```

---

## Debugging

### Enable Verbose Logging

```bash
NEXT_PRIVATE_DEBUG_CACHE=1 npm run dev
```

### Verify Cache Behavior

1. Add logging to cached function
2. Check if function executes on repeated requests
3. Verify tags with `console.log` before/after mutations

### Build-Time Validation

Cache Components validates during build:
- Dynamic data access outside Suspense
- Cached data depending on request APIs
- Missing Suspense for streaming content

**If it builds without errors, caching is configured correctly.**

---

## See Also

- [Reference](REFERENCE.md) - Full API documentation
- [Patterns](PATTERNS.md) - Implementation patterns
