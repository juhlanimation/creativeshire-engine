/**
 * ProjectShowcase section props.
 * Single project display with video, metadata, and optional shot navigation.
 */

export interface LogoConfig {
  src: string
  alt: string
  width?: number
}

export interface ProjectShowcaseProps {
  /** Section ID */
  id?: string
  /** Project logo */
  logo: LogoConfig
  /** Studio name */
  studio: string
  /** Role in project */
  role: string
  /** Main video source */
  videoSrc: string
  /** Video poster image */
  videoPoster?: string
  /** Show border around video */
  videoBorder?: boolean
  /** Shot numbers for navigation (optional) */
  shots?: number[]
  /** Background color */
  backgroundColor?: string
  /** Text color mode */
  textColor?: 'light' | 'dark'
  /** Contact email */
  email: string
}
