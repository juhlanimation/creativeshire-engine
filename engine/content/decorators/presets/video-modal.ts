/**
 * Video Modal decorator.
 * Opens a video modal on click.
 */

import type { DecoratorDefinition } from '../types'
import { registerDecorator } from '../registry'

const videoModal: DecoratorDefinition = {
  id: 'video-modal',
  name: 'Video Modal',
  description: 'Opens a video modal overlay on click',
  tags: ['video', 'modal', 'click'],
  requiredOverlays: ['VideoModal'],
  defaultOverlayKeys: { VideoModal: 'modal' },
  actions: (_params, keys) => ({
    click: `${keys.VideoModal}.open`,
  }),
}

registerDecorator(videoModal)
