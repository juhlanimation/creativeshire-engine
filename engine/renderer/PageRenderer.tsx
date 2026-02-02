'use client'

/**
 * PageRenderer - renders pages from schema.
 * Maps sections to SectionRenderer.
 */

import { useMemo } from 'react'
import { SectionRenderer } from './SectionRenderer'
import { useExperience } from '../experience'
import type { PageSchema } from '../schema'

interface PageRendererProps {
  page: PageSchema
}

/**
 * Renders a page with its sections.
 * Filters out sections hidden by the experience.
 */
export function PageRenderer({ page }: PageRendererProps) {
  const { experience } = useExperience()

  // Filter out sections hidden by the experience
  const visibleSections = useMemo(() => {
    if (!experience.hideSections?.length) return page.sections
    return page.sections.filter(section => !experience.hideSections?.includes(section.id))
  }, [page.sections, experience.hideSections])

  return (
    <main id={`page-${page.id}`} data-slug={page.slug}>
      {visibleSections.map((section, index) => (
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
