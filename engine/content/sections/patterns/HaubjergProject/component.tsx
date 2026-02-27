/**
 * HaubjergProject — Project detail page.
 *
 * Merges ProjektDetalje + ProjektLayout1 + ProjektLayout2 from source.
 * Accepts project data + layoutType as component props (replaces useParams).
 * Layout1 (projects 1,4): SplitLayout with project mission
 * Layout2 (projects 2,3,5,6): SplitLayout fullWidth — full-bleed hero
 */

import { forwardRef } from 'react'
import { motion } from 'motion/react'
import type { WidgetBaseProps } from '../../../../content/widgets/types'
import { SplitLayout } from '../../../../presets/haubjerg/components/SplitLayout'
import { ImageWithFallback } from '../../../../presets/haubjerg/components/ImageWithFallback'
import { projects, type Project } from '../../../../presets/haubjerg/data/project-data'

const FONT_HEADING = "'DM Sans', sans-serif"
const FONT_MONO = "'Space Mono', monospace"
const FONT_BODY = "'DM Sans', sans-serif"

export interface HaubjergProjectComponentProps extends WidgetBaseProps {
  project?: Project
  layoutType?: 1 | 2
}

export const HaubjergProjectComponent = forwardRef<
  HTMLDivElement,
  HaubjergProjectComponentProps
>(function HaubjergProjectComponent(props, ref) {
  const project = props.project ?? projects[0]
  const layoutType = props.layoutType ?? project.layoutType
  const currentIndex = projects.findIndex((p) => p.id === project.id)
  const isFullWidth = layoutType !== 1

  return (
    <div ref={ref} className="section-haubjerg-project">
      <SplitLayout
        missionTitle={project.title.toUpperCase()}
        missionBody={project.description}
        fullWidth={isFullWidth}
      >
        {isFullWidth ? (
          <Layout2Content
            project={project}
            currentIndex={currentIndex}
          />
        ) : (
          <Layout1Content
            project={project}
            currentIndex={currentIndex}
          />
        )}
      </SplitLayout>
    </div>
  )
})

/* ================================================================
 * Layout 1 — Single column with sidebar
 * ================================================================ */

function Layout1Content({
  project,
  currentIndex,
}: {
  project: Project
  currentIndex: number
}) {
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null
  const nextProject =
    currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null

  return (
    <div className="px-8 lg:px-14 pb-28">
      {/* Breadcrumb */}
      <div className="mb-8 lg:mb-12 pt-4 flex items-center gap-3">
        <a
          href="/"
          className="text-[11px] tracking-[0.12em] text-white/30 hover:text-white/60 transition-colors flex items-center gap-2"
          style={{ fontFamily: FONT_MONO }}
        >
          <ArrowLeftIcon />
          Projekter
        </a>
        <span className="text-white/10 text-[11px]">/</span>
        <span
          className="text-[11px] tracking-[0.12em] text-white/20"
          style={{ fontFamily: FONT_MONO }}
        >
          {String(currentIndex + 1).padStart(2, '0')}
        </span>
      </div>

      {/* Hero image */}
      <motion.div
        className="overflow-hidden relative aspect-[16/10] mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <ImageWithFallback
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: 'inset 0 0 120px 40px rgba(0,0,0,0.5)' }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-[60%] pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)',
          }}
        />
        <div className="absolute top-5 left-6 lg:left-10 pointer-events-none">
          <span
            className="text-[11px] tracking-[0.2em] text-white/30"
            style={{ fontFamily: FONT_MONO }}
          >
            {String(currentIndex + 1).padStart(2, '0')} /{' '}
            {String(projects.length).padStart(2, '0')}
          </span>
        </div>
      </motion.div>

      {/* Meta bar */}
      <MetaBar project={project} delay={0.15} />

      {/* Description */}
      <motion.div
        className="mb-20 max-w-2xl"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        {project.longDescription.split('\n\n').map((paragraph, i) => (
          <p
            key={i}
            className="text-white/45 mb-6 last:mb-0"
            style={{
              fontFamily: FONT_BODY,
              fontSize: '15px',
              lineHeight: 1.9,
              fontWeight: 300,
            }}
          >
            {paragraph}
          </p>
        ))}
      </motion.div>

      {/* Key facts */}
      <KeyFacts project={project} layout="grid" delay={0.35} />

      {/* Gallery */}
      <Gallery project={project} layout="grid-2col" delay={0.45} />

      {/* Prev / Next navigation */}
      <ProjectNav prevProject={prevProject} nextProject={nextProject} delay={0.6} />
    </div>
  )
}

/* ================================================================
 * Layout 2 — Full-width immersive
 * ================================================================ */

function Layout2Content({
  project,
  currentIndex,
}: {
  project: Project
  currentIndex: number
}) {
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null
  const nextProject =
    currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null

  return (
    <div className="pb-28">
      {/* Breadcrumb */}
      <div className="px-8 lg:px-14 mb-8 lg:mb-12 pt-4 flex items-center gap-3">
        <a
          href="/"
          className="text-[11px] tracking-[0.12em] text-white/30 hover:text-white/60 transition-colors flex items-center gap-2"
          style={{ fontFamily: FONT_MONO }}
        >
          <ArrowLeftIcon />
          Projekter
        </a>
        <span className="text-white/10 text-[11px]">/</span>
        <span
          className="text-[11px] tracking-[0.12em] text-white/20"
          style={{ fontFamily: FONT_MONO }}
        >
          {String(currentIndex + 1).padStart(2, '0')}
        </span>
      </div>

      {/* Full-bleed hero with title overlay */}
      <motion.div
        className="relative w-full h-[85vh] min-h-[500px] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <ImageWithFallback
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ boxShadow: 'inset 0 0 200px 80px rgba(0,0,0,0.6)' }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-[50%] pointer-events-none"
          style={{
            background:
              'linear-gradient(to top, rgba(10,10,10,1) 0%, rgba(10,10,10,0.7) 40%, transparent 100%)',
          }}
        />
        <div className="absolute bottom-12 left-8 lg:left-16 right-8 lg:right-16 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span
              className="text-[10px] tracking-[0.2em] uppercase text-white/30 block mb-4"
              style={{ fontFamily: FONT_MONO }}
            >
              {String(currentIndex + 1).padStart(2, '0')} /{' '}
              {String(projects.length).padStart(2, '0')} — {project.responsible}
            </span>
            <h1
              className="text-[clamp(2.5rem,6vw,5rem)] tracking-[-0.03em] text-white uppercase max-w-[900px]"
              style={{
                fontFamily: FONT_HEADING,
                fontWeight: 700,
                lineHeight: 1.0,
                mixBlendMode: 'difference',
              }}
            >
              {project.title}
            </h1>
          </motion.div>
        </div>
      </motion.div>

      {/* Horizontal metadata strip */}
      <motion.div
        className="px-8 lg:px-16 py-8 border-b border-white/[0.06] flex flex-wrap gap-x-12 gap-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {metaFields(project).map((meta) => (
          <div key={meta.label}>
            <span
              className="text-[9px] tracking-[0.2em] uppercase text-white/20 block mb-1"
              style={{ fontFamily: FONT_MONO }}
            >
              {meta.label}
            </span>
            <span
              className="text-[13px] text-white/70"
              style={{ fontFamily: FONT_BODY }}
            >
              {meta.value}
            </span>
          </div>
        ))}
      </motion.div>

      {/* Two-column: description left, key facts right */}
      <motion.div
        className="px-8 lg:px-16 py-20 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-16 lg:gap-24"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <div>
          <span
            className="text-[10px] tracking-[0.15em] uppercase text-white/15 block mb-8"
            style={{ fontFamily: FONT_MONO }}
          >
            Om projektet
          </span>
          {project.longDescription.split('\n\n').map((paragraph, i) => (
            <p
              key={i}
              className="text-white/45 mb-6 last:mb-0"
              style={{
                fontFamily: FONT_BODY,
                fontSize: '16px',
                lineHeight: 2,
                fontWeight: 300,
              }}
            >
              {paragraph}
            </p>
          ))}
        </div>

        <div>
          <span
            className="text-[10px] tracking-[0.15em] uppercase text-white/15 block mb-8"
            style={{ fontFamily: FONT_MONO }}
          >
            Noegletal
          </span>
          <div className="flex flex-col gap-0">
            {project.keyFacts.map((fact) => (
              <div
                key={fact.label}
                className="border-t border-white/[0.06] py-6 flex items-baseline justify-between"
              >
                <span
                  className="text-[10px] tracking-[0.15em] uppercase text-white/25"
                  style={{ fontFamily: FONT_MONO }}
                >
                  {fact.label}
                </span>
                <span
                  className="text-[36px] lg:text-[48px] text-white/80"
                  style={{
                    fontFamily: FONT_HEADING,
                    fontWeight: 700,
                    lineHeight: 1,
                  }}
                >
                  {fact.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Full-bleed gallery — alternating sizes */}
      <motion.div
        className="px-8 lg:px-16 mb-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <span
          className="text-[10px] tracking-[0.15em] uppercase text-white/15 block mb-8"
          style={{ fontFamily: FONT_MONO }}
        >
          Galleri
        </span>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {project.galleryImages.map((img, i) => (
            <motion.div
              key={i}
              className={`overflow-hidden relative ${
                i % 3 === 0
                  ? 'lg:col-span-8 aspect-[16/9]'
                  : i % 3 === 1
                    ? 'lg:col-span-4 aspect-[3/4]'
                    : 'lg:col-span-12 aspect-[21/9]'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 + i * 0.12 }}
            >
              <ImageWithFallback
                src={img}
                alt={`${project.title} galleri ${i + 1}`}
                className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ boxShadow: 'inset 0 0 80px 20px rgba(0,0,0,0.3)' }}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Prev / Next navigation */}
      <div className="px-8 lg:px-16">
        <ProjectNav prevProject={prevProject} nextProject={nextProject} delay={0.8} />
      </div>
    </div>
  )
}

/* ================================================================
 * Shared sub-components
 * ================================================================ */

function metaFields(project: Project) {
  return [
    { label: 'Ansvarlig', value: project.responsible },
    { label: 'Aar', value: project.year },
    { label: 'Varighed', value: project.duration },
    { label: 'Medium', value: project.medium },
    { label: 'Status', value: project.status },
  ]
}

function MetaBar({ project, delay }: { project: Project; delay: number }) {
  return (
    <motion.div
      className="flex flex-wrap gap-x-10 gap-y-4 mb-16 pb-8 border-b border-white/[0.06]"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      {metaFields(project).map((meta) => (
        <div key={meta.label}>
          <span
            className="text-[9px] tracking-[0.2em] uppercase text-white/20 block mb-1"
            style={{ fontFamily: FONT_MONO }}
          >
            {meta.label}
          </span>
          <span
            className="text-[13px] text-white/70"
            style={{ fontFamily: FONT_BODY }}
          >
            {meta.value}
          </span>
        </div>
      ))}
    </motion.div>
  )
}

function KeyFacts({
  project,
  layout,
  delay,
}: {
  project: Project
  layout: 'grid'
  delay: number
}) {
  return (
    <motion.div
      className="mb-20"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <span
        className="text-[10px] tracking-[0.15em] uppercase text-white/15 block mb-8"
        style={{ fontFamily: FONT_MONO }}
      >
        Noegletal
      </span>
      <div className="grid grid-cols-3 gap-6">
        {project.keyFacts.map((fact) => (
          <div key={fact.label} className="border-t border-white/[0.06] pt-5">
            <span
              className="text-[28px] lg:text-[36px] text-white/80 block mb-2"
              style={{
                fontFamily: FONT_HEADING,
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              {fact.value}
            </span>
            <span
              className="text-[10px] tracking-[0.15em] uppercase text-white/25"
              style={{ fontFamily: FONT_MONO }}
            >
              {fact.label}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function Gallery({
  project,
  layout,
  delay,
}: {
  project: Project
  layout: 'grid-2col'
  delay: number
}) {
  return (
    <motion.div
      className="mb-20"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <span
        className="text-[10px] tracking-[0.15em] uppercase text-white/15 block mb-8"
        style={{ fontFamily: FONT_MONO }}
      >
        Galleri
      </span>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {project.galleryImages.map((img, i) => (
          <motion.div
            key={i}
            className="overflow-hidden relative aspect-[4/3]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: delay + 0.05 + i * 0.1 }}
          >
            <ImageWithFallback
              src={img}
              alt={`${project.title} galleri ${i + 1}`}
              className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ boxShadow: 'inset 0 0 80px 20px rgba(0,0,0,0.3)' }}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

function ProjectNav({
  prevProject,
  nextProject,
  delay,
}: {
  prevProject: Project | null
  nextProject: Project | null
  delay: number
}) {
  return (
    <motion.div
      className="border-t border-white/[0.06] pt-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="flex items-stretch justify-between gap-4">
        <div className="flex-1">
          {prevProject ? (
            <a href={`/projekt/${prevProject.id}`} className="group text-left block w-full">
              <span
                className="text-[9px] tracking-[0.2em] uppercase text-white/15 block mb-3"
                style={{ fontFamily: FONT_MONO }}
              >
                Forrige projekt
              </span>
              <span className="flex items-center gap-3 text-white/40 group-hover:text-white transition-colors">
                <ArrowLeftIcon />
                <span
                  className="text-[13px] tracking-[0.05em] uppercase"
                  style={{ fontFamily: FONT_HEADING, fontWeight: 600 }}
                >
                  {prevProject.title}
                </span>
              </span>
            </a>
          ) : (
            <div />
          )}
        </div>

        <div className="flex-1 text-right">
          {nextProject ? (
            <a href={`/projekt/${nextProject.id}`} className="group text-right block w-full">
              <span
                className="text-[9px] tracking-[0.2em] uppercase text-white/15 block mb-3"
                style={{ fontFamily: FONT_MONO }}
              >
                Naeste projekt
              </span>
              <span className="flex items-center justify-end gap-3 text-white/40 group-hover:text-white transition-colors">
                <span
                  className="text-[13px] tracking-[0.05em] uppercase"
                  style={{ fontFamily: FONT_HEADING, fontWeight: 600 }}
                >
                  {nextProject.title}
                </span>
                <ArrowRightIcon />
              </span>
            </a>
          ) : (
            <div />
          )}
        </div>
      </div>
    </motion.div>
  )
}

/* Inline SVG icons */
function ArrowLeftIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}
