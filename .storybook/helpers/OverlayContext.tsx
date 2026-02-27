/**
 * Shared context wrapper for overlay stories.
 *
 * Overlays need more context than EngineDecorator provides:
 * - SiteContainerProvider + registered portal target (CursorLabel, Modal use createPortal)
 * - Custom experience store (FixedCard/NavTimeline need InfiniteCarouselState,
 *   SlideIndicators needs NavigableExperienceState)
 *
 * This wrapper provides the full stack: theme CSS vars, portal target,
 * ExperienceProvider with a custom store, ContainerProvider.
 */

import React, { useRef, useEffect, useMemo, useLayoutEffect } from 'react'
import type { StoreApi } from 'zustand'
import type { ReactNode } from 'react'
import type { Experience, ExperienceState } from '../../engine/experience/compositions/types'
import { ExperienceProvider } from '../../engine/experience/compositions/ExperienceProvider'
import { ContainerProvider } from '../../engine/interface/ContainerContext'
import { WidgetRendererProvider } from '../../engine/renderer/WidgetRendererContext'
import { WidgetRenderer } from '../../engine/renderer/WidgetRenderer'
import { SiteContainerProvider, useSiteContainer } from '../../engine/renderer/SiteContainerContext'
import { bareExperience } from '../mocks/context'
import { buildThemeStyle } from '../../engine/renderer/SiteRenderer'
import { getTheme, ensureThemesRegistered } from '../../engine/themes'

ensureThemesRegistered()

/**
 * Inner component that registers the container ref as the site container.
 * Must be rendered inside SiteContainerProvider.
 */
function ContainerRegistrar({ containerRef }: { containerRef: React.RefObject<HTMLElement | null> }) {
  const { registerContainer } = useSiteContainer()

  useEffect(() => {
    registerContainer(containerRef.current)
    return () => registerContainer(null)
  }, [containerRef, registerContainer])

  return null
}

interface OverlayContextProps {
  /** Zustand store for the experience provider */
  store: StoreApi<ExperienceState>
  /** Experience config (defaults to bareExperience) */
  experience?: Experience
  /** Child overlay components */
  children: ReactNode
  /** Additional inline styles on the container */
  style?: React.CSSProperties
  /** Storybook globals for theme resolution */
  globals?: Record<string, unknown>
}

/**
 * Provides full engine context for overlay stories:
 * - Theme CSS variables (same as EngineDecorator)
 * - SiteContainerProvider with registered portal target
 * - ExperienceProvider with custom store
 * - ContainerProvider
 */
export function OverlayContext({
  store,
  experience = bareExperience,
  children,
  style,
  globals,
}: OverlayContextProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const themeId = (globals?.colorTheme as string) ?? 'contrast'
  const mode = (globals?.colorMode as string) ?? 'dark'

  const { themeStyle, palette } = useMemo(() => {
    const themeDef = getTheme(themeId)
    const pal = themeDef?.[mode === 'light' ? 'light' : 'dark']
    const vars = buildThemeStyle({ colorTheme: themeId, colorMode: mode as 'dark' | 'light' })
    return { themeStyle: vars, palette: pal }
  }, [themeId, mode])

  const rootStyle = useMemo(() => ({
    ...themeStyle,
    minHeight: '100vh',
    position: 'relative' as const,
    ...(palette?.background && { backgroundColor: palette.background }),
    ...(palette?.text && { color: palette.text }),
    ...style,
  }), [themeStyle, palette, style])

  useLayoutEffect(() => {
    if (palette?.background) document.body.style.backgroundColor = palette.background
    if (palette?.text) document.body.style.color = palette.text
    return () => {
      document.body.style.backgroundColor = ''
      document.body.style.color = ''
    }
  }, [palette?.background, palette?.text])

  return (
    <WidgetRendererProvider renderer={WidgetRenderer}>
    <SiteContainerProvider>
      <div ref={containerRef} data-engine-root data-site-renderer style={rootStyle}>
        <ContainerRegistrar containerRef={containerRef} />
        <ExperienceProvider experience={experience} store={store}>
          <ContainerProvider mode="fullpage">
            <div data-site-content>
              {children}
            </div>
          </ContainerProvider>
        </ExperienceProvider>
      </div>
    </SiteContainerProvider>
    </WidgetRendererProvider>
  )
}
