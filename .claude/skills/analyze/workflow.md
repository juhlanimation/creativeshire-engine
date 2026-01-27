# Analyze Workflow

> `/analyze <url>` | `/analyze <path>` | `/analyze "description"`

Analyzes external references and creates analysis files. Does NOT create backlog items.

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

### 0. Get Analysis Name

**Always ask the user for the project/analysis name:**

```markdown
What name should I use for this analysis?
(e.g., "portfolio", "agency-site", "landing-page")
```

This becomes `{name}` in `.claude/analyze/{name}/`.

**Check for existing analysis:**
```bash
ls .claude/analyze/{name}/ 2>/dev/null
```

If exists, ask:
```markdown
Analysis already exists at `.claude/analyze/{name}/`.

Options:
1. Overwrite existing analysis
2. Use different name
3. Cancel
```

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

### 4. Create Analysis Files

Create analysis files in `.claude/analyze/{name}/`:

```
.claude/analyze/{name}/
├── SUMMARY.md       # Overall summary with source URL and build order
├── sections.md      # Section patterns identified
├── widgets.md       # Widget components identified
├── chrome.md        # Persistent UI elements
├── experience.md    # Animations/interactions
└── styles.md        # Design tokens
```

**Example:** Analyzing `https://stripe.com` as "stripe":
```
.claude/analyze/stripe/
```

### 5. Commit

```bash
git add .claude/analyze/{name}/
git commit -m "analyze: {name}

Co-Authored-By: Claude <noreply@anthropic.com>"
```

## Output Format

```markdown
## Analyzed: {name}

**Source:** URL or description

### Identified Components

**Content:**
- Widgets: [list]
- Sections: [list]
- Chrome: [list]

**Experience:**
- Behaviours: [list]
- Triggers: [list]

### Suggested Build Order

1. Widgets (no dependencies)
2. Sections (depend on widgets)
3. Experience (after content)

Next: `/plan {name}` to create backlog items
```

## Analysis Checklist

- [ ] All visible widgets identified
- [ ] Section boundaries marked
- [ ] Chrome elements noted (header, footer, overlays)
- [ ] Animations/interactions catalogued
- [ ] Dependencies mapped
- [ ] Build order suggested
- [ ] Analysis files created in `.claude/analyze/{name}/`
