/**
 * Button widget - renders an interactive button with CSS variable support.
 * Content Layer (L1) - no scroll listeners or viewport units.
 *
 * Click handling: Use BehaviourWrapper with data-behaviour attribute.
 * Functions cannot be serialized across the React Server Component boundary.
 */

import React, { memo, forwardRef } from 'react'
import type { ButtonProps } from './types'

/**
 * Button component renders an interactive button.
 * Supports CSS variable animation via var() fallbacks in styles.css.
 *
 * For click handling, wrap with BehaviourWrapper and use data-behaviour.
 * This keeps Button as a pure presentational component compatible with RSC.
 */
const Button = memo(forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    id,
    label,
    variant = 'primary',
    disabled = false,
    type = 'button',
    style,
    className,
    'data-behaviour': dataBehaviour
  },
  ref
) {
  return (
    <button
      ref={ref}
      id={id}
      type={type}
      className={className ? `button-widget ${className}` : 'button-widget'}
      style={style}
      disabled={disabled}
      data-variant={variant}
      data-behaviour={dataBehaviour}
    >
      <span className="button-widget__text">{label}</span>
    </button>
  )
}))

export default Button
