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

Structure mirrors Creativeshire components:

```
.claude/analyze/{name}/
├── SUMMARY.md
├── assets/                    # Screenshots and GIFs for reference
│   ├── {name}-exploration.gif
│   ├── hero.png
│   ├── modal-open.png
│   └── ...
├── widget/
├── widget-composite/
├── section/
├── section-composite/
├── chrome/
├── feature/
├── behaviour/
├── driver/
├── trigger/
└── mode/
```

Only create folders that have components.

#### Component File Template
```markdown
# {ComponentName}

**Purpose:** What it does
**Screenshot:** `../assets/{screenshot-name}.png`

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
**GIF Reference:** `../assets/{name}-exploration.gif` @ ~Xs

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
- Save as PNG for quality
- Name descriptively: `hero.png`, `modal-video-open.png`, `hover-card.png`
- Reference in markdown: `**Screenshot:** ../assets/hero.png`

### GIFs
- Main exploration GIF: `{name}-exploration.gif`
- Specific transition GIFs: `{transition-name}.gif`
- Reference with timestamp: `GIF @ ~5s` for specific moments

## Interaction Checklist

- [ ] Started GIF recording before ANY interaction
- [ ] Scrolled entire page (slow, steady)
- [ ] Clicked ALL interactive elements
- [ ] Opened/closed ALL modals
- [ ] Tested hover states
- [ ] Exported GIF to assets/
- [ ] Captured key screenshots to assets/
- [ ] Documented all observed transitions in behaviour/ files
- [ ] Referenced assets in component markdown files

## Output

```markdown
## Analyzed: {name}

**Source:** URL

### Assets
- Exploration GIF: `assets/{name}-exploration.gif`
- Screenshots: [list]

### Components
- widget/: [list]
- section/: [list]
- chrome/: [list]
- behaviour/: [list]

### Transitions Captured
- [list all transitions observed in GIF]

Next: `/plan {name}`
```

## Why Store Assets?

1. **Visual reference for builders** - See exactly what to replicate
2. **GIF shows motion** - Static docs can't convey timing/easing
3. **Persistent documentation** - Reference survives across sessions
4. **Diff-able progress** - Compare before/after implementation
