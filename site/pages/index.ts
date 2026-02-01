/**
 * Page registry.
 * Central registry for all site pages with lookup utilities.
 */

import type { PageSchema } from '@/engine/schema'
import { homePage } from './home'

/**
 * All pages registered for this site.
 * Add new pages here to make them available.
 */
const pages: PageSchema[] = [
  homePage,
  // Add more pages:
  // aboutPage,
  // projectsPage,
]

/**
 * Get all pages (for generateStaticParams).
 */
export function getAllPages(): PageSchema[] {
  return pages
}

/**
 * Get all page slugs (for generateStaticParams).
 */
export function getAllSlugs(): string[] {
  return pages.map(p => p.slug)
}

/**
 * Get page by slug.
 * @param slug - URL slug (e.g., '/', '/about')
 * @returns PageSchema or undefined if not found
 */
export function getPageBySlug(slug: string): PageSchema | undefined {
  return pages.find(p => p.slug === slug)
}

/**
 * Get page by id.
 * @param id - Page identifier (e.g., 'home', 'about')
 * @returns PageSchema or undefined if not found
 */
export function getPageById(id: string): PageSchema | undefined {
  return pages.find(p => p.id === id)
}

/**
 * Check if a slug exists.
 */
export function pageExists(slug: string): boolean {
  return pages.some(p => p.slug === slug)
}

// Re-export individual pages for direct imports
export { homePage }
