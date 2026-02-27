/**
 * Widget builders for primitive widgets.
 * Each builder returns a WidgetSchema with sensible defaults and auto-generated IDs.
 */

import type { WidgetSchema, WidgetEventMap } from '../schema/widget'

// ---------------------------------------------------------------------------
// Auto-ID
// ---------------------------------------------------------------------------

let _counter = 0

function autoId(prefix: string, explicit?: string): string {
  if (explicit) return explicit
  return `${prefix}-${++_counter}`
}

// ---------------------------------------------------------------------------
// Shared builder type for behaviour
// ---------------------------------------------------------------------------

interface BehaviourOption {
  id: string
  options?: Record<string, string | number | boolean>
}

// ---------------------------------------------------------------------------
// Text
// ---------------------------------------------------------------------------

export interface TextBuilderOptions {
  /** Text scale / semantic element: h1, h2, p, small, etc. */
  scale?: string
  style?: Record<string, unknown>
  id?: string
  className?: string
  behaviour?: BehaviourOption
}

/**
 * Build a Text widget schema.
 * @param content - Text content or binding expression
 * @param options - Optional configuration
 */
export function text(content: string, options?: TextBuilderOptions): WidgetSchema {
  return {
    id: autoId('text', options?.id),
    type: 'Text',
    props: {
      content,
      ...(options?.scale && { as: options.scale }),
    },
    ...(options?.style && { style: options.style as WidgetSchema['style'] }),
    ...(options?.className && { className: options.className }),
    ...(options?.behaviour && { behaviour: options.behaviour }),
  }
}

// ---------------------------------------------------------------------------
// Image
// ---------------------------------------------------------------------------

export interface ImageBuilderOptions {
  src: string
  alt?: string
  width?: number | string
  height?: number | string
  style?: Record<string, unknown>
  id?: string
  className?: string
  behaviour?: BehaviourOption
  on?: WidgetEventMap
}

/**
 * Build an Image widget schema.
 */
export function image(options: ImageBuilderOptions): WidgetSchema {
  return {
    id: autoId('image', options.id),
    type: 'Image',
    props: {
      src: options.src,
      ...(options.alt != null && { alt: options.alt }),
      ...(options.width != null && { width: options.width }),
      ...(options.height != null && { height: options.height }),
    },
    ...(options.style && { style: options.style as WidgetSchema['style'] }),
    ...(options.className && { className: options.className }),
    ...(options.behaviour && { behaviour: options.behaviour }),
    ...(options.on && { on: options.on }),
  }
}

// ---------------------------------------------------------------------------
// Icon
// ---------------------------------------------------------------------------

export interface IconBuilderOptions {
  name: string
  size?: number | string
  style?: Record<string, unknown>
  id?: string
  className?: string
}

/**
 * Build an Icon widget schema.
 */
export function icon(options: IconBuilderOptions): WidgetSchema {
  return {
    id: autoId('icon', options.id),
    type: 'Icon',
    props: {
      name: options.name,
      ...(options.size != null && { size: options.size }),
    },
    ...(options.style && { style: options.style as WidgetSchema['style'] }),
    ...(options.className && { className: options.className }),
  }
}

// ---------------------------------------------------------------------------
// Button
// ---------------------------------------------------------------------------

export interface ButtonBuilderOptions {
  label: string
  variant?: string
  href?: string
  style?: Record<string, unknown>
  id?: string
  className?: string
  on?: WidgetEventMap
}

/**
 * Build a Button widget schema.
 */
export function button(options: ButtonBuilderOptions): WidgetSchema {
  return {
    id: autoId('button', options.id),
    type: 'Button',
    props: {
      label: options.label,
      ...(options.variant && { variant: options.variant }),
      ...(options.href && { href: options.href }),
    },
    ...(options.style && { style: options.style as WidgetSchema['style'] }),
    ...(options.className && { className: options.className }),
    ...(options.on && { on: options.on }),
  }
}

// ---------------------------------------------------------------------------
// Link
// ---------------------------------------------------------------------------

export interface LinkBuilderOptions {
  content: string
  href?: string
  variant?: string
  style?: Record<string, unknown>
  id?: string
  className?: string
  on?: WidgetEventMap
}

/**
 * Build a Link widget schema.
 */
export function link(options: LinkBuilderOptions): WidgetSchema {
  return {
    id: autoId('link', options.id),
    type: 'Link',
    props: {
      content: options.content,
      ...(options.href && { href: options.href }),
      ...(options.variant && { variant: options.variant }),
    },
    ...(options.style && { style: options.style as WidgetSchema['style'] }),
    ...(options.className && { className: options.className }),
    ...(options.on && { on: options.on }),
  }
}
