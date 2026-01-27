# Marquee

**Purpose:** Infinite horizontal scroll for logos
**Location:** Logo marquee section

## Implementation
```css
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-33.33%); }
}
animation: marquee 30s linear infinite;
```

- Logos duplicated 3× for seamless loop
- No pause on hover
