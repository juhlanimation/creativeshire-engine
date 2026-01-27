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

### 3. Capture Reference (Always-Record Approach)

**IMPORTANT:** Start GIF recording BEFORE any interaction to capture all transitions.

#### Step 1: Start Recording
```
mcp__claude-in-chrome__gif_creator → start_recording
```

#### Step 2: Systematic Exploration
While recording, perform these in order:

1. **Full page scroll** - Scroll top to bottom slowly to capture scroll-triggered animations
2. **Click every interactive element:**
   - All buttons and CTAs
   - All cards/thumbnails
   - Navigation links
   - Modal triggers
3. **Open/close all modals** - Click to open, then close each one
4. **Hover states** - Hover over cards, buttons, links (pause briefly on each)
5. **Test any forms** - Focus inputs, see validation states

#### Step 3: Stop & Export GIF
```
mcp__claude-in-chrome__gif_creator → stop_recording
mcp__claude-in-chrome__gif_creator → export (download: true, filename: "{name}-exploration.gif")
```

Save the GIF to `.claude/analyze/{name}/assets/`

#### Step 4: Capture Key Screenshots
Take screenshots of important states and save to `assets/`:
- Hero section
- Each unique section
- Modal open states
- Hover states
- Any unique UI patterns

```
mcp__claude-in-chrome__computer → screenshot
```

#### Step 5: Review GIF
Watch the exported GIF to identify:
- Transition types (scale, fade, slide, clip-path)
- Animation durations
- Easing curves
- Micro-interactions missed during live viewing

### 3. Static Analysis

After GIF capture, also gather:
- DOM structure (`read_page`)
- CSS/JS inspection for animation definitions

### 4. Create Analysis Files

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
**Visible:** desktop, tablet (hidden on mobile)  ← CRITICAL: track visibility

## Layout

### Desktop (1440px)
**Screenshot:** `../../assets/{component}-desktop.png`
- Columns: 2
- Spacing: 64px gap
- Typography: 48px heading
- Child visibility: all visible

### Tablet (768px)
**Screenshot:** `../../assets/{component}-tablet.png`
- Columns: 1
- Spacing: 32px gap
- Typography: 36px heading
- Child visibility: all visible

### Mobile (375px)
**Visible:** NO (hidden at this breakpoint)
- OR if visible:
**Screenshot:** `../../assets/{component}-mobile.png`
- Columns: 1
- Spacing: 24px gap
- Typography: 28px heading
- Child visibility: subtitle hidden

## Props / Structure
...

## Visual Treatment
...
```

**IMPORTANT:** Always check and document:
- Is this component visible at each breakpoint?
- Are any child elements hidden at certain breakpoints?
- Does the component transform into something else? (e.g., nav → hamburger menu)

#### Behaviour File Template

```markdown
# {BehaviourName}

**Purpose:** What it does
**Trigger:** What initiates it (click, scroll, hover, etc.)
**GIF Reference:** `../../assets/{name}-desktop.gif` @ ~Xs

## Animation
- Type: scale / fade / slide / clip-path / etc.
- Duration: ~Xms
- Easing: ease-out / spring / linear / etc.
- Direction: in / out / both

## States
- Initial state
- Active/open state
- Exit state (if different from initial)

## Responsive Notes
- Desktop: hover-triggered
- Tablet: hover-triggered (same as desktop)
- Mobile: tap-triggered (no hover)
```

### 5. Commit

```bash
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
- **1 exploration GIF per breakpoint:**
  - `{name}-desktop.gif`
  - `{name}-tablet.gif`
  - `{name}-mobile.gif`
- Reference with timestamp: `GIF @ ~5s` for specific moments

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

## Output

```markdown
## Analyzed: {name}

**Source:** URL

### Assets
- Desktop GIF: `assets/{name}-desktop.gif`
- Tablet GIF: `assets/{name}-tablet.gif`
- Mobile GIF: `assets/{name}-mobile.gif`
- Screenshots: [list]

### Components
- content/widget/: [list]
- content/section/: [list]
- content/chrome/: [list]
- experience/behaviour/: [list]

### Transitions Captured
- [list all transitions observed in GIF]

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
├── 3. Analyze Site-Level Chrome (FIRST)
│   └── Global nav, footer → site/chrome/
│
├── 4. FOR EACH PAGE (one at a time):
│   │
│   ├── PHASE 1: Mobile (2 agents in parallel)
│   │   ├── Mobile Content Agent   → creates/appends content/ files
│   │   └── Mobile Experience Agent → creates/appends experience/, captures {page}-mobile.gif
│   │   └── WAIT
│   │
│   ├── PHASE 2: Tablet (2 agents in parallel)
│   │   ├── Tablet Content Agent   → appends to content/ files
│   │   └── Tablet Experience Agent → appends to experience/, captures {page}-tablet.gif
│   │   └── WAIT
│   │
│   └── PHASE 3: Desktop (2 agents in parallel)
│       ├── Desktop Content Agent  → appends to content/ files
│       └── Desktop Experience Agent → appends to experience/, captures {page}-desktop.gif
│       └── WAIT
│
├── 5. Verify all files exist in correct folders
│
└── 6. Create SUMMARY.md
```

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
## Output: .claude/analyze/{name}/content/

## Your Scope
- widget/ - Document widget layout at mobile
- section/ - Document section layout at mobile
- chrome/ - Document chrome at mobile

## Instructions
1. Get Chrome tab: tabs_context_mcp (createIfEmpty: true) → tabs_create_mcp
2. Resize window: resize_window (width: 375, height: 812, tabId)
3. Navigate to {url}
4. For each component, screenshot and CREATE its markdown file
5. Save screenshots as: {component}-mobile.png to assets/

## File Format (CREATE new file)
# {ComponentName}

**Purpose:** What it does
**Visible:** mobile, tablet, desktop  ← Update if hidden at any breakpoint

## Layout

### Mobile (375px)
**Screenshot:** `../../assets/{component}-mobile.png`
- Columns:
- Spacing:
- Typography:
- Child visibility:
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

After all agents complete, verify:

- [ ] All discovered pages have been analyzed
- [ ] Each component file exists in correct folder
- [ ] All breakpoints documented in each file
- [ ] GIFs exist: `{page}-{breakpoint}.gif`
- [ ] Screenshots named: `{component}-{breakpoint}.png`
- [ ] Global chrome in `site/chrome/`
- [ ] Page chrome overrides in `content/chrome/` (if any)
- [ ] No duplicate components (shared components documented once)
