import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { EngineDecorator } from '../../../.storybook/helpers/EngineDecorator'
import { resolveShowcaseTheme, s, ShowcaseRoot, ThemeNotFound } from './_shared'
import Button from '../../content/widgets/primitives/Button'
import Link from '../../content/widgets/primitives/Link'

const meta: Meta = {
  title: 'Theme Showcase/Interaction',
  decorators: [EngineDecorator],
  parameters: { layout: 'fullscreen' },
}
export default meta

type Story = StoryObj

export const Interaction: Story = {
  render: (_args, context) => {
    const resolved = resolveShowcaseTheme((context?.globals ?? {}) as Record<string, unknown>)
    if (!resolved) return <ThemeNotFound themeId="unknown" />
    const { palette, theme, bodyFont, titleFont, uiFont } = resolved
    const td = theme.textDecoration

    return (
      <ShowcaseRoot bodyFont={bodyFont} bg={palette.background} color={palette.text}>
        {/* Motion */}
        <div style={{ ...s.sectionTitle, fontFamily: uiFont }}>Motion</div>

        <div style={{ ...s.groupLabel, fontFamily: uiFont }}>Durations</div>
        <div style={s.motionGrid}>
          {(['durationFast', 'durationNormal', 'durationSlow'] as const).map((key) => {
            const label = key.replace('duration', '').toLowerCase()
            return (
              <div
                key={key}
                style={{ ...s.motionCard, cursor: 'pointer' }}
                onMouseEnter={(e) => { const bar = e.currentTarget.querySelector<HTMLElement>('[data-motion-bar]'); if (bar) bar.style.width = '100%' }}
                onMouseLeave={(e) => { const bar = e.currentTarget.querySelector<HTMLElement>('[data-motion-bar]'); if (bar) bar.style.width = '30%' }}
              >
                <div style={{ ...s.fontRole, fontFamily: uiFont }}>{label}</div>
                <div data-motion-bar style={s.motionBar(theme.motion[key], theme.motion.easeDefault, palette.accent)} />
                <div style={s.spacingValue}>{theme.motion[key]}</div>
              </div>
            )
          })}
        </div>

        <div style={{ ...s.groupLabel, fontFamily: uiFont }}>Easing Curves</div>
        <div style={s.motionGrid}>
          {(['easeDefault', 'easeIn', 'easeOut'] as const).map((key) => {
            const label = key.replace('ease', '').toLowerCase() || 'default'
            return (
              <div
                key={key}
                style={{ ...s.motionCard, cursor: 'pointer' }}
                onMouseEnter={(e) => { const bar = e.currentTarget.querySelector<HTMLElement>('[data-motion-bar]'); if (bar) bar.style.width = '100%' }}
                onMouseLeave={(e) => { const bar = e.currentTarget.querySelector<HTMLElement>('[data-motion-bar]'); if (bar) bar.style.width = '30%' }}
              >
                <div style={{ ...s.fontRole, fontFamily: uiFont }}>{label}</div>
                <div data-motion-bar style={s.motionBar(theme.motion.durationNormal, theme.motion[key], palette.accent)} />
                <div style={s.spacingValue}>{theme.motion[key]}</div>
              </div>
            )
          })}
        </div>

        {/* Text Decoration */}
        <div style={{ ...s.sectionTitle, fontFamily: uiFont, marginTop: '48px' }}>Text Decoration</div>
        <div style={s.bordersGrid}>
          <div style={s.borderCard}>
            <div style={{ ...s.fontRole, fontFamily: uiFont }}>Style</div>
            <div style={{ ...s.textDecoSample(td.style, td.thickness, td.offset, td.opacity, td.dashLength, td.gapLength), fontFamily: titleFont, color: palette.text }}>
              Navigation Link
            </div>
            <div style={s.spacingValue}>{td.style}{td.dashLength ? ` (${td.dashLength}/${td.gapLength})` : ''}</div>
          </div>
          <div style={s.borderCard}>
            <div style={{ ...s.fontRole, fontFamily: uiFont }}>Thickness</div>
            <div style={{ ...s.textDecoSample(td.style, td.thickness, td.offset, td.opacity, td.dashLength, td.gapLength), fontFamily: bodyFont, color: palette.text }}>
              Body text link
            </div>
            <div style={s.spacingValue}>{td.thickness}</div>
          </div>
          <div style={s.borderCard}>
            <div style={{ ...s.fontRole, fontFamily: uiFont }}>Offset</div>
            <div style={{ ...s.textDecoSample(td.style, td.thickness, td.offset, td.opacity, td.dashLength, td.gapLength), fontFamily: uiFont, color: palette.accent }}>
              Accented link
            </div>
            <div style={s.spacingValue}>{td.offset}</div>
          </div>
          <div style={s.borderCard}>
            <div style={{ ...s.fontRole, fontFamily: uiFont }}>Opacity</div>
            <div style={{ ...s.textDecoSample(td.style, td.thickness, td.offset, td.opacity, td.dashLength, td.gapLength), fontFamily: uiFont, color: palette.text }}>
              Faded underline
            </div>
            <div style={s.spacingValue}>{td.opacity}</div>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ ...s.sectionTitle, fontFamily: uiFont, marginTop: '48px' }}>Buttons</div>
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: theme.spacing.md, alignItems: 'center', marginBottom: theme.spacing.lg }}>
          <Button label="Primary" variant="primary" />
          <Button label="Secondary" variant="secondary" />
          <Button label="Ghost" variant="ghost" />
        </div>

        {/* Links */}
        <div style={{ ...s.groupLabel, fontFamily: uiFont }}>Links</div>
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: theme.spacing.lg, alignItems: 'center', marginBottom: theme.spacing.lg }}>
          <Link href="#" variant="default" onClick={(e) => e.preventDefault()}>Default link</Link>
          <Link href="#" variant="underline" onClick={(e) => e.preventDefault()}>Underline link</Link>
          <Link href="#" variant="hover-underline" onClick={(e) => e.preventDefault()}>Hover underline</Link>
        </div>

        {/* Focus */}
        <div style={{ ...s.groupLabel, fontFamily: uiFont }}>Focus</div>
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: theme.spacing.md, alignItems: 'center', marginBottom: theme.spacing.lg }}>
          <Button label="Focused primary" variant="primary" style={{ outline: 'var(--focus-ring-width, 2px) solid var(--color-focus, currentColor)', outlineOffset: 'var(--focus-ring-offset, 2px)' }} />
          <Button label="Focused ghost" variant="ghost" style={{ outline: 'var(--focus-ring-width, 2px) solid var(--color-focus, currentColor)', outlineOffset: 'var(--focus-ring-offset, 2px)' }} />
        </div>
      </ShowcaseRoot>
    )
  },
}
