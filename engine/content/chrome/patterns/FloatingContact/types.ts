/**
 * FloatingContact chrome pattern types.
 * Floating header region with an EmailCopy widget and hover/reveal behaviour.
 */

export interface FloatingContactProps {
  label: string
  email: string
  blendMode?: 'normal' | 'difference'
}
