import { forwardRef } from 'react'
import { sectionStoryConfig, sectionStoryArgs } from '../../../../../.storybook/helpers/auto-story'
import { registerScopedWidget } from '../../../widgets/registry'
import type { WidgetBaseProps } from '../../../widgets/types'
import { meta } from './meta'
import { createReactSection } from './index'
import { content } from './content'
import type { ReactSectionProps } from './meta'

// --------------------------------------------------------------------------
// Mock React component — registered as a scoped widget for the story
// --------------------------------------------------------------------------

interface MockComponentProps extends WidgetBaseProps {
  title?: string
}

const MockComponent = forwardRef<HTMLDivElement, MockComponentProps>(
  function MockComponent({ title = 'React Section Demo', style, className }, ref) {
    return (
      <div
        ref={ref}
        className={className}
        style={{
          padding: '4rem 2rem',
          textAlign: 'center',
          background: 'var(--bg-secondary, #1a1a2e)',
          color: 'var(--text-primary, #fff)',
          minHeight: '300px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          ...style,
        }}
      >
        <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading, sans-serif)' }}>
          {title}
        </h2>
        <p style={{ opacity: 0.7, maxWidth: '480px', fontFamily: 'var(--font-body, sans-serif)' }}>
          This is a custom React component rendered as a first-class engine section.
          It participates in chrome, transitions, and section-level behaviours.
        </p>
      </div>
    )
  },
)

// Register mock component so the widget registry can find it
registerScopedWidget('ReactSectionDemo__MockComponent', MockComponent)

// --------------------------------------------------------------------------
// Story configuration
// --------------------------------------------------------------------------

const factory = (props: Record<string, unknown>) =>
  createReactSection({
    component: 'ReactSectionDemo__MockComponent',
    props: { title: 'React Section Demo' },
    ...props,
  } as ReactSectionProps)

const config = sectionStoryConfig(meta, factory)

export default {
  ...config,
  title: 'Content/React Section',
  parameters: { ...config.parameters, a11y: { test: 'error' } },
}

export const Default = {
  args: sectionStoryArgs(meta, {
    ...content.sampleContent,
    component: 'ReactSectionDemo__MockComponent',
    props: { title: 'React Section Demo' },
  } as Partial<ReactSectionProps>, factory),
}
