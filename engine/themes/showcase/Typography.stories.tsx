import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { EngineDecorator } from '../../../.storybook/helpers/EngineDecorator'
import {
  resolveShowcaseTheme, s, ShowcaseRoot, ThemeNotFound,
  displayFontName, scaleFont,
  SCALE_SAMPLES, SCALE_TO_OVERRIDE, DEFAULT_WEIGHTS, DEFAULT_LINE_HEIGHTS, DEFAULT_LETTER_SPACINGS,
} from './_shared'

const meta: Meta = {
  title: 'Theme Showcase/Typography',
  decorators: [EngineDecorator],
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj

export const Typography: Story = {
  render: (_args, context) => {
    const resolved = resolveShowcaseTheme((context?.globals ?? {}) as Record<string, unknown>)
    if (!resolved) return <ThemeNotFound themeId="unknown" />
    const { palette, typo, bodyFont, titleFont, headingFont, uiFont } = resolved

    return (
      <ShowcaseRoot bodyFont={bodyFont} bg={palette.background} color={palette.text}>
        <div style={{ ...s.sectionTitle, fontFamily: uiFont }}>Typography</div>

        {/* Font families */}
        <div style={s.fontFamilies}>
          <div style={s.fontCard}>
            <div style={{ ...s.fontRole, fontFamily: uiFont }}>Title &middot; --font-title</div>
            <div style={s.fontFamily(titleFont)}>Aa Bb Cc Dd</div>
            <div style={s.fontFamilyMono}>{displayFontName(typo.title)}</div>
          </div>
          <div style={s.fontCard}>
            <div style={{ ...s.fontRole, fontFamily: uiFont }}>Heading &middot; --font-heading</div>
            <div style={s.fontFamily(headingFont)}>Aa Bb Cc Dd</div>
            <div style={s.fontFamilyMono}>{displayFontName(typo.heading)}</div>
          </div>
          <div style={s.fontCard}>
            <div style={{ ...s.fontRole, fontFamily: uiFont }}>Paragraph &middot; --font-paragraph</div>
            <div style={s.fontFamily(bodyFont)}>Aa Bb Cc Dd</div>
            <div style={s.fontFamilyMono}>{displayFontName(typo.paragraph)}</div>
          </div>
          <div style={s.fontCard}>
            <div style={{ ...s.fontRole, fontFamily: uiFont }}>UI &middot; --font-ui</div>
            <div style={s.fontFamily(typo.ui)}>Aa Bb Cc Dd</div>
            <div style={s.fontFamilyMono}>{displayFontName(typo.ui)}</div>
          </div>
        </div>

        {/* Type scale */}
        <div style={{ ...s.groupLabel, fontFamily: uiFont }}>Type Scale</div>
        {SCALE_SAMPLES.map(({ key, label, text }) => {
          const overrideKey = SCALE_TO_OVERRIDE[key]
          const weight = typo.fontWeights?.[overrideKey] ?? DEFAULT_WEIGHTS[overrideKey]
          const lh = typo.lineHeights?.[overrideKey] ?? DEFAULT_LINE_HEIGHTS[overrideKey]
          const ls = typo.letterSpacings?.[overrideKey] ?? DEFAULT_LETTER_SPACINGS[overrideKey]
          return (
            <div key={key} style={s.scaleRow}>
              <div style={s.scaleMeta}>
                <div style={{ ...s.scaleLabel, fontFamily: uiFont }}>{label}</div>
                <div style={s.scaleSize}>{typo.scale[key]}</div>
                <div style={s.scaleSize}>w:{weight} lh:{lh} ls:{ls}</div>
              </div>
              <div style={s.scaleSample(scaleFont(key, typo), typo.scale[key], weight, lh, ls)}>{text}</div>
            </div>
          )
        })}
      </ShowcaseRoot>
    )
  },
}
