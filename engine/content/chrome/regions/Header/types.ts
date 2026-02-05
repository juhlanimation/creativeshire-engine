/**
 * Header chrome component props interface.
 * Global site header with navigation links.
 */

import type { ChromeBaseProps, NavLink } from '../../types'

/**
 * Props for the Header chrome component.
 */
export interface HeaderProps extends ChromeBaseProps {
  /** Navigation links - supports binding expressions */
  navLinks: NavLink[] | string
  /** Site logo URL or binding expression */
  logo?: string
  /** Site title text */
  siteTitle?: string
  /** Whether header is fixed (default: true) */
  fixed?: boolean
  /** Background color */
  background?: string
  /** Text color */
  color?: string
}
