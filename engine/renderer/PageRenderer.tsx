'use client'

/**
 * PageRenderer - renders pages from schema.
 * Maps sections to SectionRenderer.
 */

import { SectionRenderer } from './SectionRenderer'
import type { PageSchema } from '../schema'

interface PageRendererProps {
  page: PageSchema
}

/**
 * Renders a page with its sections.
 */
export function PageRenderer({ page }: PageRendererProps) {
  return (
    <main id={`page-${page.id}`} data-slug={page.slug}>
      {page.sections.map((section, index) => (
        <SectionRenderer
          key={section.id}
          section={section}
          index={index}
        />
      ))}
    </main>
  )
}

export default PageRenderer
