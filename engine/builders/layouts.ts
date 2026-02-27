/**
 * Widget builders for layout widgets.
 * Each builder accepts layout-specific options and a children array.
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
// Common fields shared by all layout builders
// ---------------------------------------------------------------------------

interface LayoutCommonOptions {
  style?: Record<string, unknown>
  id?: string
  className?: string
  behaviour?: BehaviourOption
  on?: WidgetEventMap
  __repeat?: string
  'data-index'?: string | number
  'data-reversed'?: boolean | string
}

// ---------------------------------------------------------------------------
// Flex
// ---------------------------------------------------------------------------

export interface FlexBuilderOptions extends LayoutCommonOptions {
  direction?: 'row' | 'column'
  align?: string
  justify?: string
  gap?: number | string
  wrap?: boolean
}

/**
 * Build a Flex layout widget schema.
 */
export function flex(options: FlexBuilderOptions, children: WidgetSchema[]): WidgetSchema {
  return {
    id: autoId('flex', options.id),
    type: 'Flex',
    props: {
      ...(options.direction && { direction: options.direction }),
      ...(options.align && { align: options.align }),
      ...(options.justify && { justify: options.justify }),
      ...(options.gap != null && { gap: options.gap }),
      ...(options.wrap != null && { wrap: options.wrap }),
    },
    widgets: children,
    ...(options.style && { style: options.style as WidgetSchema['style'] }),
    ...(options.className && { className: options.className }),
    ...(options.behaviour && { behaviour: options.behaviour }),
    ...(options.on && { on: options.on }),
    ...(options.__repeat && { __repeat: options.__repeat }),
    ...(options['data-index'] != null && { 'data-index': options['data-index'] }),
    ...(options['data-reversed'] != null && { 'data-reversed': options['data-reversed'] }),
  }
}

// ---------------------------------------------------------------------------
// Stack
// ---------------------------------------------------------------------------

export interface StackBuilderOptions extends LayoutCommonOptions {
  direction?: 'row' | 'column'
  gap?: number | string
  align?: string
}

/**
 * Build a Stack layout widget schema.
 */
export function stack(options: StackBuilderOptions, children: WidgetSchema[]): WidgetSchema {
  return {
    id: autoId('stack', options.id),
    type: 'Stack',
    props: {
      ...(options.direction && { direction: options.direction }),
      ...(options.gap != null && { gap: options.gap }),
      ...(options.align && { align: options.align }),
    },
    widgets: children,
    ...(options.style && { style: options.style as WidgetSchema['style'] }),
    ...(options.className && { className: options.className }),
    ...(options.behaviour && { behaviour: options.behaviour }),
    ...(options.on && { on: options.on }),
    ...(options.__repeat && { __repeat: options.__repeat }),
    ...(options['data-index'] != null && { 'data-index': options['data-index'] }),
    ...(options['data-reversed'] != null && { 'data-reversed': options['data-reversed'] }),
  }
}

// ---------------------------------------------------------------------------
// Grid
// ---------------------------------------------------------------------------

export interface GridBuilderOptions extends LayoutCommonOptions {
  columns?: number
  rows?: number
  gap?: number | string
}

/**
 * Build a Grid layout widget schema.
 */
export function grid(options: GridBuilderOptions, children: WidgetSchema[]): WidgetSchema {
  return {
    id: autoId('grid', options.id),
    type: 'Grid',
    props: {
      ...(options.columns != null && { columns: options.columns }),
      ...(options.rows != null && { rows: options.rows }),
      ...(options.gap != null && { gap: options.gap }),
    },
    widgets: children,
    ...(options.style && { style: options.style as WidgetSchema['style'] }),
    ...(options.className && { className: options.className }),
    ...(options.behaviour && { behaviour: options.behaviour }),
    ...(options.on && { on: options.on }),
    ...(options.__repeat && { __repeat: options.__repeat }),
    ...(options['data-index'] != null && { 'data-index': options['data-index'] }),
    ...(options['data-reversed'] != null && { 'data-reversed': options['data-reversed'] }),
  }
}

// ---------------------------------------------------------------------------
// Split
// ---------------------------------------------------------------------------

export interface SplitBuilderOptions extends LayoutCommonOptions {
  ratio?: string
  gap?: number | string
  direction?: 'row' | 'column'
}

/**
 * Build a Split layout widget schema.
 */
export function split(options: SplitBuilderOptions, children: WidgetSchema[]): WidgetSchema {
  return {
    id: autoId('split', options.id),
    type: 'Split',
    props: {
      ...(options.ratio && { ratio: options.ratio }),
      ...(options.gap != null && { gap: options.gap }),
      ...(options.direction && { direction: options.direction }),
    },
    widgets: children,
    ...(options.style && { style: options.style as WidgetSchema['style'] }),
    ...(options.className && { className: options.className }),
    ...(options.behaviour && { behaviour: options.behaviour }),
    ...(options.on && { on: options.on }),
    ...(options.__repeat && { __repeat: options.__repeat }),
    ...(options['data-index'] != null && { 'data-index': options['data-index'] }),
    ...(options['data-reversed'] != null && { 'data-reversed': options['data-reversed'] }),
  }
}

// ---------------------------------------------------------------------------
// Container
// ---------------------------------------------------------------------------

export interface ContainerBuilderOptions extends LayoutCommonOptions {
  maxWidth?: number | string
  padding?: number | string
}

/**
 * Build a Container layout widget schema.
 */
export function container(options: ContainerBuilderOptions, children: WidgetSchema[]): WidgetSchema {
  return {
    id: autoId('container', options.id),
    type: 'Container',
    props: {
      ...(options.maxWidth != null && { maxWidth: options.maxWidth }),
      ...(options.padding != null && { padding: options.padding }),
    },
    widgets: children,
    ...(options.style && { style: options.style as WidgetSchema['style'] }),
    ...(options.className && { className: options.className }),
    ...(options.behaviour && { behaviour: options.behaviour }),
    ...(options.on && { on: options.on }),
    ...(options.__repeat && { __repeat: options.__repeat }),
    ...(options['data-index'] != null && { 'data-index': options['data-index'] }),
    ...(options['data-reversed'] != null && { 'data-reversed': options['data-reversed'] }),
  }
}

// ---------------------------------------------------------------------------
// Box
// ---------------------------------------------------------------------------

export interface BoxBuilderOptions extends LayoutCommonOptions {
  padding?: number | string
}

/**
 * Build a Box layout widget schema.
 */
export function box(options: BoxBuilderOptions, children: WidgetSchema[]): WidgetSchema {
  return {
    id: autoId('box', options.id),
    type: 'Box',
    props: {
      ...(options.padding != null && { padding: options.padding }),
    },
    widgets: children,
    ...(options.style && { style: options.style as WidgetSchema['style'] }),
    ...(options.className && { className: options.className }),
    ...(options.behaviour && { behaviour: options.behaviour }),
    ...(options.on && { on: options.on }),
    ...(options.__repeat && { __repeat: options.__repeat }),
    ...(options['data-index'] != null && { 'data-index': options['data-index'] }),
    ...(options['data-reversed'] != null && { 'data-reversed': options['data-reversed'] }),
  }
}
