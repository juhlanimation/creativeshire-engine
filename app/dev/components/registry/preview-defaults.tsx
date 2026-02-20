/**
 * Centralized preview data for widget previews in the registry browser.
 * Provides meaningful sample props so every widget renders visibly.
 */

import type { ReactNode } from 'react'
import type { WidgetSchema } from '../../../../engine/schema'

// =============================================================================
// Types
// =============================================================================

export interface WidgetPreviewConfig {
  /** Override props merged beneath user overrides but above meta defaults */
  props?: Record<string, unknown>
  /** Children passed to the rendered component */
  children?: ReactNode
  /** Extra styles on the wrapper div around the widget (e.g. explicit height for TextMask) */
  wrapperStyle?: React.CSSProperties
}

// =============================================================================
// Colored box helpers — WidgetSchema entries for layout widget previews
// =============================================================================

const BOX_COLORS = [
  'rgba(99, 102, 241, 0.35)',
  'rgba(236, 72, 153, 0.35)',
  'rgba(34, 197, 94, 0.35)',
  'rgba(251, 191, 36, 0.35)',
  'rgba(14, 165, 233, 0.35)',
  'rgba(168, 85, 247, 0.35)',
]

function coloredBox(index: number, overrides?: Partial<WidgetSchema>): WidgetSchema {
  const base: Record<string, unknown> = {
    background: BOX_COLORS[index % BOX_COLORS.length],
    borderRadius: '4px',
    border: '1px solid rgba(255,255,255,0.1)',
    minHeight: '48px',
    minWidth: '40px',
  }
  const { style: extraStyle, ...rest } = overrides ?? {}
  return {
    type: 'Box',
    id: `preview-box-${index}`,
    ...rest,
    style: { ...base, ...((extraStyle as Record<string, unknown>) ?? {}) },
  } as WidgetSchema
}

// =============================================================================
// Preview Defaults Map
// =============================================================================

const WIDGET_PREVIEW_DEFAULTS: Record<string, WidgetPreviewConfig> = {
  // ── Primitives ──
  Text: {
    props: { content: 'The quick brown fox jumps over the lazy dog.', as: 'p' },
  },
  Image: {
    props: {
      src: 'https://picsum.photos/seed/engine-preview/800/500',
      alt: 'Sample image',
    },
  },
  Icon: {
    props: { name: 'arrow-right', size: 32 },
  },
  Button: {
    props: { label: 'Button' },
  },
  Link: {
    props: { href: '#' },
    children: <span>Sample Link</span>,
  },

  // ── Layout (use widgets: WidgetSchema[] — layout widgets render via WidgetRenderer) ──
  Flex: {
    props: {
      direction: 'row',
      gap: 12,
      widgets: [
        coloredBox(0, { style: { background: BOX_COLORS[0], borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', minHeight: '48px', minWidth: '40px', width: '80px' } }),
        coloredBox(1, { style: { background: BOX_COLORS[1], borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', minHeight: '48px', minWidth: '40px', width: '80px' } }),
        coloredBox(2, { style: { background: BOX_COLORS[2], borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', minHeight: '48px', minWidth: '40px', width: '80px' } }),
      ],
    },
  },
  Stack: {
    props: {
      gap: 12,
      widgets: [coloredBox(0), coloredBox(1), coloredBox(2)],
    },
  },
  Grid: {
    props: {
      columns: 3,
      gap: 12,
      widgets: [
        coloredBox(0), coloredBox(1), coloredBox(2),
        coloredBox(3), coloredBox(4), coloredBox(5),
      ],
    },
  },
  Split: {
    props: {
      ratio: '2:1',
      gap: 12,
      widgets: [
        coloredBox(0, { style: { background: BOX_COLORS[0], borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', minHeight: '80px', minWidth: '40px' } }),
        coloredBox(1, { style: { background: BOX_COLORS[1], borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', minHeight: '80px', minWidth: '40px' } }),
      ],
    },
  },
  Box: {
    props: {
      widgets: [
        coloredBox(0, { style: { background: BOX_COLORS[0], borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', minHeight: '60px', minWidth: '40px' } }),
      ],
    },
  },
  Container: {
    props: {
      maxWidth: '600px',
      widgets: [
        coloredBox(3, { style: { background: BOX_COLORS[3], borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', minHeight: '60px', minWidth: '40px' } }),
      ],
    },
  },

  // ── Interactive ──
  Video: {
    props: {
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      poster: 'https://picsum.photos/seed/video-preview/800/450',
      autoplay: false,
      muted: true,
    },
  },
  VideoPlayer: {
    props: {
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      poster: 'https://picsum.photos/seed/videoplayer/800/450',
    },
  },
  EmailCopy: {
    props: { email: 'hello@example.com', variant: 'flip', label: 'How can I help you?' },
  },
  Marquee: {
    props: {
      duration: 30,
      gap: 24,
      widgets: [
        coloredBox(0, { style: { background: BOX_COLORS[0], borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', minHeight: '48px', minWidth: '40px', width: '120px' } }),
        coloredBox(1, { style: { background: BOX_COLORS[1], borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', minHeight: '48px', minWidth: '40px', width: '120px' } }),
        coloredBox(2, { style: { background: BOX_COLORS[2], borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', minHeight: '48px', minWidth: '40px', width: '120px' } }),
        coloredBox(3, { style: { background: BOX_COLORS[3], borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', minHeight: '48px', minWidth: '40px', width: '120px' } }),
      ],
    },
  },
  ExpandRowImageRepeater: {
    props: {
      projects: [
        { id: 'p1', thumbnailSrc: 'https://picsum.photos/seed/egr1/400/300', thumbnailAlt: 'Project 1', title: 'Project A', client: 'Client X', year: '2024', role: 'Director' },
        { id: 'p2', thumbnailSrc: 'https://picsum.photos/seed/egr2/400/300', thumbnailAlt: 'Project 2', title: 'Project B', client: 'Client Y', year: '2023', role: 'Editor' },
        { id: 'p3', thumbnailSrc: 'https://picsum.photos/seed/egr3/400/300', thumbnailAlt: 'Project 3', title: 'Project C', client: 'Client Z', year: '2024', role: 'Producer' },
      ],
    },
    wrapperStyle: { height: '300px' },
  },
}

// =============================================================================
// Public API
// =============================================================================

/**
 * Get preview config for a widget type.
 * Returns undefined if no preview defaults are registered.
 */
export function getPreviewConfig(widgetType: string): WidgetPreviewConfig | undefined {
  return WIDGET_PREVIEW_DEFAULTS[widgetType]
}
