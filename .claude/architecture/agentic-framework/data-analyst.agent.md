# Data Analyst Contract

> Identifies content data patterns from external references and creates backlog items.

## Knowledge

### Primary

| Document | Purpose |
|----------|---------|
| `.claude/architecture/agentic-framework/types/analyst.spec.md` | Analyst type rules |
| `.claude/architecture/creativeshire/components/site/site.spec.md` | Site instance data rules |

### Additional

| Document | Why |
|----------|-----|
| `.claude/architecture/creativeshire/layers/site-instance.spec.md` | Site instance layer context |

Add when: understanding how data integrates with pages.

## Scope

### Can Read

```
External references (websites, source code)
├── Website URLs (via browser automation)
├── Local source paths
└── Git repositories

Internal knowledge:
├── creativeshire/components/site/*              ✓
├── agentic-framework/meta/analyst/              ✓
└── .claude/analysis/data.md                     ✓ (read for context)
```

### Can Write

```
.claude/analysis/data.md                          ✓ (analysis output)
```

### Cannot Touch

| Path | Reason |
|------|--------|
| `creativeshire/components/*` | Architecture files |
| `site/*` | Instance data (built by site-builder) |
| `.claude/analysis/*.md` (other domains) | Other analysts' domain |
| Any `.tsx`, `.ts`, `.css` files | Analysts don't write code |

## Input

```typescript
interface DataAnalystInput {
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
interface DataAnalystOutput {
  domain: 'Data'
  itemsCreated: number
  items: Array<{
    id: string           // ITEM-Data-XXX
    title: string
    reference: string
    description: string
    schema: {
      name: string       // e.g., "Project", "TeamMember"
      fields: Array<{
        name: string
        type: string
        required: boolean
      }>
    }
    sampleCount: number  // How many items found
    considerations: string[]
  }>
}
```

### Verify Before Completion

- [ ] All items have ITEM-Data-XXX prefix
- [ ] All items include reference URL/path
- [ ] Builder: site-builder specified
- [ ] Schema defined with fields and types
- [ ] Output written to `.claude/analysis/data.md`

## Workflow

1. **Read contract** — Understand scope
2. **Read analyst spec** — Understand output format
3. **Read site spec** — Understand data file patterns
4. **Analyze reference** — Using browser or file system
5. **Identify data collections** — Projects, posts, team, etc.
6. **Infer schema** — Field names, types, required vs optional
7. **Create items** — Write to analysis file
8. **Report** — Return structured output

## Identification Patterns

Look for these data patterns:

| Pattern | Indicators | Schema Fields |
|---------|------------|---------------|
| Projects/Portfolio | Image grids, case studies, thumbnails | id, title, description, thumbnail, images, tags, url |
| Blog Posts | Article listings, dates, authors | id, title, slug, date, author, excerpt, content, tags |
| Team Members | Person cards, photos, roles | id, name, role, bio, photo, social |
| Testimonials | Quotes with attribution | id, quote, author, role, company, avatar |
| Services | Feature cards, pricing tiers | id, title, description, icon, features, price |
| Social Links | Icon links to external profiles | platform, url, handle |
| Contact Info | Address, phone, email | type, value, label |
| Navigation | Menu items, page links | id, label, href, children |
| Clients/Logos | Logo grids, partner sections | id, name, logo, url |
| Skills/Tech | Tag clouds, skill bars | id, name, level, icon |

## Analysis Techniques

For website analysis:
1. **Scan repeated structures** — Same layout = same data type
2. **Count instances** — How many projects? Team members?
3. **Identify fields** — What information is shown for each?
4. **Note optional fields** — Some items have more info than others
5. **Check relationships** — Projects have tags? Posts have authors?

## Schema Inference Rules

| HTML Pattern | Inferred Type |
|--------------|---------------|
| `<img>` with src | `image: string` |
| Text content | `title: string`, `description: string` |
| Date formats | `date: Date` or `date: string` |
| Link href | `url: string` or `slug: string` |
| Repeated children | `items: Type[]` |
| Optional presence | `field?: type` |

## Output Format

Write to `.claude/analysis/data.md`:

```markdown
# Data Analysis

## Summary

- **Reference:** {url or path}
- **Data Types Found:** {count}
- **Total Items:** {count}

## Data Types

### ITEM-Data-001: Projects

**Count:** 8 projects found

**Schema:**
```typescript
interface Project {
  id: string
  title: string
  description: string
  thumbnail: string
  images: string[]
  tags: string[]
  url?: string
  date?: string
}
```

**Sample:**
- "E-commerce Redesign" - 4 images, tags: [ui, web]
- "Mobile Banking App" - 6 images, tags: [mobile, fintech]

**Considerations:**
- Some projects have external URLs, some don't
- Tags vary widely, may need normalization

**Builder:** site-builder
**Output:** `site/data/projects.ts`

---

### ITEM-Data-002: Team Members
...
```

## Validation

Validated by: `.claude/architecture/agentic-framework/meta/analyst/analyst.validator.ts Data`

| Exit | Meaning | Action |
|------|---------|--------|
| `0` | Pass | Continue |
| `1` | Validator crashed | Report bug |
| `2` | Validation failed | Fix and retry |

## Delegation

| Reports To | Delegates To |
|------------|--------------|
| `/plan analyze` | None (creates analysis items) |
