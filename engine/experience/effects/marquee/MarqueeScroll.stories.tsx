import React from 'react'
import { EffectCSSPreview } from '../../../../.storybook/helpers/EffectCSSPreview'
import { EngineDecorator } from '../../../../.storybook/helpers/EngineDecorator'

const marqueeColors = ['tomato', 'orange', 'gold', 'lime', 'cyan', 'violet'] as const

function MarqueeTrack() {
  const items = marqueeColors.map((color) => (
    <div
      key={color}
      style={{
        width: 80,
        height: 40,
        borderRadius: 4,
        background: color,
        flexShrink: 0,
      }}
    />
  ))

  return (
    <div style={{ overflow: 'hidden', borderRadius: 8, background: '#111', padding: '16px 0' }}>
      <div data-marquee-track="" style={{ display: 'flex', gap: 16, width: 'max-content' }}>
        {items}
        {/* Duplicate for seamless loop */}
        {items}
      </div>
    </div>
  )
}

export default {
  title: 'Marquee',
  parameters: { layout: 'padded' },
  decorators: [EngineDecorator],
}

export const MarqueeScroll = {
  render: () => (
    <EffectCSSPreview
      effectName="marquee-scroll"
      cssVariables={[
        { name: '--marquee-duration', initial: '43s', final: '10s', description: 'Animation duration (faster on toggle)' },
      ]}
    >
      <MarqueeTrack />
    </EffectCSSPreview>
  ),
}
