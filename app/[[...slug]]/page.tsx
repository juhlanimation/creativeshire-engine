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
import { SiteRenderer, resolveBindings, processWidgets } from '../../engine/renderer'
import { siteConfig } from '@/site/config'
import { getAllPages, getPageBySlug } from '@/site/pages'
import { getPreset, DEV_PRESET_PARAM } from '../../engine/presets'
import type { SiteSchema, PageSchema, SectionSchema, ChromeSchema } from '../../engine/schema'
import type { IntroConfig } from '../../engine/intro/types'
import type { PresetChromeConfig } from '../../engine/presets/types'

// Sample content for preset preview (optional imports)
import { bishoyGendiSampleContent } from '../../engine/presets/bishoy-gendi'
import { bojuhlSampleContent } from '../../engine/presets/bojuhl'

/** Map of preset IDs to their sample content */
const PRESET_SAMPLE_CONTENT: Record<string, Record<string, unknown>> = {
  'bishoy-gendi': bishoyGendiSampleContent,
  'bojuhl': bojuhlSampleContent,
}

/**
 * Transform preset chrome config to site chrome schema.
 * Converts 'hidden' regions to undefined.
 */
function transformPresetChrome(presetChrome: PresetChromeConfig): ChromeSchema {
  const regions = presetChrome.regions
  return {
    regions: {
      header: regions.header === 'hidden' ? undefined : regions.header as ChromeSchema['regions']['header'],
      footer: regions.footer === 'hidden' ? undefined : regions.footer as ChromeSchema['regions']['footer'],
      sidebar: regions.sidebar === 'hidden' ? undefined : regions.sidebar as ChromeSchema['regions']['sidebar'],
    },
    overlays: presetChrome.overlays as ChromeSchema['overlays'],
  }
}

/**
 * Resolve bindings in chrome regions and overlays using sample content.
 */
function resolveChromeBindings(chrome: ChromeSchema, content: Record<string, unknown>): ChromeSchema {
  const resolvedRegions = { ...chrome.regions }

  // Resolve region widgets
  for (const key of Object.keys(resolvedRegions) as (keyof typeof resolvedRegions)[]) {
    const region = resolvedRegions[key]
    if (region && region.widgets) {
      resolvedRegions[key] = {
        ...region,
        widgets: processWidgets(region.widgets, content),
      }
    }
  }

  // Resolve overlay widgets
  let resolvedOverlays = chrome.overlays
  if (chrome.overlays) {
    resolvedOverlays = {} as ChromeSchema['overlays']
    for (const [key, overlay] of Object.entries(chrome.overlays)) {
      if (overlay.widget) {
        resolvedOverlays![key] = {
          ...overlay,
          widget: {
            ...overlay.widget,
            props: resolveBindings(overlay.widget.props, content),
          },
        }
      } else if (overlay.props) {
        resolvedOverlays![key] = {
          ...overlay,
          props: resolveBindings(overlay.props, content),
        }
      } else {
        resolvedOverlays![key] = overlay
      }
    }
  }

  return {
    regions: resolvedRegions,
    overlays: resolvedOverlays,
  }
}

/**
 * Resolve bindings in intro overlay props using sample content.
 */
function resolveIntroBindings(intro: IntroConfig | undefined, content: Record<string, unknown>): IntroConfig | undefined {
  if (!intro?.overlay?.props) return intro
  return {
    ...intro,
    overlay: { ...intro.overlay, props: resolveBindings(intro.overlay.props, content) },
  }
}

/**
 * Resolve bindings in a page schema using sample content.
 * Processes all sections and their widgets with binding expressions.
 */
function resolvePageBindings(page: PageSchema, content: Record<string, unknown>): PageSchema {
  return {
    ...page,
    head: resolveBindings(page.head, content),
    sections: page.sections.map(section => ({
      ...section,
      style: resolveBindings(section.style, content),
      widgets: processWidgets(section.widgets, content),
    } as SectionSchema)),
  }
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
      // Get sample content for this preset (if available)
      const sampleContent = PRESET_SAMPLE_CONTENT[presetId]

      // Build a SiteSchema from the preset
      const chrome = transformPresetChrome(preset.chrome)
      const presetConfig: SiteSchema = {
        id: presetId,
        theme: preset.theme,
        intro: sampleContent ? resolveIntroBindings(preset.intro, sampleContent) : preset.intro,
        experience: preset.experience,
        transition: preset.transition,
        chrome: sampleContent ? resolveChromeBindings(chrome, sampleContent) : chrome,
        pages: Object.values(preset.pages).map(p => ({ id: p.id, slug: p.slug })),
      }

      // Page lookup from preset - resolve bindings if sample content available
      const getPage = (slug: string): PageSchema | undefined => {
        const page = Object.values(preset.pages).find(p => p.slug === slug)
        if (!page) return undefined

        // Resolve bindings using sample content
        if (sampleContent) {
          return resolvePageBindings(page, sampleContent)
        }

        return page
      }

      return { config: presetConfig, getPage, presetId }
    }
  }

  // Default: use site config
  return {
    config: siteConfig,
    getPage: getPageBySlug,
    presetId: 'bojuhl', // Default preset ID
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
