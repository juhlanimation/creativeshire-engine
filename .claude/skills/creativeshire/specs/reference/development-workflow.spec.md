# Development Workflow

> Development practices, debugging techniques, and profiling strategies for the Creativeshire engine.

---

## Purpose

Enable efficient development and debugging of the Creativeshire engine. The architecture separates React rendering from animation updates, which requires specific debugging approaches. Understanding data flow helps diagnose issues at the correct layer.

---

## Concepts

| Term | Definition |
|------|------------|
| HMR | Hot Module Replacement - Vite/Next.js feature for instant updates |
| DevTools | Browser developer tools for inspection and debugging |
| Profiling | Performance measurement to identify bottlenecks |
| Debug Mode | Engine mode that exposes internal state and CSS variables |
| RAF | requestAnimationFrame - Browser API for smooth animations |
| CSS Variable | Custom properties set by drivers, read by CSS |

---

## Hot Module Replacement

HMR propagates changes instantly without full page reload. Different component types have different HMR behaviors.

### HMR by Component Type

| Component Type | HMR Behavior | State Preserved |
|----------------|--------------|-----------------|
| Widget | Fast refresh, component remounts | No |
| Section | Fast refresh, parent remounts | No |
| Behaviour | Hot reload, driver re-registers | Partial |
| Driver | Full reload required | No |
| Trigger | Hot reload, hook re-executes | No |
| CSS/Styles | Instant update, no remount | Yes |
| Schema | Fast refresh if types unchanged | Yes |

### HMR Best Practices

| Practice | Why |
|----------|-----|
| Keep components small | Faster HMR, less state to restore |
| Separate CSS from logic | CSS updates are instant |
| Use stable refs | Reduces unnecessary re-registration |
| Export named components | Better HMR tracking |

### HMR Troubleshooting

| Symptom | Cause | Fix |
|---------|-------|-----|
| Full page reload | Anonymous default export | Use named function components |
| State lost | Component boundary changed | Check parent component for changes |
| Styles not updating | CSS import missing | Verify CSS is imported |
| Animation stuck | Driver not re-registered | Add stable key to BehaviourWrapper |

---

## Debugging CSS Variables

CSS variables are the bridge between drivers and visual output. Inspect them to verify animation state.

### Inspecting in DevTools

1. Open Elements panel
2. Select element wrapped by BehaviourWrapper
3. Look for `style` attribute with `--prefixed` properties
4. Check Computed tab for resolved values

### CSS Variable Inspection Points

| Layer | What to Check | Location |
|-------|---------------|----------|
| Driver output | `--section-y`, `--section-opacity` | Element inline style |
| Behaviour contract | All `--prefixed` values from compute() | BehaviourWrapper element |
| CSS consumption | `var()` usage and fallbacks | Computed styles |
| Cascade | Which value wins | Styles panel cascade view |

### Debug CSS Variables in Browser

```javascript
// Console: Get all CSS variables on an element
function getCSSVars(selector) {
  const el = document.querySelector(selector);
  const style = getComputedStyle(el);
  const vars = {};
  for (const name of el.style) {
    if (name.startsWith('--')) {
      vars[name] = el.style.getPropertyValue(name);
    }
  }
  return vars;
}

// Usage
getCSSVars('[data-section-id="hero"]');
```

### Common CSS Variable Issues

| Issue | Symptom | Debug Step |
|-------|---------|------------|
| Variable not set | Fallback value used | Check driver.register() called |
| Wrong value | Unexpected animation | Log compute() output |
| Not updating | Animation frozen | Verify driver tick loop running |
| Cascade conflict | Wrong source wins | Check style specificity |

---

## React DevTools

React DevTools help identify rendering issues and verify memoization.

### Component Tree Inspection

| Check | How | Purpose |
|-------|-----|---------|
| Props | Click component | Verify data flow |
| Hooks | Expand hooks section | Check state/effects |
| Profiler | Use Profiler tab | Measure render timing |
| Highlight updates | Settings > Highlight updates | Visualize re-renders |

### Checking Memoization

| Scenario | Expected | Action if Failing |
|----------|----------|-------------------|
| useMemo dependency | No recalculation on unrelated change | Review dependency array |
| useCallback dependency | Same function reference | Check closure values |
| React.memo component | No re-render on same props | Verify prop stability |
| forwardRef component | Ref stable across renders | Check parent re-renders |

### Profiler Analysis

1. Open React DevTools Profiler tab
2. Click Record
3. Interact with page
4. Stop recording
5. Analyze commit chart

| Metric | Healthy | Investigate |
|--------|---------|-------------|
| Commit duration | < 16ms | > 16ms |
| Components rendered | Few | Many on scroll |
| Render reason | Props changed | Parent re-rendered |

---

## Browser DevTools

Browser DevTools provide low-level performance and animation inspection.

### Performance Panel

| Task | Steps | What to Look For |
|------|-------|------------------|
| Record timeline | Cmd+Shift+E, interact, stop | Long frames (> 16ms) |
| Analyze frames | Expand frame | JS vs Layout vs Paint |
| Find jank | Look for red triangles | Dropped frames |
| CPU throttling | Settings > CPU: 4x slowdown | Amplify bottlenecks |

### Animation Panel

| Feature | Purpose | Access |
|---------|---------|--------|
| Animation timeline | Visualize keyframes | More tools > Animations |
| Playback controls | Slow motion, pause | Animation panel controls |
| Bezier editor | Modify easing | Click on timing function |

### Performance Bottleneck Identification

| Bottleneck | DevTools Indicator | Solution |
|------------|-------------------|----------|
| Layout thrashing | Purple bars (Layout) | Batch reads before writes |
| Paint storms | Green bars (Paint) | Add will-change, reduce area |
| JS blocking | Yellow bars (Scripting) | Defer work, use worker |
| GC pauses | Saw-tooth memory | Reduce allocations |

---

## Debug Mode

Engine debug mode exposes internal state for development.

### Enabling Debug Mode

```typescript
// site/config.ts
export const siteConfig = {
  debug: process.env.NODE_ENV === 'development',
  // ...
}
```

### Debug Mode Features

| Feature | What It Shows | Use Case |
|---------|---------------|----------|
| State overlay | Current store values | Verify state updates |
| CSS variable log | All variables per frame | Track animation values |
| Section indicators | Section boundaries + IDs | Visual section mapping |
| Trigger events | Event timeline | Debug event flow |
| Driver status | Registered targets | Verify registration |

### Debug Overlay Implementation

```typescript
// Example debug overlay component
export function DebugOverlay({ enabled }: { enabled: boolean }) {
  const state = useStore();

  if (!enabled) return null;

  return (
    <div className="fixed bottom-4 left-4 bg-black/80 text-white p-4 font-mono text-xs z-[9999]">
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </div>
  );
}
```

### Debug Data Attributes

| Attribute | Purpose | Added By |
|-----------|---------|----------|
| `data-section-id` | Section identifier | SectionRenderer |
| `data-section-index` | Section position | SectionRenderer |
| `data-behaviour` | Active behaviour | BehaviourWrapper |
| `data-widget-type` | Widget type name | WidgetRenderer |
| `data-debug-vars` | CSS variables JSON | Debug mode only |

---

## Profiling Behaviours

Behaviours run compute() every frame. Slow compute functions cause animation jank.

### Identify Slow Behaviours

```typescript
// Wrap compute for profiling
function profileCompute(behaviour: Behaviour): Behaviour {
  return {
    ...behaviour,
    compute: (state, options) => {
      const start = performance.now();
      const result = behaviour.compute(state, options);
      const duration = performance.now() - start;

      if (duration > 1) {
        console.warn(`Slow compute: ${behaviour.id} took ${duration.toFixed(2)}ms`);
      }

      return result;
    }
  };
}
```

### Behaviour Performance Targets

| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| compute() time | < 0.5ms | > 1ms | > 5ms |
| Allocations | 0 objects | Any object | Arrays/objects per frame |
| DOM reads | 0 | Any | Multiple per frame |

### Common Behaviour Performance Issues

| Issue | Symptom | Fix |
|-------|---------|-----|
| Object allocation | GC pauses | Reuse objects, avoid spread |
| Complex math | Long compute | Pre-calculate constants |
| Array operations | Slow iteration | Use typed arrays |
| String concatenation | Memory growth | Template literals outside loop |

### Optimizing compute()

```typescript
// BAD: Allocates every frame
compute: (state) => ({
  '--y': state.scrollProgress * 100,
  '--opacity': 1 - state.scrollProgress
})

// GOOD: Reuse result object
const result = { '--y': 0, '--opacity': 1 };
compute: (state) => {
  result['--y'] = state.scrollProgress * 100;
  result['--opacity'] = 1 - state.scrollProgress;
  return result;
}
```

---

## Profiling Renders

React reconciliation should not run during scroll. Profile to find unnecessary re-renders.

### React Profiler Setup

```tsx
import { Profiler } from 'react';

function onRender(
  id: string,
  phase: 'mount' | 'update',
  actualDuration: number
) {
  if (phase === 'update' && actualDuration > 1) {
    console.warn(`Slow update: ${id} took ${actualDuration.toFixed(2)}ms`);
  }
}

<Profiler id="SectionRenderer" onRender={onRender}>
  <SectionRenderer section={section} />
</Profiler>
```

### Finding Unnecessary Re-renders

| Method | How | Identifies |
|--------|-----|------------|
| Why Did You Render | npm package | Prop changes that trigger re-render |
| React DevTools | Highlight updates setting | Visual re-render indication |
| Console logging | useEffect with empty deps | Component remounts |
| Profiler commits | Flamegraph view | Component render counts |

### Re-render Targets

| Component | Expected Re-renders | Investigate If |
|-----------|-------------------|----------------|
| Widgets | Mount only | Any during scroll |
| Sections | Mount only | Any during scroll |
| BehaviourWrapper | Mount + behaviour change | During animation |
| Chrome | Mount + route change | During scroll |

---

## Storybook Integration

Develop and test components in isolation before integration.

### Story Structure

```
creativeshire/content/widgets/primitives/{Name}/
├── index.tsx
├── types.ts
├── styles.css
└── {Name}.stories.tsx    # Co-located stories
```

### Story Template

```tsx
// widgets/primitives/VideoGrid/VideoGrid.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import VideoGridWidget from './index';

const meta: Meta<typeof VideoGridWidget> = {
  title: 'Widgets/Content/VideoGrid',
  component: VideoGridWidget,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof VideoGridWidget>;

export const Default: Story = {
  args: {
    items: [
      { id: '1', src: '/video1.mp4', thumbnail: '/thumb1.jpg' },
      { id: '2', src: '/video2.mp4', thumbnail: '/thumb2.jpg' },
    ],
  },
};

export const WithBehaviour: Story = {
  decorators: [
    (Story) => (
      <MockDriverProvider>
        <MockBehaviourWrapper behaviour="fade-in">
          <Story />
        </MockBehaviourWrapper>
      </MockDriverProvider>
    ),
  ],
};
```

### Testing with Behaviours

| Scenario | Approach |
|----------|----------|
| Static widget | Render without wrapper |
| With CSS variables | Mock driver setting variables |
| With animation | Use mock trigger that advances time |
| Responsive | Use viewport addon |

---

## Local vs Production

Differences between development and production environments.

### Environment Differences

| Aspect | Development | Production |
|--------|-------------|------------|
| Debug mode | Enabled | Disabled |
| Source maps | Inline | Separate/none |
| React mode | Development | Production |
| CSS | Unminified | Minified |
| HMR | Enabled | N/A |
| Error overlay | Visible | Hidden |

### Production-Only Issues

| Issue | Why Production Only | How to Debug |
|-------|--------------------| -------------|
| Missing CSS | Tree shaking removed | Check imports, use safelist |
| Animation jank | No React DevTools overhead | Use production profiling |
| Hydration mismatch | SSR differences | Compare server/client output |
| Missing behavior | Dead code elimination | Check exports are used |

### Simulating Production Locally

```bash
# Build and serve production bundle
npm run build
npm run start

# Or use production mode in dev
NODE_ENV=production npm run dev
```

---

## Common Issues

Debugging guide for frequently encountered problems.

### Animation Not Working

| Symptom | Check | Fix |
|---------|-------|-----|
| Element not moving | Is behaviour registered? | Verify BehaviourWrapper mounts |
| Variables not updating | Is driver ticking? | Check RAF loop running |
| Wrong values | Is compute correct? | Log compute output |
| CSS not responding | Is var() used? | Check CSS references variable |

### Performance Issues

| Symptom | Check | Fix |
|---------|-------|-----|
| Janky scroll | Are widgets re-rendering? | Profile with React DevTools |
| Memory growth | Allocations in compute? | Use object reuse pattern |
| CPU spike | Complex calculations? | Pre-compute constants |
| Paint storms | Large paint areas? | Add will-change, reduce area |

### State Issues

| Symptom | Check | Fix |
|---------|-------|-----|
| State not updating | Is trigger firing? | Add logging to trigger |
| Wrong section active | Is intersection correct? | Check threshold values |
| Stale closures | Dependencies correct? | Review useCallback deps |
| Race conditions | Multiple state sources? | Consolidate to single store |

### Build Issues

| Symptom | Check | Fix |
|---------|-------|-----|
| Missing component | Is it exported? | Check barrel exports |
| Type errors | Schema mismatch? | Verify type definitions |
| CSS not applied | Import present? | Add CSS import |
| SSR hydration | Client-only code? | Add "use client" directive |

---

## Rules

### Must

1. Enable debug mode only in development
2. Profile before optimizing
3. Use passive event listeners for scroll
4. Test in production build before deploying
5. Check performance on low-end devices
6. Add data attributes for debug inspection
7. Use browser profiler for animation issues
8. Verify HMR works for changed component

### Must Not

1. Leave console.log in production code
2. Profile in development mode only
3. Ignore memory warnings
4. Ship with debug overlays enabled
5. Assume HMR preserves all state
6. Skip production testing
7. Ignore hydration mismatches
8. Profile with DevTools open (affects results)

---

## Templates

### Debug Utility: CSS Variable Logger

```typescript
// lib/debug/css-var-logger.ts
export function createCSSVarLogger(enabled: boolean) {
  if (!enabled) return { log: () => {}, table: () => {} };

  const getVars = (el: HTMLElement) => {
    const vars: Record<string, string> = {};
    for (const name of Array.from(el.style)) {
      if (name.startsWith('--')) vars[name] = el.style.getPropertyValue(name);
    }
    return vars;
  };

  return {
    log: (el: HTMLElement, label: string) => console.log(`[CSS Vars] ${label}:`, getVars(el)),
    table: (el: HTMLElement) => console.table(getVars(el))
  };
}
```

### Debug Utility: Behaviour Profiler

```typescript
// lib/debug/behaviour-profiler.ts
// Wraps behaviours to track compute() duration. Call printReport() for results.
export function createBehaviourProfiler() {
  const profiles = new Map<string, number[]>();

  return {
    wrap: <T extends Behaviour>(b: T): T => {
      const durations: number[] = [];
      profiles.set(b.id, durations);
      return { ...b, compute: (s, o) => {
        const start = performance.now();
        const result = b.compute(s, o);
        durations.push(performance.now() - start);
        return result;
      }} as T;
    },
    getReport: () => Array.from(profiles.entries()).map(([id, d]) => ({
      behaviourId: id, avgDuration: d.reduce((a, b) => a + b, 0) / d.length,
      maxDuration: Math.max(...d), callCount: d.length
    })),
    printReport() { console.table(this.getReport()); },
    reset() { profiles.clear(); }
  };
}
```

### Debug Utility: Render Counter

```typescript
// lib/debug/render-counter.ts - Hook to log component render count
export function useRenderCount(componentName: string) {
  const count = useRef(0);
  useEffect(() => { count.current += 1; console.log(`[Render] ${componentName}: ${count.current}`); });
  return count.current;
}
```

### Debug Component: State Inspector

```tsx
// components/debug/StateInspector.tsx
// Fixed-position overlay showing Zustand store state in real-time
// Props: store (with getState/subscribe), position ('top-left'|'top-right'|'bottom-left'|'bottom-right')
// Renders minimizable JSON view of current store state
```

---

## See Also

- [Behaviour Spec](../components/experience/behaviour.spec.md) - Behaviour compute function requirements
- [Driver Spec](../components/experience/driver.spec.md) - Driver lifecycle and animation loop
- [Tech Stack](./tech-stack.spec.md) - Development dependencies
- [Folder Structure](./folders.spec.md) - Where debug utilities live
