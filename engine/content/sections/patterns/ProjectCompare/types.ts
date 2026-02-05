/**
 * ProjectCompare section props.
 * Before/after video comparison (The 21 style).
 */

export interface LogoConfig {
  src: string
  alt: string
  width?: number
}

export interface ProjectCompareProps {
  /** Section ID */
  id?: string
  /** Project logo */
  logo: LogoConfig
  /** "Before" video (breakdown/process) */
  beforeVideo: string
  /** "After" video (final result) */
  afterVideo: string
  /** Label for before video (optional) */
  beforeLabel?: string
  /** Label for after video (optional) */
  afterLabel?: string
  /** Project description text (optional) */
  description?: string
  /** Background color */
  backgroundColor?: string
  /** Video container background color */
  videoBackgroundColor?: string
  /** Description text color */
  descriptionColor?: string
  /** Contact email */
  email: string
}
