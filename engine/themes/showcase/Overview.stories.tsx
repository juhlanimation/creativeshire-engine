import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { EngineDecorator } from '../../../.storybook/helpers/EngineDecorator'
import { resolveShowcaseTheme, s, ShowcaseRoot, ThemeNotFound } from './_shared'

const meta: Meta = {
  title: 'Theme Showcase/Overview',
  decorators: [EngineDecorator],
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj

export const Overview: Story = {
  render: (_args, context) => {
    const resolved = resolveShowcaseTheme((context?.globals ?? {}) as Record<string, unknown>)
    if (!resolved) return <ThemeNotFound themeId="unknown" />
    const { themeId, mode, theme, palette, bodyFont, titleFont, uiFont } = resolved

    return (
      <ShowcaseRoot bodyFont={bodyFont} bg={palette.background} color={palette.text}>
        <div style={s.header}>
          <div style={{ ...s.themeName, fontFamily: titleFont }}>{theme.name}</div>
          <div style={{ ...s.description, fontFamily: bodyFont }}>{theme.description}</div>
          <div style={s.badges}>
            <span style={{ ...s.badge(palette.accent, palette.colorPrimaryContrast), fontFamily: uiFont }}>{mode}</span>
            {mode === theme.defaultMode && (
              <span style={{ ...s.badge('rgba(128,128,128,0.2)', palette.textPrimary), fontFamily: uiFont }}>default mode</span>
            )}
            <span style={{ ...s.badge('rgba(128,128,128,0.15)', palette.textSecondary), fontFamily: uiFont }}>{themeId}</span>
          </div>
        </div>
      </ShowcaseRoot>
    )
  },
}
