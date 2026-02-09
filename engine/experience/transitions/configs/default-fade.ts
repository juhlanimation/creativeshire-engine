/**
 * Default Fade transition config.
 * Registers the standard fade-to-black transition with default settings.
 */

import { registerTransitionConfig } from '../registry'
import type { TransitionConfigMeta } from '../registry'
import type { TransitionConfig } from '../../../schema/transition'

const meta: TransitionConfigMeta = {
  id: 'default-fade',
  name: 'Default Fade',
  description: 'Smooth fade-to-black transition between pages',
  icon: 'fade',
}

const config: TransitionConfig = {
  id: 'fade',
}

registerTransitionConfig(meta, config)

export { meta, config }
