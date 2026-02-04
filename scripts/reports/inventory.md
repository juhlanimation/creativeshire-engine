# Creativeshire Engine Inventory

**Generated:** 04/02/2026, 13:11:56

## Summary

| Category | Count |
|----------|-------|
| Widgets: Primitives | 5 |
| Widgets: Layout | 6 |
| Widgets: Interactive | 8 |
| Widgets: Patterns | 2 |
| Sections | 4 |
| Chrome: Regions | 1 |
| Chrome: Overlays | 4 |
| Behaviours | 11 |
| Effects | 9 |
| Experiences | 4 |
| Drivers | 5 |
| Triggers | 5 |
| Presets | 1 |
| **Total** | **65** |

---

## Widgets: Primitives

> Basic building blocks (Text, Image, Icon, Button, Link)

| Component | Path | index | types | meta | styles | CMS Editable |
|-----------|------|:-----:|:-----:|:----:|:------:|:-------------|
| **Button** | `content/widgets/primitives/Button` | ✅ | ✅ | ✅ | ✅ | `label` |
| **Icon** | `content/widgets/primitives/Icon` | ✅ | ✅ | ✅ | ✅ | `name`, `label` |
| **Image** | `content/widgets/primitives/Image` | ✅ | ✅ | ✅ | ✅ | `src`, `alt` |
| **Link** | `content/widgets/primitives/Link` | ✅ | ✅ | ✅ | ✅ | `href` |
| **Text** | `content/widgets/primitives/Text` | ✅ | ✅ | ✅ | ✅ | `content` |

---

## Widgets: Layout

> Structural containers (Flex, Stack, Grid, Split, Container, Box)

| Component | Path | index | types | meta | styles | CMS Editable |
|-----------|------|:-----:|:-----:|:----:|:------:|:-------------|
| **Box** | `content/widgets/layout/Box` | ✅ | ✅ | ✅ | ✅ | `width`, `height`, `minWidth`, `maxWidth`, `flexGrow`, `flexShrink` |
| **Container** | `content/widgets/layout/Container` | ✅ | ✅ | ✅ | ✅ | `maxWidth`, `padding`, `center` |
| **Flex** | `content/widgets/layout/Flex` | ✅ | ✅ | ✅ | ✅ | `direction`, `align`, `justify`, `wrap`, `gap` |
| **Grid** | `content/widgets/layout/Grid` | ✅ | ✅ | ✅ | ✅ | `columns`, `rows`, `gap`, `columnGap`, `rowGap` |
| **Split** | `content/widgets/layout/Split` | ✅ | ✅ | ✅ | ✅ | `ratio`, `gap`, `reverse`, `align` |
| **Stack** | `content/widgets/layout/Stack` | ✅ | ✅ | ✅ | ✅ | `gap`, `align` |

---

## Widgets: Interactive

> Stateful React components (Video, VideoPlayer, ContactPrompt, etc.)

| Component | Path | index | types | meta | styles | CMS Editable |
|-----------|------|:-----:|:-----:|:----:|:------:|:-------------|
| **ContactPrompt** | `content/widgets/interactive/ContactPrompt` | ✅ | ✅ | ✅ | ✅ | `email`, `promptText` |
| **ExpandableGalleryRow** | `content/widgets/interactive/ExpandableGalleryRow` | ✅ | ✅ | ✅ | ✅ | `height`, `gap`, `expandedWidth`, `transitionDuration`, `cursorLabel`, `projects[]` |
| **FeaturedProjectsGrid** | `content/widgets/interactive/FeaturedProjectsGrid` | ✅ | ✅ | ✅ | ✅ | `projects`, `projects[]` |
| **GalleryThumbnail** | `content/widgets/interactive/GalleryThumbnail` | ✅ | ✅ | ✅ | ✅ | `expandedWidth`, `transitionDuration` |
| **HeroRoles** | `content/widgets/interactive/HeroRoles` | ✅ | ✅ | ✅ | — | `roles[]` |
| **LogoMarquee** | `content/widgets/interactive/LogoMarquee` | ✅ | ✅ | ✅ | ✅ | `logos`, `duration`, `logoWidth`, `logoGap`, `logos[]` |
| **Video** | `content/widgets/interactive/Video` | ✅ | ✅ | ✅ | ✅ | `src`, `poster`, `alt`, `videoUrl` |
| **VideoPlayer** | `content/widgets/interactive/VideoPlayer` | ✅ | ✅ | ✅ | ✅ | `src`, `poster`, `autoPlay`, `startTime` |

---

## Widgets: Patterns

> Factory functions returning WidgetSchema

| Component | Path | index | types | meta | styles | CMS Editable |
|-----------|------|:-----:|:-----:|:----:|:------:|:-------------|
| **LogoLink** | `content/widgets/patterns/LogoLink` | ✅ | ✅ | ✅ | — | `text`, `imageSrc`, `imageAlt`, `href` |
| **ProjectCard** | `content/widgets/patterns/ProjectCard` | ✅ | ✅ | ✅ | — | `thumbnailSrc`, `thumbnailAlt`, `videoSrc`, `videoUrl`, `client`, `studio`, `title`, `description`, `year`, `role`, `reversed` |

---

## Sections

> Page section patterns (Hero, About, FeaturedProjects, etc.)

| Component | Path | index | types | meta | styles | CMS Editable |
|-----------|------|:-----:|:-----:|:----:|:------:|:-------------|
| **About** | `content/sections/patterns/About` | ✅ | ✅ | ✅ | — | `bioParagraphs[]` |
| **FeaturedProjects** | `content/sections/patterns/FeaturedProjects` | ✅ | ✅ | ✅ | — | `projects[]` |
| **Hero** | `content/sections/patterns/Hero` | ✅ | ✅ | ✅ | — | `roles[]` |
| **OtherProjects** | `content/sections/patterns/OtherProjects` | ✅ | ✅ | ✅ | — | `projects[]` |

---

## Chrome: Regions

> Site-wide UI regions (Header, Footer)

| Component | Path | index | types | meta | styles | CMS Editable |
|-----------|------|:-----:|:-----:|:----:|:------:|:-------------|
| **Footer** | `content/chrome/regions/Footer` | ✅ | ✅ | ✅ | ✅ | `navLinks`, `contactHeading`, `contactEmail`, `contactLinkedin`, `studioHeading`, `studioUrl`, `studioEmail`, `studioSocials`, `copyrightText`, `navLinks[]` |

---

## Chrome: Overlays

> Modal, CursorLabel, NavTimeline, SlideIndicators

| Component | Path | index | types | meta | styles | CMS Editable |
|-----------|------|:-----:|:-----:|:----:|:------:|:-------------|
| **CursorLabel** | `content/chrome/overlays/CursorLabel` | ✅ | ✅ | ✅ | ✅ | — |
| **Modal** | `content/chrome/overlays/Modal` | ✅ | ✅ | ✅ | ✅ | — |
| **NavTimeline** | `content/chrome/overlays/NavTimeline` | ✅ | ✅ | ✅ | ✅ | — |
| **SlideIndicators** | `content/chrome/overlays/SlideIndicators` | ✅ | ✅ | ✅ | ✅ | — |

---

## Behaviours

> L2 trigger-based behaviours (scroll/, hover/, visibility/, etc.)

| Name | Path |
|------|------|
| **scroll/color-shift** | `experience/behaviours/scroll/color-shift.ts` |
| **scroll/fade-out** | `experience/behaviours/scroll/fade-out.ts` |
| **scroll/fade** | `experience/behaviours/scroll/fade.ts` |
| **scroll/image-cycle** | `experience/behaviours/scroll/image-cycle.ts` |
| **scroll/progress** | `experience/behaviours/scroll/progress.ts` |
| **hover/expand** | `experience/behaviours/hover/expand.ts` |
| **hover/reveal** | `experience/behaviours/hover/reveal.ts` |
| **hover/scale** | `experience/behaviours/hover/scale.ts` |
| **visibility/fade-in** | `experience/behaviours/visibility/fade-in.ts` |
| **animation/marquee** | `experience/behaviours/animation/marquee.ts` |
| **interaction/toggle** | `experience/behaviours/interaction/toggle.ts` |

---

## Effects

> L2 CSS animations (fade, transform/, mask/, emphasis/)

| Name | Path |
|------|------|
| **color-shift** | `experience/effects/color-shift.css` |
| **fade** | `experience/effects/fade.css` |
| **marquee-scroll** | `experience/effects/marquee-scroll.css` |
| **overlay-darken** | `experience/effects/overlay-darken.css` |
| **emphasis/spin** | `experience/effects/emphasis/spin.css` |
| **mask/reveal** | `experience/effects/mask/reveal.css` |
| **mask/wipe** | `experience/effects/mask/wipe.css` |
| **transform/scale** | `experience/effects/transform/scale.css` |
| **transform/slide** | `experience/effects/transform/slide.css` |

---

## Experiences

> Experience definitions (stacking, slideshow, infinite-carousel)

| Name | Path |
|------|------|
| **cinematic-portfolio** | `experience/experiences/cinematic-portfolio.ts` |
| **infinite-carousel** | `experience/experiences/infinite-carousel.ts` |
| **slideshow** | `experience/experiences/slideshow.ts` |
| **stacking** | `experience/experiences/stacking.ts` |

---

## Drivers

> Infrastructure (ScrollDriver, MomentumDriver, SmoothScrollProvider)

| Name | Path |
|------|------|
| **getDriver** | `experience/drivers/getDriver.ts` |
| **MomentumDriver** | `experience/drivers/MomentumDriver.ts` |
| **ScrollDriver** | `experience/drivers/ScrollDriver.ts` |
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

> Site templates (bojuhl)

| Component | Path | index | types | meta | styles | CMS Editable |
|-----------|------|:-----:|:-----:|:----:|:------:|:-------------|
| **bojuhl** | `presets/bojuhl` | ✅ | ❌ | ❌ | ✅ | — |

---

## Data Schemas

> TypeScript interfaces used in array props. These define the fields for CMS data entry.

### `BioLink`

**Used by:** About

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `text` | `string` | ✅ | Link display text |
| `href` | `string` | ✅ | Link destination |

### `FeaturedProject`

**Used by:** FeaturedProjectsGrid, FeaturedProjects

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `thumbnailSrc` | `string` | ✅ | — |
| `thumbnailAlt` | `string` | ✅ | — |
| `videoSrc` | `string` | — | — |
| `videoUrl` | `string` | — | — |
| `client` | `string` | ✅ | — |
| `studio` | `string` | ✅ | — |
| `title` | `string` | ✅ | — |
| `description` | `string` | ✅ | — |
| `year` | `string` | ✅ | — |
| `role` | `string` | ✅ | — |

### `GalleryProject`

**Used by:** GalleryThumbnail

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `id` | `string` | ✅ | Unique project ID |
| `thumbnailSrc` | `string` | ✅ | Thumbnail image source |
| `thumbnailAlt` | `string` | ✅ | Thumbnail alt text |
| `videoSrc` | `string` | — | Video source for hover playback (optional) |
| `videoUrl` | `string` | — | Video URL for modal playback (optional) |
| `title` | `string` | ✅ | Project title |
| `client` | `string` | ✅ | Client name |
| `studio` | `string` | ✅ | Studio name |
| `year` | `string` | ✅ | Project year |
| `role` | `string` | ✅ | Role in project |

### `LogoItem`

**Used by:** LogoMarquee, About

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `src` | `string` | ✅ | — |
| `alt` | `string` | ✅ | — |
| `href` | `string` | — | — |

### `NavLink`

**Used by:** chrome

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `label` | `string` | ✅ | Display text |
| `href` | `string` | ✅ | Link destination |

### `OtherProject`

**Used by:** OtherProjects

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

### `SocialLink`

**Used by:** chrome

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `platform` | `string` | ✅ | Platform name (e.g., "linkedin", "instagram") |
| `url` | `string` | ✅ | Link URL |
