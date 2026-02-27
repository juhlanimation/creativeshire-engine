/**
 * Schema builders barrel export.
 * Provides fluent builder functions for constructing WidgetSchema and SectionSchema objects.
 *
 * @example
 * ```typescript
 * import { section, text, flex, image, bind } from '@creativeshire/engine/builders'
 *
 * section(
 *   { id: 'hero', patternId: 'HeroImage', sectionHeight: 'viewport' },
 *   [
 *     flex({ direction: 'column', gap: 16 }, [
 *       text(bind('hero.title'), { scale: 'h1' }),
 *       image({ src: bind('hero.image'), alt: 'Hero' }),
 *     ])
 *   ]
 * )
 * ```
 */

// Primitive widget builders
export { text, image, icon, button, link } from './primitives'
export type {
  TextBuilderOptions,
  ImageBuilderOptions,
  IconBuilderOptions,
  ButtonBuilderOptions,
  LinkBuilderOptions,
} from './primitives'

// Layout widget builders
export { flex, stack, grid, split, container, box } from './layouts'
export type {
  FlexBuilderOptions,
  StackBuilderOptions,
  GridBuilderOptions,
  SplitBuilderOptions,
  ContainerBuilderOptions,
  BoxBuilderOptions,
} from './layouts'

// Interactive widget builders
export { video, videoPlayer, emailCopy, arrowLink } from './interactive'
export type {
  VideoBuilderOptions,
  VideoPlayerBuilderOptions,
  EmailCopyBuilderOptions,
  ArrowLinkBuilderOptions,
} from './interactive'

// Section builder
export { section } from './section'
export type { SectionBuilderOptions } from './section'

// Helpers
export { bind } from './helpers'
