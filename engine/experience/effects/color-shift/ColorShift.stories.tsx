import React from 'react'
import { EffectCSSPreview } from '../../../../.storybook/helpers/EffectCSSPreview'
import { EngineDecorator } from '../../../../.storybook/helpers/EngineDecorator'

export default {
  title: 'Color Shift',
  parameters: { layout: 'padded' },
  decorators: [EngineDecorator],
}

export const ColorShift = {
  render: () => (
    <EffectCSSPreview
      effectName="color-shift"
      cssVariables={[
        { name: '--shift-color', initial: 'inherit', final: '#6c63ff', description: 'Text color' },
        { name: '--shift-blend', initial: 'normal', final: 'difference', description: 'Mix blend mode' },
        { name: '--shift-duration', initial: '300ms', final: '300ms', description: 'Duration' },
        { name: '--shift-easing', initial: 'ease-in-out', final: 'ease-in-out', description: 'Easing' },
      ]}
    >
      <div style={{ padding: 24, background: '#1e1e2e', borderRadius: 8 }}>
        <h2 style={{ margin: 0, fontSize: 28, fontWeight: 700, color: '#e0e0e0' }}>
          Color Shift Effect
        </h2>
        <p style={{ margin: '12px 0 0', lineHeight: 1.6, color: '#999' }}>
          Text color and blend mode transition on toggle.
        </p>
      </div>
    </EffectCSSPreview>
  ),
}
