import React from 'react'
import { EffectCSSPreview } from '../../../../.storybook/helpers/EffectCSSPreview'
import { EngineDecorator } from '../../../../.storybook/helpers/EngineDecorator'

export default {
  title: 'Mask/Wipe',
  parameters: { layout: 'padded' },
  decorators: [EngineDecorator],
}

export const ModalMask = {
  render: () => (
    <EffectCSSPreview
      effectName="modal-mask"
      cssVariables={[
        { name: '--modal-clip', initial: 'inset(0 100% 0 0)', final: 'inset(0 0 0 0)', description: 'Clip-path inset' },
        { name: '--modal-content-opacity', initial: '0', final: '1', description: 'Content opacity' },
        { name: '--modal-duration', initial: '800ms', final: '800ms', description: 'Duration' },
        { name: '--modal-content-delay', initial: '200ms', final: '200ms', description: 'Content fade delay' },
      ]}
    >
      <div style={{ padding: 32, background: '#1e1e2e', borderRadius: 8, minHeight: 200 }}>
        <div data-modal="content" style={{ color: '#e0e0e0' }}>
          <h3 style={{ margin: '0 0 12px', fontSize: 18, fontWeight: 600 }}>Modal Content</h3>
          <p style={{ margin: 0, lineHeight: 1.6, color: '#999' }}>
            This content fades in after the clip-path wipe reveals the container.
          </p>
        </div>
      </div>
    </EffectCSSPreview>
  ),
}
