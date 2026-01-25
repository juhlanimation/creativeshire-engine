---
name: react-best-practices
description: React and Next.js performance optimization patterns from Vercel Engineering. Use when writing, reviewing, or refactoring React components, server components, data fetching, or optimizing bundle size.
user-invocable: false
---

# React Best Practices

Performance optimization patterns from Vercel Engineering, organized into domain-specific bundles for our agentic framework.

## Bundle Reference

| Bundle | Description | Agents |
|--------|-------------|--------|
| [component-rendering.md](bundles/component-rendering.md) | Re-render and rendering optimization | widget, section, chrome, provider, trigger |
| [server-components.md](bundles/server-components.md) | Server components and async patterns | renderer, section |
| [client-runtime.md](bundles/client-runtime.md) | Client events and advanced patterns | trigger, driver |
| [bundle-optimization.md](bundles/bundle-optimization.md) | Import and bundle size | All component builders |
| [js-performance.md](bundles/js-performance.md) | Pure JavaScript patterns | behaviour, driver, composites |

## For Agents

Agents should reference specific bundles in their Knowledge section:

```markdown
## Knowledge

### Additional

| Document | Why |
|----------|-----|
| `.claude/skills/react-best-practices/bundles/component-rendering.md` | React optimization |
```

## Updating

To sync with upstream Vercel rules:

```bash
npm run sync:react-rules
```

This regenerates bundles from the latest upstream rules while maintaining stable bundle paths.

## Source

Upstream: [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills)
