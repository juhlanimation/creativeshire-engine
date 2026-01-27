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

Spawn **two focused agents** in parallel, each with their own Chrome tab:

### Content Agent
**Focus:** Static structure (widgets, sections, chrome)
**Tools:** Screenshots only, no GIF
**Output:** `content/` folder

```
You are analyzing {url} for CONTENT STRUCTURE only.

## Your Scope
- content/widget/ - Individual UI components
- content/section/ - Page sections
- content/chrome/ - Persistent UI (nav, footer, floating elements)
- content/widget-composite/ - Composed widgets
- content/section-composite/ - Composed sections

## DO NOT analyze
- Animations, transitions, hover effects (that's the Experience Agent's job)
- Click behaviors, scroll triggers

## Instructions
1. Create your own Chrome tab: tabs_context_mcp (createIfEmpty: true) → tabs_create_mcp
2. Navigate to {url}
3. Scroll through page taking screenshots of each unique section
4. Use read_page to inspect DOM structure
5. Create markdown files in content/ folders
6. Use screenshots (max 1 per component)

## Output
Write files to: .claude/analyze/{name}/content/
```

### Experience Agent
**Focus:** Dynamic behaviors (animations, transitions, interactions)
**Tools:** GIF recording, hover testing, click testing
**Output:** `experience/` folder

```
You are analyzing {url} for EXPERIENCE/BEHAVIOR only.

## Your Scope
- experience/behaviour/ - Animations, transitions
- experience/trigger/ - What initiates behaviors (click, scroll, hover)
- experience/driver/ - Animation drivers (scroll position, time, user input)
- experience/mode/ - Site-wide modes (dark mode, reduced motion)
- experience/chrome-behaviour/ - Chrome-specific behaviors

## DO NOT analyze
- Static content structure (that's the Content Agent's job)
- Visual styling, typography, colors

## Instructions
1. Create your own Chrome tab: tabs_context_mcp (createIfEmpty: true) → tabs_create_mcp
2. Start GIF recording BEFORE navigating
3. Navigate to {url}
4. Test systematically:
   - Scroll slowly (capture scroll-triggered animations)
   - Hover on ALL interactive elements (move mouse away to trigger hover-off)
   - Click modals/overlays (open AND close)
   - Test responsive breakpoints (375, 768, 1440)
5. Export GIF to assets/
6. Create markdown files in experience/ folders
7. Reference GIF timestamps for each behavior

## Output
Write files to: .claude/analyze/{name}/experience/
Export GIF to: .claude/analyze/{name}/assets/{name}-experience.gif
```

### Spawning Both Agents

```javascript
// In parent agent, spawn BOTH in parallel:
Task(subagent_type: "general-purpose", prompt: CONTENT_AGENT_PROMPT)
Task(subagent_type: "general-purpose", prompt: EXPERIENCE_AGENT_PROMPT)
```

### Why Two Agents?
1. **Reduced context** - Each agent focuses on half the work
2. **Parallel execution** - Both run simultaneously
3. **Clear boundaries** - No overlap in responsibilities
4. **Separate Chrome tabs** - Each agent has independent browser state
