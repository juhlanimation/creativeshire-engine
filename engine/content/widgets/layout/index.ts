/**
 * Layout Widgets Barrel
 *
 * Container widgets that arrange child widgets in spatial patterns.
 * Layouts accept a `widgets` array and render children via WidgetRenderer.
 */

export { default as Box } from './Box'
export { default as Container } from './Container'
export { default as Flex } from './Flex'
export { default as Grid } from './Grid'
export { default as Marquee } from './Marquee'
export { default as Split } from './Split'
export { default as Stack } from './Stack'

// Re-export types
export type { BoxProps } from './Box/types'
export type { ContainerProps } from './Container/types'
export type { FlexProps } from './Flex/types'
export type { GridProps } from './Grid/types'
export type { MarqueeProps } from './Marquee/types'
export type { SplitProps } from './Split/types'
export type { StackProps } from './Stack/types'
