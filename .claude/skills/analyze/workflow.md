# Analyze Workflow

> `/analyze <url>` | `/analyze <path>` | `/analyze "description"`

Analyzes external references and creates backlog items.

## Pre-Flight

```bash
git checkout main
git pull origin main
```

## Input Types

| Input | Detection | Example |
|-------|-----------|---------|
| Website | Starts with `http://` or `https://` | `https://example.com` |
| Path | Local path | `./my-project` |
| Description | Quoted string | `"portfolio with parallax"` |

## Workflow

### 1. Capture Reference

**For URLs (requires Chrome MCP):**
```
mcp__claude-in-chrome__tabs_context_mcp
mcp__claude-in-chrome__tabs_create_mcp
mcp__claude-in-chrome__navigate → URL
mcp__claude-in-chrome__computer → screenshot
mcp__claude-in-chrome__read_page → DOM structure
```

Scroll through page to observe:
- Layout and sections
- Animations and interactions
- Navigation and chrome elements

**For paths:**
- Scan directory structure
- Identify framework (React, Vue, etc.)
- Find component and style files

**For descriptions:**
- Extract key concepts
- Use domain expertise to infer patterns

### 2. Component Identification

Break down into Creativeshire layers:

**Content Layer:**
| Component | Look For |
|-----------|----------|
| Widgets | Atomic elements (text, images, buttons, cards) |
| Sections | Scrollable groups of widgets |
| Chrome | Persistent UI (header, footer, overlays) |

**Experience Layer:**
| Component | Look For |
|-----------|----------|
| Behaviours | Animations (fade, parallax, scroll-driven) |
| Drivers | CSS variable application patterns |
| Triggers | Event handlers (scroll, click, hover) |

### 3. Architecture Mapping

For each identified component:
1. Check if similar exists in codebase
2. Determine component type using creativeshire specs index
3. Note dependencies between components
4. Read relevant spec to understand patterns

### 4. Create Analysis Files (Optional)

Create analysis files in `.claude/analysis/`:

```
.claude/analysis/
├── sections.md      # Section patterns identified
├── widgets.md       # Widget components identified
├── chrome.md        # Persistent UI elements
├── experience.md    # Animations/interactions
├── styles.md        # Design tokens
└── SUMMARY.md       # Overall summary with build order
```

### 5. Backlog Creation

Read template: `../creativeshire/templates/backlog-item.md`

Create items grouped by layer and ordered by dependencies:

```markdown
## Content Components (build first)
- [WIDGET-001] Video player component
- [WIDGET-002] Project card with hover
- [SECTION-001] Hero section (depends on WIDGET-001)

## Experience Components (build after content)
- [BEHAVIOUR-001] Scroll-driven parallax
- [BEHAVIOUR-002] Hover scale effect
```

### 6. Commit

```bash
git add .claude/tasks/backlog.md .claude/analysis/
git commit -m "plan: analyze [reference-name], add items to backlog

Co-Authored-By: Claude <noreply@anthropic.com>"
```

## Output Format

```markdown
## Analyzed: [Reference Name]

**Source:** URL or description

### Identified Components

**Content (build first):**
- [WIDGET-001] Hero text with gradient
- [WIDGET-002] Project card with hover
- [SECTION-001] Hero section

**Experience (build after content):**
- [BEHAVIOUR-001] Scroll-driven parallax
- [BEHAVIOUR-002] Hover scale effect

### Build Order

1. WIDGET-001, WIDGET-002 (no dependencies, parallel)
2. SECTION-001 (needs WIDGET-001)
3. BEHAVIOUR-001, BEHAVIOUR-002 (experience layer)

Next: `/build WIDGET-001` (start with no dependencies)
```

## Analysis Checklist

- [ ] All visible widgets identified
- [ ] Section boundaries marked
- [ ] Chrome elements noted (header, footer, overlays)
- [ ] Animations/interactions catalogued
- [ ] Dependencies mapped
- [ ] Build order determined
- [ ] Backlog items created with correct prefixes
