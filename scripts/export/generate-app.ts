/**
 * App file generation for site export.
 * Generates layout.tsx, providers.tsx, page.tsx, [slug]/page.tsx, lib/site.ts.
 */

import type { SitePreset } from '../../engine/presets/types'
import { toCamelFromKebab } from '../scaffold-utils'

// =============================================================================
// Font Resolution
// =============================================================================

/**
 * Known font CSS variable → Google Font name mapping.
 * The engine themes reference fonts via var(--font-xxx) variables.
 * This maps those variables to the actual Google Font to import in Next.js.
 */
const FONT_VARIABLE_MAP: Record<string, { importName: string; family: string; isVariable?: boolean }> = {
  '--font-inter': { importName: 'Inter', family: 'Inter' },
  '--font-plus-jakarta': { importName: 'Plus_Jakarta_Sans', family: 'Plus Jakarta Sans', isVariable: true },
  '--font-dm-sans': { importName: 'DM_Sans', family: 'DM Sans' },
  '--font-space-grotesk': { importName: 'Space_Grotesk', family: 'Space Grotesk' },
  '--font-syne': { importName: 'Syne', family: 'Syne' },
  '--font-manrope': { importName: 'Manrope', family: 'Manrope' },
  '--font-archivo': { importName: 'Archivo', family: 'Archivo' },
  '--font-instrument-serif': { importName: 'Instrument_Serif', family: 'Instrument Serif' },
  '--font-jetbrains-mono': { importName: 'JetBrains_Mono', family: 'JetBrains Mono' },
  '--font-noto-sans-mono': { importName: 'Noto_Sans_Mono', family: 'Noto Sans Mono' },
}

interface FontInfo {
  variableName: string
  importName: string
  instanceName: string
}

/**
 * Extract required font variables from the preset's theme.
 * Reads typography config to find var(--font-xxx) references.
 */
export function extractFonts(preset: SitePreset): FontInfo[] {
  const theme = preset.theme.theme
  const typography = theme.typography
  if (!typography) {
    // Default fonts when no typography config
    return [
      { variableName: '--font-inter', importName: 'Inter', instanceName: 'inter' },
      { variableName: '--font-plus-jakarta', importName: 'Plus_Jakarta_Sans', instanceName: 'plusJakarta' },
    ]
  }

  const seen = new Set<string>()
  const fonts: FontInfo[] = []

  for (const value of [typography.title, typography.heading, typography.paragraph, typography.ui]) {
    if (!value) continue
    const match = value.match(/^var\((--font-[^)]+)\)/)
    if (!match) continue
    const varName = match[1]
    if (seen.has(varName)) continue
    seen.add(varName)

    const mapped = FONT_VARIABLE_MAP[varName]
    if (mapped) {
      fonts.push({
        variableName: varName,
        importName: mapped.importName,
        instanceName: toCamelFromKebab(varName.replace('--font-', '')),
      })
    }
  }

  // Fallback if no fonts detected
  if (fonts.length === 0) {
    return [
      { variableName: '--font-inter', importName: 'Inter', instanceName: 'inter' },
      { variableName: '--font-plus-jakarta', importName: 'Plus_Jakarta_Sans', instanceName: 'plusJakarta' },
    ]
  }

  return fonts
}

// =============================================================================
// Layout
// =============================================================================

export function generateLayout(
  preset: SitePreset,
  siteTitle: string,
  siteDescription: string,
): string {
  const fonts = extractFonts(preset)

  const fontImports = fonts.map(f => f.importName).join(', ')
  const fontConsts = fonts.map(f =>
    `const ${f.instanceName} = ${f.importName}({\n  subsets: ['latin'],\n  variable: '${f.variableName}',\n})`
  ).join('\n\n')
  const fontClasses = fonts.map(f => `\${${f.instanceName}.variable}`).join(' ')

  return `import { ${fontImports} } from 'next/font/google'
import './globals.css'

${fontConsts}

export const metadata = {
  title: ${JSON.stringify(siteTitle)},
  description: ${JSON.stringify(siteDescription)},
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={\`${fontClasses}\`}>
      <body>{children}</body>
    </html>
  )
}
`
}

// =============================================================================
// Providers
// =============================================================================

export function generateProviders(): string {
  return `'use client'

import NextImage from 'next/image'
import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import { EngineProvider } from '@creativeshire/engine/interface'
import type { SiteSchema, PageSchema } from '@creativeshire/engine/schema'

const framework = { Image: NextImage, Link: NextLink, useRouter }

interface SiteProvidersProps {
  site: SiteSchema
  page: PageSchema
  children: React.ReactNode
}

export function SiteProviders({ site, page, children }: SiteProvidersProps) {
  return (
    <EngineProvider
      input={{ site, page, isPreview: false }}
      framework={framework}
    >
      {children}
    </EngineProvider>
  )
}
`
}

// =============================================================================
// lib/site.ts
// =============================================================================

export function generateLibSite(presetId: string): string {
  const presetVarName = `${toCamelFromKebab(presetId)}Preset`
  const importPath = `@creativeshire/engine/presets/${presetId}`

  return `import { buildSiteSchemaFromPreset, buildPageFromPreset, ensurePresetsRegistered } from '@creativeshire/engine/presets'
import { ensureExperiencesRegistered } from '@creativeshire/engine/experience'
import { ensureThemesRegistered } from '@creativeshire/engine/themes'
import { ${presetVarName} } from '${importPath}'
import content from '../content/content.json'

// Ensure all engine registries are populated before resolution
ensurePresetsRegistered()
ensureExperiencesRegistered()
ensureThemesRegistered()

/**
 * Build the resolved site schema from the preset + content.
 * Content bindings ({{ content.xxx }}) are resolved against content.json.
 */
export const site = buildSiteSchemaFromPreset('${presetId}', ${presetVarName}, {
  content: content as Record<string, unknown>,
})

/**
 * Get a resolved page by slug.
 */
export function getPage(slug: string) {
  return buildPageFromPreset(${presetVarName}, slug, content as Record<string, unknown>)
}

/**
 * Get all page slugs for static generation.
 */
export function getPageSlugs(): string[] {
  return Object.values(${presetVarName}.content.pages).map(p => p.slug)
}
`
}

// =============================================================================
// Home page (app/page.tsx)
// =============================================================================

export function generateHomePage(): string {
  return `import { SiteRenderer } from '@creativeshire/engine'
import { site, getPage } from '@/lib/site'
import { SiteProviders } from './providers'

export default function HomePage() {
  const page = getPage('/')
  if (!page) {
    return <div>No home page found. Check your preset configuration.</div>
  }

  return (
    <SiteProviders site={site} page={page}>
      <SiteRenderer site={site} page={page} />
    </SiteProviders>
  )
}
`
}

// =============================================================================
// Dynamic page (app/[slug]/page.tsx)
// =============================================================================

export function generateDynamicPage(): string {
  return `import { notFound } from 'next/navigation'
import { SiteRenderer } from '@creativeshire/engine'
import { site, getPage, getPageSlugs } from '@/lib/site'
import { SiteProviders } from '../providers'

export function generateStaticParams() {
  return getPageSlugs()
    .filter(s => s !== '/')
    .map(slug => ({ slug: slug.replace(/^\\//, '') }))
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params
  const page = getPage(\`/\${slug}\`)

  if (!page) {
    return notFound()
  }

  return (
    <SiteProviders site={site} page={page}>
      <SiteRenderer site={site} page={page} />
    </SiteProviders>
  )
}
`
}
