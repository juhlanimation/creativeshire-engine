/**
 * /dev — CMS Contract Inspector dashboard.
 * Dev-only route: returns 404 in production.
 */

'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'

// Force preset registration before any registry reads
import { ensurePresetsRegistered } from '../../engine/presets'

import ContractDashboard from './components/ContractDashboard'

export default function DevPage() {
  // Production guard
  if (process.env.NODE_ENV !== 'development') {
    notFound()
  }

  // Ensure presets are registered (side-effect of import, but be explicit)
  ensurePresetsRegistered()

  // Hydration guard — avoid SSR mismatch from localStorage reads
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return (
      <div style={{ background: '#0a0a0a', minHeight: '100vh' }} />
    )
  }

  return <ContractDashboard />
}
