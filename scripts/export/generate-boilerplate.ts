/**
 * Boilerplate file generation for site export.
 * Generates package.json, next.config.ts, tsconfig.json, tailwind.config.ts, postcss.config.mjs.
 */

/**
 * Generate package.json for the exported site.
 */
export function generatePackageJson(
  siteName: string,
  engineGitUrl: string,
): string {
  const pkg = {
    name: siteName,
    version: '1.0.0',
    private: true,
    scripts: {
      dev: 'next dev',
      build: 'next build',
      start: 'next start',
      lint: 'next lint',
    },
    dependencies: {
      '@creativeshire/engine': engineGitUrl,
      next: '^15.3.3',
      react: '^19.0.0',
      'react-dom': '^19.0.0',
    },
    devDependencies: {
      '@tailwindcss/postcss': '^4',
      '@types/node': '^20',
      '@types/react': '^19',
      '@types/react-dom': '^19',
      postcss: '^8',
      tailwindcss: '^4',
      typescript: '^5',
    },
  }

  return JSON.stringify(pkg, null, 2) + '\n'
}

/**
 * Generate next.config.ts.
 */
export function generateNextConfig(): string {
  return `import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Transpile the engine package (ships as TypeScript source)
  transpilePackages: ['@creativeshire/engine'],
  images: {
    // Add remote image domains as needed
    remotePatterns: [],
  },
}

export default nextConfig
`
}

/**
 * Generate tsconfig.json.
 */
export function generateTsConfig(): string {
  const config = {
    compilerOptions: {
      target: 'ES2017',
      lib: ['dom', 'dom.iterable', 'esnext'],
      allowJs: true,
      skipLibCheck: true,
      strict: true,
      noEmit: true,
      esModuleInterop: true,
      module: 'esnext',
      moduleResolution: 'bundler',
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: 'preserve',
      incremental: true,
      plugins: [{ name: 'next' }],
      paths: {
        '@/*': ['./*'],
      },
    },
    include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
    exclude: ['node_modules'],
  }

  return JSON.stringify(config, null, 2) + '\n'
}

/**
 * Generate tailwind.config.ts.
 */
export function generateTailwindConfig(): string {
  return `import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './node_modules/@creativeshire/engine/**/*.{ts,tsx}',
  ],
}

export default config
`
}

/**
 * Generate postcss.config.mjs.
 */
export function generatePostcssConfig(): string {
  return `/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}

export default config
`
}

/**
 * Generate .engine.json metadata file.
 */
export function generateEngineJson(
  presetId: string,
  engineVersion: string,
): string {
  const meta = {
    preset: presetId,
    engineVersion,
    exportedAt: new Date().toISOString(),
    generator: '@creativeshire/engine export-site',
  }

  return JSON.stringify(meta, null, 2) + '\n'
}
