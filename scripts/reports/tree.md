# Engine Directory Tree

**Generated:** 2026-02-20
**Files:** 638 | **Directories:** 157

```
engine/
├── config/
│   ├── breakpoints.ts
│   └── index.ts
├── content/
│   ├── actions/
│   │   ├── index.ts
│   │   ├── resolver.ts
│   │   └── scanner.ts
│   ├── chrome/
│   │   ├── overlays/
│   │   │   ├── CursorLabel/
│   │   │   │   ├── CursorLabel.stories.tsx
│   │   │   │   ├── index.tsx
│   │   │   │   ├── meta.ts
│   │   │   │   ├── styles.css
│   │   │   │   └── types.ts
│   │   │   ├── FixedCard/
│   │   │   │   ├── FixedCard.stories.tsx
│   │   │   │   ├── index.tsx
│   │   │   │   ├── meta.ts
│   │   │   │   ├── styles.css
│   │   │   │   └── types.ts
│   │   │   ├── Modal/
│   │   │   │   ├── handlers/
│   │   │   │   │   └── video.tsx
│   │   │   │   ├── index.tsx
│   │   │   │   ├── meta.ts
│   │   │   │   ├── Modal.stories.tsx
│   │   │   │   ├── ModalRoot.tsx
│   │   │   │   ├── store.ts
│   │   │   │   ├── styles.css
│   │   │   │   └── types.ts
│   │   │   ├── NavTimeline/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── meta.ts
│   │   │   │   ├── NavTimeline.stories.tsx
│   │   │   │   ├── styles.css
│   │   │   │   └── types.ts
│   │   │   ├── SlideIndicators/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── meta.ts
│   │   │   │   ├── SlideIndicators.stories.tsx
│   │   │   │   ├── styles.css
│   │   │   │   └── types.ts
│   │   │   └── index.ts
│   │   ├── patterns/
│   │   │   ├── BrandFooter/
│   │   │   │   ├── BrandFooter.stories.tsx
│   │   │   │   ├── index.ts
│   │   │   │   ├── meta.ts
│   │   │   │   ├── preview.ts
│   │   │   │   ├── styles.css
│   │   │   │   └── types.ts
│   │   │   ├── CenteredNav/
│   │   │   │   ├── CenteredNav.stories.tsx
│   │   │   │   ├── index.ts
│   │   │   │   ├── meta.ts
│   │   │   │   ├── preview.ts
│   │   │   │   └── types.ts
│   │   │   ├── ContactFooter/
│   │   │   │   ├── ContactFooter.stories.tsx
│   │   │   │   ├── index.ts
│   │   │   │   ├── meta.ts
│   │   │   │   ├── preview.ts
│   │   │   │   ├── styles.css
│   │   │   │   └── types.ts
│   │   │   ├── CursorTracker/
│   │   │   │   ├── CursorTracker.stories.tsx
│   │   │   │   ├── index.ts
│   │   │   │   ├── meta.ts
│   │   │   │   ├── preview.ts
│   │   │   │   └── types.ts
│   │   │   ├── FixedNav/
│   │   │   │   ├── FixedNav.stories.tsx
│   │   │   │   ├── index.ts
│   │   │   │   ├── meta.ts
│   │   │   │   ├── preview.ts
│   │   │   │   ├── styles.css
│   │   │   │   └── types.ts
│   │   │   ├── FloatingContact/
│   │   │   │   ├── FloatingContact.stories.tsx
│   │   │   │   ├── index.ts
│   │   │   │   ├── meta.ts
│   │   │   │   ├── preview.ts
│   │   │   │   └── types.ts
│   │   │   ├── MinimalNav/
│   │   │   │   ├── index.ts
│   │   │   │   ├── meta.ts
│   │   │   │   ├── MinimalNav.stories.tsx
│   │   │   │   ├── preview.ts
│   │   │   │   ├── styles.css
│   │   │   │   └── types.ts
│   │   │   ├── VideoModal/
│   │   │   │   ├── index.ts
│   │   │   │   ├── meta.ts
│   │   │   │   ├── preview.ts
│   │   │   │   ├── types.ts
│   │   │   │   └── VideoModal.stories.tsx
│   │   │   └── index.ts
│   │   ├── CLAUDE.md
│   │   ├── index.ts
│   │   ├── overlay-base-meta.ts
│   │   ├── pattern-registry.ts
│   │   ├── region-base-meta.ts
│   │   └── registry.ts
│   ├── decorators/
│   │   ├── presets/
│   │   │   ├── cursor-label.ts
│   │   │   ├── hover-scale.ts
│   │   │   ├── index.ts
│   │   │   └── video-modal.ts
│   │   ├── index.ts
│   │   ├── merge.ts
│   │   ├── registry.ts
│   │   ├── resolve.ts
│   │   └── types.ts
│   ├── sections/
│   │   ├── patterns/
│   │   │   ├── AboutBio/
│   │   │   │   ├── components/
│   │   │   │   │   └── MarqueeImageRepeater/
│   │   │   │   │       ├── index.tsx
│   │   │   │   │       ├── MarqueeImageRepeater.stories.tsx
│   │   │   │   │       ├── meta.ts
│   │   │   │   │       ├── styles.css
│   │   │   │   │       └── types.ts
│   │   │   │   ├── AboutBio.stories.tsx
│   │   │   │   ├── index.ts
│   │   │   │   ├── meta.ts
│   │   │   │   ├── preview.ts
│   │   │   │   ├── styles.css
│   │   │   │   └── types.ts
│   │   │   ├── AboutCollage/
│   │   │   │   ├── AboutCollage.stories.tsx
│   │   │   │   ├── index.ts
│   │   │   │   ├── meta.ts
│   │   │   │   ├── preview.ts
│   │   │   │   ├── styles.css
│   │   │   │   └── types.ts
│   │   │   ├── ContentPricing/
│   │   │   │   ├── ContentPricing.stories.tsx
│   │   │   │   ├── index.ts
│   │   │   │   ├── meta.ts
│   │   │   │   ├── preview.ts
│   │   │   │   ├── styles.css
│   │   │   │   └── types.ts
│   │   │   ├── HeroTitle/
│   │   │   │   ├── HeroTitle.stories.tsx
│   │   │   │   ├── index.ts
│   │   │   │   ├── meta.ts
│   │   │   │   ├── preview.ts
│   │   │   │   ├── styles.css
│   │   │   │   └── types.ts
│   │   │   ├── HeroVideo/
│   │   │   │   ├── HeroVideo.stories.tsx
│   │   │   │   ├── index.ts
│   │   │   │   ├── meta.ts
│   │   │   │   ├── preview.ts
│   │   │   │   ├── styles.css
│   │   │   │   └── types.ts
│   │   │   ├── ProjectCompare/
│   │   │   │   ├── components/
│   │   │   │   │   └── VideoCompare/
│   │   │   │   │       ├── index.tsx
│   │   │   │   │       ├── meta.ts
│   │   │   │   │       ├── styles.css
│   │   │   │   │       ├── types.ts
│   │   │   │   │       └── VideoCompare.stories.tsx
│   │   │   │   ├── index.ts
│   │   │   │   ├── meta.ts
│   │   │   │   ├── preview.ts
│   │   │   │   ├── ProjectCompare.stories.tsx
│   │   │   │   ├── styles.css
│   │   │   │   └── types.ts
│   │   │   ├── ProjectExpand/
│   │   │   │   ├── index.ts
│   │   │   │   ├── meta.ts
│   │   │   │   ├── preview.ts
│   │   │   │   ├── ProjectExpand.stories.tsx
│   │   │   │   ├── styles.css
│   │   │   │   └── types.ts
│   │   │   ├── ProjectFeatured/
│   │   │   │   ├── components/
│   │   │   │   │   └── ProjectCard/
│   │   │   │   │       ├── index.ts
│   │   │   │   │       ├── meta.ts
│   │   │   │   │       ├── ProjectCard.stories.tsx
│   │   │   │   │       ├── styles.css
│   │   │   │   │       └── types.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── meta.ts
│   │   │   │   ├── preview.ts
│   │   │   │   ├── ProjectFeatured.stories.tsx
│   │   │   │   ├── styles.css
│   │   │   │   └── types.ts
│   │   │   ├── ProjectGallery/
│   │   │   │   ├── components/
│   │   │   │   │   └── FlexGalleryCardRepeater/
│   │   │   │   │       ├── SelectorCard/
│   │   │   │   │       │   ├── index.tsx
│   │   │   │   │       │   ├── styles.css
│   │   │   │   │       │   └── types.ts
│   │   │   │   │       ├── FlexGalleryCardRepeater.stories.tsx
│   │   │   │   │       ├── index.tsx
│   │   │   │   │       ├── meta.ts
│   │   │   │   │       ├── styles.css
│   │   │   │   │       └── types.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── meta.ts
│   │   │   │   ├── preview.ts
│   │   │   │   ├── ProjectGallery.stories.tsx
│   │   │   │   ├── styles.css
│   │   │   │   └── types.ts
│   │   │   ├── ProjectShowcase/
│   │   │   │   ├── components/
│   │   │   │   │   └── FlexButtonRepeater/
│   │   │   │   │       ├── IndexNav/
│   │   │   │   │       │   ├── index.tsx
│   │   │   │   │       │   ├── styles.css
│   │   │   │   │       │   └── types.ts
│   │   │   │   │       ├── FlexButtonRepeater.stories.tsx
│   │   │   │   │       ├── index.tsx
│   │   │   │   │       ├── meta.ts
│   │   │   │   │       └── types.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── meta.ts
│   │   │   │   ├── preview.ts
│   │   │   │   ├── ProjectShowcase.stories.tsx
│   │   │   │   ├── styles.css
│   │   │   │   └── types.ts
│   │   │   ├── ProjectStrip/
│   │   │   │   ├── index.ts
│   │   │   │   ├── meta.ts
│   │   │   │   ├── preview.ts
│   │   │   │   ├── ProjectStrip.stories.tsx
│   │   │   │   ├── styles.css
│   │   │   │   └── types.ts
│   │   │   ├── ProjectTabs/
│   │   │   │   ├── components/
│   │   │   │   │   └── TabbedContent/
│   │   │   │   │       ├── index.tsx
│   │   │   │   │       ├── meta.ts
│   │   │   │   │       ├── styles.css
│   │   │   │   │       ├── TabbedContent.stories.tsx
│   │   │   │   │       └── types.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── meta.ts
│   │   │   │   ├── preview.ts
│   │   │   │   ├── ProjectTabs.stories.tsx
│   │   │   │   ├── styles.css
│   │   │   │   └── types.ts
│   │   │   ├── ProjectVideoGrid/
│   │   │   │   ├── index.ts
│   │   │   │   ├── meta.ts
│   │   │   │   ├── preview.ts
│   │   │   │   ├── ProjectVideoGrid.stories.tsx
│   │   │   │   ├── styles.css
│   │   │   │   └── types.ts
│   │   │   ├── TeamShowcase/
│   │   │   │   ├── components/
│   │   │   │   │   └── StackVideoShowcase/
│   │   │   │   │       ├── index.tsx
│   │   │   │   │       ├── meta.ts
│   │   │   │   │       ├── StackVideoShowcase.stories.tsx
│   │   │   │   │       ├── styles.css
│   │   │   │   │       └── types.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── meta.ts
│   │   │   │   ├── preview.ts
│   │   │   │   ├── styles.css
│   │   │   │   ├── TeamShowcase.stories.tsx
│   │   │   │   └── types.ts
│   │   │   ├── base.ts
│   │   │   ├── index.ts
│   │   │   └── utils.ts
│   │   ├── base-meta.ts
│   │   ├── CLAUDE.md
│   │   ├── index.ts
│   │   ├── registry.ts
│   │   ├── Section.tsx
│   │   ├── styles.css
│   │   └── types.ts
│   └── widgets/
│       ├── interactive/
│       │   ├── EmailCopy/
│       │   │   ├── EmailCopy.stories.tsx
│       │   │   ├── index.tsx
│       │   │   ├── meta.ts
│       │   │   ├── styles.css
│       │   │   └── types.ts
│       │   ├── Video/
│       │   │   ├── index.tsx
│       │   │   ├── meta.ts
│       │   │   ├── styles.css
│       │   │   ├── types.ts
│       │   │   ├── useVisibilityPlayback.ts
│       │   │   └── Video.stories.tsx
│       │   ├── VideoPlayer/
│       │   │   ├── hooks/
│       │   │   │   ├── index.ts
│       │   │   │   ├── usePlaybackPosition.ts
│       │   │   │   └── useVideoControls.ts
│       │   │   ├── index.tsx
│       │   │   ├── meta.ts
│       │   │   ├── styles.css
│       │   │   ├── types.ts
│       │   │   └── VideoPlayer.stories.tsx
│       │   ├── CLAUDE.md
│       │   └── index.ts
│       ├── layout/
│       │   ├── Box/
│       │   │   ├── Box.stories.tsx
│       │   │   ├── index.tsx
│       │   │   ├── meta.ts
│       │   │   ├── styles.css
│       │   │   └── types.ts
│       │   ├── Container/
│       │   │   ├── Container.stories.tsx
│       │   │   ├── index.tsx
│       │   │   ├── meta.ts
│       │   │   ├── styles.css
│       │   │   └── types.ts
│       │   ├── Flex/
│       │   │   ├── Flex.stories.tsx
│       │   │   ├── index.tsx
│       │   │   ├── meta.ts
│       │   │   ├── styles.css
│       │   │   └── types.ts
│       │   ├── Grid/
│       │   │   ├── Grid.stories.tsx
│       │   │   ├── index.tsx
│       │   │   ├── meta.ts
│       │   │   ├── styles.css
│       │   │   └── types.ts
│       │   ├── Marquee/
│       │   │   ├── index.tsx
│       │   │   ├── Marquee.stories.tsx
│       │   │   ├── meta.ts
│       │   │   ├── styles.css
│       │   │   └── types.ts
│       │   ├── Split/
│       │   │   ├── index.tsx
│       │   │   ├── meta.ts
│       │   │   ├── Split.stories.tsx
│       │   │   ├── styles.css
│       │   │   └── types.ts
│       │   ├── Stack/
│       │   │   ├── index.tsx
│       │   │   ├── meta.ts
│       │   │   ├── Stack.stories.tsx
│       │   │   ├── styles.css
│       │   │   └── types.ts
│       │   ├── CLAUDE.md
│       │   ├── index.ts
│       │   └── utils.ts
│       ├── primitives/
│       │   ├── Button/
│       │   │   ├── Button.stories.tsx
│       │   │   ├── index.tsx
│       │   │   ├── meta.ts
│       │   │   ├── styles.css
│       │   │   └── types.ts
│       │   ├── Icon/
│       │   │   ├── Icon.stories.tsx
│       │   │   ├── index.tsx
│       │   │   ├── meta.ts
│       │   │   ├── styles.css
│       │   │   └── types.ts
│       │   ├── Image/
│       │   │   ├── Image.stories.tsx
│       │   │   ├── index.tsx
│       │   │   ├── meta.ts
│       │   │   ├── styles.css
│       │   │   └── types.ts
│       │   ├── Link/
│       │   │   ├── index.tsx
│       │   │   ├── Link.stories.tsx
│       │   │   ├── meta.ts
│       │   │   ├── styles.css
│       │   │   └── types.ts
│       │   ├── Text/
│       │   │   ├── index.tsx
│       │   │   ├── meta.ts
│       │   │   ├── styles.css
│       │   │   ├── Text.stories.tsx
│       │   │   └── types.ts
│       │   ├── CLAUDE.md
│       │   └── index.ts
│       ├── repeaters/
│       │   ├── ExpandRowImageRepeater/
│       │   │   ├── ExpandRowThumbnail/
│       │   │   │   ├── index.tsx
│       │   │   │   ├── styles.css
│       │   │   │   └── types.ts
│       │   │   ├── ExpandRowImageRepeater.stories.tsx
│       │   │   ├── index.tsx
│       │   │   ├── meta.ts
│       │   │   ├── styles.css
│       │   │   └── types.ts
│       │   └── index.ts
│       ├── index.ts
│       ├── meta-registry.ts
│       ├── registry.ts
│       └── types.ts
├── experience/
│   ├── behaviours/
│   │   ├── animation/
│   │   │   ├── marquee/
│   │   │   │   ├── index.ts
│   │   │   │   ├── Marquee.stories.tsx
│   │   │   │   └── meta.ts
│   │   │   └── index.ts
│   │   ├── hover/
│   │   │   ├── expand/
│   │   │   │   ├── Expand.stories.tsx
│   │   │   │   ├── index.ts
│   │   │   │   └── meta.ts
│   │   │   ├── reveal/
│   │   │   │   ├── index.ts
│   │   │   │   ├── meta.ts
│   │   │   │   └── Reveal.stories.tsx
│   │   │   ├── scale/
│   │   │   │   ├── index.ts
│   │   │   │   ├── meta.ts
│   │   │   │   └── Scale.stories.tsx
│   │   │   └── index.ts
│   │   ├── interaction/
│   │   │   ├── toggle/
│   │   │   │   ├── index.ts
│   │   │   │   ├── meta.ts
│   │   │   │   └── Toggle.stories.tsx
│   │   │   └── index.ts
│   │   ├── intro/
│   │   │   ├── chrome-reveal/
│   │   │   │   ├── ChromeReveal.stories.tsx
│   │   │   │   ├── index.ts
│   │   │   │   └── meta.ts
│   │   │   ├── content-reveal/
│   │   │   │   ├── ContentReveal.stories.tsx
│   │   │   │   ├── index.ts
│   │   │   │   └── meta.ts
│   │   │   ├── scroll-indicator/
│   │   │   │   ├── index.ts
│   │   │   │   ├── meta.ts
│   │   │   │   └── ScrollIndicator.stories.tsx
│   │   │   ├── step/
│   │   │   │   ├── index.ts
│   │   │   │   ├── meta.ts
│   │   │   │   └── Step.stories.tsx
│   │   │   ├── text-reveal/
│   │   │   │   ├── index.ts
│   │   │   │   ├── meta.ts
│   │   │   │   └── TextReveal.stories.tsx
│   │   │   └── index.ts
│   │   ├── scroll/
│   │   │   ├── collapse/
│   │   │   │   ├── Collapse.stories.tsx
│   │   │   │   ├── index.ts
│   │   │   │   └── meta.ts
│   │   │   ├── color-shift/
│   │   │   │   ├── ColorShift.stories.tsx
│   │   │   │   ├── index.ts
│   │   │   │   └── meta.ts
│   │   │   ├── cover-progress/
│   │   │   │   ├── CoverProgress.stories.tsx
│   │   │   │   ├── index.ts
│   │   │   │   └── meta.ts
│   │   │   ├── fade/
│   │   │   │   ├── Fade.stories.tsx
│   │   │   │   ├── index.ts
│   │   │   │   └── meta.ts
│   │   │   ├── fade-out/
│   │   │   │   ├── FadeOut.stories.tsx
│   │   │   │   ├── index.ts
│   │   │   │   └── meta.ts
│   │   │   ├── image-cycle/
│   │   │   │   ├── ImageCycle.stories.tsx
│   │   │   │   ├── index.ts
│   │   │   │   └── meta.ts
│   │   │   ├── progress/
│   │   │   │   ├── index.ts
│   │   │   │   ├── meta.ts
│   │   │   │   └── Progress.stories.tsx
│   │   │   ├── reveal/
│   │   │   │   ├── index.ts
│   │   │   │   └── meta.ts
│   │   │   └── index.ts
│   │   ├── video/
│   │   │   ├── frame/
│   │   │   │   ├── Frame.stories.tsx
│   │   │   │   ├── index.ts
│   │   │   │   └── meta.ts
│   │   │   └── index.ts
│   │   ├── visibility/
│   │   │   ├── center/
│   │   │   │   ├── Center.stories.tsx
│   │   │   │   ├── index.ts
│   │   │   │   └── meta.ts
│   │   │   ├── fade-in/
│   │   │   │   ├── FadeIn.stories.tsx
│   │   │   │   ├── index.ts
│   │   │   │   └── meta.ts
│   │   │   └── index.ts
│   │   ├── BehaviourWrapper.tsx
│   │   ├── CLAUDE.md
│   │   ├── index.ts
│   │   ├── registry.ts
│   │   ├── resolve.ts
│   │   └── types.ts
│   ├── drivers/
│   │   ├── getDriver.ts
│   │   ├── index.ts
│   │   ├── LenisSmoothScrollProvider.tsx
│   │   ├── MomentumDriver.ts
│   │   ├── ScrollDriver.ts
│   │   ├── ScrollLockContext.tsx
│   │   ├── SmoothScrollContext.ts
│   │   ├── SmoothScrollProvider.tsx
│   │   ├── types.ts
│   │   ├── useScrollFadeDriver.ts
│   │   └── useSmoothScrollContainer.ts
│   ├── effects/
│   │   ├── color-shift/
│   │   │   └── color-shift.css
│   │   ├── emphasis/
│   │   │   ├── pulse.css
│   │   │   └── spin.css
│   │   ├── fade/
│   │   │   └── fade.css
│   │   ├── marquee/
│   │   │   └── marquee-scroll.css
│   │   ├── mask/
│   │   │   ├── reveal.css
│   │   │   └── wipe.css
│   │   ├── overlay/
│   │   │   └── overlay-darken.css
│   │   ├── reveal/
│   │   │   ├── clip-path.css
│   │   │   └── index.css
│   │   ├── transform/
│   │   │   ├── scale.css
│   │   │   └── slide.css
│   │   ├── CLAUDE.md
│   │   └── index.css
│   ├── experiences/
│   │   ├── cinematic-portfolio/
│   │   │   ├── CinematicPortfolio.stories.tsx
│   │   │   ├── index.ts
│   │   │   └── meta.ts
│   │   ├── cover-scroll/
│   │   │   ├── CoverScroll.stories.tsx
│   │   │   ├── index.ts
│   │   │   └── meta.ts
│   │   ├── infinite-carousel/
│   │   │   ├── index.ts
│   │   │   ├── InfiniteCarousel.stories.tsx
│   │   │   └── meta.ts
│   │   ├── simple/
│   │   │   ├── index.ts
│   │   │   ├── meta.ts
│   │   │   └── Simple.stories.tsx
│   │   ├── slideshow/
│   │   │   ├── index.ts
│   │   │   ├── meta.ts
│   │   │   └── Slideshow.stories.tsx
│   │   ├── createExperienceStore.ts
│   │   ├── ExperienceProvider.tsx
│   │   ├── index.ts
│   │   ├── InfiniteCarouselController.tsx
│   │   ├── presentation.css
│   │   ├── PresentationWrapper.tsx
│   │   ├── registry.ts
│   │   └── types.ts
│   ├── lifecycle/
│   │   ├── index.ts
│   │   └── SectionLifecycleProvider.tsx
│   ├── navigation/
│   │   ├── index.ts
│   │   ├── NavigationInitializer.tsx
│   │   ├── page-transition.css
│   │   ├── PageTransitionContext.tsx
│   │   ├── PageTransitionWrapper.tsx
│   │   ├── TransitionProvider.tsx
│   │   ├── TransitionStack.ts
│   │   ├── useEntryTask.ts
│   │   ├── useExitTask.ts
│   │   ├── useExperienceActions.ts
│   │   ├── useKeyboardNavigation.ts
│   │   ├── useSwipeNavigation.ts
│   │   └── useWheelNavigation.ts
│   ├── timeline/
│   │   ├── gsap/
│   │   │   ├── transitions/
│   │   │   │   ├── expand.ts
│   │   │   │   ├── fade.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── registry.ts
│   │   │   │   ├── resolve.ts
│   │   │   │   ├── types.ts
│   │   │   │   ├── wipe-left.ts
│   │   │   │   └── wipe-right.ts
│   │   │   ├── index.ts
│   │   │   ├── reveal-transition.tsx
│   │   │   └── use-gsap-reveal.ts
│   │   ├── animateElement.ts
│   │   ├── EffectTimeline.ts
│   │   └── index.ts
│   ├── transitions/
│   │   ├── configs/
│   │   │   ├── default-fade.ts
│   │   │   └── index.ts
│   │   ├── fade/
│   │   │   ├── index.ts
│   │   │   └── meta.ts
│   │   ├── index.ts
│   │   ├── registry.ts
│   │   └── types.ts
│   ├── triggers/
│   │   ├── index.ts
│   │   ├── TriggerInitializer.tsx
│   │   ├── types.ts
│   │   ├── useCursorPosition.ts
│   │   ├── useIntersection.ts
│   │   ├── usePrefersReducedMotion.ts
│   │   ├── useScrollProgress.ts
│   │   └── useViewport.ts
│   ├── ExperienceChoreographer.tsx
│   ├── index.ts
│   └── types.ts
├── interface/
│   ├── validation/
│   │   ├── CLAUDE.md
│   │   ├── index.ts
│   │   └── validators.ts
│   ├── CLAUDE.md
│   ├── ContainerContext.tsx
│   ├── discovery.ts
│   ├── EngineProvider.tsx
│   ├── EngineStore.ts
│   ├── index.ts
│   ├── types.ts
│   └── useEngineController.ts
├── intro/
│   ├── sequences/
│   │   ├── index.ts
│   │   ├── video-hero-gate.ts
│   │   ├── VideoHeroGate.stories.tsx
│   │   ├── Wait.stories.tsx
│   │   └── wait.ts
│   ├── triggers/
│   │   ├── index.ts
│   │   ├── usePhaseController.ts
│   │   ├── useSequence.ts
│   │   ├── useTimer.ts
│   │   └── useVideoTime.ts
│   ├── CLAUDE.md
│   ├── index.ts
│   ├── IntroContentGate.tsx
│   ├── IntroContext.ts
│   ├── IntroProvider.tsx
│   ├── IntroTriggerInitializer.tsx
│   ├── registry.ts
│   └── types.ts
├── migrations/
│   ├── CLAUDE.md
│   ├── index.ts
│   └── types.ts
├── presets/
│   ├── loft/
│   │   ├── pages/
│   │   │   └── home.ts
│   │   ├── content-contract.ts
│   │   ├── index.ts
│   │   ├── Loft.stories.tsx
│   │   └── sample-content.ts
│   ├── noir/
│   │   ├── pages/
│   │   │   └── home.ts
│   │   ├── content-contract.ts
│   │   ├── index.ts
│   │   ├── Noir.stories.tsx
│   │   └── sample-content.ts
│   ├── prism/
│   │   ├── pages/
│   │   │   └── home.ts
│   │   ├── content-contract.ts
│   │   ├── index.ts
│   │   ├── Prism.stories.tsx
│   │   ├── sample-content.ts
│   │   └── styles.css
│   ├── test-multipage/
│   │   ├── pages/
│   │   │   ├── about.ts
│   │   │   └── home.ts
│   │   ├── content-contract.ts
│   │   ├── index.ts
│   │   └── TestMultipage.stories.tsx
│   ├── CLAUDE.md
│   ├── index.ts
│   ├── registry.ts
│   ├── resolve.ts
│   └── types.ts
├── renderer/
│   ├── dev/
│   │   ├── DevToolsPanel/
│   │   │   ├── index.tsx
│   │   │   ├── SettingsEditor.tsx
│   │   │   └── styles.css
│   │   ├── devSettingsStore.ts
│   │   └── DevToolsContainer.tsx
│   ├── hooks/
│   │   ├── index.ts
│   │   ├── useChromeVisibility.ts
│   │   ├── useDevOverride.ts
│   │   ├── useResolvedExperience.ts
│   │   ├── useResolvedIntro.ts
│   │   ├── useResolvedTransition.ts
│   │   ├── useScrollIndicatorFade.ts
│   │   └── useThemeVariables.ts
│   ├── base.css
│   ├── bindings.ts
│   ├── chrome.css
│   ├── ChromeRenderer.tsx
│   ├── CLAUDE.md
│   ├── ErrorBoundary.tsx
│   ├── ExperienceChromeRenderer.tsx
│   ├── index.ts
│   ├── PageRenderer.tsx
│   ├── PinnedBackdropContext.tsx
│   ├── PinnedSection.tsx
│   ├── resets.css
│   ├── scrollbar.css
│   ├── SectionChromeContext.tsx
│   ├── SectionRenderer.tsx
│   ├── SiteContainerContext.tsx
│   ├── SiteRenderer.tsx
│   ├── ThemeProvider.tsx
│   ├── types.ts
│   ├── utils.ts
│   ├── ViewportPortalContext.tsx
│   └── WidgetRenderer.tsx
├── schema/
│   ├── chrome.ts
│   ├── CLAUDE.md
│   ├── experience.ts
│   ├── index.ts
│   ├── meta.ts
│   ├── overlay-meta.ts
│   ├── page-meta.ts
│   ├── page.ts
│   ├── region-meta.ts
│   ├── section-meta.ts
│   ├── section.ts
│   ├── settings-helpers.ts
│   ├── settings.ts
│   ├── shell.ts
│   ├── site-meta.ts
│   ├── site.ts
│   ├── theme-meta.ts
│   ├── theme.ts
│   ├── transition.ts
│   ├── types.ts
│   ├── utils.ts
│   ├── version.ts
│   └── widget.ts
├── styles/
│   └── container-queries.css
├── themes/
│   ├── definitions/
│   │   ├── contrast.ts
│   │   ├── crossroad.ts
│   │   ├── earthy.ts
│   │   ├── editorial.ts
│   │   ├── monochrome.ts
│   │   ├── muted.ts
│   │   └── neon.ts
│   ├── showcase/
│   │   ├── _shared.tsx
│   │   ├── Colors.stories.tsx
│   │   ├── Interaction.stories.tsx
│   │   ├── Overview.stories.tsx
│   │   ├── SpacingLayout.stories.tsx
│   │   ├── Surfaces.stories.tsx
│   │   └── Typography.stories.tsx
│   ├── index.ts
│   ├── registry.ts
│   ├── types.ts
│   └── utils.ts
├── validation/
│   ├── CLAUDE.md
│   ├── index.ts
│   └── site-validator.ts
├── CLAUDE.md
├── index.ts
└── styles.css
```
