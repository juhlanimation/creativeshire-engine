# ProjectCard

**Purpose:** Featured project showcase
**Location:** Featured projects section

## Props
```typescript
interface ProjectCardProps {
  title: string;
  description: string;
  year: number;
  role: string;
  client: string;
  studio: string;
  image: ImageProps;
  layout: 'image-left' | 'image-right';
  videoUrl?: string;
}
```

## Structure
- Two-column (55% image, 45% content)
- Alternating layout (odd=left, even=right)
- Title: Bold, uppercase, ~24px
- Meta: Small, muted

## Projects
1. ELEMENTS OF TIME (2025) - Azuki
2. TOWER REVEAL (2024) - Supercell
3. SANTA HOG RIDER'S WORKSHOP (2022) - Supercell
4. RETURN TO VALORAN CITY (2022) - Riot
5. THE PRINCESS & THE GREEN KNIGHT (2020) - Amazon
6. DONATE YOUR DATA (2020) - Optus
