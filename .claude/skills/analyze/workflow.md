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

#### Step 3: Stop & Export
```
mcp__claude-in-chrome__gif_creator → stop_recording
mcp__claude-in-chrome__gif_creator → export (download: true)
```

#### Step 4: Review GIF
Watch the exported GIF to identify:
- Transition types (scale, fade, slide, clip-path)
- Animation durations
- Easing curves
- Micro-interactions missed during live viewing

#### Step 5: Re-record Specifics (if needed)
If a transition needs closer inspection, record just that interaction.

### 3. Static Analysis

After GIF capture, also gather:
- DOM structure (`read_page`)
- Screenshots of key states
- CSS/JS inspection for animation definitions

### 4. Create Analysis Files

Structure mirrors Creativeshire components:

```
.claude/analyze/{name}/
├── SUMMARY.md
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

#### Behaviour File Template
```markdown
# {BehaviourName}

**Purpose:** What it does
**Trigger:** What initiates it (click, scroll, hover, etc.)

## Animation
- Type: scale / fade / slide / clip-path / etc.
- Duration: ~Xms
- Easing: ease-out / spring / linear / etc.
- Direction: in / out / both

## States
- Initial state
- Active/open state
- Exit state (if different from initial)

## Implementation Notes
- Technical observations from GIF review
```

### 5. Commit

```bash
git add .claude/analyze/{name}/
git commit -m "analyze: {name}"
```

## Interaction Checklist

- [ ] Started GIF recording before ANY interaction
- [ ] Scrolled entire page (slow, steady)
- [ ] Clicked ALL interactive elements
- [ ] Opened/closed ALL modals
- [ ] Tested hover states
- [ ] Exported and reviewed GIF
- [ ] Documented all observed transitions in behaviour/ files
- [ ] Re-recorded specific transitions if needed

## Output

```markdown
## Analyzed: {name}

**Source:** URL

### Components
- widget/: [list]
- section/: [list]
- chrome/: [list]
- behaviour/: [list]

### Transitions Captured
- [list all transitions observed in GIF]

### Needs Follow-up
- [any unclear transitions needing re-recording]

Next: `/plan {name}`
```

## Why Always-Record?

Screenshots show **state**. GIFs show **motion**.

By recording the entire exploration session:
1. We capture transitions we didn't anticipate
2. We can review at our own pace
3. We don't miss micro-interactions
4. We have visual reference for implementation
