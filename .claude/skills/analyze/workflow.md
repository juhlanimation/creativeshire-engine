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
├── assets/                      # Screenshots and GIFs
│   ├── {name}-exploration.gif
│   └── *.png
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

#### Component File Template
```markdown
# {ComponentName}

**Purpose:** What it does
**Screenshot:** `../../assets/{screenshot-name}.png`

## Props / Structure
...

## Visual Treatment
...
```

#### Behaviour File Template
```markdown
# {BehaviourName}

**Purpose:** What it does
**Trigger:** What initiates it (click, scroll, hover, etc.)
**GIF Reference:** `../../assets/{name}-exploration.gif` @ ~Xs

## Animation
- Type: scale / fade / slide / clip-path / etc.
- Duration: ~Xms
- Easing: ease-out / spring / linear / etc.
- Direction: in / out / both

## States
- Initial state
- Active/open state
- Exit state (if different from initial)
```

### 5. Commit

```bash
git add .claude/analyze/{name}/
git commit -m "analyze: {name}"
```

## Asset Guidelines

### Screenshots
- **Maximum 1 per component** - Keep focused, not bloated
- Save as PNG
- Name matches component: `content/widget/hero-title.md` → `assets/hero-title.png`
- Reference in markdown: `**Screenshot:** ../../assets/hero-title.png`

### GIFs
- **1 exploration GIF** for the entire site: `{name}-exploration.gif`
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
- Exploration GIF: `assets/{name}-exploration.gif`
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
mcp__claude-in-chrome__resize_window (width: 375, height: 812, tabId)   # Mobile
mcp__claude-in-chrome__resize_window (width: 768, height: 1024, tabId)  # Tablet
mcp__claude-in-chrome__resize_window (width: 1440, height: 900, tabId)  # Desktop
```

### DOM Inspection
```
mcp__claude-in-chrome__read_page (tabId)                        # Get accessibility tree
mcp__claude-in-chrome__find (query: "search bar", tabId)        # Find elements by description
mcp__claude-in-chrome__javascript_tool (action: "javascript_exec", text: "...", tabId)  # Execute JS
```

## Parallel Agent Strategy

Analyze **per-page** with **two agents per page** running in parallel.

### Architecture

```
Parent Agent (orchestrator)
├── Discovers all pages/routes
└── For EACH page, spawns in parallel:
    ├── Content Agent (own Chrome tab) → screenshots → content/
    └── Experience Agent (own Chrome tab) → GIF → experience/
```

### Folder Structure (Multi-Page Sites)

```
.claude/analyze/{name}/
├── SUMMARY.md
├── pages/
│   ├── home/
│   │   ├── assets/
│   │   │   ├── home-content.png
│   │   │   └── home-experience.gif
│   │   ├── content/
│   │   │   ├── widget/
│   │   │   └── section/
│   │   └── experience/
│   │       ├── behaviour/
│   │       └── trigger/
│   ├── about/
│   │   └── ...
│   └── projects/
│       └── ...
└── site/                    # Site-wide (shared across pages)
    ├── chrome/              # Global nav, footer
    ├── mode/                # Dark mode, reduced motion
    └── preset/              # Shared component presets
```

### Folder Structure (Single-Page Sites)

```
.claude/analyze/{name}/
├── SUMMARY.md
├── assets/
├── content/
├── experience/
└── site/
```

### Content Agent Prompt

```
You are analyzing {url} for CONTENT STRUCTURE only.

## Page: {page_name}
## Output: .claude/analyze/{name}/pages/{page_name}/content/

## Your Scope
- widget/ - Individual UI components (buttons, cards, inputs)
- section/ - Page sections (hero, features, testimonials)
- chrome/ - Page-specific chrome (if different from global)
- widget-composite/ - Composed widgets
- section-composite/ - Composed sections

## DO NOT analyze
- Animations, transitions, hover effects
- Click behaviors, scroll triggers
- These are the Experience Agent's job

## Instructions
1. Get Chrome tab: tabs_context_mcp (createIfEmpty: true) → tabs_create_mcp
2. Navigate to {url}
3. Scroll page, screenshot each unique section
4. Use read_page for DOM structure
5. Create markdown files (max 1 screenshot per component)

## File Template
# {ComponentName}
**Purpose:** What it does
**Screenshot:** ../../assets/{page}-{component}.png

## Props
...

## Visual Treatment
...
```

### Experience Agent Prompt

```
You are analyzing {url} for EXPERIENCE/BEHAVIOR only.

## Page: {page_name}
## Output: .claude/analyze/{name}/pages/{page_name}/experience/
## GIF: .claude/analyze/{name}/pages/{page_name}/assets/{page_name}-experience.gif

## Your Scope
- behaviour/ - Animations, transitions
- trigger/ - What initiates (click, scroll, hover)
- driver/ - Animation drivers (scroll %, time, input)
- chrome-behaviour/ - Nav/footer behaviors

## DO NOT analyze
- Static content, typography, colors
- That's the Content Agent's job

## Instructions
1. Get Chrome tab: tabs_context_mcp (createIfEmpty: true) → tabs_create_mcp
2. START GIF RECORDING FIRST
3. Navigate to {url}
4. Test systematically:
   - Scroll slowly (scroll-triggered animations)
   - Hover ALL interactive elements
   - MOVE MOUSE AWAY to trigger hover-off
   - Click modals (open AND close)
   - Test responsive: 375px, 768px, 1440px
5. Export GIF
6. Create markdown files with GIF timestamps

## File Template
# {BehaviourName}
**Purpose:** What it does
**Trigger:** click / scroll / hover / load
**GIF:** ../../assets/{page}-experience.gif @ ~Xs

## Animation
- Type: scale / fade / slide / clip-path
- Duration: ~Xms
- Easing: ease-out / spring

## States
- Initial:
- Active:
- Exit:
```

### Orchestrator Flow

```python
# 1. Discover pages
pages = ["home", "about", "projects"]  # or detect from nav/sitemap

# 2. Spawn agents for each page (all in parallel)
for page in pages:
    Task(prompt=CONTENT_AGENT.format(page=page))
    Task(prompt=EXPERIENCE_AGENT.format(page=page))

# 3. After all complete, create SUMMARY.md
```

### Why Per-Page + Two Agents?
1. **Context efficiency** - Even single pages exhaust context
2. **Maximum parallelism** - All pages analyzed simultaneously
3. **Clear boundaries** - Content vs Experience, per page
4. **Independent Chrome tabs** - No state conflicts
5. **Incremental results** - Each page completes independently
