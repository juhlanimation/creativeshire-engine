/**
 * README generation for site export.
 * Documents the exported project structure and how to edit content.
 */

import type { ContentContract } from '../../engine/presets/types'

export function generateReadme(
  presetId: string,
  presetName: string,
  contract: ContentContract,
): string {
  const lines: string[] = []

  lines.push(`# ${presetName}`)
  lines.push('')
  lines.push(`Exported from the \`${presetId}\` preset using [@creativeshire/engine](https://github.com/creativeshire/creativeshire-engine).`)
  lines.push('')
  lines.push('## Quick Start')
  lines.push('')
  lines.push('```bash')
  lines.push('npm install')
  lines.push('npm run dev')
  lines.push('```')
  lines.push('')
  lines.push('Open [http://localhost:3000](http://localhost:3000) to see your site.')
  lines.push('')

  // Editing content
  lines.push('## Editing Content')
  lines.push('')
  lines.push('All site content lives in `content/content.json`. Edit the values and refresh to see changes.')
  lines.push('')
  lines.push('The field structure is documented in `content-schema.json` (read-only reference).')
  lines.push('')

  // Content sections
  lines.push('### Content Sections')
  lines.push('')
  lines.push('| Section | Description |')
  lines.push('|---------|-------------|')
  for (const section of contract.sections) {
    lines.push(`| \`${section.id}\` | ${section.description ?? section.label} |`)
  }
  lines.push('')

  // Field reference
  lines.push('### Field Types')
  lines.push('')
  lines.push('| Type | Description |')
  lines.push('|------|-------------|')
  lines.push('| `text` | Single line of text |')
  lines.push('| `textarea` | Multi-line text (supports HTML) |')
  lines.push('| `image` | Image path (place files in `public/`) |')
  lines.push('| `string-list` | List of strings |')
  lines.push('| `collection` | Array of objects (see `itemFields`) |')
  lines.push('| `number` | Numeric value |')
  lines.push('| `toggle` | Boolean (true/false) |')
  lines.push('')

  // Images
  lines.push('## Adding Images')
  lines.push('')
  lines.push('1. Place image files in the `public/` directory')
  lines.push('2. Reference them in `content.json` with paths like `/images/my-photo.webp`')
  lines.push('3. Use `.webp` format for best performance')
  lines.push('')

  // Deployment
  lines.push('## Deployment')
  lines.push('')
  lines.push('```bash')
  lines.push('npm run build')
  lines.push('```')
  lines.push('')
  lines.push('Deploy to any Node.js host (Vercel, Netlify, Railway, etc.).')
  lines.push('')
  lines.push('### Vercel (recommended)')
  lines.push('')
  lines.push('1. Push to GitHub')
  lines.push('2. Import in [vercel.com](https://vercel.com)')
  lines.push('3. Deploy automatically on push')
  lines.push('')

  // Updating
  lines.push('## Updating the Engine')
  lines.push('')
  lines.push('To pull the latest engine updates:')
  lines.push('')
  lines.push('```bash')
  lines.push('npm update @creativeshire/engine')
  lines.push('```')
  lines.push('')
  lines.push('Check the engine changelog for any content field changes that may require updating `content.json`.')
  lines.push('')

  // Project structure
  lines.push('## Project Structure')
  lines.push('')
  lines.push('```')
  lines.push('├── app/')
  lines.push('│   ├── layout.tsx          # Fonts + HTML shell')
  lines.push('│   ├── globals.css         # Tailwind + engine styles')
  lines.push('│   ├── providers.tsx       # Engine + Next.js integration')
  lines.push('│   ├── page.tsx            # Home page')
  lines.push('│   └── [slug]/')
  lines.push('│       └── page.tsx        # Dynamic pages')
  lines.push('├── lib/')
  lines.push('│   └── site.ts             # Preset resolution')
  lines.push('├── content/')
  lines.push('│   └── content.json        # ✏️ YOUR CONTENT (edit this!)')
  lines.push('├── content-schema.json     # Field reference (read-only)')
  lines.push('├── public/                 # Static assets (images, videos)')
  lines.push('└── .engine.json            # Export metadata')
  lines.push('```')
  lines.push('')

  return lines.join('\n')
}
