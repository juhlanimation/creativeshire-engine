# Architecture Diagrams

> Visual reference for Creativeshire architecture concepts.

---

## Table of Contents

- [System Overview](#system-overview)
  - [Complete System](#complete-system)
  - [Main Architecture Flow](#main-architecture-flow)
- [Presets and Configuration](#presets-and-configuration)
  - [Preset to Site to Render Flow](#preset-to-site-to-render-flow)
  - [Preset Structure](#preset-structure)
- [Experience Layer](#experience-layer)
  - [Mode and Behaviour Resolution](#mode-and-behaviour-resolution)
  - [Driver Pattern](#driver-pattern)
  - [Intrinsic vs Extrinsic Sizing](#intrinsic-vs-extrinsic-sizing)
  - [Behaviour Structure](#behaviour-structure)
  - [Mode Definition Structure](#mode-definition-structure)
- [Content Layer](#content-layer)
  - [Content Hierarchy](#content-hierarchy)
  - [The Frame Pattern](#the-frame-pattern)
- [Rendering](#rendering)
  - [The Contract](#the-contract)
  - [Widget Renderer](#widget-renderer)
  - [Section Renderer](#section-renderer)
  - [Chrome Resolution](#chrome-resolution)
- [Quick Reference](#quick-reference)
- [See Also](#see-also)

---

## System Overview

### Complete System

The complete Creativeshire system showing the CMS engine, site instance, and Next.js routing integration.

```mermaid
flowchart TB
    subgraph Engine["creativeshire/ (CMS ENGINE)"]
        direction TB

        Schema["schema/
        Interfaces & Types"]

        subgraph L1["content/ (LAYER 1)"]
            Widgets["widgets/
            content/ layout/ composite/"]
            Sections["sections/
            patterns/"]
            Chrome["chrome/
            regions/ overlays/"]
        end

        subgraph L2["experience/ (LAYER 2)"]
            Modes["modes/
            static/ parallax/ reveal/
            slideshow/ cinematic/"]
            Behaviours["behaviours/
            BehaviourWrapper.tsx"]
            Drivers["drivers/"]
            Triggers["triggers/"]
        end

        Renderer["renderer/
        Site / Page / Section / Widget"]

        subgraph Presets["presets/ (STARTING POINTS)"]
            P1["starter/"]
            P2["showcase/"]
            P3["editorial/"]
            P4["immersive/"]
        end
    end

    subgraph Site["site/ (INSTANCE DATA)"]
        SC["config.ts"]
        SP["pages/"]
        SCH["chrome/"]
        SD["data/"]
    end

    subgraph App["app/ (ROUTING)"]
        A1["layout.tsx"]
        A2["page.tsx"]
        A3["[routes]/"]
    end

    Presets --> |"extends"| Site
    L1 --> |"primitives"| Renderer
    L2 --> |"animation"| Renderer
    Schema --> |"types"| Site
    Site --> |"consumed by"| Renderer
    Renderer --> |"renders"| App
```

---

### Main Architecture Flow

The complete data flow from schema definitions through rendering to final visual output.

```mermaid
flowchart TB
    subgraph Schema["SCHEMA"]
        SiteSchema[Site Schema]
        PageSchema[Page Schema]
        SectionSchema[Section Schema]
        WidgetSchema[Widget Schema]
    end

    subgraph Content["CONTENT LAYER (L1)"]
        subgraph ChromeC["Chrome"]
            Regions[Regions]
            Overlays[Overlays]
        end

        subgraph WidgetsC["Widgets"]
            ContentWidgets["Content Widgets
            Text, Image, Video, Button"]
            LayoutWidgets["Layout Widgets
            Flex, Grid, Stack, Carousel"]
            CompositeWidgets["Widget Composites
            ProjectCard, Testimonial"]
        end

        SectionComposites["Section Patterns
        Hero, Gallery, Showreel"]
    end

    subgraph Experience["EXPERIENCE LAYER (L2)"]
        ModesE["Modes
        static | parallax | reveal
        slideshow | cinematic"]

        subgraph TriggersE["Triggers"]
            ScrollTrigger[scroll-progress]
            IntersectionTrigger[intersection]
            CursorTrigger[cursor]
        end

        Store[(Zustand Store
        scrollProgress
        sectionProgress
        visibility)]

        BehavioursE["Behaviours
        scroll-stack
        depth-layer
        mask-reveal
        fade-on-scroll"]

        BehaviourWrapper["BehaviourWrapper
        (ONE generic component)"]
    end

    subgraph Driver["DRIVER"]
        DriverEngine["Driver Engine
        ScrollDriver | GSAPDriver"]

        Compute["behaviour.compute()
        (state, options) => CSSVariables"]

        DOMUpdate["Direct DOM Update
        element.style.setProperty()"]
    end

    subgraph Renderers["RENDERERS"]
        SiteRenderer[SiteRenderer]
        PageRenderer[PageRenderer]
        SectionRenderer[SectionRenderer]
        WidgetRenderer[WidgetRenderer]
    end

    subgraph Output["OUTPUT"]
        DOM["DOM Structure
        + data-behaviour attrs
        + refs registered"]

        CSS["CSS
        var(--y, 0)
        var(--opacity, 1)"]

        Visual[Visual Result]
    end

    %% Schema to Renderers
    SiteSchema --> SiteRenderer
    PageSchema --> PageRenderer
    SectionSchema --> SectionRenderer
    WidgetSchema --> WidgetRenderer

    %% Renderer hierarchy
    SiteRenderer --> PageRenderer
    PageRenderer --> SectionRenderer
    SectionRenderer --> WidgetRenderer
    WidgetRenderer -->|recursive| WidgetRenderer

    %% Content to Output
    Renderers --> DOM
    WidgetsC --> DOM
    BehaviourWrapper --> DOM

    %% Experience Flow
    ModesE --> Store
    ModesE -->|"defaults"| BehavioursE
    TriggersE --> Store
    Store --> DriverEngine
    DriverEngine --> Compute
    BehavioursE --> Compute
    Compute --> DOMUpdate
    DOMUpdate --> CSS

    %% Output
    DOM --> Visual
    CSS --> Visual

    %% Separation
    Content -.->|"separate concerns"| Experience
```

---

## Presets and Configuration

### Preset to Site to Render Flow

How presets are extended by site data and consumed by renderers.

```mermaid
flowchart TB
    subgraph Presets["creativeshire/presets/"]
        Showcase["showcase/
        experience: { mode: 'parallax' }
        chrome: { header, footer }
        pages: { home, about }
        behaviours: { Image: 'depth-layer' }"]
    end

    subgraph Site["site/"]
        Config["config.ts
        { ...showcasePreset, mode: 'reveal' }"]

        Pages["pages/
        home.ts, about.ts, work.ts"]

        Data["data/
        projects.ts, testimonials.ts"]
    end

    subgraph Renderer["creativeshire/renderer/"]
        SR["SiteRenderer"]
        PR["PageRenderer"]
        SecR["SectionRenderer"]
        WR["WidgetRenderer"]
    end

    subgraph App["app/"]
        Route["page.tsx
        <SiteRenderer site={config} page={home} />"]
    end

    Presets -->|"extends"| Config
    Config --> SR
    Pages --> PR
    Data --> Pages
    SR --> PR
    PR --> SecR
    SecR --> WR
    Renderer --> Route
```

---

### Preset Structure

What a preset contains and how sites extend it.

```mermaid
flowchart TB
    subgraph Preset["Preset: showcase"]
        Experience["experience: {
          mode: 'parallax',
          options: { intensity: 60 }
        }"]

        Chrome["chrome: {
          regions: { header, footer },
          overlays: { cursor }
        }"]

        PagesP["pages: {
          home: { sections: [...] },
          about: { sections: [...] }
        }"]

        BehavioursP["behaviours: {
          Image: 'depth-layer',
          Video: 'mask-reveal'
        }"]
    end

    subgraph SiteUses["site/ extends"]
        Config["config.ts
        { ...showcasePreset, mode: 'reveal' }"]

        PageOverride["pages/home.ts
        { ...showcasePreset.pages.home, ... }"]
    end

    Preset --> Config
    Preset --> PageOverride
```

---

## Experience Layer

### Mode and Behaviour Resolution

How behaviours are resolved from mode defaults or explicit overrides.

```mermaid
flowchart TB
    subgraph Mode["Mode (e.g., parallax)"]
        Defaults["defaults: {
          section: 'scroll-stack',
          Image: 'depth-layer',
          Video: 'mask-reveal',
          Text: 'fade-on-scroll',
          Button: 'none'
        }"]
    end

    subgraph Schema["Widget/Section Schema"]
        Explicit["behaviour: 'mask-reveal'"]
        None["behaviour: 'none'"]
        Unset["behaviour: undefined"]
    end

    subgraph Resolution["Resolution"]
        R1{"Explicit 'none'?"}
        R2{"Explicit behaviour?"}
        R3{"Mode default exists?"}
        R4["No behaviour"]
        R5["Use explicit"]
        R6["Use mode default"]
    end

    subgraph Result["Result"]
        Wrap["BehaviourWrapper
        with resolved behaviour"]
        NoWrap["No wrapper"]
    end

    Schema --> R1
    R1 -->|Yes| R4
    R1 -->|No| R2
    R2 -->|Yes| R5
    R2 -->|No| R3
    R3 -->|Yes| R6
    R3 -->|No| R4

    Mode -->|"provides"| R3

    R4 --> NoWrap
    R5 --> Wrap
    R6 --> Wrap
```

---

### Driver Pattern

Contrasts traditional React animation vs the Creativeshire driver pattern.

```mermaid
flowchart LR
    subgraph Traditional["Traditional React Animation"]
        direction TB
        A1[Scroll Event] --> A2[Trigger updates Zustand]
        A2 --> A3[useBehaviour hooks re-run]
        A3 --> A4[All widgets re-render]
        A4 --> A5[React reconciliation]
        A5 --> A6[DOM updates]
        A6 --> A7["50 widgets x 60fps = death"]
    end

    subgraph Creativeshire["Creativeshire Driver Pattern"]
        direction TB
        B1[Scroll Event] --> B2[Driver captures]
        B2 --> B3["behaviour.compute(state, options)"]
        B3 --> B4["Returns CSSVariables
        { '--y': 50, '--opacity': 0.8 }"]
        B4 --> B5["element.style.setProperty()"]
        B5 --> B6["CSS: var(--y, 0)"]
        B6 --> B7["React never knows"]
    end
```

---

### Intrinsic vs Extrinsic Sizing

How content determines size (L1) vs context imposing size (L2).

```mermaid
flowchart LR
    subgraph Intrinsic["INTRINSIC (L1)"]
        direction TB
        I1["Video aspect ratio"]
        I2["Text content flow"]
        I3["Image dimensions"]
        I4["Widget fills container"]
    end

    subgraph Extrinsic["EXTRINSIC (L2)"]
        direction TB
        E1["Section = 100dvh"]
        E2["Scroll positioning"]
        E3["Viewport constraints"]
        E4["Animation transforms"]
    end

    Intrinsic -->|"Content determines"| Size1["Size"]
    Extrinsic -->|"Context imposes"| Size2["Size"]
```

---

### Behaviour Structure

How a behaviour is defined and used at runtime.

```mermaid
flowchart TB
    subgraph Behaviour["Behaviour Definition"]
        ID["id: 'depth-layer'"]
        Requires["requires: ['scrollProgress']"]
        Compute["compute: (state, options) => {
          '--depth-y': state.scrollProgress * options.depth
        }"]
        CSS["cssTemplate: `
          transform: translateY(var(--depth-y));
          will-change: transform;
        `"]
        Options["options: {
          depth: { type: 'range', default: 50 }
        }"]
    end

    subgraph Usage["Usage in Schema"]
        WidgetSchema["widget: {
          type: 'Image',
          behaviour: 'depth-layer',
          behaviourOptions: { depth: 100 }
        }"]
    end

    subgraph Runtime["Runtime"]
        Wrapper["BehaviourWrapper
        registers with driver"]
        DriverR["Driver calls compute()
        on every frame"]
        DOMR["DOM receives
        --depth-y value"]
    end

    Behaviour --> Usage
    Usage --> Wrapper
    Wrapper --> DriverR
    DriverR --> DOMR
```

---

### Mode Definition Structure

What a mode contains and how it is used.

```mermaid
flowchart TB
    subgraph Mode["Mode: parallax"]
        ID["id: 'parallax'"]
        Provides["provides: [
          'scrollProgress',
          'scrollVelocity',
          'sectionProgress'
        ]"]
        Store["createStore: () => zustand({
          scrollProgress: 0,
          ...
        })"]
        TriggersM["triggers: [
          { type: 'scroll-progress' },
          { type: 'intersection' }
        ]"]
        Defaults["defaults: {
          section: 'scroll-stack',
          Image: 'depth-layer',
          Video: 'mask-reveal',
          Text: 'fade-on-scroll'
        }"]
        OptionsM["options: {
          intensity: { type: 'range', default: 50 }
        }"]
    end

    subgraph Used["Used By"]
        Site["site/config.ts
        experience: { mode: 'parallax' }"]
        Preset["presets/showcase
        experience: { mode: 'parallax' }"]
    end

    Mode --> Site
    Mode --> Preset
```

---

## Content Layer

### Content Hierarchy

How content is structured from Site down to nested Widgets.

```mermaid
flowchart TB
    Site["Site"]
    SiteChrome["Chrome (Site Level)"]
    Pages["Pages"]
    Page["Page"]
    PageChrome["Chrome (Page Override)"]
    SectionsH["Sections"]
    Section["Section"]
    WidgetsH["Widgets"]
    Widget["Widget"]
    NestedWidgets["Nested Widgets"]

    Site --> SiteChrome
    Site --> Pages
    Pages --> Page
    Page --> PageChrome
    Page --> SectionsH
    SectionsH --> Section
    Section --> WidgetsH
    WidgetsH --> Widget
    Widget -->|"layout widget"| NestedWidgets
```

---

### The Frame Pattern

How BehaviourWrapper wraps content at any level with the frame pattern.

```mermaid
flowchart TB
    subgraph L2["EXPERIENCE LAYER (L2)"]
        BW1["BehaviourWrapper
        behaviour: 'scroll-stack'
        height: 100dvh
        transform: translateY(var(--y))"]

        BW2["BehaviourWrapper
        behaviour: 'mask-reveal'
        clip-path: inset(...)"]
    end

    subgraph L1["CONTENT LAYER (L1)"]
        Section["Section
        (fills parent)"]

        Widget["Widget
        (fills parent or intrinsic)"]
    end

    BW1 -->|"wraps"| Section
    Section -->|"contains"| BW2
    BW2 -->|"wraps"| Widget
```

**Key:** L2 wrappers impose extrinsic constraints. L1 content fills or sizes intrinsically.

---

## Rendering

### The Contract

The separation of concerns between Schema, React, Driver, and CSS.

```mermaid
flowchart LR
    Schema["Schema
    Declares structure
    + behaviour intent"]

    React["React
    Renders once
    Registers refs
    Sets data-* attrs"]

    Driver["Driver
    Computes every frame
    Sets CSS variables"]

    CSSLayer["CSS
    Maps var() to properties
    Uses fallbacks"]

    Schema --> React
    React --> Driver
    Driver --> CSSLayer
```

---

### Widget Renderer

How the renderer wraps widgets with the generic BehaviourWrapper.

```mermaid
flowchart TB
    Schema["Widget Schema
    { type: 'Video', behaviour: 'mask-reveal' }"]

    Resolve["resolveBehaviour(schema, type, mode)"]

    Check{"Resolved
    behaviour?"}

    Wrap["<BehaviourWrapper behaviour={resolved}>
      <Video {...props} />
    </BehaviourWrapper>"]

    NoWrap["<Video {...props} />"]

    Output["DOM Output"]

    Schema --> Resolve
    Resolve --> Check
    Check -->|Yes| Wrap
    Check -->|No| NoWrap
    Wrap --> Output
    NoWrap --> Output
```

---

### Section Renderer

How sections are wrapped with BehaviourWrapper.

```mermaid
flowchart TB
    subgraph SectionRenderer["Section Renderer"]
        direction TB
        SR1["Read section schema"]
        SR2["Resolve behaviour (default: 'scroll-stack')"]
        SR3["Create section content (L1)"]
        SR4["Wrap with BehaviourWrapper (L2)"]
    end

    subgraph BehaviourWrapperS["BehaviourWrapper"]
        direction TB
        BW1["behaviour: 'scroll-stack'"]
        BW2["height: 100dvh"]
        BW3["transform: translateY(var(--section-y))"]
        BW4["z-index: var(--section-z)"]
    end

    subgraph SectionContent["Section Content (L1)"]
        direction TB
        SC1["Layout (flex/grid)"]
        SC2["Background (feature)"]
        SC3["Widgets"]
    end

    SectionRenderer --> BehaviourWrapperS
    BehaviourWrapperS --> SectionContent
    SectionContent -->|"fills"| BehaviourWrapperS
```

---

### Chrome Resolution

How chrome is resolved between site and page levels.

```mermaid
flowchart TB
    C1{"Page says 'hidden'?"}
    C2{"Page says 'override'?"}
    C3{"Page specifies chrome?"}
    C4["Use site chrome (inherit)"]
    C5["Don't render"]
    C6["Use page chrome"]

    C1 -->|Yes| C5
    C1 -->|No| C2
    C2 -->|Yes| C6
    C2 -->|No| C3
    C3 -->|Yes| C6
    C3 -->|No| C4
```

---

## Quick Reference

### Layer Summary

| Layer | Purpose |
|-------|---------|
| **Schema** | Type definitions |
| **Content (L1)** | What is on the page |
| **Experience (L2)** | How the page feels |
| **Presets** | Full configurations (content + experience) |
| **Site** | Instance data |
| **Renderer** | Schema to Components |

### Key Concepts

| Concept | What it is |
|---------|------------|
| **Mode** | Animation configuration with defaults |
| **Behaviour** | Compute function (state to CSS vars) |
| **BehaviourWrapper** | ONE generic wrapper component |
| **Preset** | Full site starting point |

### The Core Insight

```
React handles structure.
Drivers handle motion.
They don't share style properties.
```

### The Frame Pattern (ASCII)

```
+-- BehaviourWrapper (L2) --+
|   size, clip, position    |  <-- Extrinsic (context-imposed)
|   +-- Content (L1) ----+  |
|   |  fills parent      |  |  <-- Intrinsic (content-based)
|   +--------------------+  |
+---------------------------+
```

### Resolution Flow

```
Schema defines intent
        |
        v
Mode provides defaults
        |
        v
Behaviour computes CSS vars
        |
        v
Driver applies to DOM
        |
        v
CSS maps vars to properties
```

---

## See Also

- [Philosophy](../core/philosophy.spec.md) - Core principles and design rationale
- [Contracts](../core/contracts.spec.md) - Layer boundaries and rules
- [Content Layer](../layers/content.spec.md) - Widgets, sections, chrome
- [Experience Layer](../layers/experience.spec.md) - Modes, behaviours, drivers
- [Preset Layer](../layers/preset.spec.md) - Full site starting points
