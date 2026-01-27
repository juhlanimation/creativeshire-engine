# Text Block Bracketed Widget

## Overview
Paragraph text block with decorative corner bracket marks, creating a "quoted" or highlighted appearance. Used in the about section to emphasize introductory content.

## Mobile Layout (375px)

### Dimensions
- **Width**: 100% - 48px (24px padding each side)
- **Padding**: 24px
- **Background**: Light gray (#F5F5F5)

### Structure
```
[Text Block Container - relative]
  [Corner Bracket - top-left]
  [Corner Bracket - bottom-right]
  [Paragraph Text]
```

## Visual Treatment

### Container
- **Background**: Light warm gray (#F3F2EF or #F5F5F5)
- **Padding**: 24px
- **Position**: Relative (for corner positioning)

### Corner Brackets
- **Style**: L-shaped bracket marks
- **Position**: Absolute, at corners
- **Color**: Dark gray (#666666)
- **Stroke width**: 1-2px
- **Size**: ~16px x 16px each arm

#### Top-Left Bracket
```
Position: top: 8px, left: 8px
Shape:    |
          |___
```

#### Bottom-Right Bracket
```
Position: bottom: 8px, right: 8px
Shape:    ___|
             |
```

### Typography
- **Font-family**: Serif or elegant sans-serif
- **Font-size**: 16px
- **Line-height**: 1.6-1.7
- **Color**: Dark gray (#333333)
- **Text-align**: Left, with justified appearance

## Props Schema
```typescript
interface TextBlockBracketedProps {
  content: string;
  backgroundColor?: string;
  bracketColor?: string;
  showTopLeft?: boolean;     // Default: true
  showBottomRight?: boolean; // Default: true
}
```

## CSS Pseudo-Element Approach
```css
.text-block-bracketed {
  position: relative;
  background: #F5F5F5;
  padding: 24px;
}

.text-block-bracketed::before {
  content: '';
  position: absolute;
  top: 8px;
  left: 8px;
  width: 16px;
  height: 16px;
  border-top: 2px solid #666;
  border-left: 2px solid #666;
}

.text-block-bracketed::after {
  content: '';
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 16px;
  height: 16px;
  border-bottom: 2px solid #666;
  border-right: 2px solid #666;
}
```

## Interaction States
- Static content, no interactive states
- May have reveal animation on scroll

## Accessibility
- Semantic paragraph element
- Decorative brackets don't interfere with reading
- High contrast text on light background
- Good line height for readability

## Responsive Notes
- Padding may increase on larger screens
- Font size may scale slightly
- Bracket size remains constant

## Related Components
- `section/about.md` - Parent section context

---

## Tablet (768px)

### Changes from Mobile
- **Width**: Wider container (~calc(100% - 64px))
- **Padding**: Same 24px internal
- **Font-size**: Same 16px

### Visual Differences
- Text has better line length for readability (~60-70 chars)
- Corner brackets remain same size (16px)
- Background color unchanged
- More horizontal breathing room overall

---

## Desktop (1440px)

### Changes from Tablet
- **Width**: Max-width ~600px (constrained for optimal reading)
- **Padding**: 32px internal (increased from 24px)
- **Position**: Centered within section container

### Dimensions
- **Max-width**: ~600px
- **Padding**: 32px
- **Background**: Same light warm gray (#F3F2EF)

### Visual Differences
- Text block has optimal line length (~65-75 characters)
- Corner brackets remain same size (16px)
- Generous whitespace around block
- Font-size: ~16-17px
- Line-height: 1.6-1.7
- Block centered with comfortable margins on both sides
