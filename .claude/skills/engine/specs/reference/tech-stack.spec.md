# Tech Stack

> Core technologies and configuration powering creativeshire. Reference this for version requirements and layer-specific guidance.

---

## Overview

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.x | App Router, Cache Components (`"use cache"`) |
| React | 19.x | UI rendering |
| TypeScript | 5.x | Type safety (strict mode) |
| Tailwind CSS | 4.x | Utility-first styling |
| GSAP | 3.x | Animation engine (ScrollTrigger) |

---

## Configuration Files

| File | Purpose |
|------|---------|
| `next.config.ts` | Next.js configuration, cache components |
| `postcss.config.mjs` | Tailwind v4 via `@tailwindcss/postcss` |
| `app/globals.css` | Design tokens, `@theme inline`, base styles |
| `tsconfig.json` | TypeScript config, `@/` path alias |
| `lib/utils.ts` | Shared utilities (`cn()` for class merging) |

---

## Path Alias

`@/` maps to project root in `tsconfig.json`:

```typescript
import { Section } from '@/engine/content/sections';
import { cn } from '@/lib/utils';
```

---

## Layer-Specific Guidance

| Topic | Affects | Reference |
|-------|---------|-----------|
| Styling | Widgets, sections, chrome, features, behaviours, drivers | [styling.md](tech-stack/styling.md) |
| Caching | Schema, pages, site data | [caching.md](tech-stack/caching.md) |

---

## Dependencies

### Required

| Package | Purpose | Used By |
|---------|---------|---------|
| `clsx` | Conditional class strings | `cn()` utility |
| `tailwind-merge` | Merge conflicting Tailwind classes | `cn()` utility |
| `class-variance-authority` | Variant-based styling | Widgets with variants |

### Installation

```bash
npm install clsx tailwind-merge class-variance-authority
```

---

## See Also

- [Folder Structure](folders.spec.md) - Where everything lives
- [Naming Conventions](naming.spec.md) - How to name things
- [File Patterns](file-patterns.spec.md) - File naming by component type
