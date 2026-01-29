/**
 * Widget registry - maps type strings to React components.
 * Content Layer (L1) - static component lookup.
 *
 * Widget categories:
 * - primitives/ : Leaf nodes (Text, Image, Icon, Button, Link)
 * - layout/     : Containers (Flex, Box, Stack, Grid, Split, Container)
 * - composite/  : Assembled widgets with state/logic (Video, ContactPrompt, etc.)
 *
 * Note: Factory-based composites (createLogoLink, createProjectCard) are NOT registered here.
 * They return WidgetSchema which the renderer expands into registered widgets.
 */

import type { ComponentType } from 'react'

// Primitives (leaf nodes)
import Text from './primitives/Text'
import Image from './primitives/Image'
import Icon from './primitives/Icon'
import Button from './primitives/Button'
import Link from './primitives/Link'

// Video (composite - has state and hooks)
import Video from './composite/Video'

// Layout (containers)
import Flex from './layout/Flex'
import Box from './layout/Box'
import Stack from './layout/Stack'
import Grid from './layout/Grid'
import Split from './layout/Split'
import Container from './layout/Container'

// Composites (assembled widgets with state/logic)
import ContactPrompt from './composite/ContactPrompt'
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
  Icon,
  Button,
  Link,
  // Video (composite - has state and hooks)
  Video,
  // Layout
  Flex,
  Box,
  Stack,
  Grid,
  Split,
  Container,
  // Composites
  ContactPrompt,
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
