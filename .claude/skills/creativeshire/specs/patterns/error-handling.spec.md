# Error Handling Spec

> Patterns for graceful degradation when things fail in Creativeshire sites.

---

## Purpose

Errors happen. Network fails. Data is malformed. Components crash. Error handling ensures the site degrades gracefully, showing fallback content instead of blank screens. Users see something useful. Developers get actionable logs.

---

## Concepts

| Term | Definition |
|------|------------|
| Error Boundary | React component that catches errors in child tree |
| Fallback UI | Static content shown when component crashes |
| Recovery | Strategy for restoring normal operation |
| Graceful Degradation | Showing partial content instead of nothing |
| Error Logging | Reporting errors to monitoring services |

---

## Error Boundary Pattern

### React Error Boundaries

Error boundaries catch JavaScript errors in child component tree, log errors, and display fallback UI.

```typescript
// creativeshire/components/ErrorBoundary/index.tsx
'use client'

import { Component, ErrorInfo, ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}
```

### Boundary Placement

| Level | Protects | Fallback |
|-------|----------|----------|
| Page | Entire page | Full error page |
| Section | Individual section | Section placeholder |
| Widget | Individual widget | Widget placeholder |

```
Page ErrorBoundary
    │
    ├── Section ErrorBoundary
    │       │
    │       ├── Widget ErrorBoundary
    │       └── Widget ErrorBoundary
    │
    └── Section ErrorBoundary
            │
            └── Widget ErrorBoundary
```

---

## Widget Error Handling

### What Shows When a Widget Crashes

Widgets are wrapped in error boundaries by the renderer. On crash, show minimal fallback.

```typescript
// creativeshire/renderer/WidgetRenderer.tsx
import { ErrorBoundary } from '../components/ErrorBoundary'
import { WidgetFallback } from '../components/Fallbacks/WidgetFallback'

export function WidgetRenderer({ schema }: { schema: WidgetSchema }) {
  const Widget = widgetRegistry.get(schema.type)

  return (
    <ErrorBoundary
      fallback={<WidgetFallback type={schema.type} />}
      onError={(error) => logError('widget', schema.type, error)}
    >
      <Widget {...schema.props} />
    </ErrorBoundary>
  )
}
```

### Widget Fallback Component

```typescript
// creativeshire/components/Fallbacks/WidgetFallback.tsx
interface WidgetFallbackProps {
  type: string
}

export function WidgetFallback({ type }: WidgetFallbackProps) {
  // In production: silent fallback
  // In development: show error info
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className="widget-fallback widget-fallback--dev">
        <span>Widget error: {type}</span>
      </div>
    )
  }

  // Production: invisible placeholder maintains layout
  return <div className="widget-fallback" aria-hidden="true" />
}
```

```css
/* Fallbacks/styles.css */
.widget-fallback {
  min-height: 1rem;
}

.widget-fallback--dev {
  padding: 8px;
  background: #fef2f2;
  border: 1px dashed #ef4444;
  border-radius: 4px;
  font-size: 12px;
  color: #dc2626;
}
```

---

## Section Error Handling

### What Shows When a Section Crashes

Sections are wrapped by the page renderer. Show section placeholder on crash.

```typescript
// creativeshire/renderer/SectionRenderer.tsx
import { ErrorBoundary } from '../components/ErrorBoundary'
import { SectionFallback } from '../components/Fallbacks/SectionFallback'

export function SectionRenderer({ schema }: { schema: SectionSchema }) {
  return (
    <ErrorBoundary
      fallback={<SectionFallback id={schema.id} />}
      onError={(error) => logError('section', schema.id, error)}
    >
      <Section schema={schema} />
    </ErrorBoundary>
  )
}
```

### Section Fallback Component

```typescript
// creativeshire/components/Fallbacks/SectionFallback.tsx
interface SectionFallbackProps {
  id: string
}

export function SectionFallback({ id }: SectionFallbackProps) {
  if (process.env.NODE_ENV === 'development') {
    return (
      <section className="section-fallback section-fallback--dev">
        <div className="section-fallback__content">
          <h3>Section Error</h3>
          <p>Section "{id}" failed to render</p>
        </div>
      </section>
    )
  }

  // Production: maintain vertical rhythm
  return (
    <section className="section-fallback" aria-hidden="true">
      <div className="section-fallback__spacer" />
    </section>
  )
}
```

```css
.section-fallback {
  min-height: 200px;
}

.section-fallback__spacer {
  height: 200px;
}

.section-fallback--dev {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fef2f2;
  border: 2px dashed #ef4444;
}

.section-fallback__content {
  text-align: center;
  color: #dc2626;
}
```

---

## Behaviour Error Handling

### What Happens When compute() Throws

Behaviours run in the driver tick loop. Errors in `compute()` must not crash the loop.

```typescript
// creativeshire/experience/drivers/ScrollDriver.ts
private update() {
  this.targets.forEach(({ id, element, behaviour, options }) => {
    try {
      const vars = behaviour.compute(this.state, options)
      Object.entries(vars).forEach(([key, value]) => {
        element.style.setProperty(key, String(value))
      })
    } catch (error) {
      // Log once per behaviour, not every frame
      if (!this.erroredBehaviours.has(id)) {
        this.erroredBehaviours.add(id)
        logError('behaviour', behaviour.id, error as Error)
      }
      // Apply fallback values
      this.applyFallbacks(element, behaviour)
    }
  })
}

private applyFallbacks(element: HTMLElement, behaviour: Behaviour) {
  // Parse cssTemplate for fallback values
  const fallbackMatch = behaviour.cssTemplate.matchAll(/var\(--[\w-]+,\s*([^)]+)\)/g)
  for (const match of fallbackMatch) {
    const varName = match[0].match(/var\((--[\w-]+)/)?.[1]
    const fallback = match[1]
    if (varName && fallback) {
      element.style.setProperty(varName, fallback.trim())
    }
  }
}
```

### Rules

| Rule | Why |
|------|-----|
| Catch errors in tick loop | Prevents animation loop crash |
| Log once per behaviour | Avoid console spam at 60fps |
| Apply CSS fallbacks | Maintain visual stability |
| Track errored behaviours | Enable recovery detection |

---

## Driver Error Handling

### What Happens When Driver Fails to Apply CSS Variables

```typescript
// creativeshire/experience/drivers/ScrollDriver.ts
private safeSetProperty(element: HTMLElement, key: string, value: string) {
  try {
    element.style.setProperty(key, value)
  } catch (error) {
    // Element may have been removed from DOM
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Failed to set ${key} on element:`, error)
    }
    // Unregister orphaned target
    const targetId = this.findTargetIdByElement(element)
    if (targetId) {
      this.unregister(targetId)
    }
  }
}

private findTargetIdByElement(element: HTMLElement): string | null {
  for (const [id, target] of this.targets) {
    if (target.element === element) return id
  }
  return null
}
```

### Driver Initialization Errors

```typescript
// creativeshire/experience/providers/DriverProvider.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export function DriverProvider({ children }: { children: ReactNode }) {
  const [driver, setDriver] = useState<Driver | null>(null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    try {
      const scrollDriver = new ScrollDriver()
      setDriver(scrollDriver)
      return () => scrollDriver.destroy()
    } catch (err) {
      setError(err as Error)
      logError('driver', 'ScrollDriver', err as Error)
    }
  }, [])

  if (error) {
    // Driver failed - animations won't work but page renders
    return <>{children}</>
  }

  return (
    <DriverContext.Provider value={driver}>
      {children}
    </DriverContext.Provider>
  )
}
```

---

## Network Error Handling

### Failed Data Fetches

Data fetching happens in `site/data/`. Handle errors at the fetch level.

```typescript
// site/data/projects.ts
'use cache'
import { cacheLife, cacheTag } from 'next/cache'

export async function getProjects(): Promise<Project[]> {
  cacheLife('days')
  cacheTag('projects')

  try {
    const response = await fetch(PROJECTS_API)

    if (!response.ok) {
      throw new NetworkError(`Failed to fetch projects: ${response.status}`)
    }

    return response.json()
  } catch (error) {
    logError('fetch', 'projects', error as Error)
    // Return empty array - page renders with no projects
    return []
  }
}

class NetworkError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'NetworkError'
  }
}
```

### Fallback Data Pattern

```typescript
// site/data/projects.ts
const FALLBACK_PROJECTS: Project[] = [
  {
    id: 'offline',
    title: 'Content unavailable',
    description: 'Please check your connection',
    // ... minimal fallback data
  }
]

export async function getProjects(): Promise<Project[]> {
  try {
    return await fetchProjects()
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      return FALLBACK_PROJECTS
    }
    // Production: return empty, let UI handle
    return []
  }
}
```

### Suspense Error Handling

```typescript
// app/page.tsx
import { Suspense } from 'react'
import { ErrorBoundary } from '@/creativeshire/components/ErrorBoundary'

export default function Page() {
  return (
    <>
      <Hero />
      <ErrorBoundary fallback={<ProjectsError />}>
        <Suspense fallback={<ProjectsSkeleton />}>
          <Projects />
        </Suspense>
      </ErrorBoundary>
    </>
  )
}

function ProjectsError() {
  return (
    <section className="projects-error">
      <p>Unable to load projects. Please try again later.</p>
    </section>
  )
}
```

---

## Validation Errors

### Schema Validation Failures

Validate schemas before rendering. Invalid schemas don't crash - they log and skip.

```typescript
// creativeshire/renderer/PageRenderer.tsx
import { validatePageSchema } from '../schema/validators'

export function PageRenderer({ schema }: { schema: PageSchema }) {
  const validationResult = validatePageSchema(schema)

  if (!validationResult.valid) {
    logError('validation', 'PageSchema', new Error(validationResult.errors.join(', ')))

    if (process.env.NODE_ENV === 'development') {
      return <ValidationErrorView errors={validationResult.errors} />
    }

    // Production: render what we can
    return <PartialPageRenderer schema={schema} />
  }

  return <FullPageRenderer schema={schema} />
}
```

### Widget Props Validation

```typescript
// creativeshire/renderer/WidgetRenderer.tsx
export function WidgetRenderer({ schema }: { schema: WidgetSchema }) {
  const Widget = widgetRegistry.get(schema.type)

  if (!Widget) {
    logError('validation', 'widget-registry', new Error(`Unknown widget: ${schema.type}`))
    return <WidgetFallback type={schema.type} />
  }

  // TypeScript handles prop validation at compile time
  // Runtime validation for dynamic schemas
  if (process.env.NODE_ENV === 'development') {
    const validation = validateWidgetProps(schema.type, schema.props)
    if (!validation.valid) {
      console.warn(`Invalid props for ${schema.type}:`, validation.errors)
    }
  }

  return <Widget {...schema.props} />
}
```

---

## Error Logging

### Development vs Production

| Environment | Console | External Service |
|-------------|---------|------------------|
| Development | Verbose with stack traces | Disabled |
| Production | Minimal (errors only) | Enabled |

### Logging Implementation

```typescript
// creativeshire/utils/logger.ts
type ErrorCategory = 'widget' | 'section' | 'behaviour' | 'driver' | 'fetch' | 'validation'

interface ErrorLog {
  category: ErrorCategory
  source: string
  error: Error
  timestamp: number
  url: string
}

export function logError(category: ErrorCategory, source: string, error: Error) {
  const log: ErrorLog = {
    category,
    source,
    error,
    timestamp: Date.now(),
    url: typeof window !== 'undefined' ? window.location.href : 'server'
  }

  if (process.env.NODE_ENV === 'development') {
    console.error(`[${category}] ${source}:`, error)
    console.error(error.stack)
  } else {
    // Production: send to monitoring service
    sendToMonitoring(log)
  }
}

async function sendToMonitoring(log: ErrorLog) {
  // Integrate with your monitoring service
  // Examples: Sentry, LogRocket, DataDog
  try {
    if (typeof window !== 'undefined' && window.Sentry) {
      window.Sentry.captureException(log.error, {
        tags: {
          category: log.category,
          source: log.source
        }
      })
    }
  } catch {
    // Monitoring failed - fail silently
  }
}
```

### Error Context

```typescript
// Enrich errors with context
export function logErrorWithContext(
  category: ErrorCategory,
  source: string,
  error: Error,
  context: Record<string, any>
) {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${category}] ${source}:`, error)
    console.table(context)
  } else {
    sendToMonitoring({
      category,
      source,
      error,
      timestamp: Date.now(),
      url: typeof window !== 'undefined' ? window.location.href : 'server',
      ...context
    })
  }
}
```

---

## Recovery Patterns

### Retry Pattern

```typescript
// site/data/utils/retry.ts
interface RetryOptions {
  attempts: number
  delay: number
  backoff: 'linear' | 'exponential'
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = { attempts: 3, delay: 1000, backoff: 'exponential' }
): Promise<T> {
  let lastError: Error | null = null

  for (let attempt = 0; attempt < options.attempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error

      if (attempt < options.attempts - 1) {
        const delay = options.backoff === 'exponential'
          ? options.delay * Math.pow(2, attempt)
          : options.delay * (attempt + 1)

        await sleep(delay)
      }
    }
  }

  throw lastError
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
```

### Usage

```typescript
// site/data/projects.ts
export async function getProjects(): Promise<Project[]> {
  return withRetry(
    () => fetchProjects(),
    { attempts: 3, delay: 500, backoff: 'exponential' }
  )
}
```

### Fallback Chain Pattern

```typescript
// site/data/content.ts
export async function getContent(slug: string): Promise<Content> {
  // Try primary source
  try {
    return await fetchFromCMS(slug)
  } catch {
    // Fallback to cache
    try {
      return await getFromCache(slug)
    } catch {
      // Fallback to static
      return getStaticFallback(slug)
    }
  }
}
```

### Error Boundary Reset

```typescript
// creativeshire/components/ErrorBoundary/ResetErrorBoundary.tsx
'use client'

import { Component, ErrorInfo, ReactNode } from 'react'

interface ResetErrorBoundaryProps {
  children: ReactNode
  fallback: (props: { reset: () => void }) => ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface ResetErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ResetErrorBoundary extends Component<
  ResetErrorBoundaryProps,
  ResetErrorBoundaryState
> {
  constructor(props: ResetErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ResetErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo)
  }

  reset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback({ reset: this.reset })
    }
    return this.props.children
  }
}
```

### Usage with Retry Button

```typescript
// app/projects/page.tsx
<ResetErrorBoundary
  fallback={({ reset }) => (
    <div className="error-container">
      <p>Something went wrong loading projects</p>
      <button onClick={reset}>Try Again</button>
    </div>
  )}
>
  <Projects />
</ResetErrorBoundary>
```

---

## Rules

### Must

1. Wrap sections and widgets in error boundaries
2. Log errors with category, source, and context
3. Provide fallback UI for all error boundaries
4. Handle network errors with graceful fallbacks
5. Catch errors in driver tick loop (don't crash 60fps loop)
6. Track errored behaviours to prevent log spam
7. Validate schemas before rendering
8. Return cleanup functions from error-prone effects
9. Test error scenarios explicitly

### Must Not

1. Let errors propagate to blank screens
2. Log at 60fps (once per error, not per frame)
3. Show stack traces in production
4. Crash the animation loop for single widget errors
5. Block page render for non-critical data failures
6. Ignore error boundaries in development
7. Use console.log for production error logging

---

## Validation Rules

| # | Rule | Function | Files |
|---|------|----------|-------|
| 1 | Error boundaries wrap sections | `checkSectionBoundary` | `SectionRenderer.tsx` |
| 2 | Error boundaries wrap widgets | `checkWidgetBoundary` | `WidgetRenderer.tsx` |
| 3 | Fallback provided for boundaries | `checkFallbackProvided` | `*Renderer.tsx` |
| 4 | Driver catches compute errors | `checkDriverCatch` | `*Driver.ts` |
| 5 | Network fetches have error handling | `checkFetchErrorHandling` | `site/data/*.ts` |
| 6 | No console.log in production | `checkNoConsoleLog` | All files |
| 7 | Error logger used for errors | `checkErrorLogger` | All files |

---

## Templates

### ErrorBoundary Component

See [Error Boundary Pattern](#error-boundary-pattern) for the full implementation. The template adds `category` and `source` props for structured logging:

```typescript
// creativeshire/components/ErrorBoundary/index.tsx - Enhanced version
interface ErrorBoundaryProps {
  children: ReactNode
  fallback: ReactNode
  category?: 'widget' | 'section' | 'page'  // For structured logging
  source?: string                           // Component identifier
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

// Uses logError(category, source, error) in componentDidCatch
```

### Fallback Components

See [Widget Fallback Component](#widget-fallback-component) and [Section Fallback Component](#section-fallback-component) for full implementations.

Barrel export pattern:
```typescript
// creativeshire/components/Fallbacks/index.tsx
export { WidgetFallback } from './WidgetFallback'
export { SectionFallback } from './SectionFallback'
export { PageFallback } from './PageFallback'
```

### Error Logger

See [Error Logging](#error-logging) for the full implementation with `sendToMonitoring` and `logErrorWithContext` functions.

---

## Testing

### How to Test Error Scenarios

#### Test Error Boundaries

```typescript
// creativeshire/components/ErrorBoundary/index.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ErrorBoundary } from './index'

function ThrowingComponent() {
  throw new Error('Test error')
}

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    render(
      <ErrorBoundary fallback={<div>Error</div>}>
        <div>Content</div>
      </ErrorBoundary>
    )
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('renders fallback when child throws', () => {
    // Suppress error console for this test
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary fallback={<div>Error occurred</div>}>
        <ThrowingComponent />
      </ErrorBoundary>
    )

    expect(screen.getByText('Error occurred')).toBeInTheDocument()
    spy.mockRestore()
  })

  it('calls onError when error caught', () => {
    const onError = vi.fn()
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(
      <ErrorBoundary fallback={<div>Error</div>} onError={onError}>
        <ThrowingComponent />
      </ErrorBoundary>
    )

    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({ componentStack: expect.any(String) })
    )
    spy.mockRestore()
  })
})
```

#### Test Behaviour Error Handling

```typescript
// creativeshire/experience/drivers/ScrollDriver.test.ts
import { describe, it, expect, vi } from 'vitest'
import { ScrollDriver } from './ScrollDriver'

describe('ScrollDriver error handling', () => {
  it('continues tick loop when behaviour.compute throws', async () => {
    const driver = new ScrollDriver()
    const element = document.createElement('div')
    const setPropertySpy = vi.spyOn(element.style, 'setProperty')

    const errorBehaviour = {
      id: 'error-behaviour',
      requires: [],
      compute: () => { throw new Error('Compute failed') },
      cssTemplate: 'opacity: var(--opacity, 1);'
    }

    const workingBehaviour = {
      id: 'working-behaviour',
      requires: [],
      compute: () => ({ '--opacity': 0.5 }),
      cssTemplate: 'opacity: var(--opacity, 1);'
    }

    driver.register('error', element, errorBehaviour, {})
    driver.register('working', element, workingBehaviour, {})

    // Wait for animation frame
    await new Promise(r => requestAnimationFrame(r))

    // Working behaviour should still apply
    expect(setPropertySpy).toHaveBeenCalledWith('--opacity', '0.5')

    driver.destroy()
  })

  it('applies fallback values on compute error', async () => {
    const driver = new ScrollDriver()
    const element = document.createElement('div')
    const setPropertySpy = vi.spyOn(element.style, 'setProperty')

    const errorBehaviour = {
      id: 'error-behaviour',
      requires: [],
      compute: () => { throw new Error('Compute failed') },
      cssTemplate: 'opacity: var(--opacity, 1); transform: translateY(var(--y, 0));'
    }

    driver.register('error', element, errorBehaviour, {})

    await new Promise(r => requestAnimationFrame(r))

    // Should apply fallback values
    expect(setPropertySpy).toHaveBeenCalledWith('--opacity', '1')
    expect(setPropertySpy).toHaveBeenCalledWith('--y', '0')

    driver.destroy()
  })
})
```

#### Test Network Error Handling

```typescript
// site/data/projects.test.ts
import { describe, it, expect, vi } from 'vitest'
import { getProjects } from './projects'

describe('getProjects', () => {
  it('returns empty array on network error', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

    const projects = await getProjects()

    expect(projects).toEqual([])
  })

  it('returns empty array on 500 response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500
    })

    const projects = await getProjects()

    expect(projects).toEqual([])
  })

  it('logs error on failure', async () => {
    const logSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

    await getProjects()

    expect(logSpy).toHaveBeenCalled()
    logSpy.mockRestore()
  })
})
```

### Definition of Done

An error handling implementation is complete when:

- [ ] Error boundaries wrap all sections and widgets
- [ ] Fallback components provided for all boundaries
- [ ] Driver catches and handles compute() errors
- [ ] Network fetches return graceful fallbacks
- [ ] Error logging works in dev and production
- [ ] Tests cover error scenarios
- [ ] No uncaught errors propagate to blank screens

---

## See Also

- [Anti-Patterns Spec](./anti-patterns.spec.md) - Patterns to avoid
- [Widget Spec](../components/content/widget.spec.md) - Widget structure
- [Section Spec](../components/content/section.spec.md) - Section structure
- [Behaviour Spec](../components/experience/behaviour.spec.md) - Behaviour compute
- [Driver Spec](../components/experience/driver.spec.md) - Driver lifecycle
- [Data Fetching Spec](./data-fetching.spec.md) - Network patterns
