# App (Next.js Routes)

**Next.js App Router entry points.**

Structure:
```
app/
├── [[...slug]]/
│   └── page.tsx      # Catch-all handles ALL pages (including /)
├── layout.tsx        # Root layout
└── globals.css       # Global styles
```

Before modifying:
- ALL pages handled by `app/[[...slug]]/page.tsx`
- Don't create manual route files—add pages to registry instead
- `generateStaticParams()` handles static generation
- `generateMetadata()` handles SEO from PageSchema.head

**Next.js 16 Cache Components pattern:**
```typescript
// Async params access must be in Suspense boundary
async function PageContent({ params }: PageProps) {
  const { slug } = await params  // async access here
  // ...render
}

export default function Page(props: PageProps) {
  return (
    <Suspense>
      <PageContent {...props} />
    </Suspense>
  )
}
```

Without Suspense, you get: "Uncached data was accessed outside of <Suspense>"
