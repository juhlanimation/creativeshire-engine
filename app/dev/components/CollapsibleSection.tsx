'use client'

import { useState } from 'react'

interface CollapsibleSectionProps {
  label: string
  defaultOpen?: boolean
  children: React.ReactNode
  count?: number
}

export function CollapsibleSection({
  label,
  defaultOpen = false,
  children,
  count,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="da-collapsible">
      <button className="da-collapsible__toggle" onClick={() => setOpen((v) => !v)}>
        <span className="da-collapsible__arrow" data-open={open}>&#9656;</span>
        <span className="da-collapsible__label">{label}</span>
        {count !== undefined && <span className="da-collapsible__count">{count}</span>}
      </button>
      {open && <div className="da-collapsible__content">{children}</div>}
    </div>
  )
}
