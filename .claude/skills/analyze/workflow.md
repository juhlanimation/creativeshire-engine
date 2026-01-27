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

### 2. Capture Reference (Always-Record Approach)

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
│   ├── {name}-desktop.gif          # Desktop exploration GIF
│   ├── {name}-tablet.gif           # Tablet exploration GIF
│   ├── {name}-mobile.gif           # Mobile exploration GIF
│   ├── {component}-desktop.png     # Component at desktop
│   ├── {component}-tablet.png      # Component at tablet
│   └── {component}-mobile.png      # Component at mobile
├── content/
│   ├── widget/
│   ├── widget-composite/
│   ├── section/
│   ├── section-composite/
│   ├── chrome/
│   ├── feature/
│   └── layout-widget/
├── experience/
│   ├── behaviour/
│   ├── chrome-behaviour/
│   ├── driver/
│   ├── mode/
│   ├── provider/
│   └── trigger/
├── renderer/
├── schema/
├── preset/
└── site/
```

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

## Parallel Agent Strategy

Analyze with **2 agents per breakpoint** (Content + Experience), all writing to the SAME component files.

### Breakpoints

| Name | Width | Viewport |
|------|-------|----------|
| `desktop` | 1440px | 1440×900 |
| `tablet` | 768px | 768×1024 |
| `mobile` | 375px | 375×812 |

### Architecture

```
Parent Agent (orchestrator)
├── Creates folder structure
├── Spawns 6 agents in parallel:
│   ├── Desktop Content Agent  → appends desktop layout to content/ files
│   ├── Desktop Experience Agent → writes experience/, captures {name}-desktop.gif
│   ├── Tablet Content Agent   → appends tablet layout to content/ files
│   ├── Tablet Experience Agent → captures {name}-tablet.gif, notes responsive diffs
│   ├── Mobile Content Agent   → appends mobile layout to content/ files
│   └── Mobile Experience Agent → captures {name}-mobile.gif, notes mobile behaviors
└── Merges outputs, creates SUMMARY.md
```

### Content Agent Prompt

```
You are analyzing {url} for CONTENT STRUCTURE at {breakpoint} breakpoint.

## Breakpoint: {breakpoint} ({width}×{height})
## Output: .claude/analyze/{name}/content/

## Your Scope
- widget/ - Document widget layout at this breakpoint
- section/ - Document section layout at this breakpoint
- chrome/ - Document chrome at this breakpoint

## Instructions
1. Get Chrome tab: tabs_context_mcp (createIfEmpty: true) → tabs_create_mcp
2. Resize window: resize_window (width: {width}, height: {height}, tabId)
3. Navigate to {url}
4. For each component, screenshot and document the {breakpoint} layout
5. Save screenshots as: {component}-{breakpoint}.png

## File Format
For each component, create/append to its markdown file:

### {Breakpoint} ({width}px)
**Screenshot:** `../../assets/{component}-{breakpoint}.png`
- Columns:
- Spacing:
- Typography:
- Visibility: (hidden/shown elements)

IMPORTANT: Each component gets ONE file with ALL breakpoints documented.
```

### Experience Agent Prompt

```
You are analyzing {url} for EXPERIENCE/BEHAVIOR at {breakpoint} breakpoint.

## Breakpoint: {breakpoint} ({width}×{height})
## Output: .claude/analyze/{name}/experience/
## GIF: .claude/analyze/{name}/assets/{name}-{breakpoint}.gif

## Your Scope
- behaviour/ - Document animations
- trigger/ - Document interaction triggers

## Instructions
1. Get Chrome tab: tabs_context_mcp (createIfEmpty: true) → tabs_create_mcp
2. Resize window: resize_window (width: {width}, height: {height}, tabId)
3. START GIF RECORDING
4. Navigate to {url}
5. Test systematically:
   - Scroll slowly
   - Hover/tap ALL interactive elements
   - MOVE MOUSE AWAY for hover-off
   - Open/close modals, menus
   - Mobile: test touch gestures
6. Export GIF as {name}-{breakpoint}.gif

## File Format
For each behaviour, note breakpoint-specific differences:

## Responsive Notes
- Desktop: hover-triggered, 300ms
- Tablet: hover-triggered (same)
- Mobile: tap-triggered, instant
```

### Why This Structure?

1. **Mirrors Creativeshire** - Analysis folder = implementation folder structure
2. **Responsive is a property** - Not a separate hierarchy
3. **One file per component** - All breakpoint info in one place
4. **Easier to build from** - Builder reads one file, sees all responsive rules
