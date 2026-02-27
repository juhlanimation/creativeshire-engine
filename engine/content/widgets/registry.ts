/**
 * Widget registry - maps type strings to React components.
 * Content Layer (L1) - static component lookup.
 *
 * Widget categories (global — reusable across 2+ sections):
 * - primitives/   : Leaf nodes (Text, Image, Icon, Button, Link)
 * - layout/       : Containers (Flex, Box, Stack, Grid, Split, Container, Marquee)
 * - interactive/  : Stateful widgets (Video, VideoPlayer, EmailCopy)
 * - repeaters/    : Array-to-widget repeaters (ExpandRowImageRepeater)
 *
 * Section-scoped widgets register via registerScopedWidget() at module load.
 * They live in sections/patterns/{Section}/components/ and use 'Section__Widget' naming.
 */

import type { ComponentType } from 'react'

// Primitives (leaf nodes)
import Text from './primitives/Text'
import Image from './primitives/Image'
import Icon from './primitives/Icon'
import Button from './primitives/Button'
import Link from './primitives/Link'

// Layout (containers)
import Flex from './layout/Flex'
import Box from './layout/Box'
import Stack from './layout/Stack'
import Grid from './layout/Grid'
import Split from './layout/Split'
import Container from './layout/Container'
import Marquee from './layout/Marquee'

// Interactive (stateful widgets)
import Video from './interactive/Video'
import VideoPlayer from './interactive/VideoPlayer'
import EmailCopy from './interactive/EmailCopy'
import ContactBar from './interactive/ContactBar'
import ArrowLink from './interactive/ArrowLink'
// Repeaters (array-to-widget)
import ExpandRowImageRepeater from './repeaters/ExpandRowImageRepeater'

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Widget props vary by type, registry lookup is untyped
type WidgetComponent = ComponentType<any>

/**
 * Registry mapping widget type strings to their components.
 */
export const widgetRegistry: Record<string, WidgetComponent> = {
  // Primitives
  Text,
  Image,
  Icon,
  Button,
  Link,
  // Layout
  Flex,
  Box,
  Stack,
  Grid,
  Split,
  Container,
  Marquee,
  // Interactive
  Video,
  VideoPlayer,
  EmailCopy,
  ContactBar,
  ArrowLink,
  // Repeaters
  ExpandRowImageRepeater,
}

/**
 * Retrieves a widget component by type string.
 * @param type - Widget type identifier (e.g., 'Text')
 * @returns The widget component or undefined if not found
 */
export function getWidget(type: string): WidgetComponent | undefined {
  return widgetRegistry[type]
}

/**
 * Register a section-internal (scoped) widget.
 * Convention: 'SectionName__ComponentName' (double underscore separator).
 *
 * Scoped widgets are section-internal React components that need to be
 * in the widget registry for the renderer to find them, but are NOT
 * global widgets. They live inside their parent section's `components/` folder.
 *
 * @example
 * registerScopedWidget('SplitGallery__PanelSlider', PanelSlider)
 * // Used in factory: { type: 'SplitGallery__PanelSlider', props: {...} }
 */
export function registerScopedWidget(name: string, component: WidgetComponent): void {
  if (!name.includes('__')) {
    throw new Error(
      `Scoped widget name must use '__' separator: '${name}'. Expected format: 'SectionName__ComponentName'`
    )
  }
  widgetRegistry[name] = component
}
