import type { WidgetBaseProps } from '../../../../../widgets/types'

export interface ScrollCardProps extends WidgetBaseProps {
  title?: string
  client?: string
  description?: string
  imageSrc?: string
  overlayImageSrc?: string
  videoSrc?: string
  cardBorder?: boolean
}
