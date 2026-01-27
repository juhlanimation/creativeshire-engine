# Metadata & SEO

> SEO metadata, Open Graph, JSON-LD structured data, and sitemap patterns for Creativeshire sites.

---

## Purpose

Metadata controls how pages appear in search results, social shares, and accessibility tools. Creativeshire centralizes metadata through `PageHeadSchema`, enabling consistent SEO across all pages while allowing per-page customization. Proper metadata improves discoverability, social engagement, and search ranking.

---

## Concepts

| Term | Definition |
|------|------------|
| PageHeadSchema | Type-safe interface for page-level metadata |
| Meta Tags | HTML `<meta>` elements controlling browser and crawler behavior |
| Open Graph | Facebook/LinkedIn protocol for rich social previews |
| Twitter Card | Twitter-specific metadata for tweet embeds |
| JSON-LD | Structured data format for search engine understanding |
| Canonical URL | Authoritative URL preventing duplicate content issues |
| Sitemap | XML file listing all indexable pages for crawlers |
| Robots | Directives controlling crawler access and behavior |

---

## PageHeadSchema Interface

Page-level metadata uses a flattened structure (no nested objects) to match the Feature pattern and simplify access.

```typescript
// creativeshire/schema/page-head.ts
export interface PageHeadSchema {
  // Required
  title: string

  // SEO Essentials
  description?: string
  canonical?: string
  keywords?: string[]

  // Open Graph (flattened)
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogImageAlt?: string
  ogUrl?: string
  ogType?: 'website' | 'article' | 'profile'
  ogSiteName?: string
  ogLocale?: string

  // Twitter Card (flattened)
  twitterCard?: 'summary' | 'summary_large_image'
  twitterSite?: string
  twitterCreator?: string
  twitterImage?: string

  // Robots (flattened)
  robotsIndex?: boolean    // default: true
  robotsFollow?: boolean   // default: true
  robotsNoArchive?: boolean
  robotsNoSnippet?: boolean

  // Technical
  viewport?: string
  themeColor?: string
  colorScheme?: 'light' | 'dark' | 'light dark'
  icons?: {
    icon?: string
    apple?: string
    shortcut?: string
  }

  // JSON-LD
  jsonLd?: JsonLdSchema | JsonLdSchema[]
}
```

### Design Decision: Flattened Structure

**Why not nested?**
```typescript
// AVOID - Deep nesting creates accessor chains
meta?: {
  openGraph?: {
    title?: string
    description?: string
  }
}
// Usage: page.meta?.openGraph?.title

// PREFER - Flat structure, direct access
ogTitle?: string
ogDescription?: string
// Usage: page.ogTitle
```

Flattened structure:
- Matches Feature pattern (shallow nesting)
- Enables simpler type narrowing
- Reduces optional chaining depth
- Maps directly to Next.js Metadata API

---

## Meta Tag Patterns

### Required Meta Tags

Every page must have these meta tags:

| Tag | Purpose | Example |
|-----|---------|---------|
| `<title>` | Browser tab and search result title | `Page Title \| Site Name` |
| `description` | Search result snippet (150-160 chars) | `Brief page summary...` |
| `viewport` | Responsive scaling | `width=device-width, initial-scale=1` |

### Recommended Meta Tags

| Tag | Purpose | When to Use |
|-----|---------|-------------|
| `canonical` | Prevent duplicate content | Always (self-referencing OK) |
| `robots` | Crawler directives | When restricting indexing |
| `theme-color` | Mobile browser chrome | Brand consistency |
| `keywords` | Search terms | Low priority (rarely used by engines) |

### Template

```typescript
// site/pages/about.ts
import type { PageSchema, PageHeadSchema } from '@/creativeshire/schema'

const head: PageHeadSchema = {
  title: 'About Us | My Site',
  description: 'Learn about our team and mission. We build creative digital experiences.',
  canonical: 'https://mysite.com/about',
  ogTitle: 'About Us',
  ogDescription: 'Meet the team behind the creative work.',
  ogImage: 'https://mysite.com/images/about-og.jpg',
  twitterCard: 'summary_large_image',
}

export const aboutPage: PageSchema = {
  id: 'about',
  slug: '/about',
  head,
  sections: [...]
}
```

---

## Open Graph & Twitter Cards

### Open Graph Tags

Required for rich social previews on Facebook, LinkedIn, and other platforms.

| Property | Required | Description |
|----------|----------|-------------|
| `og:title` | Yes | Share title (60 chars max) |
| `og:description` | Yes | Share description (155 chars max) |
| `og:image` | Yes | Preview image (1200x630px recommended) |
| `og:url` | Yes | Canonical page URL |
| `og:type` | No | Content type (website, article, profile) |
| `og:site_name` | No | Overall site name |

### Twitter Card Tags

Twitter-specific metadata (falls back to Open Graph if not set).

| Property | Description |
|----------|-------------|
| `twitter:card` | Card type: `summary` (small) or `summary_large_image` (large) |
| `twitter:site` | @username of site (e.g., `@mysite`) |
| `twitter:creator` | @username of content creator |
| `twitter:image` | Image URL (separate from og:image if needed) |

### Image Requirements

| Platform | Dimensions | Aspect Ratio | Max Size |
|----------|------------|--------------|----------|
| Open Graph | 1200 x 630px | 1.91:1 | 8MB |
| Twitter Large | 1200 x 628px | 1.91:1 | 5MB |
| Twitter Summary | 144 x 144px | 1:1 | 5MB |

### Integration with Next.js

```typescript
// app/[...slug]/page.tsx
import type { Metadata } from 'next'
import type { PageHeadSchema } from '@/creativeshire/schema'

export async function generateMetadata({ params }): Promise<Metadata> {
  const page = await getPage(params.slug)
  const head: PageHeadSchema = page.head

  return {
    title: head.title,
    description: head.description,
    keywords: head.keywords,

    openGraph: {
      title: head.ogTitle ?? head.title,
      description: head.ogDescription ?? head.description,
      images: head.ogImage ? [{
        url: head.ogImage,
        alt: head.ogImageAlt ?? head.title,
        width: 1200,
        height: 630,
      }] : undefined,
      url: head.ogUrl ?? head.canonical,
      type: head.ogType ?? 'website',
      siteName: head.ogSiteName,
      locale: head.ogLocale ?? 'en_US',
    },

    twitter: {
      card: head.twitterCard ?? 'summary_large_image',
      site: head.twitterSite,
      creator: head.twitterCreator,
      images: head.twitterImage ?? head.ogImage,
    },

    robots: {
      index: head.robotsIndex ?? true,
      follow: head.robotsFollow ?? true,
      noarchive: head.robotsNoArchive,
      nosnippet: head.robotsNoSnippet,
    },

    alternates: {
      canonical: head.canonical,
    },
  }
}
```

---

## JSON-LD Structured Data

Schema.org markup helps search engines understand page content for rich results.

### Common Schema Types

| Schema Type | Use Case | Rich Result |
|-------------|----------|-------------|
| `WebSite` | Site root | Sitelinks search box |
| `WebPage` | Any page | Basic listing |
| `Article` | Blog posts | Article cards |
| `Person` | About pages | Knowledge panel |
| `Organization` | Company info | Knowledge panel |
| `BreadcrumbList` | Navigation | Breadcrumb trail |
| `FAQPage` | FAQ sections | FAQ accordion |
| `LocalBusiness` | Physical locations | Map pack |

### JSON-LD Interface

```typescript
// creativeshire/schema/json-ld.ts
export type JsonLdSchema =
  | WebSiteSchema
  | WebPageSchema
  | ArticleSchema
  | PersonSchema
  | OrganizationSchema
  | BreadcrumbSchema
  | FAQSchema

export interface WebSiteSchema {
  '@type': 'WebSite'
  name: string
  url: string
  description?: string
  potentialAction?: SearchAction
}

export interface WebPageSchema {
  '@type': 'WebPage'
  name: string
  description?: string
  url?: string
  datePublished?: string
  dateModified?: string
  author?: PersonSchema | OrganizationSchema
}

export interface ArticleSchema {
  '@type': 'Article' | 'BlogPosting'
  headline: string
  description?: string
  image?: string | string[]
  datePublished: string
  dateModified?: string
  author: PersonSchema
}

export interface BreadcrumbSchema {
  '@type': 'BreadcrumbList'
  itemListElement: BreadcrumbItem[]
}

export interface BreadcrumbItem {
  '@type': 'ListItem'
  position: number
  name: string
  item?: string
}
```

### JSON-LD Component

```typescript
// creativeshire/content/chrome/JsonLd.tsx
import type { JsonLdSchema } from '@/creativeshire/schema'

interface JsonLdProps {
  data: JsonLdSchema | JsonLdSchema[]
}

export function JsonLd({ data }: JsonLdProps) {
  const schemas = Array.isArray(data) ? data : [data]

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              ...schema,
            }),
          }}
        />
      ))}
    </>
  )
}
```

### Usage Examples

```typescript
// Site-level: WebSite with SearchAction
const siteJsonLd: WebSiteSchema = {
  '@type': 'WebSite',
  name: 'My Portfolio',
  url: 'https://mysite.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://mysite.com/search?q={search_term_string}',
    'query-input': 'required name=search_term_string',
  },
}

// Article: BlogPosting with author
const articleJsonLd: ArticleSchema = {
  '@type': 'BlogPosting',
  headline: 'Article Title',
  datePublished: '2024-01-15T08:00:00Z',
  author: { '@type': 'Person', name: 'Author Name' },
}

// Breadcrumb: List of navigation items
const breadcrumbJsonLd: BreadcrumbSchema = {
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://mysite.com' },
    { '@type': 'ListItem', position: 2, name: 'Work', item: 'https://mysite.com/work' },
    { '@type': 'ListItem', position: 3, name: 'Current Page' },  // No item = current
  ],
}
```

---

## Dynamic Metadata

Generate metadata from page content or CMS data.

### Pattern: Title Templates

```typescript
// site/config.ts
export const siteConfig = {
  metadata: {
    titleTemplate: '%s | My Site',
    defaultTitle: 'My Site',
    defaultDescription: 'Creative digital experiences.',
    siteUrl: 'https://mysite.com',
    ogImage: '/images/default-og.jpg',
  },
}

// site/data/metadata.ts
import { siteConfig } from '../config'

export function createPageHead(page: {
  title: string
  description?: string
  image?: string
  slug: string
}): PageHeadSchema {
  const { metadata } = siteConfig

  return {
    title: page.title,
    description: page.description ?? metadata.defaultDescription,
    canonical: `${metadata.siteUrl}${page.slug}`,
    ogTitle: page.title,
    ogDescription: page.description ?? metadata.defaultDescription,
    ogImage: page.image ?? `${metadata.siteUrl}${metadata.ogImage}`,
    ogUrl: `${metadata.siteUrl}${page.slug}`,
    twitterCard: 'summary_large_image',
  }
}
```

### Pattern: CMS Integration

```typescript
// site/data/projects.ts
'use cache'
import { cacheLife, cacheTag } from 'next/cache'
import type { PageHeadSchema } from '@/creativeshire/schema'

export async function getProjectMeta(slug: string): Promise<PageHeadSchema> {
  cacheLife('days')
  cacheTag(`project-${slug}`)

  const project = await fetchProjectFromCMS(slug)

  return {
    title: `${project.title} | Projects`,
    description: project.excerpt,
    canonical: `https://mysite.com/work/${slug}`,
    ogTitle: project.title,
    ogDescription: project.excerpt,
    ogImage: project.featuredImage,
    jsonLd: {
      '@type': 'Article',
      headline: project.title,
      description: project.excerpt,
      image: project.featuredImage,
      datePublished: project.publishedAt,
      author: {
        '@type': 'Person',
        name: project.author.name,
      },
    },
  }
}
```

---

## Sitemap

### Generation Pattern

```typescript
// app/sitemap.ts
import type { MetadataRoute } from 'next'
import { siteConfig } from '@/site/config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.metadata.siteUrl

  // Static pages from site config
  const staticPages = siteConfig.pages.map((page) => ({
    url: `${baseUrl}${page.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: page.slug === '/' ? 1 : 0.8,
  }))

  // Dynamic pages from CMS
  const projects = await getProjects()
  const projectPages = projects.map((project) => ({
    url: `${baseUrl}/work/${project.slug}`,
    lastModified: new Date(project.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...projectPages]
}
```

### Sitemap Index for Large Sites

```typescript
// app/sitemap.ts
export async function generateSitemaps() {
  const projects = await getProjectCount()
  const pagesPerSitemap = 1000
  const sitemapCount = Math.ceil(projects / pagesPerSitemap)

  return Array.from({ length: sitemapCount }, (_, i) => ({ id: i }))
}

export default async function sitemap({ id }: { id: number }) {
  const start = id * 1000
  const projects = await getProjects({ offset: start, limit: 1000 })

  return projects.map((project) => ({
    url: `https://mysite.com/work/${project.slug}`,
    lastModified: project.updatedAt,
  }))
}
```

---

## Robots

### robots.txt Pattern

```typescript
// app/robots.ts
import type { MetadataRoute } from 'next'
import { siteConfig } from '@/site/config'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.metadata.siteUrl

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/', '/_next/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
```

### Per-Page Robots Control

```typescript
// Control indexing via PageHeadSchema
const head: PageHeadSchema = {
  title: 'Private Page',
  robotsIndex: false,   // noindex
  robotsFollow: true,   // follow links
  robotsNoArchive: true, // don't cache
}
```

### Robots Directive Reference

| Directive | Effect |
|-----------|--------|
| `index` / `noindex` | Allow/prevent page indexing |
| `follow` / `nofollow` | Follow/ignore page links |
| `noarchive` | Don't show cached version |
| `nosnippet` | Don't show description snippet |
| `noimageindex` | Don't index images on page |

---

## Integration with Site/Page Schema

### Site-Level Defaults

```typescript
// creativeshire/schema/site.ts
export interface SiteSchema {
  id: string
  experience: ExperienceConfig
  chrome: ChromeSchema
  pages: PageReference[]
  metadata?: SiteMetadataDefaults  // Site-wide defaults
}

export interface SiteMetadataDefaults {
  titleTemplate?: string      // '%s | Site Name'
  defaultDescription?: string
  siteUrl: string
  ogImage?: string
  twitterSite?: string
  jsonLd?: JsonLdSchema       // Site-wide JSON-LD
}
```

### Page-Level Override

```typescript
// creativeshire/schema/page.ts
export interface PageSchema {
  id: string
  slug: string
  title?: string
  head?: PageHeadSchema       // Page-specific metadata
  chrome?: 'inherit' | PageChromeOverrides
  sections: SectionSchema[]
}
```

### Resolution Order

```
1. Page head (page.head.title)
   ↓ if undefined
2. Site defaults (site.metadata.defaultDescription)
   ↓ if undefined
3. Fallback values (hardcoded defaults)
```

---

## Rules

### Must

1. Every page has a `title` (required in PageHeadSchema)
2. Every page has a `description` (150-160 characters)
3. Every page has a `canonical` URL (prevents duplicate content)
4. Open Graph images are 1200x630px minimum
5. JSON-LD uses `@context: 'https://schema.org'`
6. Sitemap includes all indexable pages
7. Use flattened structure (not nested meta objects)

### Must Not

1. Duplicate title/description across pages
2. Use keywords for SEO manipulation (outdated practice)
3. Set `noindex` on important pages
4. Hardcode URLs in metadata (use config)
5. Skip alt text on og:image
6. Nest metadata objects (ogTitle not meta.og.title)

---

## Templates

### Page Metadata Template

```typescript
const head: PageHeadSchema = {
  // Required
  title: 'Page Title | Site Name',
  description: 'Compelling description under 160 characters.',
  canonical: 'https://mysite.com/page',

  // Open Graph
  ogTitle: 'Page Title',
  ogDescription: 'Description for social shares.',
  ogImage: 'https://mysite.com/images/page-og.jpg',
  ogType: 'website',  // or 'article' for blog posts

  // Twitter
  twitterCard: 'summary_large_image',
  twitterCreator: '@authorhandle',  // For articles

  // JSON-LD (for articles)
  jsonLd: {
    '@type': 'Article',
    headline: 'Article Headline',
    datePublished: '2024-01-15',
    author: { '@type': 'Person', name: 'Author Name' },
  },
}
```

---

## Anti-Patterns

### Don't: Nest metadata objects

```typescript
// WRONG - Deep nesting
const head = {
  meta: {
    openGraph: {
      title: 'Title',
    },
  },
}

// CORRECT - Flat structure
const head: PageHeadSchema = {
  ogTitle: 'Title',
}
```

**Why:** Flat structure reduces optional chaining and matches Next.js Metadata API.

### Don't: Hardcode site URL

```typescript
// WRONG - Hardcoded URL
canonical: 'https://mysite.com/about'

// CORRECT - Use config
canonical: `${siteConfig.metadata.siteUrl}/about`
```

**Why:** URL changes require one config update, not search-and-replace.

### Don't: Skip image alt text

```typescript
// WRONG - Missing alt
ogImage: 'https://mysite.com/image.jpg'

// CORRECT - Include alt
ogImage: 'https://mysite.com/image.jpg',
ogImageAlt: 'Team photo at company retreat'
```

**Why:** Alt text improves accessibility and provides context when images fail to load.

### Don't: Use identical metadata across pages

```typescript
// WRONG - Same description everywhere
description: 'Welcome to My Site'

// CORRECT - Unique per page
description: 'Learn about our team and 10 years of creative work.'
```

**Why:** Unique descriptions improve CTR and avoid duplicate content penalties.

---

## Testing

### Validation Tools

| Tool | Purpose | URL |
|------|---------|-----|
| Google Rich Results | Test JSON-LD | search.google.com/test/rich-results |
| Facebook Debugger | Test Open Graph | developers.facebook.com/tools/debug |
| Twitter Card Validator | Test Twitter Cards | cards-dev.twitter.com/validator |
| Schema.org Validator | Validate JSON-LD | validator.schema.org |

### Checklist

- [ ] Every page has unique title and description
- [ ] Canonical URLs are correct and absolute
- [ ] Open Graph images render correctly in Facebook Debugger
- [ ] Twitter Cards display properly
- [ ] JSON-LD validates without errors
- [ ] Sitemap includes all public pages
- [ ] robots.txt allows indexing of public pages

---

## See Also

- [Schema Spec](../components/schema/schema.spec.md) - PageHeadSchema interface definition
- [Site Spec](../components/site/site.spec.md) - Site-level metadata defaults
- [Caching Strategy](caching.spec.md) - Cache profiles for metadata
- [Data Fetching](../patterns/data-fetching.spec.md) - CMS integration patterns
