/**
 * Dynamic catch-all route.
 * Handles all pages defined in site/pages/.
 *
 * Routes:
 * - / → slug: undefined → home
 * - /about → slug: ['about'] → about
 * - /projects/featured → slug: ['projects', 'featured'] → projects/featured
 */

import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { Suspense } from 'react'
import { SiteRenderer } from '../../engine/renderer'
import { siteConfig } from '@/site/config'
import { getAllPages, getPageBySlug } from '@/site/pages'

type PageProps = {
  params: Promise<{ slug?: string[] }>
}

/**
 * Convert slug array to path string.
 */
function slugToPath(slug?: string[]): string {
  if (!slug || slug.length === 0) return '/'
  return `/${slug.join('/')}`
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
async function PageContent({ params }: PageProps) {
  const { slug } = await params
  const path = slugToPath(slug)
  const page = getPageBySlug(path)

  if (!page) {
    notFound()
  }

  return <SiteRenderer site={siteConfig} page={page} />
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
