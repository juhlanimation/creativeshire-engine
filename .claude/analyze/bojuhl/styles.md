# Styles Analysis: bojuhl.com

## Typography

### Font Families

```css
/* Primary - Headings and body */
--font-primary: 'Plus Jakarta Sans', sans-serif;

/* Secondary - UI elements */
--font-secondary: 'Inter', sans-serif;
```

### Type Scale

| Element | Size | Weight | Transform |
|---------|------|--------|-----------|
| Hero Title | ~100-120px | 800 (ExtraBold) | uppercase |
| Section Heading | ~24-32px | 700 (Bold) | uppercase |
| Project Title | ~20-24px | 700 (Bold) | uppercase |
| Body Text | ~16-18px | 400 (Regular) | none |
| Meta Text | ~12-14px | 400 (Regular) | uppercase |
| Small Text | ~12px | 400 (Regular) | none |

### Line Heights
- Headings: 1.1-1.2
- Body: 1.6
- Meta: 1.4

---

## Color Palette

### Background Colors

```css
/* Primary backgrounds */
--bg-dark: #0a0a0a; /* Near black */
--bg-section: #000000; /* Pure black */
--bg-footer: #1a1a1a; /* Dark gray */

/* Hero backgrounds are images, not solid colors */
```

### Text Colors

```css
/* Primary text */
--text-primary: #ffffff;
--text-muted: rgba(255, 255, 255, 0.7);
--text-meta: rgba(255, 255, 255, 0.5);
```

### Accent Colors

```css
/* Based on hero title colors */
--accent-purple: #8b5cf6; /* Vivid purple */
--accent-violet: #a855f7; /* Light purple */
--accent-red: #ef4444; /* Red accent */
--accent-tan: #d4a574; /* Beige/tan */
--accent-blue: #60a5fa; /* Blue accent */

/* Links */
--link-color: #a855f7; /* Purple */
--link-hover: #c084fc; /* Lighter purple */
```

### Gradient Examples

```css
/* Hero title "PRODUCER" */
background: linear-gradient(90deg, #8b5cf6, #a855f7);
-webkit-background-clip: text;
color: transparent;

/* Hero title "EDITOR" */
background: linear-gradient(90deg, #a855f7, #ef4444);
-webkit-background-clip: text;
color: transparent;
```

---

## Spacing

### Section Spacing

```css
--section-padding-y: 120px; /* ~7.5rem */
--section-gap: 80px; /* ~5rem */
```

### Content Spacing

```css
--content-padding-x: 80px; /* Side padding */
--card-gap: 120px; /* Between project cards */
--text-gap: 24px; /* Between paragraphs */
```

### Grid

```css
/* Two-column split */
--split-left: 55%; /* Image side */
--split-right: 45%; /* Content side */

/* Or using gap */
--split-gap: 48px;
```

---

## Layout Patterns

### Full-Width Sections
```css
.section {
  width: 100vw;
  min-height: 100vh; /* Hero only */
  padding: var(--section-padding-y) var(--content-padding-x);
}
```

### Split Layout (About, Project Cards)
```css
.split-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--split-gap);
  align-items: center;
}
```

### Alternating Layout
```css
.project-card:nth-child(odd) {
  grid-template-columns: 55% 45%;
}

.project-card:nth-child(even) {
  grid-template-columns: 45% 55%;
  /* Content first, then image */
}
```

---

## Component Styles

### Project Card
```css
.project-card {
  display: grid;
  gap: 48px;
  padding: 80px 0;
}

.project-card__title {
  font-size: 24px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.project-card__meta {
  font-size: 12px;
  color: var(--text-meta);
  text-transform: uppercase;
}
```

### Client Logo
```css
.client-logo {
  height: 40px;
  width: auto;
  filter: grayscale(100%);
  opacity: 0.8;
}
```

### Footer
```css
.footer {
  background: var(--bg-footer);
  padding: 80px;
}

.footer__heading {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 16px;
}

.footer__link {
  font-size: 14px;
  color: var(--text-muted);
  text-decoration: none;
}
```

---

## Motion / Transitions

```css
/* Default transition */
--transition-fast: 150ms ease;
--transition-normal: 300ms ease;
--transition-slow: 500ms ease-out;

/* Specific uses */
--transition-hover: 200ms ease;
--transition-modal: 300ms cubic-bezier(0.4, 0, 0.2, 1);
--transition-scroll: 500ms ease-out;
```

---

## Breakpoints (Estimated)

```css
/* Mobile first approach likely */
--bp-sm: 640px;
--bp-md: 768px;
--bp-lg: 1024px;
--bp-xl: 1280px;
--bp-2xl: 1536px;
```

---

## Design Tokens for Creativeshire

```typescript
const bojuhlTokens = {
  colors: {
    background: {
      primary: '#0a0a0a',
      section: '#000000',
      footer: '#1a1a1a',
    },
    text: {
      primary: '#ffffff',
      muted: 'rgba(255, 255, 255, 0.7)',
      meta: 'rgba(255, 255, 255, 0.5)',
    },
    accent: {
      purple: '#8b5cf6',
      violet: '#a855f7',
      red: '#ef4444',
      tan: '#d4a574',
      blue: '#60a5fa',
    },
  },
  typography: {
    fontFamily: {
      primary: "'Plus Jakarta Sans', sans-serif",
      secondary: "'Inter', sans-serif",
    },
    fontSize: {
      display: '120px',
      h1: '32px',
      h2: '24px',
      body: '16px',
      meta: '12px',
    },
  },
  spacing: {
    section: '120px',
    content: '80px',
    card: '48px',
    text: '24px',
  },
};
```
