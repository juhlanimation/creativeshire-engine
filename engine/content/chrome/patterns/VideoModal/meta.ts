/**
 * VideoModal chrome pattern metadata for platform UI.
 */

import { defineChromeMeta } from '../../../../schema/meta'
import type { VideoModalProps } from './types'

export const meta = defineChromeMeta<VideoModalProps>({
  id: 'VideoModal',
  name: 'Video Modal',
  description: 'Full-screen modal overlay for video playback',
  category: 'chrome-pattern',
  chromeSlot: null,
  icon: 'video',
  tags: ['chrome', 'overlay', 'modal', 'video'],
  component: false,
  providesActions: ['{key}.open'],
})
