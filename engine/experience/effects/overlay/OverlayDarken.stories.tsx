import React from 'react'
import { EffectCSSPreview } from '../../../../.storybook/helpers/EffectCSSPreview'
import { EngineDecorator } from '../../../../.storybook/helpers/EngineDecorator'

export default {
  title: 'Overlay',
  parameters: { layout: 'padded' },
  decorators: [EngineDecorator],
}

export const OverlayDarken = {
  render: () => (
    <EffectCSSPreview
      effectName="overlay-darken"
      cssVariables={[
        { name: '--overlay-bg', initial: 'rgba(0, 0, 0, 0.1)', final: 'rgba(0, 0, 0, 0.6)', description: 'Background overlay color' },
        { name: '--overlay-duration', initial: '300ms', final: '300ms', description: 'Duration' },
        { name: '--overlay-easing', initial: 'ease', final: 'ease', description: 'Easing' },
      ]}
    >
      <div style={{ position: 'relative', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{
          width: '100%',
          height: 200,
          background: 'linear-gradient(135deg, #6c63ff 0%, #e040fb 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: 18,
          fontWeight: 600,
        }}>
          Background Content
        </div>
        <div
          data-overlay=""
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          Overlay
        </div>
      </div>
    </EffectCSSPreview>
  ),
}
