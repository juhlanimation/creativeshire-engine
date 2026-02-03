/**
 * HeroRoles widget - renders role titles for hero sections.
 *
 * Accepts either:
 * - An array of role strings (renders immediately)
 * - A binding expression string (returns null, platform resolves and re-renders)
 *
 * This widget exists to support binding expressions in presets where
 * the role array isn't known at definition time.
 */

'use client'

import type { HeroRolesProps } from './types'

/**
 * Check if a value is a binding expression (starts with {{ content.)
 */
function isBindingExpression(value: unknown): value is string {
  return typeof value === 'string' && value.startsWith('{{ content.')
}

export default function HeroRoles({
  roles,
  firstAs = 'h1',
  restAs = 'h2',
  style,
}: HeroRolesProps) {
  // If roles is a binding expression, render nothing
  // Platform will resolve the binding and re-render with actual array
  if (isBindingExpression(roles)) {
    return null
  }

  // If not an array (shouldn't happen but defensive), render nothing
  if (!Array.isArray(roles)) {
    return null
  }

  // Render each role as a text element
  return (
    <>
      {roles.map((role, index) => {
        const Tag = index === 0 ? firstAs : restAs
        return (
          <Tag key={index} style={style}>
            {role}
          </Tag>
        )
      })}
    </>
  )
}
