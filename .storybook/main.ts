import type { StorybookConfig } from '@storybook/react-vite'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { saveDefaultsPlugin } from './plugins/save-defaults.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))

const config: StorybookConfig = {
  stories: [
    {
      directory: '../engine/content/widgets',
      files: '**/*.stories.tsx',
      titlePrefix: 'L1 Content/Widgets',
    },
    {
      directory: '../engine/content/sections/patterns',
      files: '**/*.stories.tsx',
      titlePrefix: 'L1 Content/Sections',
    },
    {
      directory: '../engine/content/chrome',
      files: '**/*.stories.tsx',
      titlePrefix: 'L1 Content/Chrome',
    },
    {
      directory: '../engine/presets',
      files: '**/*.stories.tsx',
      titlePrefix: 'Presets',
    },
    {
      directory: '../engine/themes',
      files: '**/*.stories.tsx',
      titlePrefix: 'Theme',
    },
    {
      directory: '../engine/experience/behaviours',
      files: '**/*.stories.tsx',
      titlePrefix: 'L2 Experience/Behaviours',
    },
    {
      directory: '../engine/experience/experiences',
      files: '**/*.stories.tsx',
      titlePrefix: 'L2 Experience/Experiences',
    },
    {
      directory: '../engine/intro/sequences',
      files: '**/*.stories.tsx',
      titlePrefix: 'L2 Experience/Intros',
    },
  ],
  framework: '@storybook/react-vite',
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
    '@storybook/addon-docs',
    '@storybook/addon-designs',
    '@chromatic-com/storybook',
  ],
  typescript: {
    reactDocgen: false,
  },
  viteFinal: async (config) => {
    config.resolve ??= {}
    config.resolve.alias ??= {}

    const root = resolve(__dirname, '..')
    const aliases = config.resolve.alias as Record<string, string>

    // Match tsconfig paths: @/* -> ./*
    aliases['@'] = root

    // Mock Next.js modules (widgets use next/link, next/image, next/navigation)
    aliases['next/link'] = resolve(__dirname, 'mocks/next-link.tsx')
    aliases['next/image'] = resolve(__dirname, 'mocks/next-image.tsx')
    aliases['next/navigation'] = resolve(__dirname, 'mocks/next-navigation.ts')

    // Polyfill `process` for Next.js internals that leak through
    config.define ??= {}
    config.define['process.env'] = JSON.stringify({})

    // Save-as-defaults plugin for writing control changes back to meta.ts
    config.plugins ??= []
    config.plugins.push(saveDefaultsPlugin())

    return config
  },
}

export default config
