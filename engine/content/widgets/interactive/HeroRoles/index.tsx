/**
 * HeroRoles widget - renders role titles for hero sections.
 *
 * Supports two patterns:
 * 1. Children via __repeat (preferred): Receives widgets array, visible in hierarchy
 * 2. Legacy roles prop: Receives roles array directly (hidden in hierarchy)
 */

'use client'

import type { HeroRolesProps } from './types'

export default function HeroRoles({
  roles,
  widgets,
  firstAs = 'h1',
  restAs = 'h2',
  style,
}: HeroRolesProps) {
  // Prefer widgets (children via __repeat) over roles prop
  const hasChildren = widgets && widgets.length > 0

  if (hasChildren) {
    // Render children with appropriate heading tags
    // Children are Text widgets with content prop
    return (
      <>
        {widgets.map((widget, index) => {
          const Tag = index === 0 ? firstAs : restAs
          // Extract content - handle various data types
          const rawContent = widget.props?.content

          // Skip null/undefined
          if (rawContent == null) {
            return null
          }

          // Skip unresolved binding expressions (platform will re-render)
          if (typeof rawContent === 'string' && rawContent.startsWith('{{')) {
            return null
          }

          // Handle different content types
          let content: string
          if (typeof rawContent === 'string') {
            content = rawContent
          } else if (typeof rawContent === 'object') {
            // Object - try to extract meaningful value or stringify
            content = rawContent.toString?.() !== '[object Object]'
              ? String(rawContent)
              : JSON.stringify(rawContent)
          } else {
            content = String(rawContent)
          }

          return (
            <Tag key={widget.id || index} style={{ ...style, ...widget.style }}>
              {content}
            </Tag>
          )
        })}
      </>
    )
  }

  // Legacy: roles prop
  if (typeof roles === 'string') {
    return null // Binding expression - platform will resolve
  }

  if (!Array.isArray(roles) || roles.length === 0) {
    return null
  }

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
