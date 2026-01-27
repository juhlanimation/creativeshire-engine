# Chrome Analysis: bojuhl.com

## Overview

Minimal chrome design - only two persistent UI elements observed. The site prioritizes content with unobtrusive navigation.

---

## 1. Floating Contact CTA

**Location:** Fixed, top-right corner
**Visibility:** Always visible across all sections
**Purpose:** Primary call-to-action for contact

### Structure
```
FloatingContact
├── TriggerText ("How can I help you?")
└── RevealedEmail ("hello@bojuhl.com")
```

### Behaviour
- Fixed position (doesn't scroll with content)
- Click/hover reveals email address
- Text changes color based on background (dark/light awareness possible)

### Visual Specs
```css
position: fixed;
top: ~24px;
right: ~24px;
font-size: ~14px;
color: white; /* or contextual */
z-index: high;
```

### States
| State | Appearance |
|-------|------------|
| Default | "How can I help you?" visible |
| Hover/Active | Email revealed or highlighted |

---

## 2. Scroll Indicator

**Location:** Bottom-center of hero section
**Visibility:** Hero section only (disappears on scroll)
**Purpose:** Prompt user interaction

### Structure
```
ScrollIndicator
└── Text ("(SCROLL)")
```

### Behaviour
- Appears only at top of page
- Fades out as user scrolls
- May have subtle pulse or bounce animation

### Visual Specs
```css
position: absolute;
bottom: ~24px;
left: 50%;
transform: translateX(-50%);
font-size: ~12px;
color: white;
opacity: 0.7;
```

---

## Chrome Absence Notes

### No Traditional Header
- No logo in header
- No hamburger menu
- No primary navigation visible during scroll

### No Sticky Navigation
- Footer contains navigation links (HOME, ABOUT, PROJECTS)
- Navigation is accessed via scroll or footer clicks

### No Progress Indicator
- No scroll progress bar
- No section indicators/dots

---

## Design Philosophy

The minimal chrome approach:
1. **Content-first** - Lets the visual work speak for itself
2. **Portfolio context** - The work is the hero, not the navigation
3. **Trust in scroll** - Single-page design makes navigation unnecessary
4. **Contact priority** - The only persistent element is the contact CTA

---

## Implementation Notes

### For Creativeshire

```typescript
// Chrome configuration for bojuhl-style sites
const chromeConfig: ChromeConfig = {
  header: null, // No header
  footer: 'FooterSection', // Navigation in footer
  floating: [
    {
      component: 'FloatingContact',
      position: 'top-right',
      props: {
        text: 'How can I help you?',
        email: 'hello@example.com'
      }
    }
  ],
  scrollIndicator: {
    component: 'ScrollIndicator',
    section: 'hero',
    text: '(SCROLL)'
  }
};
```
