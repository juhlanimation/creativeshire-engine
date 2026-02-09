/**
 * Widget registry - maps type strings to React components.
 * Content Layer (L1) - static component lookup.
 *
 * Widget categories:
 * - primitives/   : Leaf nodes (Text, Image, Icon, Button, Link)
 * - layout/       : Containers (Flex, Box, Stack, Grid, Split, Container)
 * - interactive/  : Stateful widgets (Video, VideoPlayer, ContactPrompt, etc.)
 * - patterns/     : Factory functions (NOT registered - they return WidgetSchema)
 *
 * Note: Patterns (createLogoLink, createProjectCard) are NOT registered here.
 * They return WidgetSchema which the renderer expands into registered widgets.
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

// Interactive (stateful widgets)
import Video from './interactive/Video'
import VideoPlayer from './interactive/VideoPlayer'
import ContactPrompt from './interactive/ContactPrompt'
import ExpandableGalleryRow from './interactive/ExpandableGalleryRow'
import GalleryThumbnail from './interactive/GalleryThumbnail'
import HeroRoles from './interactive/HeroRoles'
import FeaturedProjectsGrid from './interactive/FeaturedProjectsGrid'
import LogoMarquee from './interactive/LogoMarquee'
import TransitionLink from './interactive/TransitionLink'
import VideoCompare from './interactive/VideoCompare'
import ProjectSelector from './interactive/ProjectSelector'
import TabbedContent from './interactive/TabbedContent'
import ShotIndicator from './interactive/ShotIndicator'
import TextMask from './interactive/TextMask'
import EmailReveal from './interactive/EmailReveal'

// Chrome overlays (used by experience chrome)
import SlideIndicators from '../chrome/overlays/SlideIndicators'

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
  // Interactive
  Video,
  VideoPlayer,
  ContactPrompt,
  ExpandableGalleryRow,
  GalleryThumbnail,
  HeroRoles,
  FeaturedProjectsGrid,
  LogoMarquee,
  TransitionLink,
  VideoCompare,
  ProjectSelector,
  TabbedContent,
  ShotIndicator,
  TextMask,
  EmailReveal,
  // Chrome overlays
  SlideIndicators,
}

/**
 * Retrieves a widget component by type string.
 * @param type - Widget type identifier (e.g., 'Text')
 * @returns The widget component or undefined if not found
 */
export function getWidget(type: string): WidgetComponent | undefined {
  return widgetRegistry[type]
}
