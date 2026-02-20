import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { EngineDecorator } from '../../../.storybook/helpers/EngineDecorator'
import { resolveShowcaseTheme, s, ShowcaseRoot, ThemeNotFound, PALETTE_GROUPS, PALETTE_VAR_MAP } from './_shared'

const meta: Meta = {
  title: 'Theme Showcase/Colors',
  decorators: [EngineDecorator],
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj

export const Colors: Story = {
  render: (_args, context) => {
    const resolved = resolveShowcaseTheme((context?.globals ?? {}) as Record<string, unknown>)
    if (!resolved) return <ThemeNotFound themeId="unknown" />
    const { mode, palette, bodyFont, uiFont } = resolved

    return (
      <ShowcaseRoot bodyFont={bodyFont} bg={palette.background} color={palette.text}>
        <div style={{ ...s.sectionTitle, fontFamily: uiFont }}>Color Palette &middot; {mode}</div>
        {PALETTE_GROUPS.map((group) => (
          <div key={group.label}>
            <div style={{ ...s.groupLabel, fontFamily: uiFont }}>{group.label}</div>
            <div style={s.grid}>
              {group.fields.map((field) => {
                const color = palette[field]
                const cssVar = PALETTE_VAR_MAP[field]
                return (
                  <div key={field} style={s.swatchCard}>
                    <div style={s.swatch(color)} />
                    <div style={{ ...s.swatchLabel, fontFamily: uiFont }}>{field}</div>
                    <div style={s.swatchMeta}>{cssVar} &middot; {color}</div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </ShowcaseRoot>
    )
  },
}
