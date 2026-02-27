import React from 'react'
import { EffectCSSPreview } from '../../../../.storybook/helpers/EffectCSSPreview'
import { EngineDecorator } from '../../../../.storybook/helpers/EngineDecorator'

export default {
  title: 'Mask/Reveal',
  parameters: { layout: 'padded' },
  decorators: [EngineDecorator],
}

export const MaskReveal = {
  render: () => (
    <EffectCSSPreview
      effectName="mask-reveal"
      cssVariables={[
        { name: '--mask-clip', initial: 'inset(0 100% 0 0)', final: 'inset(0 0 0 0)', description: 'Clip-path inset' },
        { name: '--mask-duration', initial: '800ms', final: '800ms', description: 'Duration' },
        { name: '--mask-content-opacity', initial: '0', final: '1', description: 'Content opacity' },
        { name: '--mask-content-delay', initial: '200ms', final: '200ms', description: 'Content fade delay' },
      ]}
    >
      <div style={{ padding: 32, background: '#1e1e2e', borderRadius: 8, minHeight: 200 }}>
        <div data-reveal="content" style={{ color: '#e0e0e0' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: 18, fontWeight: 600 }}>Revealed Content</h3>
          <p style={{ margin: 0, lineHeight: 1.6, color: '#999' }}>
            Content fades in after the mask clip-path reveals the container.
          </p>
        </div>
      </div>
    </EffectCSSPreview>
  ),
}
