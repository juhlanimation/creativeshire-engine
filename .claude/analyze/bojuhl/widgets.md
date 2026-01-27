# Widgets Analysis: bojuhl.com

## Text Widgets

### 1. HeroTitle
**Purpose:** Large stacked role typography
**Location:** Hero section

```
Props:
- lines: string[] (roles to display)
- colors: ColorConfig[] (per-line color treatment)
```

**Visual Treatment:**
- Font: Plus Jakarta Sans (likely)
- Size: ~100-120px (display scale)
- Weight: Bold/Black
- Line 1 "EXECUTIVE PRODUCER": Beige/tan with blue accents
- Line 2 "PRODUCER": Purple gradient
- Line 3 "EDITOR": Purple to red gradient
- All uppercase
- Stacked vertically, left-aligned

### 2. IntroText
**Purpose:** Small intro label
**Location:** Above hero title

```
Props:
- text: string ("I'm Bo Juhl")
```

**Visual Treatment:**
- Font: Inter or Plus Jakarta Sans
- Size: ~14px
- Weight: Regular
- Color: White/light gray
- Opacity: Slightly muted

### 3. BioText
**Purpose:** Rich text paragraph with inline links
**Location:** About section

```
Props:
- content: RichText (with link support)
```

**Visual Treatment:**
- Font: Plus Jakarta Sans
- Size: ~16-18px
- Weight: Regular
- Line height: ~1.6
- Links: Purple accent color, underlined on hover
- Justified text alignment

### 4. Signature
**Purpose:** Author attribution
**Location:** End of about text

```
Props:
- name: string
```

**Visual Treatment:**
- Font: Plus Jakarta Sans (italic)
- Right-aligned
- Muted color

---

## Image Widgets

### 5. ClientLogo
**Purpose:** Display client brand
**Location:** Logo marquee section

```
Props:
- src: string (logo image URL)
- alt: string (client name)
- width?: number
- height?: number
```

**Visual Treatment:**
- Grayscale or muted colors
- Consistent height (~40px)
- Horizontal spacing between logos
- No hover effects observed

### 6. PortraitImage
**Purpose:** Personal photo
**Location:** About section

```
Props:
- src: string
- alt: string
```

**Visual Treatment:**
- Full-height of section
- No border radius
- Slight shadow/depth effect
- Professional photo styling

### 7. ProjectImage
**Purpose:** Project showcase visual
**Location:** Project cards

```
Props:
- src: string
- alt: string (project name)
- aspectRatio?: string
```

**Visual Treatment:**
- Large scale (~55% of viewport width)
- Anime/illustration style artwork
- Sharp edges (no border radius)

---

## Card Widgets

### 8. ProjectCard
**Purpose:** Featured project showcase
**Location:** Featured projects section

```
Props:
- title: string
- description: string
- year: number
- role: string
- client: string
- studio: string
- image: ImageProps
- layout: 'image-left' | 'image-right'
- videoUrl?: string
```

**Structure:**
```
ProjectCard
├── ImageArea
│   └── ProjectImage
├── ContentArea
│   ├── Title (heading, uppercase)
│   ├── Description (paragraph)
│   ├── Year
│   └── Role
└── MetaArea
    ├── "Client: {client}"
    └── "Studio: {studio}"
```

**Visual Treatment:**
- Two-column layout (image ~55%, content ~45%)
- Large whitespace around content
- Title: Bold, uppercase, ~24px
- Description: Regular weight, ~16px
- Meta: Small text, muted, bottom-aligned
- Alternating layout (left/right image position)

### 9. GalleryThumbnail
**Purpose:** Compact project preview
**Location:** Other projects gallery

```
Props:
- image: string
- title: string
- year: number
- role: string
- client: string
- studio: string
```

**Visual Treatment:**
- Square or portrait aspect ratio
- ~180px width
- Hover reveals info overlay (likely)

---

## Interactive Widgets

### 10. VideoPlayer
**Purpose:** Embedded video playback
**Location:** Project cards (modal overlay)

```
Props:
- videoUrl: string
- duration: string
- poster?: string
```

**Structure:**
```
VideoPlayer
├── Video element
├── CloseButton
├── ProgressDisplay ("0:00 / 1:04")
├── MuteButton
└── VolumeSlider
```

**Visual Treatment:**
- Modal overlay (dark background)
- Custom controls (not native)
- Close button prominent
- Progress shown as text timestamps

### 11. ScrollIndicator
**Purpose:** Prompt user to scroll
**Location:** Bottom of hero section

```
Props:
- text?: string (default: "(SCROLL)")
```

**Visual Treatment:**
- Small text
- Centered horizontally
- Near bottom of viewport
- Parentheses wrapping text
- May have subtle animation

---

## Navigation Widgets

### 12. FloatingContact
**Purpose:** Persistent contact CTA
**Location:** Fixed top-right

```
Props:
- text: string ("How can I help you?")
- email: string
```

**Visual Treatment:**
- Fixed position
- Top-right corner
- White/light text
- Clickable (reveals email)
- Persists across all sections

### 13. FooterLink
**Purpose:** Navigation in footer
**Location:** Footer section

```
Props:
- href: string
- label: string
- external?: boolean
```

**Visual Treatment:**
- Uppercase text
- White color
- No underline by default
- Hover: underline or opacity change
