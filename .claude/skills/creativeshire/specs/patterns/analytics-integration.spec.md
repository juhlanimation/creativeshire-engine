# Analytics Integration Spec

> Patterns for integrating analytics while preserving performance and respecting user privacy.

---

## Purpose

Analytics provide insight into user behaviour: what pages they visit, how far they scroll, which elements they interact with. This data informs design decisions and content strategy. However, analytics must not degrade performance or compromise privacy.

**Key constraint:** Analytics scripts are non-critical for initial render. They must load after hydration to avoid blocking the initial bundle (see [preset.spec.md](../components/preset/preset.spec.md) rule: "Block initial bundle with analytics/logging - defer after hydration").

---

## Concepts

| Term | Definition |
|------|------------|
| Page View | Navigation to a new route |
| Event | Discrete user action (click, submit, download) |
| Custom Dimension | Metadata attached to events (category, label, value) |
| Consent | User permission to track (required for GDPR compliance) |
| Provider | Third-party analytics service (GA4, Plausible, etc.) |

---

## Folder Structure

```
creativeshire/analytics/
├── types.ts                  # AnalyticsConfig, Event, PageView interfaces
├── provider.tsx              # AnalyticsProvider context
├── hooks/
│   ├── useAnalytics.ts       # Main hook for tracking
│   ├── usePageView.ts        # Automatic page view tracking
│   ├── useScrollDepth.ts     # Scroll milestone tracking
│   └── useClickTracking.ts   # Element interaction tracking
├── adapters/
│   ├── types.ts              # AnalyticsAdapter interface
│   ├── ga4.ts                # Google Analytics 4 adapter
│   ├── plausible.ts          # Plausible adapter
│   └── debug.ts              # Console logging for development
└── consent/
    ├── ConsentBanner.tsx     # GDPR consent UI
    └── useConsent.ts         # Consent state management
```

---

## Interface

### AnalyticsConfig

```typescript
// analytics/types.ts
interface AnalyticsConfig {
  provider: 'ga4' | 'plausible' | 'debug' | 'none'
  measurementId?: string        // GA4: G-XXXXXXXXXX
  domain?: string               // Plausible: domain to track
  respectDoNotTrack?: boolean   // Honor browser DNT setting
  anonymizeIp?: boolean         // GA4: anonymize IP addresses
  debug?: boolean               // Log events to console
}

interface AnalyticsEvent {
  name: string                  // Event name (e.g., 'button_click')
  category?: string             // Event category (e.g., 'navigation')
  label?: string                // Event label (e.g., 'hero_cta')
  value?: number                // Numeric value (e.g., scroll depth)
  metadata?: Record<string, any>
}

interface PageViewEvent {
  path: string                  // Current route
  title?: string                // Page title
  referrer?: string             // Previous page
}
```

### AnalyticsAdapter

```typescript
// analytics/adapters/types.ts
interface AnalyticsAdapter {
  init: (config: AnalyticsConfig) => Promise<void>
  trackPageView: (event: PageViewEvent) => void
  trackEvent: (event: AnalyticsEvent) => void
  setUserProperties?: (properties: Record<string, any>) => void
  isReady: () => boolean
}
```

---

## Pattern 1: Page View Tracking

Track navigation between pages. Integrates with Next.js App Router.

### Implementation

```typescript
// analytics/hooks/usePageView.ts
'use client'
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useAnalytics } from './useAnalytics'

export function usePageView(): void {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { trackPageView, isReady } = useAnalytics()

  useEffect(() => {
    if (!isReady) return

    const url = pathname + (searchParams.toString() ? `?${searchParams}` : '')
    trackPageView({
      path: url,
      title: document.title
    })
  }, [pathname, searchParams, trackPageView, isReady])
}
```

### Usage in Layout

```typescript
// app/layout.tsx
import dynamic from 'next/dynamic'

// Lazy load analytics - CRITICAL for performance
const AnalyticsProvider = dynamic(
  () => import('@/creativeshire/analytics/provider').then(m => m.AnalyticsProvider),
  { ssr: false }
)

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <AnalyticsProvider config={{ provider: 'ga4', measurementId: 'G-XXX' }} />
      </body>
    </html>
  )
}
```

### Validation Rules

| # | Rule | Check |
|---|------|-------|
| 1 | usePageView in client component | `'use client'` directive present |
| 2 | Waits for analytics ready | `if (!isReady) return` guard |
| 3 | Tracks on route change | Dependencies include pathname |

---

## Pattern 2: Event Tracking

Track discrete user actions like button clicks, form submissions, downloads.

### Implementation

```typescript
// analytics/hooks/useAnalytics.ts
'use client'
import { useCallback, useContext } from 'react'
import { AnalyticsContext } from '../provider'

export function useAnalytics() {
  const context = useContext(AnalyticsContext)
  if (!context) {
    throw new Error('useAnalytics must be used within AnalyticsProvider')
  }

  const trackEvent = useCallback((event: AnalyticsEvent) => {
    if (!context.isReady || !context.hasConsent) return
    context.adapter.trackEvent(event)
  }, [context])

  const trackPageView = useCallback((event: PageViewEvent) => {
    if (!context.isReady || !context.hasConsent) return
    context.adapter.trackPageView(event)
  }, [context])

  return {
    trackEvent,
    trackPageView,
    isReady: context.isReady,
    hasConsent: context.hasConsent
  }
}
```

### Event Schema

```typescript
// Standard event names for consistency
const EventNames = {
  BUTTON_CLICK: 'button_click',
  FORM_SUBMIT: 'form_submit',
  DOWNLOAD: 'download',
  VIDEO_PLAY: 'video_play',
  VIDEO_COMPLETE: 'video_complete',
  SCROLL_DEPTH: 'scroll_depth',
  OUTBOUND_LINK: 'outbound_link',
  SEARCH: 'search',
  CTA_CLICK: 'cta_click'
} as const
```

### Usage in Components

```typescript
// widgets/Button/index.tsx
import { useAnalytics } from '@/creativeshire/analytics/hooks/useAnalytics'

function Button({ label, trackingLabel, onClick, ...props }) {
  const { trackEvent } = useAnalytics()

  const handleClick = (e) => {
    if (trackingLabel) {
      trackEvent({
        name: 'button_click',
        category: 'interaction',
        label: trackingLabel
      })
    }
    onClick?.(e)
  }

  return <button onClick={handleClick} {...props}>{label}</button>
}
```

---

## Pattern 3: Click Tracking

Declarative click tracking via data attributes. No code changes required in widgets.

### Implementation

```typescript
// analytics/hooks/useClickTracking.ts
'use client'
import { useEffect } from 'react'
import { useAnalytics } from './useAnalytics'

export function useClickTracking(): void {
  const { trackEvent, isReady, hasConsent } = useAnalytics()

  useEffect(() => {
    if (!isReady || !hasConsent) return
    if (typeof window === 'undefined') return

    const handler = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('[data-track-click]')
      if (!target) return

      const trackData = target.getAttribute('data-track-click')
      const category = target.getAttribute('data-track-category') || 'click'
      const label = target.getAttribute('data-track-label') || trackData

      trackEvent({
        name: trackData || 'element_click',
        category,
        label
      })
    }

    document.addEventListener('click', handler, { passive: true })
    return () => document.removeEventListener('click', handler)
  }, [trackEvent, isReady, hasConsent])
}
```

### Usage in Markup

```html
<!-- Simple tracking -->
<button data-track-click="hero_cta">Get Started</button>

<!-- With category and label -->
<a
  href="/pricing"
  data-track-click="navigation"
  data-track-category="nav"
  data-track-label="pricing_link"
>
  Pricing
</a>
```

### Validation Rules

| # | Rule | Check |
|---|------|-------|
| 1 | Passive listener | `{ passive: true }` option |
| 2 | Cleanup on unmount | `removeEventListener` in return |
| 3 | SSR guard | `typeof window !== 'undefined'` |
| 4 | Consent check | `if (!hasConsent) return` |

---

## Pattern 4: Scroll Tracking

Track scroll depth milestones. Integrates with existing scroll triggers.

### Implementation

```typescript
// analytics/hooks/useScrollDepth.ts
'use client'
import { useEffect, useRef } from 'react'
import { useAnalytics } from './useAnalytics'
import { useExperienceStore } from '@/creativeshire/experience/ExperienceProvider'

interface ScrollDepthOptions {
  thresholds?: number[]  // Default: [25, 50, 75, 100]
}

export function useScrollDepth(options?: ScrollDepthOptions): void {
  const { trackEvent, isReady, hasConsent } = useAnalytics()
  const scrollProgress = useExperienceStore(s => s.scrollProgress)
  const trackedThresholds = useRef<Set<number>>(new Set())

  const thresholds = options?.thresholds ?? [25, 50, 75, 100]

  useEffect(() => {
    if (!isReady || !hasConsent) return

    const currentDepth = Math.floor(scrollProgress * 100)

    thresholds.forEach(threshold => {
      if (currentDepth >= threshold && !trackedThresholds.current.has(threshold)) {
        trackedThresholds.current.add(threshold)
        trackEvent({
          name: 'scroll_depth',
          category: 'engagement',
          label: `${threshold}%`,
          value: threshold
        })
      }
    })
  }, [scrollProgress, trackEvent, isReady, hasConsent, thresholds])
}
```

### Integration with Trigger System

The scroll depth hook reads from the experience store's `scrollProgress` value, which is populated by the scroll trigger (see [trigger.spec.md](../components/experience/trigger.spec.md)). This avoids adding duplicate scroll listeners.

```
Browser scroll event
        |
        v
useScrollProgress trigger --> Store (scrollProgress: 0.75)
        |                            |
        v                            v
Drivers read store            useScrollDepth reads store
        |                            |
        v                            v
CSS Variables applied         Analytics event fired
```

---

## Pattern 5: Provider Integration

All adapters implement the `AnalyticsAdapter` interface. GA4 shown as complete reference; others differ only in script loading and API calls.

### GA4 Adapter (Full Reference)

```typescript
// analytics/adapters/ga4.ts
import { AnalyticsAdapter, AnalyticsConfig, AnalyticsEvent, PageViewEvent } from './types'

let isInitialized = false

export const ga4Adapter: AnalyticsAdapter = {
  async init(config: AnalyticsConfig) {
    if (isInitialized || !config.measurementId) return
    if (typeof window === 'undefined') return

    // Load gtag script
    const script = document.createElement('script')
    script.src = `https://www.googletagmanager.com/gtag/js?id=${config.measurementId}`
    script.async = true
    document.head.appendChild(script)

    // Initialize gtag
    window.dataLayer = window.dataLayer || []
    function gtag(...args: any[]) { window.dataLayer.push(args) }
    window.gtag = gtag
    gtag('js', new Date())
    gtag('config', config.measurementId, {
      send_page_view: false,
      anonymize_ip: config.anonymizeIp ?? true
    })
    isInitialized = true
  },

  trackPageView(event: PageViewEvent) {
    if (!isInitialized || typeof window === 'undefined') return
    window.gtag('event', 'page_view', { page_path: event.path, page_title: event.title })
  },

  trackEvent(event: AnalyticsEvent) {
    if (!isInitialized || typeof window === 'undefined') return
    window.gtag('event', event.name, {
      event_category: event.category,
      event_label: event.label,
      value: event.value,
      ...event.metadata
    })
  },

  isReady() { return isInitialized }
}
```

### Other Adapters (Key Differences Only)

| Adapter | Script | Page View | Event API |
|---------|--------|-----------|-----------|
| **Plausible** | `plausible.io/js/script.js` (defer, data-domain) | Auto-tracks; manual: `window.plausible('pageview', { u: path })` | `window.plausible(name, { props: {...} })` |
| **Debug** | None | `console.log('[Analytics] Page View:', event)` | `console.log('[Analytics] Event:', event)` |

Plausible requires `config.domain`. Debug always returns `isReady() = true`.

---

## Pattern 6: Privacy & Consent

### GDPR Requirements

| Requirement | Implementation |
|-------------|----------------|
| Informed consent | Clear banner explaining what is tracked |
| Granular choice | Allow accepting/rejecting specific categories |
| Easy withdrawal | Settings accessible to change consent |
| Respect DNT | Honor Do Not Track browser setting |
| Data minimization | Only track what is necessary |

### Consent Hook

```typescript
// analytics/consent/useConsent.ts
'use client'
import { useState, useEffect, useCallback } from 'react'

type ConsentCategory = 'necessary' | 'analytics' | 'marketing'

interface ConsentState {
  given: boolean
  categories: Record<ConsentCategory, boolean>
  timestamp?: number
}

const CONSENT_KEY = 'analytics-consent:v1'

export function useConsent() {
  const [consent, setConsent] = useState<ConsentState>({
    given: false,
    categories: { necessary: true, analytics: false, marketing: false }
  })

  // Load saved consent
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const saved = localStorage.getItem(CONSENT_KEY)
      if (saved) setConsent(JSON.parse(saved))
    } catch {
      // Ignore parse errors
    }
  }, [])

  const updateConsent = useCallback((categories: Partial<Record<ConsentCategory, boolean>>) => {
    const newConsent: ConsentState = {
      given: true,
      categories: { ...consent.categories, ...categories, necessary: true },
      timestamp: Date.now()
    }
    setConsent(newConsent)
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(newConsent))
    } catch {
      // localStorage unavailable
    }
  }, [consent.categories])

  const acceptAll = useCallback(() => {
    updateConsent({ analytics: true, marketing: true })
  }, [updateConsent])

  const rejectAll = useCallback(() => {
    updateConsent({ analytics: false, marketing: false })
  }, [updateConsent])

  return {
    consent,
    hasAnalyticsConsent: consent.categories.analytics,
    updateConsent,
    acceptAll,
    rejectAll,
    needsConsent: !consent.given
  }
}
```

### Consent Banner

```typescript
// analytics/consent/ConsentBanner.tsx
'use client'
import { useConsent } from './useConsent'

export function ConsentBanner() {
  const { needsConsent, acceptAll, rejectAll } = useConsent()

  if (!needsConsent) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg z-50"
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        <p className="text-sm">
          We use cookies to understand how you use our site and improve your experience.
        </p>
        <div className="flex gap-2">
          <button
            onClick={rejectAll}
            className="px-4 py-2 text-sm border rounded"
          >
            Reject
          </button>
          <button
            onClick={acceptAll}
            className="px-4 py-2 text-sm bg-black text-white rounded"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
```

### Respecting Do Not Track

```typescript
// analytics/provider.tsx
function shouldTrack(config: AnalyticsConfig): boolean {
  if (typeof window === 'undefined') return false

  // Respect Do Not Track
  if (config.respectDoNotTrack && navigator.doNotTrack === '1') {
    return false
  }

  return true
}
```

---

## Pattern 7: Performance

Analytics must not impact Core Web Vitals.

### Lazy Loading Analytics

```typescript
// CORRECT - Load after hydration
const AnalyticsProvider = dynamic(
  () => import('@/creativeshire/analytics/provider'),
  { ssr: false }  // Prevents server-side rendering
)

// WRONG - Blocks initial bundle
import { AnalyticsProvider } from '@/creativeshire/analytics/provider'
```

### Script Loading Strategy

| Provider | Loading | Strategy |
|----------|---------|----------|
| GA4 | `async` | Non-blocking, executes when ready |
| Plausible | `defer` | Executes after HTML parsing |
| Debug | None | No external scripts |

### Validation Rules

| # | Rule | Check |
|---|------|-------|
| 1 | Analytics loaded via dynamic import | `{ ssr: false }` option |
| 2 | Scripts use async or defer | No blocking scripts |
| 3 | No analytics in initial bundle | Bundle analysis |
| 4 | Events don't block UI | Fire-and-forget pattern |

### Performance Budget Impact

| Metric | Without Analytics | With Analytics (Lazy) |
|--------|-------------------|----------------------|
| LCP | No impact | No impact |
| FID | No impact | No impact |
| TTI | Baseline | +50-100ms after hydration |
| Bundle (JS) | Baseline | +0KB initial, +5-10KB deferred |

---

## Pattern 8: Testing

### Unit Testing Events

```typescript
// analytics/hooks/useAnalytics.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAnalytics } from './useAnalytics'
import { AnalyticsProvider } from '../provider'

const mockTrackEvent = vi.fn()
const mockAdapter = {
  init: vi.fn(),
  trackEvent: mockTrackEvent,
  trackPageView: vi.fn(),
  isReady: () => true
}

describe('useAnalytics', () => {
  beforeEach(() => {
    mockTrackEvent.mockClear()
  })

  it('tracks events when consent given', () => {
    const wrapper = ({ children }) => (
      <AnalyticsProvider
        config={{ provider: 'debug' }}
        initialConsent={{ analytics: true }}
      >
        {children}
      </AnalyticsProvider>
    )

    const { result } = renderHook(() => useAnalytics(), { wrapper })

    act(() => {
      result.current.trackEvent({
        name: 'test_event',
        category: 'test'
      })
    })

    expect(mockTrackEvent).toHaveBeenCalledWith({
      name: 'test_event',
      category: 'test'
    })
  })

  it('does not track without consent', () => {
    const wrapper = ({ children }) => (
      <AnalyticsProvider
        config={{ provider: 'debug' }}
        initialConsent={{ analytics: false }}
      >
        {children}
      </AnalyticsProvider>
    )

    const { result } = renderHook(() => useAnalytics(), { wrapper })

    act(() => {
      result.current.trackEvent({ name: 'test_event' })
    })

    expect(mockTrackEvent).not.toHaveBeenCalled()
  })
})
```

### E2E Testing Events

```typescript
// e2e/analytics.spec.ts
import { test, expect } from '@playwright/test'

test('tracks page view on navigation', async ({ page }) => {
  // Intercept analytics requests
  const analyticsRequests: string[] = []
  await page.route('**/gtag/**', route => {
    analyticsRequests.push(route.request().url())
    route.continue()
  })

  // Accept consent
  await page.goto('/')
  await page.click('button:has-text("Accept")')

  // Navigate
  await page.click('a[href="/about"]')
  await page.waitForURL('/about')

  // Verify page view tracked
  expect(analyticsRequests.some(url => url.includes('page_view'))).toBe(true)
})
```

### Debug Mode Testing

Use the debug adapter during development to verify events fire correctly.

```typescript
// site/config.ts
export const analyticsConfig: AnalyticsConfig = {
  provider: process.env.NODE_ENV === 'development' ? 'debug' : 'ga4',
  measurementId: process.env.NEXT_PUBLIC_GA_ID
}
```

Console output in development:

```
[Analytics] Initialized with config: { provider: 'debug' }
[Analytics] Page View: { path: '/', title: 'Home' }
[Analytics] Event: { name: 'button_click', category: 'interaction', label: 'hero_cta' }
[Analytics] Event: { name: 'scroll_depth', category: 'engagement', label: '25%', value: 25 }
```

---

## Validation Rules Summary

| # | Rule | Check |
|---|------|-------|
| 1 | Analytics loaded lazily | `dynamic(() => import(), { ssr: false })` |
| 2 | Scripts use async/defer | No blocking `<script>` tags |
| 3 | Consent checked before tracking | `if (!hasConsent) return` |
| 4 | SSR guards present | `typeof window !== 'undefined'` |
| 5 | Event listeners passive | `{ passive: true }` option |
| 6 | Cleanup on unmount | `removeEventListener` in return |
| 7 | Do Not Track respected | Check `navigator.doNotTrack` |
| 8 | localStorage versioned | `analytics-consent:v1` pattern |
| 9 | No initial bundle impact | Bundle analysis shows 0KB |
| 10 | Consent banner accessible | `role="dialog"` + `aria-label` |

---

## Anti-Patterns

| Anti-Pattern | Problem | Correct Approach |
|--------------|---------|------------------|
| Eager analytics import | Blocks initial bundle | `dynamic(() => import(), { ssr: false })` |
| Tracking without consent | GDPR violation | Check consent before every track call |
| Sync script loading | Blocks render | Use `async` or `defer` attributes |
| Duplicate scroll listeners | Performance waste | Read from experience store |
| Missing SSR guards | Server crashes | `typeof window !== 'undefined'` |
| Hard-coded measurement IDs | Security risk | Use environment variables |
| Tracking sensitive data | Privacy violation | Never track PII or passwords |

---

## See Also

- [Preset Spec](../components/preset/preset.spec.md) - Bundle optimization rules
- [Trigger Spec](../components/experience/trigger.spec.md) - Scroll progress integration
- [Performance Spec](./performance.spec.md) - Core Web Vitals budgets
- [Hydration Spec](./hydration.spec.md) - Post-hydration loading patterns
