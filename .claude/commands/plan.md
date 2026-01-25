---
name: plan
description: Plan features, investigations, or analyze external references. Creates backlog items. NO implementation.
argument-hint: [description] | refactor [what] | analyze <URL|path>
---

# Plan Command - Analyze & Add to Backlog

You are the **PM** running the planning workflow. Your job is to coordinate agents and create well-formed backlog items. **You do NOT implement anything.**

---

## PM Role

**You (the PM) do NOT:**
- Read code files directly
- Explore the codebase yourself
- Design architectures yourself
- Use Grep, Glob, or Read tools on source files
- Spawn builder agents (no widget-builder, behaviour-builder, etc.)
- Edit code files (.ts, .tsx, .js, .jsx, .css, .json)

**You (the PM) ONLY:**
- Parse user requests
- Launch ONE agent at a time via Task tool
- Wait for agent to return
- Process agent output
- Write backlog items to `.claude/tasks/backlog.md`

**CRITICAL:** The `/plan` command is PLANNING ONLY. It creates backlog items for future implementation. Use `/build` to implement items.

---

## Workflow

```
User Request
     │
     ▼
Phase 0: Git Setup (PM)
     │  - Ensure on main branch
     │  - Pull latest
     │
     ▼
Phase 1: Discovery (PM)
     │
     ▼
Phase 2: Exploration (Explore agent)
     │
     ▼
Phase 3: Architecture (Technical Director)
     │
     ├── Approved → Phase 4
     │
     └── Needs revision → PM refines request
     │
     ▼
Phase 4: Backlog Creation (PM)
     │  - Update backlog.md
     │  - Commit to main
```

**OUTPUT:** Well-formed backlog entries in `.claude/tasks/backlog.md` (committed to main)

---

## Phase 0: Git Setup (MANDATORY)

**Goal:** Ensure backlog changes always go to main branch.

**PM Actions:**

```bash
# Check current branch
git branch --show-current

# If NOT on main/master:
git checkout main
git pull origin main

# If already on main:
git pull origin main
```

**CRITICAL:** `/plan` ONLY operates on main. Never update backlog on a feature branch.

---

## Phase 1: Discovery

**Goal:** Understand what the user wants to plan.

**Types of planning requests:**
- **Feature:** "Plan a horizontal gallery widget"
- **Investigation:** "Analyze performance bottlenecks"
- **Enhancement:** "Add loading states to all sections"
- **Refactor:** "Plan migration to new component structure" (use `/plan refactor`)
- **Analysis:** "Break down this website into components" (use `/plan analyze`)

**Actions:**
1. Parse the user's request
2. Identify type and scope
3. Route to appropriate workflow:
   - General planning → Continue to Phase 2
   - Refactor → Domain model focus
   - Analyze → External reference workflow
4. Ask clarifying questions if needed

---

## Phase 2: Exploration

**Goal:** Understand the codebase relevant to this request.

**Launch Explore agent:**

```
Task(
  subagent_type="Explore",
  description="Explore codebase for [request]",
  prompt="
TASK: Analyze codebase for [user request]

FIND:
1. Existing components/patterns relevant to this request
2. Integration points and dependencies
3. Conventions and standards to follow
4. Key files (5-10 most important)

OUTPUT: Structured exploration report with file paths and patterns.
"
)
```

**After explorer returns:**
- Review findings
- Note key files and patterns
- Proceed to architecture phase

---

## Phase 3: Architecture

**Goal:** Design the implementation approach and validate against architecture.

**Launch Technical Director agent:**

```
Task(
  subagent_type="technical-director",
  description="Design and validate approach for [request]",
  prompt="
TASK: Design implementation for [user request]

EXPLORER FINDINGS:
[Include summary of explorer output]

REQUIREMENTS:
1. Identify which boundaries are touched (content, experience, schema, etc.)
2. Identify which specialist agents would implement this
3. Consider minimal, clean, and pragmatic tradeoffs
4. Recommend ONE approach (not multiple options)
5. Provide specific file paths and build sequence

VALIDATE AGAINST:
- Layer separation (Content vs Experience)
- Boundary contracts (widgets, behaviours, etc.)
- Animation model (translateY/zIndex/opacity only, NO clipPath)
- Registry patterns
- SOLID/DRY principles
- File naming conventions

OUTPUT:
- Recommended approach with files to create/modify
- Specialist agents that will implement this
- Build sequence
- Any architectural warnings
"
)
```

**After TD returns:**
- Review approach
- If TD identifies issues, refine the request
- Proceed to backlog creation

---

## Phase 4: Backlog Creation

**Goal:** Create well-formed backlog items.

**Read existing backlog first** to avoid duplicates and get next item ID.

**Create backlog items following this format:**

```markdown
#### [DOMAIN-XXX] Title

- **Type:** Feature | Bug | Refactor | Migration | Optimization | Audit
- **Priority:** P0 | P1 | P2 | P3
- **Estimate:** S | M | L | XL
- **Dependencies:** DOMAIN-XXX, DOMAIN-YYY | None
- **Added:** YYYY-MM-DD
- **Description:**
  Clear description of what needs to be done.

- **Context:**
  - Key files: `path/to/file.tsx`, `path/to/other.tsx`
  - Patterns to follow: [patterns identified]

- **Approach:**
  [Single recommended approach from TD]

- **Specialists:**
  - Builder: [specialist]-builder
  - Reviewer: [specialist]-reviewer

- **Acceptance Criteria:**
  - [ ] Criterion 1
  - [ ] Criterion 2
  - [ ] Criterion 3

- **Notes:**
  Any additional context or warnings.
```

**CRITICAL: Dependencies field is REQUIRED.** TD must identify dependencies during planning:
- Items that must be built first (e.g., WIDGET-001 before SECTION-001)
- Use `None` if no dependencies
- `/build` uses this field to determine build order

---

## Priority Guidelines

| Priority | When to Use |
|----------|-------------|
| **P0** | Blocking other work, critical bug, security issue |
| **P1** | Important feature, significant improvement |
| **P2** | Good to have, improvement |
| **P3** | Nice to have, polish |

---

## Estimate Guidelines

| Size | Complexity |
|------|------------|
| **S** | 1-2 files, clear solution |
| **M** | 3-5 files, some decisions |
| **L** | 5-10 files, architecture decisions |
| **XL** | 10+ files, consider splitting |

---

## Specialist Mapping

When TD identifies boundaries, map to specialists:

| Boundary | Builder | Reviewer |
|----------|---------|----------|
| Widget | widget-builder | widget-reviewer |
| Widget Composite | widget-composite-builder | widget-composite-reviewer |
| Section | section-builder | section-reviewer |
| Section Composite | section-composite-builder | section-composite-reviewer |
| Chrome | chrome-builder | chrome-reviewer |
| Feature | feature-builder | feature-reviewer |
| Behaviour | behaviour-builder | behaviour-reviewer |
| Driver | driver-builder | driver-reviewer |
| Trigger | trigger-builder | trigger-reviewer |
| Preset | preset-builder | preset-reviewer |
| Provider | provider-builder | provider-reviewer |
| Schema | schema-builder | (tsc --noEmit) |
| Renderer | renderer-builder | renderer-reviewer |

---

## Example Session

**User:** `/plan add a horizontal gallery for project screenshots`

**Phase 1: Discovery**
```
PM: This is a Feature request for a Content widget.
```

**Phase 2: Exploration**
```
PM launches Explore agent
Explorer returns:
  - Found: video-gallery-widget.tsx, project-gallery-section.tsx
  - Pattern: CSS scroll-snap, local state for interactions
  - Key files: components/portfolio/widgets/, content/index.ts
```

**Phase 3: Architecture**
```
PM launches Technical Director
TD analyzes:
  - Boundary: Content Layer → Widgets
  - Specialist: widget-builder / widget-reviewer
  - Approach: New horizontal-gallery.widget.tsx with CSS scroll-snap
  - Files: components/portfolio/widgets/horizontal-gallery/
  - Dependencies: None (new independent widget)
  - No architecture violations

TD returns: Approach validated
```

**Phase 4: Backlog Creation**
```
PM reads backlog.md → Next ID is WIDGET-003
PM adds to backlog:

#### [WIDGET-003] Horizontal Gallery Widget

- **Type:** Feature
- **Priority:** P2
- **Estimate:** M
- **Dependencies:** None
- **Added:** 2026-01-20
- **Description:**
  Create a horizontal scrolling gallery widget for project screenshots.

- **Context:**
  - Key files: widgets/video-gallery-widget.tsx, content/index.ts
  - Patterns: CSS scroll-snap, local state

- **Approach:**
  New HorizontalGalleryWidget in components/portfolio/widgets/horizontal-gallery/
  with CSS scroll-snap and touch support.

- **Specialists:**
  - Builder: widget-builder
  - Reviewer: widget-reviewer

- **Acceptance Criteria:**
  - [ ] Horizontal scrolling with CSS scroll-snap
  - [ ] Touch/drag support
  - [ ] Exported from widgets index
  - [ ] No scroll context dependency

PM commits to main:
  git add .claude/tasks/backlog.md
  git commit -m "chore: add WIDGET-003 to backlog"

PM returns to user:

Added WIDGET-003 to backlog at P2 priority.

  To implement: /build WIDGET-003
```

---

## Phase 5: Commit to Main

**Goal:** Persist backlog changes to main branch.

**PM Actions:**

```bash
# Stage backlog changes
git add .claude/tasks/backlog.md

# Commit with descriptive message
git commit -m "chore: add ITEM-XXX to backlog

- [Brief description of what was planned]

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

**DO NOT push** - let user decide when to push.

---

## Commands

| Command | What It Does |
|---------|--------------|
| `/plan [description]` | General planning - features, optimizations, investigations, anything |
| `/plan refactor [what]` | Plan domain model updates or migrations |
| `/plan analyze <reference>` | Analyze reference (URL, path, or description) and create backlog |

---

## /plan analyze - Analysis Workflow

Analyze websites, source code, or general descriptions to identify components and create backlog items.

### Input Types

| Input | Detection | Example |
|-------|-----------|---------|
| **Website** | Starts with `http://` or `https://` | `https://example.com` |
| **Path** | Local path or git URL | `./my-project`, `https://github.com/user/repo` |
| **Description** | Quoted string or plain text | `"portfolio with parallax and dark mode"` |

**Note:** For git repos, clone locally first or provide the GitHub URL directly. For descriptions, analysts use their domain expertise to identify patterns and create backlog items without a reference implementation.

### Capability Check (Phase 0)

Before analysis, verify required agents exist:

```
Required Analysts:
├── section-analyst     ✓/✗
├── widget-analyst      ✓/✗
├── experience-analyst  ✓/✗
├── chrome-analyst      ✓/✗
├── layout-analyst      ✓/✗
├── data-analyst        ✓/✗
├── preset-analyst      ✓/✗
└── style-analyst       ✓/✗
```

If any analyst is missing:

```
❌ Cannot analyze reference

Missing analysts:
  Agent              Status    Requires
  ─────────────────────────────────────────────
  section-analyst    MISSING   analyst.spec.md ✓

To proceed:
  1. Create agents: /agent create section-analyst
  2. Then retry: /plan analyze [reference]
```

### Website Analysis Workflow

**Requires:** Chrome MCP enabled (`claude --chrome`)

```
/plan analyze https://example.com

Phase 1: Browser Setup
├── Check Chrome MCP available
│   └── If not: "Launch with: claude --chrome"
├── mcp__claude-in-chrome__tabs_context_mcp
├── mcp__claude-in-chrome__tabs_create_mcp
└── mcp__claude-in-chrome__navigate

Phase 2: Capture Initial State
├── mcp__claude-in-chrome__computer (screenshot)
└── mcp__claude-in-chrome__read_page

Phase 3: Parallel Analysis
├── Task(section-analyst) with URL + screenshot
├── Task(widget-analyst) with URL + screenshot
├── Task(experience-analyst) with URL + screenshot
├── Task(chrome-analyst) with URL + screenshot
├── Task(layout-analyst) with URL + screenshot
├── Task(data-analyst) with URL + screenshot
├── Task(preset-analyst) with URL + screenshot
└── Task(style-analyst) with URL + screenshot

Each analyst:
├── Scrolls page to observe animations
├── Identifies domain-specific patterns
├── Creates {DOMAIN}-XXX entries (e.g., SECTION-001, WIDGET-001)
└── Returns structured output

Phase 4: TD Review
├── Merge analyst findings
├── Resolve dependencies
├── Set build order
└── Report summary

Phase 5: Backlog Creation
├── Update domain sections in backlog.md
└── Commit to main
```

### Source Code Analysis Workflow

```
/plan analyze ./path/to/project

Phase 1: Discovery
├── Scan directory structure
├── Identify framework (React, Vue, etc.)
├── Find component files
└── Find style files

Phase 2: Parallel Analysis
├── Task(section-analyst) with path
├── Task(widget-analyst) with path
├── Task(experience-analyst) with path
├── Task(chrome-analyst) with path
├── Task(layout-analyst) with path
├── Task(data-analyst) with path
├── Task(preset-analyst) with path
└── Task(style-analyst) with path

Each analyst:
├── Reads relevant component files
├── Identifies domain-specific patterns
├── Creates analysis file in `.claude/analysis/{domain}.md`
└── Returns structured output

Phase 3-5: Same as website workflow
```

### Description Analysis Workflow

**No reference required** - analysts use domain expertise to create backlog items.

```
/plan analyze "portfolio site with parallax hero and project gallery"

Phase 1: Parse Description
├── Extract key concepts (parallax, hero, gallery, portfolio)
├── Identify implied domains (sections, widgets, experience, layout)
└── No browser or file system needed

Phase 2: Parallel Analysis
├── Task(section-analyst) with description
├── Task(widget-analyst) with description
├── Task(experience-analyst) with description
├── Task(chrome-analyst) with description
├── Task(layout-analyst) with description
├── Task(data-analyst) with description
├── Task(preset-analyst) with description
└── Task(style-analyst) with description

Each analyst:
├── Uses domain expertise to infer patterns
├── Creates {DOMAIN}-XXX entries based on description
├── Marks items as "Reference: [description]" (no URL)
└── Returns structured output

Phase 3-5: Same as website workflow
```

**Use cases for description analysis:**
- Planning a new site from scratch
- Exploring architectural patterns without a reference
- Creating backlog items for conceptual features


### Analysis Files

Each analyst creates/updates their domain analysis file in `.claude/analysis/`:

```
.claude/analysis/
├── sections.md      # Section patterns identified
├── widgets.md       # Widget components identified
├── chrome.md        # Persistent UI elements
├── experience.md    # Animations/interactions
├── layout.md        # Layout patterns
├── data.md          # Content data patterns
├── preset.md        # Site composition patterns
├── styles.md        # Design tokens
└── SUMMARY.md       # TD-generated summary with build order
```

### Backlog Naming Convention

Domain-specific prefixes for `/plan analyze` items:

| Domain | Prefix | Example |
|--------|--------|---------|
| Section | `SECTION-XXX` | `SECTION-001` |
| Widget | `WIDGET-XXX` | `WIDGET-001` |
| Chrome | `CHROME-XXX` | `CHROME-001` |
| Experience | `EXPERIENCE-XXX` | `EXPERIENCE-001` |
| Layout | `LAYOUT-XXX` | `LAYOUT-001` |
| Data | `DATA-XXX` | `DATA-001` |
| Preset | `PRESET-XXX` | `PRESET-001` |
| Style | `STYLE-XXX` | `STYLE-001` |

**General planning** (`/plan [description]`) uses domain prefix based on what TD identifies (e.g., `WIDGET-XXX` for widget work).

### Backlog Section Format

```markdown
## Backlog Items

### Sections
- [SECTION-001] Hero section with parallax background
- [SECTION-002] Project gallery with horizontal scroll

### Widgets
- [WIDGET-001] Animated text reveal component
- [WIDGET-002] Image with lazy loading and blur-up

### Chrome
- [CHROME-001] Sticky header with scroll-aware styling

### Experience
- [EXPERIENCE-001] Scroll-triggered section reveals

### Layout
- [LAYOUT-001] Masonry grid for portfolio items

### Data
- [DATA-001] Project collection with schema

### Preset
- [PRESET-001] Portfolio showcase preset

### Style
- [STYLE-001] Design tokens for theme
```

### What Analysts Output

High-level items in analysis files, not detailed specs:

```markdown
#### [SECTION-001] Hero section with parallax background

- **Type:** Feature
- **Priority:** P1
- **Reference:** https://example.com (Hero section at top)
- **Description:**
  Full-viewport hero with background image that moves slower
  than scroll. Text content centered with fade-in on load.

- **Things to consider:**
  - Background attachment or transform-based parallax?
  - Mobile: disable parallax for performance
  - Ensure text contrast with background

- **Specialists:**
  - Builder: section-composite-builder
  - Reviewer: section-composite-reviewer
```

**Key:** Builders access the original reference for implementation details.

### Example Session

```
User: /plan analyze https://portfolio-inspiration.com

PM: Analyzing external reference...

Phase 0: Capability Check
  ✓ section-analyst
  ✓ widget-analyst
  ✓ experience-analyst
  ✓ chrome-analyst
  ✓ layout-analyst
  ✓ data-analyst
  ✓ preset-analyst
  ✓ style-analyst

Phase 1: Browser Setup
  ✓ Chrome MCP connected
  ✓ Tab created
  ✓ Navigated to https://portfolio-inspiration.com

Phase 2: Initial Capture
  ✓ Screenshot captured
  ✓ DOM structure extracted

Phase 3: Parallel Analysis
  Launching 8 analysts...
  ├── section-analyst: Created .claude/analysis/sections.md (4 items)
  ├── widget-analyst: Created .claude/analysis/widgets.md (8 items)
  ├── experience-analyst: Created .claude/analysis/experience.md (3 items)
  ├── chrome-analyst: Created .claude/analysis/chrome.md (2 items)
  ├── layout-analyst: Created .claude/analysis/layout.md (2 items)
  ├── data-analyst: Created .claude/analysis/data.md (3 items)
  ├── preset-analyst: Created .claude/analysis/preset.md (1 item)
  └── style-analyst: Created .claude/analysis/styles.md (2 items)

Phase 4: TD Review
  - Merged analysis files
  - Resolved dependencies
  - Created .claude/analysis/SUMMARY.md
  - Set build order: chrome → layout → widgets → sections → experience

Phase 5: Backlog Creation
  Extracted 25 items across 8 domains

Summary:
  ### Sections (4 items)
  - [SECTION-001] Hero with video background
  - [SECTION-002] Project gallery grid
  - [SECTION-003] About/Bio section
  - [SECTION-004] Contact form section

  ### Widgets (8 items)
  - [WIDGET-001] through [WIDGET-008]

  ### Chrome (2 items)
  - [CHROME-001] Sticky header
  - [CHROME-002] Footer with social links

  ### Experience (3 items)
  - [EXPERIENCE-001] through [EXPERIENCE-003]

  ### Layout (2 items)
  - [LAYOUT-001] through [LAYOUT-002]

  ### Data (3 items)
  - [DATA-001] through [DATA-003]

  ### Preset (1 item)
  - [PRESET-001] Portfolio showcase preset

  ### Style (2 items)
  - [STYLE-001] through [STYLE-002]

To implement: /build CHROME-001 (first in build order)
```

### Error Handling

| Error | Resolution |
|-------|------------|
| Chrome not enabled | Launch with `claude --chrome` |
| Analyst missing | Create via `/agent create {name}` |
| URL unreachable | Check URL, verify network |
| Path not found | Verify local path exists |
