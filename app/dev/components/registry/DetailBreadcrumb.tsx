/**
 * Breadcrumb navigation for the registry detail drill-down stack.
 */

'use client'

import { useDetailStack, useRegistryDetail } from './registry-store'

export function DetailBreadcrumb() {
  const stack = useDetailStack()
  const { popToIndex } = useRegistryDetail()

  if (stack.length <= 1) return null

  return (
    <nav className="cd-detail-breadcrumb">
      {stack.map((entry, i) => {
        const isLast = i === stack.length - 1
        return (
          <span key={i} className="cd-detail-breadcrumb__segment">
            {i > 0 && <span className="cd-detail-breadcrumb__sep">&rsaquo;</span>}
            {isLast ? (
              <span className="cd-detail-breadcrumb__current">{entry.label}</span>
            ) : (
              <button
                className="cd-detail-breadcrumb__link"
                onClick={() => popToIndex(i)}
              >
                {entry.label}
              </button>
            )}
          </span>
        )
      })}
    </nav>
  )
}
