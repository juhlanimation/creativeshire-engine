/**
 * Dynamic catch-all route.
 * Handles all pages defined in site/pages/.
 *
 * Routes:
 * - / → slug: undefined → home
 * - /about → slug: ['about'] → about
 * - /projects/featured → slug: ['projects', 'featured'] → projects/featured
 *
 * Dev mode: supports ?_preset=id to switch presets for testing
 */

import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { Suspense } from 'react'
import { SiteRenderer } from '../../engine/renderer'
import { siteConfig } from '@/site/config'
import { getAllPages, getPageBySlug } from '@/site/pages'
import { getPreset, DEV_PRESET_PARAM } from '../../engine/presets'
import {
  buildSiteSchemaFromPreset,
  buildPageFromPreset,
} from '../../engine/presets/resolve'
import type { SiteSchema, PageSchema } from '../../engine/schema'

// Sample content for preset preview (optional imports)
import { prismSampleContent } from '../../engine/presets/prism'
import { noirSampleContent } from '../../engine/presets/noir'
import { loftSampleContent } from '../../engine/presets/loft'

/** Map of preset IDs to their sample content */
const PRESET_SAMPLE_CONTENT: Record<string, Record<string, unknown>> = {
  'prism': prismSampleContent,
  'noir': noirSampleContent,
  'loft': loftSampleContent,
}

type PageProps = {
  params: Promise<{ slug?: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

/**
 * Convert slug array to path string.
 */
function slugToPath(slug?: string[]): string {
  if (!slug || slug.length === 0) return '/'
  return `/${slug.join('/')}`
}

/**
 * Get site config and page lookup function based on preset override.
 * In dev mode with ?_preset=id, loads from the specified preset.
 * Otherwise uses the default site config.
 */
function getSiteConfigForPreset(presetId: string | undefined): {
  config: SiteSchema
  getPage: (slug: string) => PageSchema | undefined
  presetId: string
} {
  // Check for preset override in dev mode
  if (process.env.NODE_ENV === 'development' && presetId) {
    const preset = getPreset(presetId)
    if (preset) {
      const sampleContent = PRESET_SAMPLE_CONTENT[presetId]
      const presetConfig = buildSiteSchemaFromPreset(presetId, preset, {
        content: sampleContent,
      })

      const getPage = (slug: string): PageSchema | undefined =>
        buildPageFromPreset(preset, slug, sampleContent)

      return { config: presetConfig, getPage, presetId }
    }
  }

  // Default: use site config
  return {
    config: siteConfig,
    getPage: getPageBySlug,
    presetId: 'noir', // Default preset ID
  }
}

/**
 * Generate static params for all pages.
 * Enables static generation at build time.
 */
export async function generateStaticParams() {
  const pages = getAllPages()

  return pages.map(page => {
    // Home page: empty object for optional catch-all
    if (page.slug === '/') {
      return {}
    }
    return {
      slug: page.slug.split('/').filter(Boolean)
    }
  })
}

/**
 * Generate metadata for each page.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const path = slugToPath(slug)
  const page = getPageBySlug(path)

  if (!page || !page.head) {
    return {}
  }

  const { head } = page

  return {
    title: head.title,
    description: head.description,
    ...(head.canonical && { alternates: { canonical: head.canonical } }),
    openGraph: {
      title: head.ogTitle ?? head.title,
      description: head.ogDescription ?? head.description,
      ...(head.ogImage && { images: [head.ogImage] }),
      ...(head.ogUrl && { url: head.ogUrl }),
    },
    twitter: {
      card: head.twitterCard ?? 'summary_large_image',
      ...(head.twitterCreator && { creator: head.twitterCreator }),
    },
    robots: {
      index: head.robotsIndex ?? true,
      follow: head.robotsFollow ?? true,
    },
    ...(head.viewport && { viewport: head.viewport }),
    ...(head.themeColor && { themeColor: head.themeColor }),
    ...(head.icons && { icons: head.icons }),
  }
}

/**
 * Page content component.
 */
async function PageContent({ params, searchParams }: PageProps) {
  const { slug } = await params
  const resolvedSearchParams = await searchParams
  const path = slugToPath(slug)

  // Get preset override from query param (dev mode only)
  const presetOverride = resolvedSearchParams[DEV_PRESET_PARAM] as string | undefined

  // Get site config based on preset (default or override)
  const { config, getPage, presetId } = getSiteConfigForPreset(presetOverride)
  const page = getPage(path)

  if (!page) {
    notFound()
  }

  return <SiteRenderer site={config} page={page} presetId={presetId} />
}

/**
 * Page component with Suspense boundary.
 */
export default function Page(props: PageProps) {
  return (
    <Suspense>
      <PageContent {...props} />
    </Suspense>
  )
}
