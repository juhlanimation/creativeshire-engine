# Analyst Spec

> Domain-specific agents that identify components from external references and create analysis reports.

## Purpose

Analysts examine external references (websites or source code) to identify components within their domain. They write findings to analysis reports (not directly to backlog). Users review and curate findings, then selectively import items to the backlog for implementation.

**Workflow:** Analyze → Review → Import (to backlog)

## Concepts

| Term | Definition |
|------|------------|
| Analyst | Read-only agent that identifies domain components from references |
| Reference | External source: URL (website) or path (source code) |
| Domain | Analyst's area of expertise (widgets, sections, experience, chrome, layout) |
| Analysis Report | Discovery output in `.claude/analysis/{domain}.md` |
| Backlog Item | Committed work in `backlog.md` (imported from analysis) |
| Builder | Agent that implements backlog items, has access to original reference |

## Analyst Types

| Analyst | Domain | ID Prefix | Identifies |
|---------|--------|-----------|------------|
| `section-analyst` | Sections | `ITEM-Section-` | Hero, Gallery, CTA, Footer patterns |
| `widget-analyst` | Widgets | `ITEM-Widget-` | Text, Image, Button, Card components |
| `experience-analyst` | Experience | `ITEM-Experience-` | Scroll, Parallax, Hover effects |
| `chrome-analyst` | Chrome | `ITEM-Chrome-` | Header, Footer, Modal, Navigation |
| `layout-analyst` | Layout | `ITEM-Layout-` | Grid, Flex, Stack patterns |

## Folder Structure

```
.claude/architecture/agentic-framework/
├── types/
│   └── analyst.spec.md         # This spec
├── validators/
│   └── analyst.validator.ts    # Validates analyst output format
└── *-analyst.agent.md          # Individual analyst contracts

.claude/analysis/                # Analysis output (discovery)
├── SUMMARY.md                  # Consolidated view of all domains
├── widgets.md                  # Widget analyst findings
├── sections.md                 # Section analyst findings
├── chrome.md                   # Chrome analyst findings
├── experience.md               # Experience analyst findings
└── layout.md                   # Layout analyst findings
```

## Interface

### Input

```typescript
interface AnalystInput {
  // Reference to analyze
  reference: {
    type: 'website' | 'source' | 'git'
    url?: string          // Website URL
    path?: string         // Local path
    gitRef?: string       // github:user/repo#branch
  }

  // Analyst configuration
  domain: string          // widget, section, experience, chrome, layout
  analysisPath: string    // Path to analysis folder (.claude/analysis/)

  // Browser context (for website analysis)
  browserTools?: {
    screenshot: () => Promise<void>
    readPage: () => Promise<string>
    navigate: (url: string) => Promise<void>
  }
}
```

### Output

```typescript
interface AnalystOutput {
  domain: string
  itemsCreated: number
  items: BacklogItem[]
  warnings: string[]
}

interface BacklogItem {
  id: string              // ITEM-{Domain}-XXX
  title: string
  type: 'Feature' | 'Refactor' | 'Optimization'
  priority: 'P0' | 'P1' | 'P2' | 'P3'
  description: string
  reference: string       // Original reference URL/path
  considerations: string[]
  specialists: {
    builder: string
    reviewer: string
  }
}
```

## Rules

### Must

1. Only analyze within their domain expertise
2. Output high-level items, not exact specifications
3. Include original reference in each item
4. Use domain-prefixed IDs: `ITEM-{Domain}-XXX`
5. Write to `.claude/analysis/{domain}.md` (not backlog.md)
6. List considerations (not implementation details)
7. Specify which builder/reviewer pair handles the item

### Must Not

1. Create detailed specifications (builders do that)
2. Access files outside their knowledge domain
3. Modify any code files
4. Write directly to backlog.md (use analysis/ folder)
5. Make implementation decisions
6. Skip the reference in analysis items (builders need it)

## Validation Rules

> Each rule maps 1:1 to `analyst.validator.ts`

| # | Rule | Function | What It Checks |
|---|------|----------|----------------|
| 1 | Valid ID prefix | `checkIdPrefix` | ID matches `ITEM-{Domain}-XXX` |
| 2 | Reference included | `checkReferenceIncluded` | Each item has reference URL/path |
| 3 | Builder specified | `checkBuilderSpecified` | Item has builder agent name |
| 4 | Output location | `checkOutputLocation` | Writes to `.claude/analysis/{domain}.md` |
| 5 | No code modifications | `checkNoCodeModifications` | No .ts/.tsx/.css files touched |

## Backlog Item Format

```markdown
#### [ITEM-{Domain}-XXX] {Title}

- **Type:** Feature | Refactor | Optimization
- **Priority:** P0 | P1 | P2 | P3
- **Reference:** {URL or path}
- **Description:**
  {1-2 sentence description of what this component does}

- **Things to consider:**
  - {Consideration 1}
  - {Consideration 2}
  - {Consideration 3}

- **Specialists:**
  - Builder: {domain}-builder
  - Reviewer: {domain}-reviewer
```

## Analysis Methods

### Website Analysis (Browser Automation)

**Requires:** Chrome MCP enabled (`claude --chrome`)

```
1. Navigate to URL
2. Take screenshot for visual context
3. Read DOM structure via read_page
4. Identify domain-relevant patterns
5. For each pattern:
   a. Note location in page
   b. Identify key characteristics
   c. Create backlog item
6. Return structured output
```

### Source Code Analysis (File System)

```
1. Scan directory structure
2. Identify framework (React, Vue, etc.)
3. Find component files matching domain
4. For each component:
   a. Read file content
   b. Identify patterns
   c. Create backlog item
5. Return structured output
```

## Browser Tools (Chrome MCP)

When analyzing websites, use these MCP tools:

### Tab Management

| Tool | Purpose | Example |
|------|---------|---------|
| `mcp__claude-in-chrome__tabs_context_mcp` | Get current tab group | `{ createIfEmpty: true }` |
| `mcp__claude-in-chrome__tabs_create_mcp` | Create new tab | (no params) |

### Navigation

| Tool | Purpose | Example |
|------|---------|---------|
| `mcp__claude-in-chrome__navigate` | Go to URL | `{ url: "https://...", tabId: X }` |

### Page Reading

| Tool | Purpose | Example |
|------|---------|---------|
| `mcp__claude-in-chrome__read_page` | Get DOM/accessibility tree | `{ tabId: X }` |
| `mcp__claude-in-chrome__get_page_text` | Extract plain text | `{ tabId: X }` |
| `mcp__claude-in-chrome__find` | Find elements by description | `{ query: "hero section", tabId: X }` |

### Interaction

| Tool | Purpose | Example |
|------|---------|---------|
| `mcp__claude-in-chrome__computer` | Screenshot, scroll, click | `{ action: "screenshot", tabId: X }` |

### Website Analysis Workflow

```typescript
// 1. Get or create tab
const context = await mcp__claude-in-chrome__tabs_context_mcp({ createIfEmpty: true });
const tabId = context.tabs[0]?.id;

// 2. Navigate to reference URL
await mcp__claude-in-chrome__navigate({ url: referenceUrl, tabId });

// 3. Capture initial screenshot
await mcp__claude-in-chrome__computer({ action: "screenshot", tabId });

// 4. Read page structure
const pageContent = await mcp__claude-in-chrome__read_page({ tabId });

// 5. Scroll to observe animations (for experience-analyst)
await mcp__claude-in-chrome__computer({
  action: "scroll",
  scroll_direction: "down",
  tabId
});

// 6. Find domain-specific elements
const elements = await mcp__claude-in-chrome__find({
  query: "hero section", // domain-specific query
  tabId
});
```

### Best Practices

1. **Always get context first** — Call `tabs_context_mcp` before other tools
2. **Take screenshots** — Visual context helps identify patterns
3. **Scroll the page** — Observe scroll-triggered animations
4. **Use find tool** — Natural language queries for elements
5. **Handle missing Chrome** — If tools unavailable, report error

### Error Handling

| Error | Resolution |
|-------|------------|
| "Chrome not enabled" | Report: "Launch with: claude --chrome" |
| "Tab doesn't exist" | Call `tabs_context_mcp` for fresh IDs |
| Tool not found | Chrome MCP not available |

## Anti-Patterns

### Don't: Write implementation details

```markdown
<!-- WRONG -->
- **Description:**
  Create a hero section with 100vh height, flex layout,
  centered content using justify-center items-center,
  and a gradient background from blue-500 to purple-600.
```

**Why:** Builders will see the original reference. Keep descriptions high-level.

### Don't: Skip the reference

```markdown
<!-- WRONG -->
#### [ITEM-Section-001] Hero Section

- **Type:** Feature
- **Description:** Full-height hero with centered text
```

**Why:** Builders need the reference URL to see what to build.

### Do: Keep descriptions concise

```markdown
<!-- CORRECT -->
#### [ITEM-Section-001] Hero Section with Video Background

- **Type:** Feature
- **Priority:** P1
- **Reference:** https://example.com (Hero section at top)
- **Description:**
  Full-viewport hero with video background and centered text overlay.

- **Things to consider:**
  - Video autoplay on desktop, static image on mobile
  - Text contrast with dynamic background
  - Lazy loading for video performance
```

## Integration

| Interacts With | Direction | How |
|----------------|-----------|-----|
| `/plan analyze` | Called by | Spawned as Task with reference |
| `.claude/analysis/` | Writes to | Creates domain-specific analysis files |
| `/plan import` | Followed by | User curates and imports to backlog |
| Browser MCP | Uses | For website analysis |
| File system | Reads | For source code analysis |
| Builders | Hands off to | Via imported backlog items |

## Validator

Validated by: `.claude/architecture/agentic-framework/validators/analyst.validator.ts`

Rules in "Must/Must Not" map 1:1 to validator checks.
