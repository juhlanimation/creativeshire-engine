import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { EngineDecorator } from '../../../.storybook/helpers/EngineDecorator'
import { resolveShowcaseTheme, s, ShowcaseRoot, ThemeNotFound, SPACING_TOKENS } from './_shared'
import { LAYOUT_PRESETS } from '../types'

const meta: Meta = {
  title: 'Theme Showcase/Spacing Layout',
  decorators: [EngineDecorator],
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj

export const SpacingLayout: Story = {
  render: (_args, context) => {
    const resolved = resolveShowcaseTheme((context?.globals ?? {}) as Record<string, unknown>)
    if (!resolved) return <ThemeNotFound themeId="unknown" />
    const { palette, theme, bodyFont, uiFont } = resolved

    return (
      <ShowcaseRoot bodyFont={bodyFont} bg={palette.background} color={palette.text}>
        {/* Spacing tokens */}
        <div style={{ ...s.sectionTitle, fontFamily: uiFont }}>Spacing</div>
        {SPACING_TOKENS.map(({ key, label }) => (
          <div key={key} style={s.spacingRow}>
            <div style={s.scaleMeta}>
              <div style={{ ...s.scaleLabel, fontFamily: uiFont }}>{label}</div>
              <div style={s.spacingValue}>{theme.spacing[key]}</div>
            </div>
            <div>
              <div style={{ ...s.spacingBar(palette.accent), width: theme.spacing[key] }} />
            </div>
          </div>
        ))}

        {/* Layout presets */}
        <div style={{ ...s.sectionTitle, fontFamily: uiFont, marginTop: '48px' }}>Layout Presets</div>

        <div style={{ ...s.groupLabel, fontFamily: uiFont }}>Gap</div>
        {LAYOUT_PRESETS.map((preset) => {
          const value = theme.layout.gap[preset]
          return (
            <div key={`gap-${preset}`} style={s.layoutRow}>
              <div style={s.scaleMeta}>
                <div style={{ ...s.scaleLabel, fontFamily: uiFont }}>{preset}</div>
                <div style={s.spacingValue}>{value}</div>
              </div>
              <div style={{ ...s.layoutGapDemo(palette.accent), gap: value }}>
                <div style={s.layoutGapBox(palette.accent)} />
                <div style={s.layoutGapBox(palette.accent)} />
                <div style={s.layoutGapBox(palette.accent)} />
              </div>
            </div>
          )
        })}

        <div style={{ ...s.groupLabel, fontFamily: uiFont, marginTop: '24px' }}>Padding</div>
        {LAYOUT_PRESETS.map((preset) => {
          const value = theme.layout.padding[preset]
          return (
            <div key={`pad-${preset}`} style={s.layoutRow}>
              <div style={s.scaleMeta}>
                <div style={{ ...s.scaleLabel, fontFamily: uiFont }}>{preset}</div>
                <div style={s.spacingValue}>{value}</div>
              </div>
              <div style={{ ...s.layoutPaddingDemo(palette.accent), padding: value }}>
                <div style={s.layoutPaddingInner(palette.textSecondary)} />
              </div>
            </div>
          )
        })}
      </ShowcaseRoot>
    )
  },
}
