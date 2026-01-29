# Pages

**Page definitions for this site.**

Structure:
```
pages/
├── index.ts          # Registry: getAllPages, getPageBySlug
├── home.ts           # slug: '/'
├── about.ts          # slug: '/about'
└── projects.ts       # slug: '/projects'
```

Before creating a page:
1. Create `{name}.ts` with PageSchema (id, slug, head, sections)
2. Register in `index.ts` pages array
3. Add to `site/config.ts` pages array

PageSchema structure:
```typescript
{
  id: 'about',
  slug: '/about',
  head: { title: '...', description: '...' },
  sections: [ createAboutSection({...}) ]
}
```
