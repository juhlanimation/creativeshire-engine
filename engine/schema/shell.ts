/**
 * Shell configuration types.
 * Shell is the platform wrapper around sites (engine.domain.com mode).
 *
 * The engine provides the ShellConfig type for awareness.
 * The platform owns the shell implementation.
 */

/**
 * Shell configuration for platform wrapper.
 * Platform passes this to indicate shell mode is active.
 */
export interface ShellConfig {
  /** Whether shell is enabled */
  enabled: boolean

  /** Position of shell sidebar */
  position: 'left' | 'right'

  /** Width of shell sidebar (px or CSS value) */
  width: number | string

  /** Responsive behavior */
  responsive?: ShellResponsive
}

/**
 * Shell responsive configuration.
 */
export interface ShellResponsive {
  /** Breakpoint below which shell collapses */
  collapseBelow?: 'sm' | 'md' | 'lg' | 'xl'

  /** Behavior when collapsed */
  collapsedMode?: 'hidden' | 'drawer'
}
