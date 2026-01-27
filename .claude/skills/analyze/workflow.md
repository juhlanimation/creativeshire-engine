# Analyze Workflow

> `/analyze <url>` | `/analyze <path>` | `/analyze "description"`

Analyzes references and creates analysis files mirroring Creativeshire component structure.

## Pre-Flight

```bash
git checkout main && git pull origin main
```

## Workflow

### 1. Get Analysis Name

Ask user for project name → `.claude/analyze/{name}/`

### 2. Page Discovery (Crawl)

Before analyzing, discover all pages on the site.

```
1. Get Chrome tab context
2. Navigate to root URL
3. Extract all internal navigation links
4. Check for sitemap.xml if available
5. Ask user to confirm/add pages
```

**Output:** List of pages to analyze (e.g., `/`, `/about`, `/work`, `/contact`)

### 3. Create Folder Structure

Create the analysis folder structure before spawning agents.

### 4. Run Parallel Agents

See "Mobile-First Agent Strategy" section below for agent prompts and flow.

### 5. Create Analysis Files

Structure mirrors Creativeshire layers exactly:

```
.claude/analyze/{name}/
├── SUMMARY.md
├── assets/
│   ├── {page}-{breakpoint}.gif     # Page exploration GIF per breakpoint
│   └── {component}-{breakpoint}.png # Component screenshot per breakpoint
├── content/
│   ├── widget/                     # Atomic content units
│   ├── widget-composite/           # Widget factory patterns
│   ├── section/                    # Page sections
│   ├── section-composite/          # Section factory patterns
│   ├── chrome/                     # PAGE-SPECIFIC chrome overrides
│   ├── feature/                    # Static styling patterns
│   └── layout-widget/              # Layout patterns (Stack, Grid, etc.)
├── experience/
│   ├── behaviour/                  # Animation functions
│   ├── chrome-behaviour/           # Chrome-specific animations
│   ├── driver/                     # CSS variable applicators
│   ├── mode/                       # Behaviour bundles (parallax, reveal)
│   ├── provider/                   # React context patterns
│   └── trigger/                    # Event handlers (scroll, click)
├── schema/                         # Data structure patterns observed
├── preset/                         # Overall site configuration pattern
└── site/
    ├── chrome/                     # GLOBAL chrome (nav, footer) - site defaults
    ├── pages/                      # Page structure notes
    └── data/                       # Data patterns observed
```

**Chrome placement:**
- `site/chrome/` → Global defaults (same across all pages)
- `content/chrome/` → Page-specific overrides (if any)

Only create folders that have components.

#### Component File Template (with Responsive)

```markdown
# {ComponentName}

**Purpose:** What it does
**Type:** widget | section | chrome | layout-widget
**Visible:** desktop, tablet (hidden on mobile)

## Layout

### Mobile (375px)
**Screenshot:** `../../assets/{component}-mobile.png`
- Columns: 1
- Gap: 16px
- Padding: 24px
- Max-width: 100%
- Child visibility: subtitle hidden

### Tablet (768px)
**Screenshot:** `../../assets/{component}-tablet.png`
- Columns: 1
- Gap: 24px
- Padding: 48px
- Child visibility: all visible
- Changes: increased spacing

### Desktop (1440px)
**Screenshot:** `../../assets/{component}-desktop.png`
- Columns: 2
- Gap: 32px
- Padding: 64px
- Max-width: 1200px
- Child visibility: all visible
- Changes: 2-column layout

## Visual Treatment

### Colors
- Background: #0a0a0a (dark)
- Text primary: #ffffff
- Text secondary: #a1a1aa
- Accent: #3b82f6

### Typography
- Heading: font-title, 48px/1.1, 700
- Body: font-sans, 16px/1.6, 400

### Effects
- Border-radius: 12px
- Shadow: 0 4px 24px rgba(0,0,0,0.1)
- Border: 1px solid rgba(255,255,255,0.1)

## Props / Data Schema

```typescript
interface {ComponentName}Props {
  title: string
  subtitle?: string
  items: Array<{
    id: string
    label: string
  }>
}
```

## Interaction States
- Default: opacity 1
- Hover: scale 1.02, shadow increase
- Active: scale 0.98
- Focus: ring 2px accent color

## Accessibility
- Role: region | article | navigation
- ARIA: aria-label="{purpose}"
- Keyboard: Tab navigable, Enter activates
```

**IMPORTANT:** Always check and document:
- Is this component visible at each breakpoint?
- Are any child elements hidden at certain breakpoints?
- Does the component transform into something else? (e.g., nav → hamburger menu)
- What are the exact color values?
- What are the actual spacing/sizing values?

#### Behaviour File Template

```markdown
# {BehaviourName}

**Purpose:** What it does
**Type:** behaviour | chrome-behaviour | trigger | driver | mode
**Applies to:** Which components use this behaviour

## Trigger
- Event: scroll | click | hover | tap | load | intersection
- Target: element selector or description
- Threshold: 0.5 (for intersection)

## Animation

### Keyframes
- From: opacity 0, translateY(20px)
- To: opacity 1, translateY(0)

### Timing
- Duration: 300ms
- Easing: cubic-bezier(0.4, 0, 0.2, 1) | ease-out | spring
- Delay: 0ms
- Stagger: 50ms (if multiple elements)

### CSS Variables Set
- `--element-opacity`: 0 → 1
- `--element-y`: 20 → 0

## States
| State | Properties |
|-------|------------|
| Initial | opacity: 0, y: 20px |
| Active | opacity: 1, y: 0 |
| Exit | opacity: 0, y: -20px (if different) |

## GIF References
- Mobile: `../../assets/{page}-mobile.gif` @ ~Xs
- Desktop: `../../assets/{page}-desktop.gif` @ ~Xs

## Responsive Notes
- Mobile: tap-triggered, 200ms duration
- Tablet: hover-triggered, 300ms duration
- Desktop: hover-triggered, 300ms duration

## Dependencies
- Requires: ScrollTrigger (trigger)
- Used by: HeroSection, AboutSection
```

### 6. Verify & Commit

```bash
# Verify files exist
ls .claude/analyze/{name}/

# Commit
git add .claude/analyze/{name}/
git commit -m "analyze: {name}"
```

## Asset Guidelines

### Screenshots
- **Naming:** `{component}-{breakpoint}.png` (e.g., `hero-desktop.png`, `hero-mobile.png`)
- **Maximum 1 per breakpoint per component** - Keep focused, not bloated
- Save as PNG
- Reference in markdown under appropriate breakpoint section

### GIFs
- **1 exploration GIF per page per breakpoint:**
  - `{page}-mobile.gif`
  - `{page}-tablet.gif`
  - `{page}-desktop.gif`
- Example: `home-mobile.gif`, `about-desktop.gif`
- Reference with timestamp: `GIF @ ~5s` for specific moments
- **Saving:** GIFs export to browser Downloads → move to `assets/` folder

## Interaction Checklist

- [ ] Started GIF recording before ANY interaction
- [ ] Scrolled entire page (slow, steady)
- [ ] Clicked ALL interactive elements
- [ ] Opened/closed ALL modals
- [ ] Tested hover states
- [ ] Exported GIF to assets/
- [ ] Captured key screenshots to assets/
- [ ] Documented all observed transitions in experience/behaviour/ files
- [ ] Referenced assets in component markdown files

## Output (SUMMARY.md)

```markdown
# Analysis: {name}

**Source:** {url}
**Pages Analyzed:** {list of pages}
**Date:** {date}

## Pages

| Page | GIFs |
|------|------|
| home | home-mobile.gif, home-tablet.gif, home-desktop.gif |
| about | about-mobile.gif, about-tablet.gif, about-desktop.gif |

## Components Found

### Site Chrome (site/chrome/)
- header.md - Global navigation
- footer.md - Global footer

### Content (content/)
| Type | Components |
|------|------------|
| widget/ | hero-title, project-card, client-logo |
| section/ | hero, about, featured-projects |
| layout-widget/ | project-grid, logo-marquee |
| chrome/ | (page overrides if any) |

### Experience (experience/)
| Type | Components |
|------|------------|
| behaviour/ | fade-in, parallax-scroll, hover-scale |
| trigger/ | scroll-trigger, click-trigger |
| chrome-behaviour/ | header-hide, footer-reveal |

## Responsive Summary

| Component | Mobile | Tablet | Desktop |
|-----------|--------|--------|---------|
| hero | visible | visible | visible |
| sidebar | hidden | hidden | visible |
| logo-marquee | visible | visible | visible |

## Build Order Recommendation

1. site/chrome/ (global nav, footer)
2. content/widget/ (atomic components)
3. content/section/ (composed from widgets)
4. experience/behaviour/ (animations)
5. experience/trigger/ (event handlers)

Next: `/plan {name}`
```

## Why Store Assets?

1. **Visual reference for builders** - See exactly what to replicate
2. **GIF shows motion** - Static docs can't convey timing/easing
3. **Persistent documentation** - Reference survives across sessions
4. **Diff-able progress** - Compare before/after implementation

## Chrome Tool Reference

### Setup
```
mcp__claude-in-chrome__tabs_context_mcp (createIfEmpty: true)  # Get/create tab context
mcp__claude-in-chrome__tabs_create_mcp                          # Create new tab
```

### Navigation & Viewing
```
mcp__claude-in-chrome__navigate (url, tabId)                    # Go to URL
mcp__claude-in-chrome__computer (action: "screenshot", tabId)   # Capture screen
mcp__claude-in-chrome__computer (action: "key", text: "Home")   # Keyboard input
```

### Scrolling
```
mcp__claude-in-chrome__computer (action: "scroll", coordinate: [x, y], scroll_direction: "down", scroll_amount: 5, tabId)
```

### Hover States
**CRITICAL:** Mouse must MOVE to trigger hover-off states.
```
mcp__claude-in-chrome__computer (action: "hover", coordinate: [x, y], tabId)  # Hover on element
mcp__claude-in-chrome__computer (action: "hover", coordinate: [0, 0], tabId)  # Move away to trigger hover-off
mcp__claude-in-chrome__computer (action: "screenshot", tabId)                  # Capture result
```

### Clicking
```
mcp__claude-in-chrome__computer (action: "left_click", coordinate: [x, y], tabId)
```

### GIF Recording
```
mcp__claude-in-chrome__gif_creator (action: "start_recording", tabId)
# ... perform interactions ...
mcp__claude-in-chrome__gif_creator (action: "stop_recording", tabId)
mcp__claude-in-chrome__gif_creator (action: "export", download: true, filename: "name.gif", tabId)
```

### Responsive Testing
```
mcp__claude-in-chrome__resize_window (width: 1440, height: 900, tabId)  # Desktop
mcp__claude-in-chrome__resize_window (width: 768, height: 1024, tabId)  # Tablet
mcp__claude-in-chrome__resize_window (width: 375, height: 812, tabId)   # Mobile
```

### DOM Inspection
```
mcp__claude-in-chrome__read_page (tabId)                        # Get accessibility tree
mcp__claude-in-chrome__find (query: "search bar", tabId)        # Find elements by description
mcp__claude-in-chrome__javascript_tool (action: "javascript_exec", text: "...", tabId)  # Execute JS
```

## Mobile-First Agent Strategy

Analyze **sequentially**: Pages one at a time, breakpoints mobile-first.

### Full Flow

```
Parent Agent (orchestrator)
│
├── 1. Page Discovery
│   └── Crawl site, get list of pages
│
├── 2. Create folder structure
│
├── 3. FOR EACH PAGE (one at a time):
│   │
│   ├── PHASE 1: Mobile (2 agents in parallel)
│   │   ├── Mobile Content Agent
│   │   │   ├── Creates content/ files (widget, section, layout-widget)
│   │   │   ├── FIRST PAGE: Creates site/chrome/ (global nav, footer)
│   │   │   └── If page has chrome override → content/chrome/
│   │   └── Mobile Experience Agent
│   │       ├── Creates experience/ files (behaviour, trigger, driver)
│   │       └── Captures {page}-mobile.gif
│   │   └── WAIT
│   │
│   ├── PHASE 2: Tablet (2 agents in parallel)
│   │   ├── Tablet Content Agent → appends to content/, site/chrome/
│   │   └── Tablet Experience Agent → appends to experience/, captures {page}-tablet.gif
│   │   └── WAIT
│   │
│   └── PHASE 3: Desktop (2 agents in parallel)
│       ├── Desktop Content Agent → appends to content/, site/chrome/
│       └── Desktop Experience Agent → appends to experience/, captures {page}-desktop.gif
│       └── WAIT
│
├── 4. Verify all files exist in correct folders
│
├── 5. Create SUMMARY.md
│
└── 6. Commit
```

**Chrome handling:**
- **First page analysis** → Content Agent creates `site/chrome/` (global nav, footer)
- **Subsequent pages** → Content Agent checks if chrome differs, if so creates `content/chrome/` override
- Chrome is part of Content Agent scope, not a separate agent

### Component Deduplication

When analyzing subsequent pages:
1. **Check existing** - Does this widget/section already exist from previous page?
2. **If exists** - Note page-specific variations (if any), don't recreate
3. **If new** - Create file, component only appears on this page

### Error Recovery

If an agent fails:
1. Manager agent receives error notification
2. If possible, spawn new agent to retry that specific task
3. If not recoverable, continue and note in SUMMARY.md what's missing

### Breakpoints (Mobile-First Order)

| Order | Name | Width | Viewport |
|-------|------|-------|----------|
| 1 | `mobile` | 375px | 375×812 |
| 2 | `tablet` | 768px | 768×1024 |
| 3 | `desktop` | 1440px | 1440×900 |

### Mobile Content Agent Prompt (PHASE 1 - Creates Files)

```
You are analyzing {url} for CONTENT STRUCTURE at MOBILE breakpoint.
This is the FIRST phase - you CREATE the component files.

## Breakpoint: mobile (375×812)
## Output: .claude/analyze/{name}/

## Your Scope
- content/widget/ - Atomic UI components
- content/section/ - Page sections
- content/layout-widget/ - Layout patterns (grids, stacks)
- site/chrome/ - GLOBAL chrome (nav, footer) - create on FIRST PAGE only
- content/chrome/ - Page-specific chrome overrides (if different from global)

## Instructions
1. Get Chrome tab: tabs_context_mcp (createIfEmpty: true) → tabs_create_mcp
2. Resize window: resize_window (width: 375, height: 812, tabId)
3. Navigate to {url}
4. Analyze and screenshot each component
5. Save screenshots as: {component}-mobile.png to assets/
6. CHROME HANDLING:
   - If this is the FIRST page: Create site/chrome/header.md, site/chrome/footer.md
   - If chrome differs from global: Create content/chrome/{override}.md

## File Format
Use the Component File Template (see above) with full details:
- Layout values (columns, gap, padding)
- Visual treatment (colors, typography, effects)
- Props/data schema
- Interaction states
- Accessibility requirements
```

### Tablet/Desktop Content Agent Prompt (PHASE 2-3 - Append or Create)

```
You are analyzing {url} for CONTENT STRUCTURE at {breakpoint} breakpoint.
This is PHASE {phase} - you APPEND to existing files OR CREATE if component didn't exist at smaller breakpoints.

## Breakpoint: {breakpoint} ({width}×{height})
## Output: .claude/analyze/{name}/content/

## Instructions
1. Get Chrome tab: tabs_context_mcp (createIfEmpty: true) → tabs_create_mcp
2. Resize window: resize_window (width: {width}, height: {height}, tabId)
3. Navigate to {url}
4. For each component visible at this breakpoint:
   - If file EXISTS → APPEND the {breakpoint} section
   - If file DOESN'T EXIST → CREATE it (component only appears at this breakpoint+)
5. Save screenshots as: {component}-{breakpoint}.png to assets/
6. Update **Visible:** line to reflect which breakpoints show this component

## For EXISTING files (APPEND)
### {Breakpoint} ({width}px)
**Screenshot:** `../../assets/{component}-{breakpoint}.png`
- Columns:
- Spacing:
- Typography:
- Child visibility:
- Changes from mobile: (what's different)

## For NEW components (CREATE)
# {ComponentName}

**Purpose:** What it does
**Visible:** {breakpoint}, desktop  ← Only larger breakpoints

## Layout

### {Breakpoint} ({width}px)
**Screenshot:** `../../assets/{component}-{breakpoint}.png`
- Columns:
- Spacing:
- Note: Not visible on smaller breakpoints
```

### Mobile Experience Agent Prompt (PHASE 1 - Creates Files)

```
You are analyzing {url} for EXPERIENCE/BEHAVIOR at MOBILE breakpoint.
This is the FIRST phase - you CREATE the behaviour files.

## Breakpoint: mobile (375×812)
## Output: .claude/analyze/{name}/experience/
## GIF: .claude/analyze/{name}/assets/{name}-mobile.gif

## Instructions
1. Get Chrome tab: tabs_context_mcp (createIfEmpty: true) → tabs_create_mcp
2. Resize window: resize_window (width: 375, height: 812, tabId)
3. START GIF RECORDING
4. Navigate to {url}
5. Test systematically:
   - Scroll slowly
   - TAP all interactive elements (no hover on mobile)
   - Open/close modals, menus
   - Test hamburger menu if present
6. Export GIF as {name}-mobile.gif

## File Format (CREATE new file)
# {BehaviourName}

**Purpose:** What it does
**Trigger:** tap / scroll / swipe
**GIF Reference:** `../../assets/{name}-mobile.gif` @ ~Xs

## Animation
- Type:
- Duration:
- Easing:

## Responsive Notes
- Mobile: tap-triggered
```

### Tablet/Desktop Experience Agent Prompt (PHASE 2-3 - Append or Create)

```
You are analyzing {url} for EXPERIENCE/BEHAVIOR at {breakpoint} breakpoint.
This is PHASE {phase} - you APPEND to existing files OR CREATE if behaviour didn't exist at smaller breakpoints.

## Breakpoint: {breakpoint} ({width}×{height})
## Output: .claude/analyze/{name}/experience/
## GIF: .claude/analyze/{name}/assets/{name}-{breakpoint}.gif

## Instructions
1. Get Chrome tab: tabs_context_mcp (createIfEmpty: true) → tabs_create_mcp
2. Resize window: resize_window (width: {width}, height: {height}, tabId)
3. START GIF RECORDING
4. Navigate to {url}
5. Test systematically:
   - Scroll slowly
   - HOVER all interactive elements (hover works at tablet/desktop)
   - MOVE MOUSE AWAY for hover-off states
   - Open/close modals, menus
6. Export GIF as {name}-{breakpoint}.gif
7. For each behaviour:
   - If file EXISTS → APPEND responsive notes
   - If file DOESN'T EXIST → CREATE it (behaviour only exists at this breakpoint+)

## For EXISTING files (APPEND to Responsive Notes)
- {Breakpoint}: hover-triggered, 300ms (or note differences from mobile)

## For NEW behaviours (CREATE)
# {BehaviourName}

**Purpose:** What it does
**Trigger:** hover / click
**GIF Reference:** `../../assets/{name}-{breakpoint}.gif` @ ~Xs
**Visible:** {breakpoint}, desktop  ← Only at larger breakpoints

## Animation
- Type:
- Duration:
- Easing:

## Responsive Notes
- Mobile: N/A (not present)
- {Breakpoint}: hover-triggered
```

### Why Mobile-First?

1. **Standard practice** - Build up from mobile baseline
2. **Avoids race conditions** - Sequential phases, no file conflicts
3. **Clear diffs** - Each breakpoint notes "changes from mobile"
4. **Catches visibility** - Mobile creates, others note what's added/hidden

## When to Use Each Folder

| Folder | Use When | Example |
|--------|----------|---------|
| `content/widget/` | Atomic UI component | Button, Card, Logo |
| `content/widget-composite/` | Factory that creates widget trees | HeroComposite creates title + subtitle + CTA |
| `content/section/` | Scrollable page region | HeroSection, AboutSection |
| `content/section-composite/` | Factory that creates section presets | ProjectGridComposite |
| `content/chrome/` | Page-specific chrome override | Different nav on landing page |
| `content/feature/` | Static styling pattern | Gradient background, spacing system |
| `content/layout-widget/` | Layout pattern | Grid, Stack, Carousel |
| `experience/behaviour/` | Animation function | FadeIn, SlideUp, Parallax |
| `experience/chrome-behaviour/` | Chrome animation | HeaderHide, FooterReveal |
| `experience/driver/` | CSS variable applicator | ScrollDriver applies --scroll-y |
| `experience/mode/` | Behaviour bundle | "Parallax mode", "Reveal mode" |
| `experience/trigger/` | Event handler | ScrollTrigger, ClickTrigger |
| `schema/` | Data structure pattern | ProjectSchema, TestimonialSchema |
| `preset/` | Overall site config | "Portfolio preset", "Agency preset" |
| `site/chrome/` | Global chrome defaults | Main nav, footer (same on all pages) |
| `site/pages/` | Page structure notes | Page list, routing |
| `site/data/` | Content data pattern | Projects array, social links |

## Verification Checklist

After all agents complete, orchestrator verifies:

- [ ] All discovered pages have been analyzed
- [ ] Each component file exists in correct folder
- [ ] All 3 breakpoints documented in each file (mobile, tablet, desktop)
- [ ] GIFs exist for each page: `{page}-mobile.gif`, `{page}-tablet.gif`, `{page}-desktop.gif`
- [ ] Screenshots named correctly: `{component}-{breakpoint}.png`
- [ ] Global chrome documented in `site/chrome/`
- [ ] Page chrome overrides in `content/chrome/` (if any differ from global)
- [ ] No duplicate components (shared components documented once, not per-page)
- [ ] Component files have complete details:
  - [ ] Layout values (columns, gap, padding, max-width)
  - [ ] Visual treatment (colors, typography, effects)
  - [ ] Props/data schema
  - [ ] Interaction states
  - [ ] Accessibility notes
- [ ] Behaviour files have complete details:
  - [ ] Keyframes (from/to states)
  - [ ] Timing (duration, easing, delay, stagger)
  - [ ] CSS variables set
  - [ ] Dependencies
- [ ] SUMMARY.md created with build order recommendation
