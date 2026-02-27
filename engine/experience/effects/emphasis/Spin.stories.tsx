import React from 'react'
import { EffectCSSPreview } from '../../../../.storybook/helpers/EffectCSSPreview'
import { EngineDecorator } from '../../../../.storybook/helpers/EngineDecorator'

export default {
  title: 'Emphasis/Spin',
  parameters: { layout: 'padded' },
  decorators: [EngineDecorator],
}

export const Spin = {
  render: () => (
    <EffectCSSPreview
      effectName="spin"
      cssVariables={[
        { name: '--spin-duration', initial: '1s', final: '0.3s', description: 'Rotation speed (faster on toggle)' },
        { name: '--spin-easing', initial: 'linear', final: 'linear', description: 'Timing function' },
      ]}
    >
      <div
        style={{
          width: 48,
          height: 48,
          border: '3px solid #333',
          borderTopColor: '#6c63ff',
          borderRadius: '50%',
        }}
      />
    </EffectCSSPreview>
  ),
}
