# Cache Components Patterns

> Proven patterns for implementing Cache Components effectively.

---

## Pattern 1: Static + Cached + Dynamic Page

### Context

Page with header (static), featured content (cached), and personalized section (dynamic).

### Solution

```typescript
// app/page.tsx
import { Suspense } from 'react'
import Header from './header'
import FeaturedPosts from './featured-posts'
import PersonalizedFeed from './personalized-feed'

export default function Page() {
  return (
    <>
      <Header />              {/* Static shell */}
      <FeaturedPosts />       {/* Cached - no Suspense needed */}
      <Suspense fallback={<FeedSkeleton />}>
        <PersonalizedFeed />  {/* Dynamic - requires Suspense */}
      </Suspense>
    </>
  )
}
```

```typescript
// featured-posts.tsx
'use cache'
import { cacheLife, cacheTag } from 'next/cache'

export default async function FeaturedPosts() {
  cacheLife('hours')
  cacheTag('featured')

  const posts = await fetchFeaturedPosts()
  return <PostGrid posts={posts} />
}
```

---

## Pattern 2: Read-Your-Own-Writes

### Context

User creates content and should see it immediately.

### Solution

```typescript
// data/posts.ts
'use cache'
import { cacheLife, cacheTag } from 'next/cache'

export async function getPost(postId: string) {
  cacheLife('days')
  cacheTag('posts', `post-${postId}`)

  return fetchPost(postId)
}
```

```typescript
// actions/posts.ts
'use server'
import { updateTag } from 'next/cache'

export async function createPost(data: PostData) {
  const post = await savePost(data)
  updateTag('posts')  // Immediate invalidation
  return post
}
```

### Why `updateTag()` Not `revalidateTag()`

`updateTag()` ensures the creating user sees their content immediately. `revalidateTag()` would show stale data until background refresh.

---

## Pattern 3: Granular Cache Invalidation

### Context

Invalidate single post without clearing all posts.

### Solution

```typescript
'use cache'
import { cacheTag } from 'next/cache'

export async function getPost(postId: string) {
  cacheTag('posts', `post-${postId}`)  // Both tags
  return fetchPost(postId)
}

export async function getAllPosts() {
  cacheTag('posts')  // Collection tag only
  return fetchAllPosts()
}
```

```typescript
// Invalidate single post
updateTag(`post-${postId}`)  // Only this post

// Invalidate all posts
updateTag('posts')  // All post caches
```

---

## Pattern 4: Cached Data Fetchers

### Context

Multiple components need the same cached data.

### Solution

```typescript
// data/index.ts
'use cache'
import { cacheLife, cacheTag } from 'next/cache'

export async function getProjects() {
  cacheLife('hours')
  cacheTag('projects')
  return fetchProjects()
}

export async function getProject(slug: string) {
  cacheLife('days')
  cacheTag('projects', `project-${slug}`)
  return fetchProject(slug)
}

export async function getSiteConfig() {
  cacheLife('max')
  cacheTag('site-config')
  return fetchSiteConfig()
}
```

### Why This Works

Centralized data fetchers with consistent caching strategy. DRY and easy to maintain.

---

## Pattern 5: Stale-While-Revalidate

### Context

Analytics or inventory data that can be slightly stale.

### Solution

```typescript
// Admin updates inventory
'use server'
import { revalidateTag } from 'next/cache'

export async function syncInventory() {
  await updateInventoryFromSource()
  revalidateTag('inventory')  // Background refresh
}
```

```typescript
// Product page shows inventory
'use cache'
import { cacheLife, cacheTag } from 'next/cache'

export async function getInventory(productId: string) {
  cacheLife('minutes')  // Short cache for volatile data
  cacheTag('inventory', `inventory-${productId}`)
  return fetchInventory(productId)
}
```

### `updateTag` vs `revalidateTag`

| Use Case | Function | Behavior |
|----------|----------|----------|
| User-facing changes | `updateTag()` | Immediate invalidation |
| Background sync | `revalidateTag()` | Stale-while-revalidate |

---

## Pattern 6: E-commerce Product Page

### Context

Product page with static details, moderately-cached reviews, and dynamic inventory.

### Solution

```typescript
// app/products/[slug]/page.tsx
import { Suspense } from 'react'
import ProductDetails from './product-details'
import Reviews from './reviews'
import Inventory from './inventory'

export default function ProductPage({ params }) {
  return (
    <>
      <ProductDetails slug={params.slug} />   {/* Cached: days */}
      <Reviews productId={params.slug} />      {/* Cached: hours */}
      <Suspense fallback={<InventorySkeleton />}>
        <Inventory productId={params.slug} />  {/* Dynamic */}
      </Suspense>
    </>
  )
}
```

```typescript
// product-details.tsx
'use cache'
import { cacheLife, cacheTag } from 'next/cache'

export default async function ProductDetails({ slug }: { slug: string }) {
  cacheLife('days')
  cacheTag('products', `product-${slug}`)

  const product = await fetchProduct(slug)
  return <ProductInfo product={product} />
}
```

```typescript
// inventory.tsx (dynamic - no cache)
import { cookies } from 'next/headers'

export default async function Inventory({ productId }: { productId: string }) {
  const region = (await cookies()).get('region')?.value || 'us'
  const inventory = await fetchInventory(productId, region)

  return <StockStatus inventory={inventory} />
}
```

---

## Pattern 7: Multi-tenant SaaS

### Context

Each tenant's data must be isolated.

### Solution

```typescript
'use cache'
import { cacheTag } from 'next/cache'

export async function getTenantData(tenantId: string) {
  cacheTag(`tenant-${tenantId}`)  // Scoped by tenant
  return fetchTenantData(tenantId)
}
```

```typescript
// Invalidate only one tenant's cache
updateTag(`tenant-${tenantId}`)
```

### Why This Works

Tenant-scoped tags prevent cross-tenant cache pollution.

---

## Pattern 8: Subshell Generation

### Context

Category pages that should be instant, with streaming product details.

### Solution

```typescript
// app/categories/[category]/page.tsx
export async function generateStaticParams() {
  const categories = await fetchCategories()
  return categories.map(c => ({ category: c.slug }))
}

export default async function CategoryPage({ params }) {
  return (
    <>
      <CategoryHeader category={params.category} />
      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductGrid category={params.category} />
      </Suspense>
    </>
  )
}
```

### Why This Works

`generateStaticParams()` creates cached "subshells" for each category. Layout renders instantly; products stream in.

---

## Anti-Patterns

### Don't: Cache user-specific data without parameter

```typescript
// WRONG - All users see same cached data
'use cache'
export async function getUserProfile() {
  const session = await getSession()  // Session varies per user!
  return fetchProfile(session.userId)
}

// CORRECT - Pass userId as parameter
'use cache'
export async function getUserProfile(userId: string) {
  return fetchProfile(userId)
}
```

### Don't: Over-cache volatile data

```typescript
// WRONG - Stock changes frequently
'use cache'
cacheLife('days')
export async function getStockLevel() { ... }

// CORRECT - Short cache or dynamic
'use cache'
cacheLife('seconds')  // Or no cache at all
export async function getStockLevel() { ... }
```

### Don't: Omit Suspense for dynamic content

```typescript
// WRONG - Blocks entire page
export default async function Page() {
  const user = await getCurrentUser()  // Dynamic!
  return <Dashboard user={user} />
}

// CORRECT - Streams dynamic content
export default function Page() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <Dashboard />
    </Suspense>
  )
}
```

---

## See Also

- [Reference](REFERENCE.md) - Full API documentation
- [Troubleshooting](TROUBLESHOOTING.md) - Error solutions
