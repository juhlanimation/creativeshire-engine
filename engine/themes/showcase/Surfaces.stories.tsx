import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { EngineDecorator } from '../../../.storybook/helpers/EngineDecorator'
import { resolveShowcaseTheme, s, ShowcaseRoot, ThemeNotFound, RADIUS_TOKENS, SHADOW_TOKENS } from './_shared'

const meta: Meta = {
  title: 'Theme Showcase/Surfaces',
  decorators: [EngineDecorator],
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj

export const Surfaces: Story = {
  render: (_args, context) => {
    const resolved = resolveShowcaseTheme((context?.globals ?? {}) as Record<string, unknown>)
    if (!resolved) return <ThemeNotFound themeId="unknown" />
    const { palette, theme, bodyFont, uiFont } = resolved

    return (
      <ShowcaseRoot bodyFont={bodyFont} bg={palette.background} color={palette.text}>
        {/* Border Radius */}
        <div style={{ ...s.sectionTitle, fontFamily: uiFont }}>Border Radius</div>
        <div style={s.radiusGrid}>
          {RADIUS_TOKENS.map(({ key, label }) => {
            const value = theme.radius[key]
            return (
              <div key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={s.radiusCard(value, palette.accent)} />
                <div style={{ ...s.scaleLabel, fontFamily: uiFont }}>{label}</div>
                <div style={s.spacingValue}>{value}</div>
              </div>
            )
          })}
        </div>

        {/* Shadows */}
        <div style={{ ...s.sectionTitle, fontFamily: uiFont, marginTop: '48px' }}>Shadows</div>
        <div style={s.shadowGrid}>
          {SHADOW_TOKENS.map(({ key, label }) => {
            const value = theme.shadows[key]
            return (
              <div key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div style={s.shadowCard(value, palette.colorSecondary)} />
                <div style={{ ...s.scaleLabel, fontFamily: uiFont }}>{label}</div>
                <div style={s.spacingValue}>{value === 'none' ? 'none' : value}</div>
              </div>
            )
          })}
        </div>

        {/* Borders */}
        <div style={{ ...s.sectionTitle, fontFamily: uiFont, marginTop: '48px' }}>Borders</div>
        <div style={s.bordersGrid}>
          <div style={s.borderCard}>
            <div style={{ ...s.fontRole, fontFamily: uiFont }}>Width</div>
            <div style={s.borderSample(theme.borders.width, palette.accent)} />
            <div style={s.spacingValue}>{theme.borders.width}</div>
          </div>
          <div style={s.borderCard}>
            <div style={{ ...s.fontRole, fontFamily: uiFont }}>Style</div>
            <div style={{ height: '0', borderTop: `${theme.borders.width} ${theme.borders.style} ${palette.accent}` }} />
            <div style={s.spacingValue}>{theme.borders.style}</div>
          </div>
          <div style={s.borderCard}>
            <div style={{ ...s.fontRole, fontFamily: uiFont }}>Color</div>
            <div style={s.borderSample(theme.borders.width, theme.borders.color)} />
            <div style={s.spacingValue}>{theme.borders.color}</div>
          </div>
          <div style={s.borderCard}>
            <div style={{ ...s.fontRole, fontFamily: uiFont }}>Divider</div>
            <div style={s.borderDividerSample(theme.borders.width, palette.text, theme.borders.dividerOpacity)} />
            <div style={s.spacingValue}>opacity: {theme.borders.dividerOpacity}</div>
          </div>
        </div>
      </ShowcaseRoot>
    )
  },
}
