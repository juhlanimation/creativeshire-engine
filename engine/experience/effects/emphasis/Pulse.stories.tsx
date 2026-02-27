import React from 'react'
import { EffectCSSPreview } from '../../../../.storybook/helpers/EffectCSSPreview'
import { EngineDecorator } from '../../../../.storybook/helpers/EngineDecorator'

export default {
  title: 'Emphasis/Pulse',
  parameters: { layout: 'padded' },
  decorators: [EngineDecorator],
}

export const Pulse = {
  render: () => (
    <EffectCSSPreview
      effectName="pulse"
      cssVariables={[
        { name: '--pulse-duration', initial: '1.5s', final: '0.5s', description: 'Pulse speed (faster on toggle)' },
        { name: '--pulse-easing', initial: 'ease-in-out', final: 'ease-in-out', description: 'Timing function' },
      ]}
    >
      <div
        style={{
          width: 16,
          height: 16,
          borderRadius: '50%',
          background: '#4ade80',
        }}
      />
    </EffectCSSPreview>
  ),
}
