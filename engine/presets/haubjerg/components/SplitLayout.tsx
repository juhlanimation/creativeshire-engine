/**
 * SplitLayout — 40/60 split panel layout shared across all Haubjerg sections.
 *
 * Adapted from source Layout.tsx. Removes:
 * - NavBar (now engine chrome header)
 * - GrainOverlay (now engine chrome overlay)
 * - React Router (engine navigation)
 * - CustomEvent system (replaced by React props)
 */

import { useState, useCallback, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { ImageWithFallback } from './ImageWithFallback'
import { projects } from '../data/project-data'

const FONT_HEADING = "'DM Sans', sans-serif"
const FONT_MONO = "'Space Mono', monospace"
const FONT_BODY = "'DM Sans', sans-serif"

export interface CategoryInfo {
  id: string
  label: string
}

export interface SelectedPersonData {
  id: number
  name: string
  title: string
  image: string
  bio: string
  category: string
}

export interface SplitLayoutProps {
  children: ReactNode
  missionTitle: string
  missionBody: string
  ctaLabel?: string
  ctaHref?: string
  categoryTitle?: string
  categories?: CategoryInfo[]
  activeCategory?: string
  onCategoryClick?: (id: string) => void
  selectedPerson?: SelectedPersonData | null
  onPersonClose?: () => void
  fullWidth?: boolean
}

export function SplitLayout({
  children,
  missionTitle,
  missionBody,
  ctaLabel,
  ctaHref,
  categoryTitle = 'Kategorier',
  categories = [],
  activeCategory = '',
  onCategoryClick,
  selectedPerson = null,
  onPersonClose,
  fullWidth = false,
}: SplitLayoutProps) {
  const hasCategories = categories.length > 0

  const scrollToCategory = useCallback(
    (id: string) => {
      onCategoryClick?.(id)
      const el = document.querySelector(`[data-category-id="${id}"]`)
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    },
    [onCategoryClick],
  )

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative">
      {/* Main Content Area — pt-[72px] clears the fixed chrome nav */}
      <div className="flex min-h-screen pt-[72px]">
        {/* Fixed Mission Statement — Left Side */}
        {!fullWidth && (
          <div className="hidden lg:flex sticky top-[72px] w-[40%] h-[calc(100vh-72px)] shrink-0 flex-col justify-between px-14 pb-16">
            {/* Category nav — centered vertically */}
            {hasCategories && (
              <div className="flex-1 flex items-center">
                <div>
                  <span
                    className="text-[10px] tracking-[0.15em] uppercase text-white/15 block mb-4"
                    style={{ fontFamily: FONT_MONO }}
                  >
                    {categoryTitle}
                  </span>
                  <div className="flex flex-col gap-2.5">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => scrollToCategory(cat.id)}
                        className={`text-left text-[12px] tracking-[0.08em] transition-all duration-400 flex items-center gap-3 group ${
                          activeCategory === cat.id
                            ? 'text-white'
                            : 'text-white/25 hover:text-white/50'
                        }`}
                        style={{ fontFamily: FONT_MONO }}
                      >
                        <span
                          className={`inline-block h-px transition-all duration-400 ${
                            activeCategory === cat.id
                              ? 'w-6 bg-white'
                              : 'w-3 bg-white/20 group-hover:w-4 group-hover:bg-white/40'
                          }`}
                        />
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Spacer when no categories */}
            {!hasCategories && <div className="flex-1" />}

            {/* Mission text (hidden when person is selected) */}
            <AnimatePresence mode="wait">
              {!selectedPerson && (
                <motion.div
                  key="mission"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-[420px]"
                >
                  <h2
                    className="text-[clamp(2.2rem,3.8vw,3.2rem)] tracking-[-0.03em] mb-8 text-white"
                    style={{ fontFamily: FONT_HEADING, fontWeight: 700, lineHeight: 1.08 }}
                  >
                    {missionTitle}
                  </h2>
                  <p
                    className="text-white/35 mb-10 max-w-[360px]"
                    style={{
                      fontFamily: FONT_BODY,
                      fontSize: '15px',
                      lineHeight: 1.75,
                      fontWeight: 300,
                    }}
                  >
                    {missionBody}
                  </p>
                  {ctaLabel && (
                    <a
                      href={ctaHref ?? '#'}
                      className="inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors group"
                      style={{ fontFamily: FONT_BODY }}
                    >
                      {ctaLabel}
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="group-hover:translate-x-1 transition-transform"
                      >
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </a>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Selected Person Full-Height Overlay Panel */}
        {!fullWidth && (
          <AnimatePresence>
            {selectedPerson && (
              <PersonPanel person={selectedPerson} onClose={onPersonClose} />
            )}
          </AnimatePresence>
        )}

        {/* Scrollable Content — Right Side */}
        <div className={`w-full ${fullWidth ? '' : 'lg:w-[60%]'}`}>
          {/* Mobile Mission */}
          {!fullWidth && (
            <div className="lg:hidden px-8 pt-4 pb-14">
              <h2
                className="text-[2rem] tracking-[-0.02em] mb-5 text-white"
                style={{ fontFamily: FONT_HEADING, fontWeight: 700, lineHeight: 1.1 }}
              >
                {missionTitle}
              </h2>
              <p
                className="text-white/35 max-w-sm"
                style={{
                  fontFamily: FONT_BODY,
                  fontSize: '15px',
                  lineHeight: 1.75,
                  fontWeight: 300,
                }}
              >
                {missionBody}
              </p>
            </div>
          )}

          {children}
        </div>
      </div>
    </div>
  )
}

function PersonPanel({
  person,
  onClose,
}: {
  person: SelectedPersonData
  onClose?: () => void
}) {
  const personProjects = projects.filter((p) => p.responsible === person.name)

  return (
    <motion.div
      key={person.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="hidden lg:flex fixed top-[72px] left-0 w-[32%] h-[calc(100vh-72px)] z-[200] border-r border-white/[0.08] bg-[#0a0a0a] flex-col"
    >
      {/* Close button */}
      <div className="flex justify-end px-8 pt-6">
        <button
          onClick={onClose}
          className="text-white/20 hover:text-white/60 transition-colors"
        >
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
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>

      {/* Person content */}
      <div className="flex-1 flex items-center justify-center px-10">
        <div className="max-w-[300px] w-full flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full aspect-square overflow-hidden mb-8"
          >
            <ImageWithFallback
              src={person.image}
              alt={person.name}
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="text-[9px] tracking-[0.2em] uppercase text-white/20 block mb-3"
            style={{ fontFamily: FONT_MONO }}
          >
            {person.category}
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[clamp(1.4rem,2.2vw,1.8rem)] tracking-[-0.03em] mb-2 text-white"
            style={{ fontFamily: FONT_HEADING, fontWeight: 700, lineHeight: 1.08 }}
          >
            {person.name}
          </motion.h2>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="text-white/40 block mb-6"
            style={{ fontFamily: FONT_BODY, fontSize: '13px', fontWeight: 400 }}
          >
            {person.title}
          </motion.span>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="h-px bg-white/[0.08] mb-6 origin-left w-full"
          />

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="text-white/35"
            style={{ fontFamily: FONT_BODY, fontSize: '13px', lineHeight: 1.75, fontWeight: 300 }}
          >
            {person.bio}
          </motion.p>

          {/* Contributed projects */}
          {personProjects.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.42 }}
              className="w-full mt-8"
            >
              <div className="h-px bg-white/[0.06] mb-5" />
              <span
                className="text-[9px] tracking-[0.2em] uppercase text-white/15 block mb-4"
                style={{ fontFamily: FONT_MONO }}
              >
                Projekter
              </span>
              <div className="flex flex-col gap-2">
                {personProjects.map((proj) => (
                  <a
                    key={proj.id}
                    href={`/projekt/${proj.id}`}
                    onClick={onClose}
                    className="group flex items-center gap-3 text-left py-1.5 transition-colors"
                  >
                    <span className="inline-block w-3 h-px bg-white/15 group-hover:w-5 group-hover:bg-white/40 transition-all duration-300" />
                    <span
                      className="text-white/30 group-hover:text-white/80 transition-colors"
                      style={{ fontFamily: FONT_BODY, fontSize: '12px', fontWeight: 500 }}
                    >
                      {proj.title}
                    </span>
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-white/0 group-hover:text-white/40 transition-all ml-auto"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Bottom label */}
      <div className="px-10 pb-10 flex justify-center">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.45 }}
          className="text-[9px] tracking-[0.15em] uppercase text-white/[0.08] block"
          style={{ fontFamily: FONT_MONO }}
        >
          Profil
        </motion.span>
      </div>
    </motion.div>
  )
}
