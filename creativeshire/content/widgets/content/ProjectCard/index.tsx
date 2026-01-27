'use client'

/**
 * ProjectCard widget - featured project display with thumbnail and metadata.
 * Content Layer (L1) - no scroll listeners or viewport units.
 */

import React, { memo, forwardRef } from 'react'
import VideoThumbnail from '../VideoThumbnail'
import type { ProjectCardProps } from './types'
import './styles.css'

/**
 * ProjectCard component renders a featured project with thumbnail and details.
 * Responsive: stacked on mobile, two-column on tablet+.
 * Supports CSS variable animation via var() fallbacks in styles.css.
 */
const ProjectCard = memo(forwardRef<HTMLDivElement, ProjectCardProps>(function ProjectCard(
  {
    thumbnailSrc,
    thumbnailAlt,
    client,
    studio,
    title,
    description,
    year,
    role,
    watchLabel = 'WATCH',
    onWatch,
    reversed = false,
    className,
    'data-behaviour': dataBehaviour
  },
  ref
) {
  const classNames = [
    'project-card-widget',
    reversed ? 'project-card-widget--reversed' : '',
    className
  ].filter(Boolean).join(' ')

  return (
    <article
      ref={ref}
      className={classNames}
      data-behaviour={dataBehaviour}
    >
      {/* Thumbnail */}
      <div className="project-card-widget__thumbnail">
        <VideoThumbnail
          src={thumbnailSrc}
          alt={thumbnailAlt}
          watchLabel={watchLabel}
          onClick={onWatch}
        />
      </div>

      {/* Content */}
      <div className="project-card-widget__content">
        {/* Meta row */}
        <div className="project-card-widget__meta">
          <div className="project-card-widget__meta-item">
            <span className="project-card-widget__meta-label">Client</span>
            <span className="project-card-widget__meta-value">{client}</span>
          </div>
          <div className="project-card-widget__meta-item">
            <span className="project-card-widget__meta-label">Studio</span>
            <span className="project-card-widget__meta-value">{studio}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="project-card-widget__title">{title}</h3>

        {/* Description */}
        <p className="project-card-widget__description">{description}</p>

        {/* Year */}
        <p className="project-card-widget__detail">{year}</p>

        {/* Role */}
        <p className="project-card-widget__detail">{role}</p>
      </div>
    </article>
  )
}))

export default ProjectCard
