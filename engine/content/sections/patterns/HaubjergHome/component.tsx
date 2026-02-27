/**
 * HaubjergHome — Projects page (Kerneprodukter).
 *
 * 6 project cards with Ken Burns hover effect, wrapped in SplitLayout
 * with mission text and project category nav on the left panel.
 */

import { forwardRef, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import type { WidgetBaseProps } from '../../../../content/widgets/types'
import {
  SplitLayout,
  type CategoryInfo,
} from '../../../../presets/haubjerg/components/SplitLayout'
import { ImageWithFallback } from '../../../../presets/haubjerg/components/ImageWithFallback'
import { projects, type Project } from '../../../../presets/haubjerg/data/project-data'

const FONT_HEADING = "'DM Sans', sans-serif"
const FONT_MONO = "'Space Mono', monospace"
const FONT_BODY = "'DM Sans', sans-serif"

export interface HaubjergHomeComponentProps extends WidgetBaseProps {}

export const HaubjergHomeComponent = forwardRef<HTMLDivElement, HaubjergHomeComponentProps>(
  function HaubjergHomeComponent(_props, ref) {
    const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})
    const [activeCategory, setActiveCategory] = useState(
      projects[0]?.id.toString() || '',
    )

    const categories: CategoryInfo[] = projects.map((p) => ({
      id: p.id.toString(),
      label: p.title,
    }))

    // IntersectionObserver for active category tracking
    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries.filter((e) => e.isIntersecting)
          if (visible.length > 0) {
            const top = visible.reduce((a, b) =>
              a.intersectionRatio > b.intersectionRatio ? a : b,
            )
            const id = top.target.getAttribute('data-category-id')
            if (id) setActiveCategory(id)
          }
        },
        { threshold: [0, 0.2, 0.4, 0.6], rootMargin: '-20% 0px -40% 0px' },
      )

      Object.values(sectionRefs.current).forEach((el) => {
        if (el) observer.observe(el)
      })

      return () => observer.disconnect()
    }, [])

    return (
      <div ref={ref} className="section-haubjerg-home">
        <SplitLayout
          missionTitle="HISTORIER VERDEN MANGLER"
          missionBody="Fotografi, journalistik og facilitering. Visuelle fortaellinger der forbinder mennesker."
          ctaLabel="Laer Mere"
          ctaHref="/kontakt"
          categoryTitle="Projekter"
          categories={categories}
          activeCategory={activeCategory}
          onCategoryClick={(id) => setActiveCategory(id)}
        >
          <div className="px-8 lg:px-14 pb-28">
            <div className="mb-14 lg:mb-20 pt-4">
              <span
                className="text-[11px] tracking-[0.12em] text-white/20"
                style={{ fontFamily: FONT_MONO }}
              >
                Kerneprodukter / Projekter
              </span>
            </div>

            {/* Mobile project pills */}
            <div className="lg:hidden flex flex-wrap gap-3 mb-14">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => {
                    sectionRefs.current[project.id.toString()]?.scrollIntoView({
                      behavior: 'smooth',
                      block: 'start',
                    })
                  }}
                  className={`text-[10px] tracking-[0.12em] uppercase px-4 py-2 border rounded-full transition-all duration-300 ${
                    activeCategory === project.id.toString()
                      ? 'text-white border-white/30'
                      : 'text-white/25 border-white/[0.06] hover:border-white/15'
                  }`}
                  style={{ fontFamily: FONT_MONO }}
                >
                  {project.title}
                </button>
              ))}
            </div>

            <div className="space-y-28 lg:space-y-36">
              {projects.map((project, index) => (
                <div
                  key={project.id}
                  ref={(el) => {
                    sectionRefs.current[project.id.toString()] = el
                  }}
                  data-category-id={project.id.toString()}
                  className="scroll-mt-[72px]"
                >
                  <ProjectCard project={project} idx={index + 1} />
                </div>
              ))}
            </div>
          </div>
        </SplitLayout>
      </div>
    )
  },
)

function ProjectCard({ project, idx }: { project: Project; idx: number }) {
  const [hovered, setHovered] = useState(false)

  const kenBurnsVariants = [
    { scale: 1.15, x: '-3%', y: '-2%' },
    { scale: 1.12, x: '2%', y: '-3%' },
    { scale: 1.18, x: '-2%', y: '2%' },
    { scale: 1.14, x: '3%', y: '1%' },
    { scale: 1.16, x: '0%', y: '-3%' },
    { scale: 1.13, x: '-3%', y: '0%' },
  ]
  const kenBurns = kenBurnsVariants[idx % kenBurnsVariants.length]

  return (
    <a
      href={`/projekt/${project.id}`}
      className="group block cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image with Ken Burns "video" effect + title overlay in difference blend */}
      <div className="overflow-hidden relative aspect-[16/10]">
        {/* Base still image */}
        <motion.div
          className="absolute inset-0"
          animate={{ opacity: hovered ? 0 : 1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <ImageWithFallback
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover grayscale-[30%]"
          />
        </motion.div>

        {/* Hover "footage" image with Ken Burns */}
        <motion.div
          className="absolute inset-0"
          animate={
            hovered
              ? {
                  opacity: 1,
                  scale: kenBurns.scale,
                  x: kenBurns.x,
                  y: kenBurns.y,
                }
              : { opacity: 0, scale: 1, x: '0%', y: '0%' }
          }
          transition={{
            opacity: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] },
            scale: {
              duration: hovered ? 8 : 1.2,
              ease: hovered ? 'linear' : [0.25, 0.1, 0.25, 1],
            },
            x: {
              duration: hovered ? 8 : 1.2,
              ease: hovered ? 'linear' : [0.25, 0.1, 0.25, 1],
            },
            y: {
              duration: hovered ? 8 : 1.2,
              ease: hovered ? 'linear' : [0.25, 0.1, 0.25, 1],
            },
          }}
        >
          <ImageWithFallback
            src={project.hoverImage}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Dark gradient behind title */}
        <div
          className="absolute inset-x-0 bottom-0 h-[60%] pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
          }}
        />

        {/* Title in difference blend */}
        <div
          className="absolute inset-0 flex items-end p-6 lg:p-10 pointer-events-none"
          style={{ mixBlendMode: 'difference' }}
        >
          <h3
            className="text-white uppercase tracking-[0.05em]"
            style={{
              fontFamily: FONT_HEADING,
              fontWeight: 800,
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              lineHeight: 1.05,
            }}
          >
            {project.title}
          </h3>
        </div>

        {/* "REC" indicator on hover */}
        <motion.div
          className="absolute top-5 right-5 flex items-center gap-2 pointer-events-none"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.4, delay: hovered ? 0.3 : 0 }}
        >
          <motion.div
            className="w-2 h-2 rounded-full bg-red-500"
            animate={{ opacity: hovered ? [1, 0.3, 1] : 0 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span
            className="text-[9px] tracking-[0.2em] text-white/50"
            style={{ fontFamily: FONT_MONO }}
          >
            REC
          </span>
        </motion.div>
      </div>

      {/* Description reveal area */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <motion.p
              className="text-white/50 max-w-lg py-6"
              style={{
                fontFamily: FONT_BODY,
                fontSize: '14px',
                lineHeight: 1.85,
                fontWeight: 300,
              }}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 8, opacity: 0 }}
              transition={{
                duration: 0.4,
                ease: [0.25, 0.1, 0.25, 1],
                delay: 0.05,
              }}
            >
              {project.description}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Number / line / responsible name */}
      <motion.div
        className="flex items-center justify-between gap-6 pt-3"
        animate={{ paddingTop: hovered ? '0px' : '12px' }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <span
          className="text-[11px] tracking-[0.2em] text-white/30 shrink-0"
          style={{ fontFamily: FONT_MONO }}
        >
          {String(idx).padStart(2, '0')}
        </span>
        <div className="w-full h-px bg-white/[0.1]" />
        <span
          className="text-[11px] tracking-[0.15em] text-white/40 shrink-0 uppercase"
          style={{ fontFamily: FONT_MONO }}
        >
          {project.responsible}
        </span>
      </motion.div>
    </a>
  )
}
