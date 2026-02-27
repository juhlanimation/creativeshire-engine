/**
 * GrainOverlay stories.
 * Canvas-based film grain effect over dark background.
 */

import type { Meta, StoryObj } from '@storybook/react'
import GrainOverlay from './index'
import { meta } from './meta'

export default {
  title: 'Overlays/Grain Overlay',
  component: GrainOverlay,
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: meta.description } },
  },
} satisfies Meta

export const Default: StoryObj = {
  render: () => (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#0a0a0a' }}>
      <div style={{ padding: 48, color: 'white', fontFamily: 'system-ui' }}>
        <h2 style={{ fontSize: 32, marginBottom: 16 }}>Film Grain Overlay</h2>
        <p style={{ opacity: 0.6 }}>256×256 noise texture tiled at 8fps with mix-blend-overlay.</p>
      </div>
      <GrainOverlay />
    </div>
  ),
}
