# Data Fetching Spec

> Patterns for fetching, caching, and streaming data in Creativeshire sites.

---

## Principle

Creativeshire declares structure. Next.js fetches data. Keep them separate.

```
site/data/         →  Fetch functions (with caching)
       ↓
site/pages/        →  Page schema (with caching)
       ↓
creativeshire/     →  Pure render (no fetching)
```

**Rule:** Content and experience layers never fetch. They receive data as props.

---

## Pattern 1: Parallel Fetching

### Problem

Sequential awaits create waterfalls. Each await adds full network latency.

```typescript
// WRONG - Sequential waterfall (slow)
async function getPageData() {
  const site = await getSiteConfig()      // 100ms
  const page = await getPageSchema()      // 100ms
  const projects = await getProjects()    // 100ms
  return { site, page, projects }         // Total: 300ms
}
```

### Solution

Use `Promise.all()` for independent data.

```typescript
// CORRECT - Parallel fetching (fast)
async function getPageData() {
  const [site, page, projects] = await Promise.all([
    getSiteConfig(),    // 100ms ─┐
    getPageSchema(),    // 100ms ─┼─ Total: 100ms
    getProjects(),      // 100ms ─┘
  ])
  return { site, page, projects }
}
```

### Validation Rules

| # | Rule | Check |
|---|------|-------|
| 1 | No sequential awaits for independent data | Use Promise.all() |
| 2 | Waterfall only when data depends on previous | Document dependency |
| 3 | Await early only if value needed before branch | Defer await otherwise |

### When Waterfall is Correct

```typescript
// CORRECT - Data depends on previous result
async function getUserProjects(userId: string) {
  const user = await getUser(userId)           // Need user first
  const projects = await getProjects(user.id)  // Depends on user.id
  return { user, projects }
}
```

---

## Pattern 2: Defer Await

### Problem

Awaiting before the value is needed blocks other work.

```typescript
// WRONG - Await blocks the branch that doesn't use it
async function getPageData(slug: string) {
  const projects = await getProjects()  // Always awaited

  if (slug === 'about') {
    return { page: 'about' }  // Didn't need projects
  }

  return { page: 'home', projects }
}
```

### Solution

Move await into the branch where it's used.

```typescript
// CORRECT - Await only when needed
async function getPageData(slug: string) {
  const projectsPromise = getProjects()  // Start early

  if (slug === 'about') {
    return { page: 'about' }  // No await, fast return
  }

  const projects = await projectsPromise  // Await only when needed
  return { page: 'home', projects }
}
```

---

## Pattern 3: Cache Strategy

### Cache Profiles

| Profile | Stale | Revalidate | Use Case |
|---------|-------|------------|----------|
| `max` | 5 min | 30 days | Site config, navigation |
| `days` | 5 min | 1 day | Blog posts, project data |
| `hours` | 5 min | 1 hour | Product listings |
| `minutes` | 5 min | 5 min | Comments, user data |
| `seconds` | 30 sec | 1 sec | Real-time stats |

### Usage

```typescript
// site/data/projects.ts
'use cache'
import { cacheLife, cacheTag } from 'next/cache'

export async function getProjects() {
  cacheLife('days')
  cacheTag('projects')

  const projects = await fetchFromCMS()
  return projects
}
```

### Validation Rules

| # | Rule | Check |
|---|------|-------|
| 1 | Data functions use "use cache" | Directive at top |
| 2 | Profile matches update frequency | Match TTL to content type |
| 3 | Tags enable revalidation | cacheTag() called |

---

## Pattern 4: Request Deduplication

### Problem

Same data fetched multiple times in one request.

```typescript
// WRONG - Fetches user twice in same request
async function PageHeader() {
  const user = await getUser()  // Fetch 1
  return <Header user={user} />
}

async function PageFooter() {
  const user = await getUser()  // Fetch 2 (duplicate!)
  return <Footer user={user} />
}
```

### Solution

Use `React.cache()` for per-request deduplication.

```typescript
// site/data/user.ts
import { cache } from 'react'

export const getUser = cache(async () => {
  const user = await fetchUser()
  return user
})

// Now both components share the same cached result
```

### When to Use What

| Tool | Scope | Use Case |
|------|-------|----------|
| `React.cache()` | Single request | Dedupe within one render |
| `"use cache"` | Across requests | Persist data between users |
| Both together | Both | Dedupe + persist |

---

## Pattern 5: Suspense Streaming

### Problem

Slow data blocks entire page render.

### Solution

Wrap slow fetches in Suspense for progressive rendering.

```typescript
// app/page.tsx
import { Suspense } from 'react'

export default function Page() {
  return (
    <>
      {/* Above-fold renders immediately */}
      <Hero />

      {/* Below-fold streams in */}
      <Suspense fallback={<ProjectsSkeleton />}>
        <Projects />
      </Suspense>
    </>
  )
}

// Projects fetches its own data
async function Projects() {
  const projects = await getProjects()  // Slow fetch
  return <ProjectGrid projects={projects} />
}
```

### Validation Rules

| # | Rule | Check |
|---|------|-------|
| 1 | Above-fold content renders immediately | No Suspense on hero |
| 2 | Slow data wrapped in Suspense | Fallback provided |
| 3 | Fallback matches layout | Skeleton prevents shift |

### Skeleton Best Practices

```typescript
// Skeleton matches final layout dimensions
function ProjectsSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {[1, 2, 3].map(i => (
        <div
          key={i}
          className="h-64 animate-pulse rounded-lg bg-neutral-200"
        />
      ))}
    </div>
  )
}
```

---

## Anti-Patterns

| Anti-Pattern | Why It's Wrong | Fix |
|--------------|----------------|-----|
| Fetch in schema | Schema is static data | Fetch in page, pass as props |
| Fetch in widget | Widgets are pure render | Fetch in page, pass as props |
| Sequential independent fetches | Creates waterfall | Promise.all() |
| No cacheTag | Can't revalidate | Add cacheTag() |
| Await before branch | Blocks unused code path | Defer await |
| Missing Suspense boundary | Slow data blocks page | Wrap in Suspense |

---

## Decision Tree

```
Need data in component?
      │
      ▼
Is component in creativeshire/?
      │
  YES │ NO
      │  │
      ▼  ▼
Receive   Fetch in
as props  site/data/
      │       │
      │       ▼
      │   Independent data?
      │       │
      │   YES │ NO
      │       │  │
      │       ▼  ▼
      │   Promise.all()  Sequential
      │       │           await
      │       │             │
      │       └─────┬───────┘
      │             ▼
      │       Slow fetch?
      │             │
      │         YES │ NO
      │             │  │
      │             ▼  ▼
      │       Suspense  Direct
      │       boundary  render
      │             │     │
      └─────────────┴─────┘
```

---

## See Also

- [Caching Strategy](../reference/caching.spec.md) - Cache profiles and revalidation
- [Schema Layer](../layers/schema.spec.md) - Type definitions
- [Site Instance Layer](../layers/site-instance.spec.md) - Data organization
