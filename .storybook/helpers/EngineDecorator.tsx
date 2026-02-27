/**
 * Engine Decorator for Storybook.
 * Wraps every non-section story (widgets, patterns, chrome, behaviours)
 * with the minimal rendering context they need.
 *
 * Uses buildThemeStyle() from SiteRenderer so theme variables match
 * production exactly. DOM structure mirrors SiteRenderer's output.
 */

import React, { useLayoutEffect, useMemo } from 'react'
import type { Decorator } from '@storybook/react'
import { ExperienceProvider } from '../../engine/experience/compositions/ExperienceProvider'
import { ContainerProvider } from '../../engine/interface/ContainerContext'
import { WidgetRendererProvider } from '../../engine/renderer/WidgetRendererContext'
import { WidgetRenderer } from '../../engine/renderer/WidgetRenderer'
import { bareExperience, createNoopStore } from '../mocks/context'
import { buildThemeStyle } from '../../engine/renderer/SiteRenderer'
import { getTheme, ensureThemesRegistered } from '../../engine/themes'

// Ensure themes are registered before any lookups
ensureThemesRegistered()

/**
 * Global decorator that provides the engine's rendering context.
 * Widgets require ExperienceProvider and ContainerProvider to render.
 *
 * Reads `context.globals.colorTheme` and `context.globals.colorMode`
 * and applies matching CSS variables via buildThemeStyle() — same
 * function SiteRenderer uses for production rendering.
 */
export const EngineDecorator: Decorator = (Story, context) => {
  const store = useMemo(() => createNoopStore(), [])

  const globals = context.globals as Record<string, unknown>
  const rawThemeId = (globals.colorTheme as string) ?? 'contrast'
  const mode = (globals.colorMode as string) ?? 'dark'

  // "none" = no theme bg — use 'contrast' for CSS variables only
  const isNoTheme = rawThemeId === 'none'
  const themeId = isNoTheme ? 'contrast' : rawThemeId

  const { themeStyle, palette } = useMemo(() => {
    const themeDef = getTheme(themeId)
    const pal = themeDef?.[mode === 'light' ? 'light' : 'dark']
    const vars = buildThemeStyle({ colorTheme: themeId, colorMode: mode as 'dark' | 'light' })

    return {
      themeStyle: vars,
      palette: pal,
    }
  }, [themeId, mode])

  const rootStyle = useMemo(() => ({
    ...themeStyle,
    minHeight: '100vh',
    backgroundColor: isNoTheme ? '#000' : (palette?.background ?? 'transparent'),
    ...(palette?.text && { color: palette.text }),
  } as React.CSSProperties), [themeStyle, palette, isNoTheme])

  // Sync Storybook iframe body to active palette (supplements CSS default in reset.css).
  // Cleanup resets to empty string so CSS rules from reset.css take over when
  // navigating to preset stories (which don't use EngineDecorator).
  useLayoutEffect(() => {
    document.body.style.backgroundColor = isNoTheme ? '#000' : (palette?.background ?? '')
    if (palette?.text) document.body.style.color = palette.text
    return () => {
      document.body.style.backgroundColor = ''
      document.body.style.color = ''
    }
  }, [palette?.background, palette?.text, isNoTheme])

  // Explicit background/color on data-site-content prevents preset CSS contamination.
  // Preset stories side-effect import their CSS which sets
  // `[data-site-content] { background-color }` globally. Inline styles override this.
  const contentStyle = useMemo(() => ({
    backgroundColor: isNoTheme ? 'transparent' : (palette?.background ?? 'transparent'),
    color: palette?.text ?? 'inherit',
  } as React.CSSProperties), [palette, isNoTheme])

  return (
    <WidgetRendererProvider renderer={WidgetRenderer}>
    <div data-engine-root style={rootStyle}>
      <div data-site-renderer style={themeStyle}>
        <ExperienceProvider experience={bareExperience} store={store}>
          <ContainerProvider mode="fullpage">
            <div data-site-content style={contentStyle}>
              <Story />
            </div>
          </ContainerProvider>
        </ExperienceProvider>
      </div>
    </div>
    </WidgetRendererProvider>
  )
}
