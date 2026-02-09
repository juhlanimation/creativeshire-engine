import { defineBehaviourMeta } from '../../registry'
import type { FrameSettings } from './index'

export const meta = defineBehaviourMeta<FrameSettings>({
  id: 'video/frame',
  name: 'Video Frame Trigger',
  description: 'Triggers reveal at a specific video timestamp or frame',
  icon: 'film',
  tags: ['video', 'frame', 'timestamp', 'reveal'],
  category: 'video',
  settings: {
    targetFrame: { type: 'range', label: 'Target Frame', default: 80, min: 1, max: 300, step: 1 },
    targetTime: { type: 'range', label: 'Target Time (s)', default: 3.2, min: 0, max: 30, step: 0.1 },
    fps: { type: 'range', label: 'Frames Per Second', default: 25, min: 24, max: 60, step: 1 },
    latch: { type: 'toggle', label: 'Stay Triggered', default: true },
  },
})
