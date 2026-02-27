import type { StorybookConfig } from '@storybook/react-vite'
import tailwindcss from '@tailwindcss/vite'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { saveDefaultsPlugin } from './plugins/save-defaults.ts'
import { exportSitePlugin } from './plugins/export-site.ts'

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
      directory: '../engine/experience/effects',
      files: '**/*.stories.tsx',
      titlePrefix: 'L2 Experience/Effects',
    },
    {
      directory: '../engine/experience/timeline',
      files: '**/*.stories.tsx',
      titlePrefix: 'L2 Experience/Timeline',
    },
    {
      directory: '../engine/experience/transitions',
      files: '**/*.stories.tsx',
      titlePrefix: 'L2 Experience/Transitions',
    },
    {
      directory: '../engine/experience/drivers',
      files: '**/*.stories.tsx',
      titlePrefix: 'Infrastructure',
    },
    {
      directory: '../engine/experience/triggers',
      files: '**/*.stories.tsx',
      titlePrefix: 'Infrastructure',
    },
    {
      directory: '../engine/experience/compositions',
      files: '**/*.stories.tsx',
      titlePrefix: 'L2 Experience/Compositions',
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

    // Save-as-defaults plugin for writing control changes back to meta.ts
    config.plugins ??= []
    config.plugins.push(tailwindcss())
    config.plugins.push(saveDefaultsPlugin())
    config.plugins.push(exportSitePlugin())

    return config
  },
}

export default config
