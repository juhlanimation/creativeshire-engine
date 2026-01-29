'use client'

/**
 * Button widget - renders an interactive button with CSS variable support.
 * Content Layer (L1) - no scroll listeners or viewport units.
 */

import React, { memo, forwardRef } from 'react'
import type { ButtonProps } from './types'
import './styles.css'

/**
 * Button component renders an interactive button.
 * Supports CSS variable animation via var() fallbacks in styles.css.
 */
const Button = memo(forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    id,
    label,
    onClick,
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
      onClick={onClick}
      disabled={disabled}
      data-variant={variant}
      data-behaviour={dataBehaviour}
    >
      {label}
    </button>
  )
}))

export default Button
