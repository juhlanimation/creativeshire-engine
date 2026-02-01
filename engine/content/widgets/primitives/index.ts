/**
 * Primitives Barrel
 *
 * Leaf-node widgets that render actual content.
 * Primitives are stateless React components that read CSS variables for animation.
 */

export { default as Button } from './Button'
export { default as Icon } from './Icon'
export { default as Image } from './Image'
export { default as Link } from './Link'
export { default as Text } from './Text'

// Re-export types
export type { ButtonProps } from './Button/types'
export type { IconProps } from './Icon/types'
export type { ImageProps } from './Image/types'
export type { LinkProps } from './Link/types'
export type { TextProps } from './Text/types'
