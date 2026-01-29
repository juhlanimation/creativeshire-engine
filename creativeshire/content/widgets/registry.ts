/**
 * Widget registry - maps type strings to React components.
 * Content Layer (L1) - static component lookup.
 *
 * Widget categories:
 * - primitives/ : Leaf nodes (Text, Image, Video)
 * - layout/     : Containers (Flex, Box)
 * - composite/  : Assembled widgets with state/logic (ContactPrompt, LogoLink, etc.)
 */

import type { ComponentType } from 'react'

// Primitives (leaf nodes)
import Text from './primitives/Text'
import Image from './primitives/Image'
import Video from './primitives/Video'
import Icon from './primitives/Icon'
import Button from './primitives/Button'

// Layout (containers)
import Flex from './layout/Flex'
import Box from './layout/Box'
import Stack from './layout/Stack'
import Grid from './layout/Grid'
import Split from './layout/Split'
import Container from './layout/Container'

// Composites (assembled widgets with state/logic)
import ContactPrompt from './composite/ContactPrompt'
import LogoLink from './composite/LogoLink'
import ExpandableGalleryRow from './composite/ExpandableGalleryRow'

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- Widget props vary by type
type WidgetComponent = ComponentType<any>

/**
 * Registry mapping widget type strings to their components.
 */
export const widgetRegistry: Record<string, WidgetComponent> = {
  // Primitives
  Text,
  Image,
  Video,
  Icon,
  Button,
  // Layout
  Flex,
  Box,
  Stack,
  Grid,
  Split,
  Container,
  // Composites
  ContactPrompt,
  LogoLink,
  ExpandableGalleryRow,
}

/**
 * Retrieves a widget component by type string.
 * @param type - Widget type identifier (e.g., 'Text')
 * @returns The widget component or undefined if not found
 */
export function getWidget(type: string): WidgetComponent | undefined {
  return widgetRegistry[type]
}
