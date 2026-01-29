# Site Instance

**The assembled site—what gets deployed.**

Structure:
```
site/
├── config.ts         # Site configuration (uses preset)
├── pages/            # Page definitions
│   ├── index.ts      # Page registry + getPageBySlug
│   ├── home.ts       # Home page
│   └── {page}.ts     # Additional pages
└── data/             # Content data (projects, about, etc.)
```

**Site vs Preset:**
- Preset = template (starting point in creativeshire/presets/)
- Site = assembled instance (this folder)

Flow: Pick preset → copy to site/ → customize

Before creating pages:
- Add page to `pages/{name}.ts`
- Register in `pages/index.ts`
- Add to `config.ts` pages array
