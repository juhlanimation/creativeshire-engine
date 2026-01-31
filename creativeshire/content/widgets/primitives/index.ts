/**
 * Primitives barrel - exports all primitive widgets.
 * Primitives are leaf nodes with no children.
 */

export { default as Text } from './Text'
export { default as Image } from './Image'
export { default as Icon } from './Icon'
export { default as Button } from './Button'
export { default as Link } from './Link'

// Re-export types
export type { TextProps } from './Text/types'
export type { ImageProps } from './Image/types'
export type { IconProps } from './Icon/types'
export type { ButtonProps } from './Button/types'
export type { LinkProps } from './Link/types'
