/**
 * ProjectGallery section props.
 * Main video with selectable project thumbnails (Azuki style).
 */

export interface GalleryProject {
  /** Unique identifier */
  id: string
  /** Thumbnail image URL */
  thumbnail: string
  /** Main video URL */
  video: string
  /** Project title */
  title: string
  /** Project year */
  year: string
  /** Studio name */
  studio: string
  /** External URL (optional) */
  url?: string
}

export interface LogoConfig {
  src: string
  alt: string
  width?: number
  invert?: boolean
}

export interface ProjectGalleryProps {
  /** Section ID */
  id?: string
  /** Project logo */
  logo: LogoConfig
  /** Projects in gallery OR binding expression */
  projects: GalleryProject[] | string
  /** Initial active project index */
  defaultActiveIndex?: number
  /** Background color */
  backgroundColor?: string
  /** Text color mode */
  textColor?: 'light' | 'dark'
  /** Contact email */
  email: string
}
