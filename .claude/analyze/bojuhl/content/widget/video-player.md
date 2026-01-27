# VideoPlayer

**Purpose:** Modal video playback
**Location:** Project cards

## Props
```typescript
interface VideoPlayerProps {
  videoUrl: string;
  duration: string;
  poster?: string;
}
```

## Structure
- Modal overlay (dark)
- Custom controls: close, progress, mute, volume
- 27 videos pre-loaded on page
