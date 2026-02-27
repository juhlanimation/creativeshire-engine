import React from 'react'
import { EffectCSSPreview } from '../../../../.storybook/helpers/EffectCSSPreview'
import { EngineDecorator } from '../../../../.storybook/helpers/EngineDecorator'

export default {
  title: 'Transform/Slide',
  parameters: { layout: 'padded' },
  decorators: [EngineDecorator],
}

export const TextReveal = {
  render: () => (
    <EffectCSSPreview
      effectName="text-reveal"
      cssVariables={[
        { name: '--reveal-y', initial: '100%', final: '0', description: 'Vertical slide position' },
        { name: '--reveal-opacity', initial: '0', final: '1', description: 'Icon/secondary opacity' },
        { name: '--reveal-duration', initial: '400ms', final: '400ms', description: 'Duration' },
        { name: '--reveal-easing', initial: 'ease-in-out', final: 'ease-in-out', description: 'Easing' },
      ]}
    >
      <div style={{ overflow: 'hidden', padding: 24, background: '#1e1e2e', borderRadius: 8 }}>
        <div data-reveal="primary" style={{ fontSize: 18, fontWeight: 600, color: '#e0e0e0' }}>
          Primary Text
        </div>
        <div data-reveal="secondary" style={{ fontSize: 14, color: '#999', marginTop: 8 }}>
          Secondary text slides in
        </div>
        <div data-reveal="icon" style={{ marginTop: 12, fontSize: 20 }}>
          &#x2192;
        </div>
      </div>
    </EffectCSSPreview>
  ),
}
