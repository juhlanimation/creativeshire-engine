# Creativeshire Engine Inventory

**Generated:** 26/02/2026, 10:11:33

## Summary

| Category | Count |
|----------|-------|
| Widgets: Primitives | 5 |
| Widgets: Layout | 7 |
| Widgets: Interactive | 4 |
| Sections | 14 |
| Chrome: Patterns | 8 |
| Chrome: Overlays | 5 |
| Behaviours | 21 |
| Effects | 11 |
| Experiences | 1 |
| Transitions | 1 |
| Drivers | 6 |
| Triggers | 5 |
| Presets | 4 |
| **Total** | **92** |

---

## Widgets: Primitives

> Basic building blocks (Text, Image, Icon, Button, Link)

| Component | Path | index | types | meta | styles | CMS Editable |
|-----------|------|:-----:|:-----:|:----:|:------:|:-------------|
| **Button** | `content/widgets/primitives/Button` | ✅ | ✅ | ✅ | ✅ | `label` |
| **Icon** | `content/widgets/primitives/Icon` | ✅ | ✅ | ✅ | ✅ | `name`, `label` |
| **Image** | `content/widgets/primitives/Image` | ✅ | ✅ | ✅ | ✅ | `src`, `alt`, `filter` |
| **Link** | `content/widgets/primitives/Link` | ✅ | ✅ | ✅ | ✅ | `href` |
| **Text** | `content/widgets/primitives/Text` | ✅ | ✅ | ✅ | ✅ | `content` |

---

## Widgets: Layout

> Structural containers (Flex, Stack, Grid, Split, Container, Box)

| Component | Path | index | types | meta | styles | CMS Editable |
|-----------|------|:-----:|:-----:|:----:|:------:|:-------------|
| **Box** | `content/widgets/layout/Box` | ✅ | ✅ | ✅ | ✅ | `width`, `height`, `minWidth`, `maxWidth`, `flexGrow`, `flexShrink` |
| **Container** | `content/widgets/layout/Container` | ✅ | ✅ | ✅ | ✅ | `maxWidth`, `padding`, `center` |
| **Flex** | `content/widgets/layout/Flex` | ✅ | ✅ | ✅ | ✅ | `direction`, `align`, `justify`, `wrap`, `gap`, `gapScale` |
| **Grid** | `content/widgets/layout/Grid` | ✅ | ✅ | ✅ | ✅ | `columns`, `rows`, `gap`, `gapScale`, `columnGap`, `rowGap` |
| **Marquee** | `content/widgets/layout/Marquee` | ✅ | ✅ | ✅ | ✅ | `duration`, `gap`, `gapScale`, `direction` |
| **Split** | `content/widgets/layout/Split` | ✅ | ✅ | ✅ | ✅ | `ratio`, `gap`, `gapScale`, `reverse`, `align` |
| **Stack** | `content/widgets/layout/Stack` | ✅ | ✅ | ✅ | ✅ | `gap`, `gapScale`, `align` |

---

## Widgets: Interactive

> Stateful React components (Video, VideoPlayer, EmailCopy, etc.)

| Component | Path | index | types | meta | styles | CMS Editable |
|-----------|------|:-----:|:-----:|:----:|:------:|:-------------|
| **ContactBar** | `content/widgets/interactive/ContactBar` | ✅ | ✅ | ✅ | ✅ | `links` |
| **EmailCopy** | `content/widgets/interactive/EmailCopy` | ✅ | ✅ | ✅ | ✅ | `email`, `label` |
| **Video** | `content/widgets/interactive/Video` | ✅ | ✅ | ✅ | ✅ | `src`, `poster`, `alt`, `posterTime`, `loopStartTime`, `overlayTitle`, `videoUrl` |
| **VideoPlayer** | `content/widgets/interactive/VideoPlayer` | ✅ | ✅ | ✅ | ✅ | `src`, `poster`, `autoPlay`, `startTime` |

---

## Sections

> Page section patterns (Hero, About, FeaturedProjects, etc.)

| Component | Path | index | types | meta | styles | CMS Editable |
|-----------|------|:-----:|:-----:|:----:|:------:|:-------------|
| **AboutBio** | `content/sections/patterns/AboutBio` | ✅ | ✅ | ✅ | ✅ | — |
| **AboutCollage** | `content/sections/patterns/AboutCollage` | ✅ | ✅ | ✅ | ✅ | `images[]` |
| **ContentPricing** | `content/sections/patterns/ContentPricing` | ✅ | ✅ | ✅ | ✅ | `plans[]` |
| **HeroTitle** | `content/sections/patterns/HeroTitle` | ✅ | ✅ | ✅ | ✅ | — |
| **HeroVideo** | `content/sections/patterns/HeroVideo` | ✅ | ✅ | ✅ | ✅ | — |
| **ProjectCompare** | `content/sections/patterns/ProjectCompare` | ✅ | ✅ | ✅ | ✅ | — |
| **ProjectExpand** | `content/sections/patterns/ProjectExpand` | ✅ | ✅ | ✅ | ✅ | `videos[]` |
| **ProjectFeatured** | `content/sections/patterns/ProjectFeatured` | ✅ | ✅ | ✅ | ✅ | — |
| **ProjectGallery** | `content/sections/patterns/ProjectGallery` | ✅ | ✅ | ✅ | ✅ | `projects[]` |
| **ProjectShowcase** | `content/sections/patterns/ProjectShowcase` | ✅ | ✅ | ✅ | ✅ | — |
| **ProjectStrip** | `content/sections/patterns/ProjectStrip` | ✅ | ✅ | ✅ | ✅ | — |
| **ProjectTabs** | `content/sections/patterns/ProjectTabs` | ✅ | ✅ | ✅ | ✅ | `tabs[]` |
| **ProjectVideoGrid** | `content/sections/patterns/ProjectVideoGrid` | ✅ | ✅ | ✅ | ✅ | `videos[]` |
| **TeamShowcase** | `content/sections/patterns/TeamShowcase` | ✅ | ✅ | ✅ | ✅ | `members[]` |

---

## Chrome: Patterns

> Widget-based region factories (FixedNav, ContactFooter, etc.)

| Component | Path | index | types | meta | styles | CMS Editable |
|-----------|------|:-----:|:-----:|:----:|:------:|:-------------|
| **BrandFooter** | `content/chrome/patterns/BrandFooter` | ✅ | ✅ | ✅ | ✅ | — |
| **CenteredNav** | `content/chrome/patterns/CenteredNav` | ✅ | ✅ | ✅ | — | — |
| **ContactFooter** | `content/chrome/patterns/ContactFooter` | ✅ | ✅ | ✅ | ✅ | — |
| **CursorTracker** | `content/chrome/patterns/CursorTracker` | ✅ | ✅ | ✅ | — | — |
| **FixedNav** | `content/chrome/patterns/FixedNav` | ✅ | ✅ | ✅ | ✅ | — |
| **FloatingContact** | `content/chrome/patterns/FloatingContact` | ✅ | ✅ | ✅ | — | — |
| **MinimalNav** | `content/chrome/patterns/MinimalNav` | ✅ | ✅ | ✅ | ✅ | — |
| **VideoModal** | `content/chrome/patterns/VideoModal` | ✅ | ✅ | ✅ | — | — |

---

## Chrome: Overlays

> Modal, CursorLabel, NavTimeline, SlideIndicators

| Component | Path | index | types | meta | styles | CMS Editable |
|-----------|------|:-----:|:-----:|:----:|:------:|:-------------|
| **CursorLabel** | `content/chrome/overlays/CursorLabel` | ✅ | ✅ | ✅ | ✅ | — |
| **FixedCard** | `content/chrome/overlays/FixedCard` | ✅ | ✅ | ✅ | ✅ | — |
| **Modal** | `content/chrome/overlays/Modal` | ✅ | ✅ | ✅ | ✅ | — |
| **NavTimeline** | `content/chrome/overlays/NavTimeline` | ✅ | ✅ | ✅ | ✅ | — |
| **SlideIndicators** | `content/chrome/overlays/SlideIndicators` | ✅ | ✅ | ✅ | ✅ | — |

---

## Behaviours

> L2 trigger-based behaviours (scroll/, hover/, visibility/, etc.)

| Component | Path | index | types | meta | styles | CMS Editable |
|-----------|------|:-----:|:-----:|:----:|:------:|:-------------|
| **scroll/collapse** | `experience/behaviours/scroll/collapse` | ✅ | ❌ | ✅ | — | — |
| **scroll/color-shift** | `experience/behaviours/scroll/color-shift` | ✅ | ❌ | ✅ | — | — |
| **scroll/cover-progress** | `experience/behaviours/scroll/cover-progress` | ✅ | ❌ | ✅ | — | — |
| **scroll/fade** | `experience/behaviours/scroll/fade` | ✅ | ❌ | ✅ | — | — |
| **scroll/fade-out** | `experience/behaviours/scroll/fade-out` | ✅ | ❌ | ✅ | — | — |
| **scroll/image-cycle** | `experience/behaviours/scroll/image-cycle` | ✅ | ❌ | ✅ | — | — |
| **scroll/progress** | `experience/behaviours/scroll/progress` | ✅ | ❌ | ✅ | — | — |
| **scroll/reveal** | `experience/behaviours/scroll/reveal` | ✅ | ❌ | ✅ | — | — |
| **hover/expand** | `experience/behaviours/hover/expand` | ✅ | ❌ | ✅ | — | — |
| **hover/reveal** | `experience/behaviours/hover/reveal` | ✅ | ❌ | ✅ | — | — |
| **hover/scale** | `experience/behaviours/hover/scale` | ✅ | ❌ | ✅ | — | — |
| **visibility/center** | `experience/behaviours/visibility/center` | ✅ | ❌ | ✅ | — | — |
| **visibility/fade-in** | `experience/behaviours/visibility/fade-in` | ✅ | ❌ | ✅ | — | — |
| **animation/marquee** | `experience/behaviours/animation/marquee` | ✅ | ❌ | ✅ | — | — |
| **interaction/toggle** | `experience/behaviours/interaction/toggle` | ✅ | ❌ | ✅ | — | — |
| **video/frame** | `experience/behaviours/video/frame` | ✅ | ❌ | ✅ | — | — |
| **intro/chrome-reveal** | `experience/behaviours/intro/chrome-reveal` | ✅ | ❌ | ✅ | — | — |
| **intro/content-reveal** | `experience/behaviours/intro/content-reveal` | ✅ | ❌ | ✅ | — | — |
| **intro/scroll-indicator** | `experience/behaviours/intro/scroll-indicator` | ✅ | ❌ | ✅ | — | — |
| **intro/step** | `experience/behaviours/intro/step` | ✅ | ❌ | ✅ | — | — |
| **intro/text-reveal** | `experience/behaviours/intro/text-reveal` | ✅ | ❌ | ✅ | — | — |

---

## Effects

> L2 CSS animations (fade, transform/, mask/, emphasis/)

| Name | Path |
|------|------|
| **emphasis/pulse** | `experience/effects/emphasis/pulse.css` |
| **emphasis/spin** | `experience/effects/emphasis/spin.css` |
| **color-shift/color-shift** | `experience/effects/color-shift/color-shift.css` |
| **fade/fade** | `experience/effects/fade/fade.css` |
| **marquee/marquee-scroll** | `experience/effects/marquee/marquee-scroll.css` |
| **mask/reveal** | `experience/effects/mask/reveal.css` |
| **mask/wipe** | `experience/effects/mask/wipe.css` |
| **overlay/overlay-darken** | `experience/effects/overlay/overlay-darken.css` |
| **transform/scale** | `experience/effects/transform/scale.css` |
| **transform/slide** | `experience/effects/transform/slide.css` |
| **reveal/clip-path** | `experience/effects/reveal/clip-path.css` |

---

## Experiences

> Experience definitions (stacking, slideshow, infinite-carousel)

| Name | Path |
|------|------|
| **createExperienceStore** | `experience/compositions/createExperienceStore.ts` |

---

## Transitions

> Page transition definitions (fade, etc.)

| Component | Path | index | types | meta | styles | CMS Editable |
|-----------|------|:-----:|:-----:|:----:|:------:|:-------------|
| **fade** | `experience/transitions/fade` | ✅ | ❌ | ✅ | — | — |

---

## Drivers

> Infrastructure (ScrollDriver, MomentumDriver, SmoothScrollProvider)

| Name | Path |
|------|------|
| **getDriver** | `experience/drivers/getDriver.ts` |
| **MomentumDriver** | `experience/drivers/MomentumDriver.ts` |
| **ScrollDriver** | `experience/drivers/ScrollDriver.ts` |
| **SmoothScrollContext** | `experience/drivers/SmoothScrollContext.ts` |
| **useScrollFadeDriver** | `experience/drivers/useScrollFadeDriver.ts` |
| **useSmoothScrollContainer** | `experience/drivers/useSmoothScrollContainer.ts` |

---

## Triggers

> React hooks for behaviours (useScrollProgress, useIntersection, etc.)

| Name | Path |
|------|------|
| **useCursorPosition** | `experience/triggers/useCursorPosition.ts` |
| **useIntersection** | `experience/triggers/useIntersection.ts` |
| **usePrefersReducedMotion** | `experience/triggers/usePrefersReducedMotion.ts` |
| **useScrollProgress** | `experience/triggers/useScrollProgress.ts` |
| **useViewport** | `experience/triggers/useViewport.ts` |

---

## Presets

> Site templates (noir, prism, loft)

| Component | Path | index | types | meta | styles | CMS Editable |
|-----------|------|:-----:|:-----:|:----:|:------:|:-------------|
| **loft** | `presets/loft` | ✅ | ❌ | ❌ | — | — |
| **noir** | `presets/noir` | ✅ | ❌ | ❌ | — | — |
| **prism** | `presets/prism` | ✅ | ❌ | ❌ | ✅ | — |
| **test-multipage** | `presets/test-multipage` | ✅ | ❌ | ❌ | — | — |

---

## Data Schemas

> TypeScript interfaces used in array props. These define the fields for CMS data entry.

### `AboutCollageImage`

**Used by:** AboutCollage

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `src` | `string` | ✅ | — |
| `alt` | `string` | ✅ | — |

### `BioLink`

**Used by:** AboutBio

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `text` | `string` | ✅ | Link display text |
| `href` | `string` | ✅ | Link destination |

### `DecoratorRef`

**Used by:** decorators

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `id` | `string` | ✅ | Decorator ID from registry |
| `params` | `Record<string, unknown>` | — | Per-instance param overrides |
| `overlayKeys` | `Record<string, string>` | — | Override overlay key mapping |

### `ExpandableVideoItem`

**Used by:** ProjectExpand

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `id` | `string` | ✅ | Unique item ID |
| `thumbnailSrc` | `string` | ✅ | Thumbnail image URL |
| `thumbnailAlt` | `string` | ✅ | Thumbnail alt text |
| `videoSrc` | `string` | — | Video source for hover preview (optional) |
| `videoUrl` | `string` | ✅ | Video URL for modal playback |
| `title` | `string` | ✅ | Video/project title |
| `client` | `string` | — | Client name |
| `studio` | `string` | — | Studio name |
| `year` | `string` | — | Year |
| `role` | `string` | — | Role/position |

### `ExpandRowItem`

**Used by:** ExpandRowThumbnail

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `id` | `string` | ✅ | Unique item ID |
| `thumbnailSrc` | `string` | ✅ | Thumbnail image source |
| `thumbnailAlt` | `string` | ✅ | Thumbnail alt text |
| `videoSrc` | `string` | — | Video source for hover playback (optional) |
| `videoUrl` | `string` | — | Video URL for modal playback (optional) |
| `title` | `string` | ✅ | Project title |
| `client` | `string` | ✅ | Client name |
| `studio` | `string` | ✅ | Studio name |
| `year` | `string` | ✅ | Project year |
| `role` | `string` | ✅ | Role in project |

### `ExternalLink`

**Used by:** ProjectTabs

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `href` | `string` | ✅ | Link URL |
| `icon` | `string` | ✅ | Icon name (e.g., 'instagram') |

### `FeaturedProject`

**Used by:** ProjectFeatured

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `thumbnailSrc` | `string` | ✅ | Thumbnail image source |
| `thumbnailAlt` | `string` | ✅ | Thumbnail alt text |
| `videoSrc` | `string` | — | Video source for playback (optional) |
| `videoUrl` | `string` | — | Video URL for modal playback (optional) |
| `client` | `string` | ✅ | Client name |
| `studio` | `string` | ✅ | Studio name |
| `title` | `string` | ✅ | Project title |
| `description` | `string` | ✅ | Project description |
| `year` | `string` | ✅ | Project year |
| `role` | `string` | ✅ | Role in project |

### `FlexGalleryCardRepeaterItem`

**Used by:** FlexGalleryCardRepeater

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `id` | `string` | ✅ | Unique identifier |
| `thumbnail` | `string` | ✅ | Thumbnail image source |
| `alt` | `string` | — | Thumbnail alt text |
| `title` | `string` | ✅ | Project title |
| `year` | `string` | — | Project year (optional) |
| `studio` | `string` | — | Studio name (optional) |
| `role` | `string` | — | Role (optional, shown in info card) |
| `url` | `string` | — | Video/external URL (optional) |
| `posterTime` | `number` | — | Time in seconds to seek to for thumbnail frame display |

### `GalleryProject`

**Used by:** ProjectGallery

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `id` | `string` | ✅ | Unique identifier |
| `thumbnail` | `string` | ✅ | Thumbnail image URL |
| `video` | `string` | ✅ | Main video URL |
| `title` | `string` | ✅ | Project title |
| `year` | `string` | ✅ | Project year |
| `studio` | `string` | ✅ | Studio name |
| `url` | `string` | — | External URL (optional) |
| `role` | `string` | — | Role in the project (e.g. "Animation Lead") |
| `posterTime` | `number` | — | Time in seconds to seek to for video poster frame |

### `IndexNavItem`

**Used by:** IndexNav

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `label` | `string` | ✅ | Display label for the button |
| `value` | `string \| number` | — | Optional value associated with this item |
| `videoSrc` | `string` | — | Optional video source for shot switching |

### `LogoItem`

**Used by:** AboutBio, MarqueeImageRepeater

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `name` | `string` | ✅ | Logo name for identification |
| `src` | `string` | ✅ | Image source URL |
| `alt` | `string` | ✅ | Alt text for accessibility |
| `height` | `number` | ✅ | Display height in pixels - adjust per logo for visual balance |

### `MemberItem`

**Used by:** TeamShowcase

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `id` | `string` | ✅ | Unique identifier |
| `name` | `string` | ✅ | Display name |
| `subtitle` | `string` | — | Optional subtitle (role, title, etc.) |
| `videoSrc` | `string` | ✅ | Video source URL |
| `videoPoster` | `string` | — | Video poster/thumbnail |
| `href` | `string` | — | Optional link URL |

### `NavLink`

**Used by:** ContactFooter

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `label` | `string` | ✅ | — |
| `href` | `string` | ✅ | — |

### `OtherProject`

**Used by:** ProjectStrip

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `id` | `string` | ✅ | Unique project ID |
| `thumbnailSrc` | `string` | ✅ | Thumbnail image source |
| `thumbnailAlt` | `string` | ✅ | Thumbnail alt text |
| `videoSrc` | `string` | — | Video source for hover preview (optional) |
| `videoUrl` | `string` | — | Video URL for modal playback (optional) |
| `title` | `string` | ✅ | Project title |
| `client` | `string` | ✅ | Client name |
| `studio` | `string` | ✅ | Studio name |
| `year` | `string` | ✅ | Project year |
| `role` | `string` | ✅ | Role in project |

### `PricingFeature`

**Used by:** ContentPricing

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `label` | `string` | ✅ | Feature name/description |
| `included` | `boolean \| 'partial'` | ✅ | Included status: true = check, false = x, 'partial' = plus/limited |
| `tooltip` | `string` | — | Optional tooltip/explanation |

### `PricingIcons`

**Used by:** ContentPricing

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `included` | `string` | — | Icon for included feature (default: checkmark) |
| `excluded` | `string` | — | Icon for excluded feature (default: x/cross) |
| `partial` | `string` | — | Icon for partial/limited feature (default: plus) |

### `PricingPlan`

**Used by:** ContentPricing

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `id` | `string` | ✅ | Unique identifier |
| `name` | `string` | ✅ | Plan name (e.g., "Basic", "Pro", "Enterprise") |
| `price` | `string` | ✅ | Price display (e.g., "$99/mo", "Contact us", "Free") |
| `period` | `string` | — | Optional price period (e.g., "/month", "/year") |
| `description` | `string` | — | Plan description |
| `features` | `PricingFeature[]` | ✅ | Features list with inclusion status |
| `ctaText` | `string` | — | CTA button text |
| `ctaHref` | `string` | — | CTA button link |
| `highlighted` | `boolean` | — | Highlight this plan (recommended/popular) |
| `badge` | `string` | — | Badge text (e.g., "Most Popular", "Best Value") |

### `ProjectTab`

**Used by:** ProjectTabs

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `id` | `string` | ✅ | Unique tab identifier |
| `label` | `string` | ✅ | Tab label |
| `layout` | `'standard' \| 'compact'` | ✅ | Layout type |
| `info` | `ProjectTabInfo` | — | Project info (for standard layout) |
| `videos` | `TabVideo[]` | ✅ | Videos for this tab |

### `ProjectTabInfo`

**Used by:** ProjectTabs

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `title` | `string` | ✅ | Project title |
| `client` | `string` | ✅ | Client name |
| `studio` | `string` | ✅ | Studio name |
| `role` | `string` | ✅ | Role in project |

### `ShowcaseMember`

**Used by:** StackVideoShowcase

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `name` | `string` | ✅ | Display name |
| `videoSrc` | `string` | — | Video source URL (played as background when active) |
| `videoPoster` | `string` | — | Video poster/thumbnail |
| `href` | `string` | — | External link URL (opens on click when active) |

### `SocialLink`

**Used by:** ContactBar

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `platform` | `SocialPlatform` | ✅ | Platform identifier — determines icon and behaviour (email = copy-to-clipboard) |
| `url` | `string` | ✅ | URL for link platforms, or email address for 'email' platform |
| `label` | `string` | — | Accessible label override (defaults to platform name) |

### `TabItem`

**Used by:** TabbedContent

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `id` | `string` | ✅ | Unique identifier for the tab |
| `label` | `string` | ✅ | Tab label displayed in header |
| `content` | `WidgetSchema[]` | ✅ | Content widgets for this tab panel |

### `TabVideo`

**Used by:** ProjectTabs

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `src` | `string` | ✅ | Video source URL |
| `title` | `string` | ✅ | Video title |

### `VideoGridItem`

**Used by:** ProjectVideoGrid

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `src` | `string` | ✅ | Video source URL |
| `title` | `string` | ✅ | Video title (for hover display) |
| `aspectRatio` | `'16/9' \| '9/16' \| '1/1'` | ✅ | Aspect ratio in CSS-native format |
| `poster` | `string` | — | Poster/thumbnail image shown when not hovering |
| `posterTime` | `number` | — | Time in seconds to seek to for initial frame display (when no poster image) |

## Quick Reference

### Widgets: Primitives (5)
Button, Icon, Image, Link, Text

### Widgets: Layout (7)
Box, Container, Flex, Grid, Marquee, Split, Stack

### Widgets: Interactive (4)
ContactBar, EmailCopy, Video, VideoPlayer

### Sections (14)
AboutBio, AboutCollage, ContentPricing, HeroTitle, HeroVideo, ProjectCompare, ProjectExpand, ProjectFeatured, ProjectGallery, ProjectShowcase, ProjectStrip, ProjectTabs, ProjectVideoGrid, TeamShowcase

### Chrome: Patterns (8)
BrandFooter, CenteredNav, ContactFooter, CursorTracker, FixedNav, FloatingContact, MinimalNav, VideoModal

### Chrome: Overlays (5)
CursorLabel, FixedCard, Modal, NavTimeline, SlideIndicators

### Behaviours (21)
scroll/collapse, scroll/color-shift, scroll/cover-progress, scroll/fade, scroll/fade-out, scroll/image-cycle, scroll/progress, scroll/reveal, hover/expand, hover/reveal, hover/scale, visibility/center, visibility/fade-in, animation/marquee, interaction/toggle, video/frame, intro/chrome-reveal, intro/content-reveal, intro/scroll-indicator, intro/step, intro/text-reveal

### Effects (11)
emphasis/pulse, emphasis/spin, color-shift/color-shift, fade/fade, marquee/marquee-scroll, mask/reveal, mask/wipe, overlay/overlay-darken, transform/scale, transform/slide, reveal/clip-path

### Experiences (1)
createExperienceStore

### Transitions (1)
fade

### Drivers (6)
getDriver, MomentumDriver, ScrollDriver, SmoothScrollContext, useScrollFadeDriver, useSmoothScrollContainer

### Triggers (5)
useCursorPosition, useIntersection, usePrefersReducedMotion, useScrollProgress, useViewport

### Presets (4)
loft, noir, prism, test-multipage
