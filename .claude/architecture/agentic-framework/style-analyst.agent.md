# Style Analyst Contract

> Identifies design tokens and styling patterns from external references and creates backlog items.

## Knowledge

### Primary

| Document | Purpose |
|----------|---------|
| `.claude/architecture/agentic-framework/types/analyst.spec.md` | Analyst type rules |
| `.claude/architecture/creativeshire/components/content/feature.spec.md` | Feature decorator rules |

### Additional

| Document | Why |
|----------|-----|
| `.claude/architecture/creativeshire/reference/styling.spec.md` | Styling patterns and CSS variables |
| `.claude/architecture/creativeshire/reference/css-variables.spec.md` | CSS variable catalog |

Add when: understanding how design tokens integrate with components.

## Scope

### Can Read

```
External references (websites, source code)
├── Website URLs (via browser automation)
├── Local source paths
└── Git repositories

Internal knowledge:
├── creativeshire/components/content/feature*     ✓
├── creativeshire/reference/styling*              ✓
├── agentic-framework/meta/analyst/               ✓
└── .claude/analysis/styles.md                    ✓ (read for context)
```

### Can Write

```
.claude/analysis/styles.md                         ✓ (analysis output)
```

### Cannot Touch

| Path | Reason |
|------|--------|
| `creativeshire/components/*` | Architecture files |
| `.claude/analysis/*.md` (other domains) | Other analysts' domain |
| Any `.tsx`, `.ts`, `.css` files | Analysts don't write code |

## Input

```typescript
interface StyleAnalystInput {
  reference: {
    type: 'website' | 'source' | 'git'
    url?: string
    path?: string
  }
  analysisPath: string  // Path to .claude/analysis/
}
```

## Output

```typescript
interface StyleAnalystOutput {
  domain: 'Style'
  itemsCreated: number
  items: Array<{
    id: string           // ITEM-Style-XXX
    title: string
    reference: string
    description: string
    tokens: {
      colors: Record<string, string>
      typography: Record<string, string>
      spacing: Record<string, string>
      other: Record<string, string>
    }
    considerations: string[]
  }>
}
```

### Verify Before Completion

- [ ] All items have ITEM-Style-XXX prefix
- [ ] All items include reference URL/path
- [ ] Builder: feature-builder or schema-builder specified
- [ ] Token values extracted with CSS values
- [ ] Output written to `.claude/analysis/styles.md`

## Workflow

1. **Read contract** — Understand scope
2. **Read analyst spec** — Understand output format
3. **Read feature spec** — Understand styling patterns
4. **Analyze reference** — Extract computed styles
5. **Identify tokens** — Colors, typography, spacing
6. **Create items** — Write to analysis file
7. **Report** — Return structured output

## Identification Patterns

Look for these style patterns:

### Colors

| Pattern | Indicators | Token Name |
|---------|------------|------------|
| Primary | Main CTA buttons, links | `--color-primary` |
| Secondary | Secondary buttons | `--color-secondary` |
| Accent | Highlights, badges | `--color-accent` |
| Background | Page/section backgrounds | `--color-bg-*` |
| Text | Body text, headings | `--color-text-*` |
| Border | Dividers, outlines | `--color-border` |

### Typography

| Pattern | Indicators | Token Name |
|---------|------------|------------|
| Font Family | Body vs headings | `--font-*` |
| Font Size | Scale from sm to 6xl | `--text-*` |
| Font Weight | Regular, medium, bold | `--font-weight-*` |
| Line Height | Tight, normal, relaxed | `--leading-*` |
| Letter Spacing | Tight, wide | `--tracking-*` |

### Spacing

| Pattern | Indicators | Token Name |
|---------|------------|------------|
| Section Padding | Vertical rhythm | `--space-section` |
| Container Width | Max content width | `--container-*` |
| Gap | Grid/flex gaps | `--gap-*` |
| Margin/Padding | Component spacing | `--space-*` |

### Other

| Pattern | Indicators | Token Name |
|---------|------------|------------|
| Border Radius | Rounded corners | `--radius-*` |
| Shadow | Box shadows | `--shadow-*` |
| Transition | Animation timing | `--duration-*` |
| Z-Index | Stacking layers | `--z-*` |

## Analysis Techniques

For website analysis:
1. **Inspect computed styles** — Use DevTools to see actual values
2. **Sample multiple elements** — Buttons, headings, cards, etc.
3. **Look for patterns** — Same color used in multiple places = token
4. **Note variations** — Primary-50 through primary-900
5. **Check dark mode** — If present, note alternate values

## Extraction Commands (Browser DevTools)

```javascript
// Get all unique colors from a page
const colors = new Set();
document.querySelectorAll('*').forEach(el => {
  const style = getComputedStyle(el);
  colors.add(style.color);
  colors.add(style.backgroundColor);
});

// Get font families
const fonts = new Set();
document.querySelectorAll('*').forEach(el => {
  fonts.add(getComputedStyle(el).fontFamily);
});
```

## Output Format

Write to `.claude/analysis/styles.md`:

```markdown
# Style Analysis

## Summary

- **Reference:** {url or path}
- **Color Palette:** {monochrome, vibrant, neutral, etc.}
- **Typography:** {modern, classic, playful, etc.}
- **Overall Style:** {minimal, bold, elegant, etc.}

## Design Tokens

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#2563eb` | Buttons, links |
| `--color-primary-hover` | `#1d4ed8` | Button hover |
| `--color-bg` | `#ffffff` | Page background |
| `--color-bg-muted` | `#f3f4f6` | Section backgrounds |
| `--color-text` | `#111827` | Body text |
| `--color-text-muted` | `#6b7280` | Secondary text |

### Typography

| Token | Value | Usage |
|-------|-------|-------|
| `--font-sans` | `'Inter', system-ui, sans-serif` | Body |
| `--font-display` | `'Playfair Display', serif` | Headings |
| `--text-base` | `1rem / 1.5` | Body text |
| `--text-lg` | `1.125rem / 1.75` | Lead text |
| `--text-4xl` | `2.25rem / 1.2` | Hero headings |

### Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--space-section` | `6rem` | Section padding |
| `--space-container` | `max(1rem, 5vw)` | Container padding |
| `--gap-grid` | `2rem` | Grid gaps |

### Effects

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | `0.25rem` | Buttons |
| `--radius-lg` | `1rem` | Cards |
| `--shadow-sm` | `0 1px 2px rgb(0 0 0 / 0.05)` | Subtle lift |
| `--shadow-lg` | `0 10px 15px rgb(0 0 0 / 0.1)` | Card shadow |

---

### ITEM-Style-001: Design Tokens

**Description:** Core design tokens for the site theme

**Tokens:**
- 8 color tokens (primary palette)
- 6 typography tokens
- 4 spacing tokens
- 4 effect tokens

**Considerations:**
- Dark mode not detected - may need to add
- Font requires Google Fonts import
- Spacing uses clamp() for fluid sizing

**Builder:** schema-builder (for theme types), feature-builder (for decorators)
**Output:** `creativeshire/schema/theme.ts`, `creativeshire/content/features/theme/`
```

## Validation

Validated by: `.claude/architecture/agentic-framework/meta/analyst/analyst.validator.ts Style`

| Exit | Meaning | Action |
|------|---------|--------|
| `0` | Pass | Continue |
| `1` | Validator crashed | Report bug |
| `2` | Validation failed | Fix and retry |

## Delegation

| Reports To | Delegates To |
|------------|--------------|
| `/plan analyze` | None (creates analysis items) |
