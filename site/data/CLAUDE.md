# Site Data

**Content data for this site instance.**

Structure:
```
data/
├── projects.ts       # Project content (featured, other)
├── about.ts          # Bio, signature, profile
├── logos.ts          # Client logos
└── {content}.ts      # Additional content types
```

Before creating:
- Is this CONTENT data (text, images, links)?
- Or CONFIGURATION? → Goes in config.ts or preset
- Keep data separate from page structure
- Pages import from here, not the other way
