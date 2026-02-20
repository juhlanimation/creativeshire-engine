# File Patterns Reference

> Standard file organization for each Creativeshire component type.

---

## Content Widget

Content widgets hold actual content (text, images, video). They are leaf nodes in the widget tree.

### Folder Structure

```
engine/content/widgets/primitives/{WidgetName}/
├── index.tsx           # React component
├── types.ts            # Props interface
├── styles.css          # CSS with var() mappings (optional)
└── behaviours.ts       # Widget-specific behaviours (optional)
```

### File Purposes

| File | Purpose | Required |
|------|---------|----------|
| `index.tsx` | React component with forwardRef pattern | Yes |
| `types.ts` | Props interface and handle interface | Yes |
| `styles.css` | CSS variables for L2 integration | No |
| `behaviours.ts` | Widget-specific behaviour definitions | No |

### Example: index.tsx

```tsx
"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import type { VideoGalleryWidgetProps, VideoGalleryHandle } from "./types";

const VideoGalleryWidget = forwardRef<VideoGalleryHandle, VideoGalleryWidgetProps>(
  function VideoGalleryWidget({ items, activated = true }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      setVideosPlaying: (playing: boolean) => {
        // Implementation
      },
    }));

    return (
      <div ref={containerRef} className="w-full h-full">
        {/* Widget content */}
      </div>
    );
  }
);

export default VideoGalleryWidget;
```

### Example: types.ts

```tsx
export interface VideoGalleryWidgetProps {
  items: VideoGalleryItem[];
  gap?: number;
  activated?: boolean;
}

export interface VideoGalleryHandle {
  setVideosPlaying: (playing: boolean) => void;
}
```

---

## Layout Widget

Layout widgets are containers that hold other widgets. They accept children and control arrangement.

### Folder Structure

```
engine/content/widgets/layout/{WidgetName}/
├── index.tsx           # React component (accepts children)
└── types.ts            # Props interface
```

### File Purposes

| File | Purpose | Required |
|------|---------|----------|
| `index.tsx` | Container component with children slot | Yes |
| `types.ts` | Props interface extending `{ children: ReactNode }` | Yes |

### Example: index.tsx

```tsx
"use client";

import type { FlexWidgetProps } from "./types";

export function FlexWidget({
  children,
  direction = "row",
  gap = 0,
  align = "center",
  justify = "start",
}: FlexWidgetProps) {
  return (
    <div
      className="flex"
      style={{
        flexDirection: direction,
        gap: `${gap}px`,
        alignItems: align,
        justifyContent: justify,
      }}
    >
      {children}
    </div>
  );
}

export default FlexWidget;
```

### Example: types.ts

```tsx
import { ReactNode } from "react";

export interface FlexWidgetProps {
  children: ReactNode;
  direction?: "row" | "column";
  gap?: number;
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between" | "around";
}
```

---

## Widget Composite

Widget composites are factory functions that expand into a WidgetSchema tree. Use inside sections.

### Folder Structure

```
engine/content/widgets/composite/{CompositeName}/
├── index.ts            # Factory function: createXxx(props) → WidgetSchema
└── types.ts            # Props interface
```

### File Purposes

| File | Purpose | Required |
|------|---------|----------|
| `index.ts` | Factory function returning WidgetSchema | Yes |
| `types.ts` | Props interface for the factory | Yes |

### Example: index.ts

```ts
import type { WidgetSchema } from "@/engine/schema/widget";
import type { ProjectCardProps } from "./types";

export function createProjectCard(props: ProjectCardProps): WidgetSchema {
  return {
    type: "Flex",
    props: { direction: "column", gap: 16 },
    widgets: [
      {
        type: "Image",
        props: { src: props.thumbnail, alt: props.title },
      },
      {
        type: "Text",
        props: { content: props.title, variant: "h3" },
      },
      {
        type: "Text",
        props: { content: props.description, variant: "body" },
      },
    ],
  };
}
```

### Example: types.ts

```ts
export interface ProjectCardProps {
  title: string;
  description: string;
  thumbnail: string;
  link?: string;
}
```

---

## Section Pattern

Section patterns are factory functions that expand into a full SectionSchema. Use at page level.

### Folder Structure

```
engine/content/sections/patterns/{PatternName}/
├── index.ts            # Factory function: createXxxSection(props) → SectionSchema
├── types.ts            # Props interface
└── variants.ts         # Predefined configurations (optional)
```

### File Purposes

| File | Purpose | Required |
|------|---------|----------|
| `index.ts` | Factory function returning SectionSchema | Yes |
| `types.ts` | Props interface for the factory | Yes |
| `variants.ts` | Predefined variant configurations | No |

### Example: index.ts

```ts
import type { SectionSchema } from "@/engine/schema/section";
import type { HeroProps } from "./types";

export function createHeroSection(props: HeroProps): SectionSchema {
  return {
    id: props.id ?? "hero",
    label: props.label ?? "Hero",
    behaviour: props.behaviour ?? "stack",
    widgets: [
      {
        type: "Stack",
        props: { align: "center", justify: "center" },
        widgets: [
          {
            type: "Text",
            props: { content: props.heading, variant: "h1" },
          },
          {
            type: "Text",
            props: { content: props.subheading, variant: "body" },
          },
        ],
      },
    ],
    features: {
      background: props.background,
    },
  };
}
```

### Example: types.ts

```ts
import type { BackgroundFeature } from "@/engine/schema/features";

export interface HeroProps {
  id?: string;
  label?: string;
  heading: string;
  subheading?: string;
  background?: BackgroundFeature;
  behaviour?: string;
}
```

### Example: variants.ts

```ts
import type { HeroProps } from "./types";

export const centeredHero: Partial<HeroProps> = {
  behaviour: "stack",
};

export const splitHero: Partial<HeroProps> = {
  behaviour: "fade",
};

export const videoBgHero: Partial<HeroProps> = {
  behaviour: "static",
};
```

---

## Behaviour

Behaviours are React wrapper components that apply extrinsic sizing and animation effects.

### Folder Structure

```
engine/experience/behaviours/section/{behaviour-name}/
├── index.ts                    # Barrel export
└── {behaviour-name}.behaviour.tsx   # Behaviour implementation
```

### File Purposes

| File | Purpose | Required |
|------|---------|----------|
| `index.ts` | Barrel export for the behaviour | Yes |
| `{name}.behaviour.tsx` | React component wrapping children | Yes |

### Example: index.ts

```ts
export { StackBehaviour } from "./stack.behaviour";
```

### Example: stack.behaviour.tsx

```tsx
"use client";

import { useEffect, useMemo } from "react";
import { useExperience } from "@/engine/experience";
import type { SectionBehaviourProps } from "../../behaviour.types";

export function StackBehaviour({
  children,
  index,
  id,
  brandColor,
  label,
  className = "",
}: SectionBehaviourProps) {
  const { activeIndex, progress, registerSection, unregisterSection } =
    useExperience();

  useEffect(() => {
    registerSection?.({ id, index });
    return () => unregisterSection?.(id);
  }, [id, index, registerSection, unregisterSection]);

  const { yPos, zIndex, opacity } = useMemo(() => {
    const relativePos = index - activeIndex - progress;
    return {
      yPos: relativePos * 50,
      zIndex: 1000 - index,
      opacity: Math.max(0, 1 - Math.abs(relativePos) * 0.5),
    };
  }, [index, activeIndex, progress]);

  return (
    <div
      className={`absolute inset-0 w-full h-screen ${className}`}
      style={{
        transform: `translateY(${yPos}vh)`,
        zIndex,
        opacity,
        willChange: "transform, opacity",
      }}
      data-section-id={id}
      data-section-index={index}
    >
      {children}
    </div>
  );
}
```

---

## Preset

Presets assemble experience, behaviours, and chrome into a complete page configuration.

### Folder Structure

```
engine/presets/{preset-name}/
├── index.ts                        # Barrel export
└── {preset-name}.preset.tsx        # Preset component
```

### File Purposes

| File | Purpose | Required |
|------|---------|----------|
| `index.ts` | Barrel export with types | Yes |
| `{name}.preset.tsx` | Preset component assembling layers | Yes |

### Example: index.ts

```ts
export { InfiniteCarouselPreset } from "./infinite-carousel.preset";
export type { InfiniteCarouselPresetProps } from "./infinite-carousel.preset";
```

### Example: infinite-carousel.preset.tsx

```tsx
"use client";

import { InfiniteCarouselExperience } from "@/engine/experience/experiences/infinite-carousel";
import { StackBehaviour } from "@/engine/experience/behaviours/section/stack";
import { NavTimelineChrome } from "@/engine/content/chrome/regions";
import type { Section } from "@/types/section";

export interface InfiniteCarouselPresetProps {
  sections: Section[];
  initialSectionIndex?: number;
  scrollMultiplier?: number;
  showDevPanel?: boolean;
}

export function InfiniteCarouselPreset({
  sections,
  initialSectionIndex = 0,
  scrollMultiplier = 1,
  showDevPanel = false,
}: InfiniteCarouselPresetProps) {
  return (
    <InfiniteCarouselExperience
      totalSections={sections.length}
      initialSectionIndex={initialSectionIndex}
      scrollMultiplier={scrollMultiplier}
    >
      {/* Section rendering with behaviours */}
      {sections.map((section, index) => (
        <StackBehaviour
          key={section.id}
          index={index}
          id={section.id}
          label={section.label}
        >
          {/* Section content */}
        </StackBehaviour>
      ))}

      {/* Chrome layer */}
      <NavTimelineChrome sections={sections} />
    </InfiniteCarouselExperience>
  );
}
```

---

## Site Page (App Router)

Site pages use the catch-all route pattern to render schema-driven pages.

### Folder Structure

```
app/
├── layout.tsx                  # Root layout with providers
├── globals.css                 # Global styles
└── [[...slug]]/
    └── page.tsx                # Catch-all route
```

### File Purposes

| File | Purpose | Required |
|------|---------|----------|
| `layout.tsx` | Root layout with global providers | Yes |
| `globals.css` | Global styles and CSS reset | Yes |
| `[[...slug]]/page.tsx` | Dynamic route matching all paths | Yes |

### Example: layout.tsx

```tsx
import type { Metadata } from "next";
import { GeistSans, GeistMono } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "Site Title",
  description: "Site description",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${GeistSans.variable} ${GeistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
```

### Example: [[...slug]]/page.tsx

```tsx
import { SiteRenderer } from "@/engine/renderer";
import { getSiteData } from "@/data/site";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export default async function Page({ params }: PageProps) {
  const { slug = [] } = await params;
  const path = "/" + slug.join("/");
  const site = await getSiteData();

  return <SiteRenderer site={site} currentPath={path} />;
}
```

---

## Chrome Component

Chrome components provide persistent UI that remains across page transitions.

### Folder Structure

```
engine/content/chrome/
├── Chrome.tsx                  # Chrome orchestrator
├── types.ts                    # ChromeSchema, RegionSchema
├── regions/                    # Fixed position components
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Sidebar.tsx
└── overlays/                   # Floating UI components
    ├── Cursor.tsx
    ├── Loader.tsx
    └── ModalContainer.tsx
```

### File Purposes

| File | Purpose | Required |
|------|---------|----------|
| `Chrome.tsx` | Orchestrates regions and overlays | Yes |
| `types.ts` | Schema interfaces | Yes |
| `regions/*.tsx` | Fixed position UI components | No |
| `overlays/*.tsx` | Floating/modal UI components | No |

---

## Naming Conventions

Components use **folder-based organization** with `index.tsx` entry points:

| Component Type | Folder Pattern | Entry File | Example Path |
|----------------|----------------|------------|--------------|
| Content Widget | `widgets/primitives/{Name}/` | `index.tsx` | `widgets/primitives/VideoGallery/index.tsx` |
| Layout Widget | `widgets/layout/{Name}/` | `index.tsx` | `widgets/layout/Flex/index.tsx` |
| Widget Composite | `widgets/composite/{Name}/` | `index.ts` | `widgets/composite/ProjectCard/index.ts` |
| Section Pattern | `sections/patterns/{Name}/` | `index.ts` | `sections/patterns/Hero/index.ts` |
| Behaviour | `behaviours/{name}/` | `index.ts` | `behaviours/depth-layer/index.ts` |
| Mode | `modes/{name}/` | `index.ts` | `modes/parallax/index.ts` |
| Preset | `presets/{name}/` | `index.ts` | `presets/showcase/index.ts` |
| Chrome Pattern | `chrome/patterns/{Name}/` | `index.ts` | `chrome/patterns/FixedNav/index.ts` |
| Chrome Overlay | `chrome/overlays/{Name}/` | `index.tsx` | `chrome/overlays/Modal/index.tsx` |
| Driver | `drivers/` | `{Name}Driver.ts` | `drivers/ScrollDriver.ts` |
| Trigger | `triggers/` | `use{Name}.ts` | `triggers/useScrollProgress.ts` |

**Key conventions:**
- Widget/behaviour folders: kebab-case for behaviours (`depth-layer`), PascalCase for widgets (`VideoGallery`)
- Entry files: `index.tsx` for React components, `index.ts` for pure TypeScript
- Chrome files: Direct `.tsx` files in `regions/` or `overlays/` folders
- Drivers/Triggers: Suffixed files directly in their folders

---

## See Also

- [Folder Structure](./folders.spec.md) - Complete directory layout
- [Contracts](../core/contracts.spec.md) - Layer boundaries and rules
- [Table of Contents](../index.spec.md) - Full documentation index
