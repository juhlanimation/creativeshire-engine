# Preset Analysis

> Site composition patterns identified from external references.

## Reference

| Reference | Type | Analyzed |
|-----------|------|----------|
| bo-juhl-portfolio | GitHub Repo | 2026-01-26 |

## Findings

### [PRESET-001] Portfolio Landing Page

- **Type:** Feature
- **Priority:** P1
- **Reference:** `components/features/pages/landing-page/landing-page.tsx`
- **Dependencies:** SECTION-001, SECTION-002, SECTION-003, SECTION-004, SECTION-005, CHROME-001
- **Description:**
  Complete portfolio landing page preset with hero, about, projects, more projects, and footer sections.

- **Composition:**
  - Experience: smooth-scroll
  - Chrome: contact-navbar, cursor-label
  - Pages: single-page scrolling portfolio

- **Things to consider:**
  - Server component with "use cache" + cacheLife("days")
  - PageLayout wrapper (minimal, handles maxWidth/background)
  - Five sections in order: Hero, About, Projects, MoreProjects, Footer
  - MoreProjectsSection wrapped in Suspense (client component)
  - Centralized project data transformation
  - Default settings for each section
  - ContactNavbar included via page layout

- **Section composition:**
  1. HeroSection - Full viewport video background with titles
  2. AboutSection - Split layout with progressive image and logo marquee
  3. ProjectsSection - Featured project cards with hover video
  4. MoreProjectsSection - Expandable thumbnail gallery (desktop)
  5. FooterSection - Multi-column contact and navigation

- **Specialists:**
  - Builder: preset-builder
  - Reviewer: preset-reviewer

---

## Summary

| ID | Name | Priority | Dependencies |
|----|------|----------|--------------|
| PRESET-001 | Portfolio Landing Page | P1 | All sections + chrome |
