/**
 * PreviewContainer — live preview of the current preset.
 * Renders the site inside a contained ContainerProvider so cqw/cqh units
 * size relative to the preview frame, not the viewport.
 */

'use client'

import { useRef, useMemo, useLayoutEffect } from 'react'
import { SiteRenderer } from '../../../engine/renderer'
import { ContainerProvider } from '../../../engine/interface/ContainerContext'
import { presetToSiteSchema, getPresetPage } from './presetToSiteSchema'
import type { SitePreset } from '../../../engine/presets/types'

interface PreviewContainerProps {
  preset: SitePreset
  presetId: string
  pageId?: string
}

export default function PreviewContainer({ preset, presetId, pageId }: PreviewContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Set --viewport-height and --vh so preset CSS scales to the preview
  // container instead of the browser viewport (e.g. #hero { height: var(--viewport-height) })
  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => {
      const h = el.clientHeight
      el.style.setProperty('--viewport-height', `${h}px`)
      el.style.setProperty('--vh', `${h / 100}px`)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const site = useMemo(() => presetToSiteSchema(preset, presetId), [preset, presetId])
  const page = useMemo(() => getPresetPage(preset, presetId, pageId), [preset, presetId, pageId])

  if (!page) {
    return <div className="da-preview__empty">No pages in preset</div>
  }

  return (
    <div ref={containerRef} className="da-preview__frame" data-engine-container>
      <ContainerProvider mode="contained" containerRef={containerRef}>
        <SiteRenderer site={site} page={page} presetId={presetId} />
      </ContainerProvider>
    </div>
  )
}
