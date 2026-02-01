# Anti-Patterns

> Patterns to avoid. Each violates layer separation or causes performance issues.

---

## Anti-Pattern: Scroll Listener in Widget

### Context
Building a widget that animates based on scroll position.

### Problem
Widget imports experience concerns. Breaks layer separation. Widget becomes coupled to scroll state.

### Bad Example
```typescript
// engine/content/widgets/primitives/Image/index.tsx
import { useScrollProgress } from '@/engine/experience/triggers'

export default function Image({ src, alt }: ImageProps) {
  const scrollProgress = useScrollProgress()
  return <img src={src} alt={alt} style={{ transform: `translateY(${scrollProgress * 100}px)` }} />
}
```

### Good Example
```typescript
// engine/content/widgets/primitives/Image/index.tsx
export default function Image({ src, alt }: ImageProps) {
  return <img src={src} alt={alt} className="image-widget" />
}
```
```css
.image-widget { transform: translateY(calc(var(--y, 0) * 1px)); }
```

### Why The Fix Works
Widget renders once. Driver sets `--y`. CSS maps variable to transform. Declare `behaviour: 'depth-layer'` in schema.

---

## Anti-Pattern: Viewport Units in Content

### Context
Ensuring a section fills the viewport.

### Problem
Widget uses `100vh` directly. BehaviourWrapper imposes extrinsic constraints, not the widget.

### Bad Example
```typescript
// engine/content/widgets/primitives/Hero/index.tsx
export default function Hero({ title }: HeroProps) {
  return <div style={{ height: '100vh' }}><h1>{title}</h1></div>
}
```

### Good Example
```typescript
// engine/content/widgets/primitives/Hero/index.tsx
export default function Hero({ title }: HeroProps) {
  return <div className="hero-widget"><h1>{title}</h1></div>
}
```

### Why The Fix Works
Widget sizes to content. BehaviourWrapper applies `height: 100dvh` via cssTemplate.

---

## Anti-Pattern: React State for Animation

### Context
Animating 50 widgets at 60fps.

### Problem
Each scroll triggers state update and re-render. 50 widgets x 60fps = 3,000 renders/second.

### Bad Example
```typescript
// engine/content/sections/Section.tsx
export default function Section({ children }: SectionProps) {
  const [offset, setOffset] = useState(0)
  useEffect(() => {
    const handler = () => setOffset((window.scrollY / document.body.scrollHeight) * 100)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])
  return <div style={{ transform: `translateY(${offset}px)` }}>{children}</div>
}
```

### Good Example
```typescript
// experience/drivers/ScrollDriver.ts
private tick = () => {
  this.targets.forEach(({ element, behaviour, options }) => {
    const vars = behaviour.compute(this.state, options)
    Object.entries(vars).forEach(([key, value]) => element.style.setProperty(key, String(value)))
  })
  requestAnimationFrame(this.tick)
}
```

### Why The Fix Works
Driver bypasses React. `setProperty()` updates CSS variables. No reconciliation. 60fps maintained.

---

## Anti-Pattern: Direct Style in Driver

### Context
Driver applying animation values to element.

### Problem
Driver sets `element.style.transform` directly. Clobbers CSS cascade, overrides hover states.

### Bad Example
```typescript
// experience/drivers/ScrollDriver.ts
private update() {
  this.targets.forEach(({ element, options }) => {
    element.style.transform = `translateY(${this.state.scrollProgress * options.depth}px)`
  })
}
```

### Good Example
```typescript
// experience/drivers/ScrollDriver.ts
private update() {
  this.targets.forEach(({ element, behaviour, options }) => {
    const vars = behaviour.compute(this.state, options)
    Object.entries(vars).forEach(([key, value]) => element.style.setProperty(key, String(value)))
  })
}
```

### Why The Fix Works
CSS variables don't clobber cascade. Driver sets variable. CSS declares transform mapping.

---

## Anti-Pattern: Missing CSS Fallback

### Context
Rendering widget with CSS variables before hydration.

### Problem
CSS variable has no fallback. Before driver registers, variable is undefined. Layout shifts.

### Bad Example
```css
.text-widget {
  transform: translateY(calc(var(--y) * 1px));
  opacity: var(--opacity);
}
```

### Good Example
```css
.text-widget {
  transform: translateY(calc(var(--y, 0) * 1px));
  opacity: var(--opacity, 1);
}
```

### Why The Fix Works
SSR renders with fallback values. Content visible immediately. No layout shift on hydration.

---

## Anti-Pattern: Returning JSX from Composite

### Context
Creating factory function for complex widget combinations.

### Problem
Composite returns JSX element. Renderer expects schema object. Renderer cannot apply behaviours.

### Bad Example
```typescript
// engine/content/widgets/composite/ProjectCard.tsx
export function createProjectCard(project: Project) {
  return (
    <div className="project-card">
      <Image src={project.image} alt={project.title} />
      <Text content={project.title} />
    </div>
  )
}
```

### Good Example
```typescript
// engine/content/widgets/composite/ProjectCard.ts
export function createProjectCard(project: Project): WidgetSchema {
  return {
    type: 'Stack',
    props: { gap: 'md' },
    children: [
      { type: 'Image', props: { src: project.image, alt: project.title } },
      { type: 'Text', props: { content: project.title } }
    ]
  }
}
```

### Why The Fix Works
Composites return data, not elements. Renderer transforms schema to React with BehaviourWrapper.

---

## Anti-Pattern: Importing Experience in Content

### Context
Widget needs scroll-based styling.

### Problem
Content imports from experience directory. Layer boundary violated.

### Bad Example
```typescript
// engine/content/widgets/primitives/Card/index.tsx
import { useExperience } from '@/engine/experience/ExperienceProvider'

export default function Card({ title }: CardProps) {
  const { scrollProgress } = useExperience()
  return <div style={{ opacity: 1 - scrollProgress }}>{title}</div>
}
```

### Good Example
```typescript
// engine/content/widgets/primitives/Card/index.tsx
export default function Card({ title }: CardProps) {
  return <div className="card-widget">{title}</div>
}
```
```css
.card-widget { opacity: var(--opacity, 1); }
```

### Why The Fix Works
Content imports nothing from experience. CSS variables bridge layers. Schema declares behaviour.

---

## Anti-Pattern: Missing Driver Cleanup

### Context
Component unmounts while ScrollTrigger active.

### Problem
ScrollTrigger not killed on unmount. Multiple triggers accumulate. Memory leaks.

### Bad Example
```typescript
// experience/behaviours/BehaviourWrapper.tsx
useEffect(() => {
  const trigger = ScrollTrigger.create({ trigger: ref.current, scrub: true, onUpdate: (self) => {
    const vars = behaviour.compute({ scrollProgress: self.progress }, options)
    Object.entries(vars).forEach(([key, val]) => ref.current.style.setProperty(key, String(val)))
  }})
}, [])
```

### Good Example
```typescript
// experience/behaviours/BehaviourWrapper.tsx
useEffect(() => {
  if (!ref.current || behaviour.id === 'none') return
  const trigger = ScrollTrigger.create({ trigger: ref.current, scrub: true, onUpdate: (self) => {
    const vars = behaviour.compute({ scrollProgress: self.progress }, options)
    Object.entries(vars).forEach(([key, val]) => ref.current.style.setProperty(key, String(val)))
  }})
  return () => trigger.kill()
}, [behaviour.id, options])
```

### Why The Fix Works
Cleanup function runs on unmount. `trigger.kill()` removes ScrollTrigger. No memory leaks.

---

## Quick Reference

| Anti-Pattern | Violation | Fix |
|--------------|-----------|-----|
| Scroll listener in widget | L1 imports L2 | Schema declares behaviour |
| Viewport units in content | Widget uses extrinsic sizing | BehaviourWrapper imposes size |
| React state for animation | 3000 renders/sec | Driver sets CSS variables |
| Direct style in driver | Clobbers CSS cascade | Use `setProperty()` only |
| Missing CSS fallback | Layout shift on hydration | `var(--x, fallback)` |
| JSX from composite | Bypasses renderer | Return schema object |
| Import experience in content | Layer boundary crossed | CSS variables bridge layers |
| Missing driver cleanup | Memory leaks | `return () => trigger.kill()` |

---

## See Also

- [Philosophy](../core/philosophy.spec.md)
- [Widget Contract](../components/content/widget.spec.md)
- [Behaviour Contract](../components/experience/behaviour.spec.md)
- [Driver Contract](../components/experience/driver.spec.md)
