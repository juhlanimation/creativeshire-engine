/**
 * HaubjergWorkshops — Workshops page (Metoder).
 *
 * Workshop cards grouped by category with IntersectionObserver-driven
 * left-panel navigation, plus a methodology "Vores Tilgang" section.
 * Wrapped in SplitLayout with mission text and category nav.
 */

import { forwardRef, useEffect, useRef, useState } from 'react'
import type { WidgetBaseProps } from '../../../../content/widgets/types'
import {
  SplitLayout,
  type CategoryInfo,
} from '../../../../presets/haubjerg/components/SplitLayout'
import { ImageWithFallback } from '../../../../presets/haubjerg/components/ImageWithFallback'
import {
  workshopCategories,
  methodologySteps,
} from '../../../../presets/haubjerg/data/workshop-data'

const FONT_HEADING = "'DM Sans', sans-serif"
const FONT_MONO = "'Space Mono', monospace"
const FONT_BODY = "'DM Sans', sans-serif"

/** Inline ArrowRight SVG — avoids lucide-react dependency */
function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}

export interface HaubjergWorkshopsComponentProps extends WidgetBaseProps {}

export const HaubjergWorkshopsComponent = forwardRef<
  HTMLDivElement,
  HaubjergWorkshopsComponentProps
>(function HaubjergWorkshopsComponent(_props, ref) {
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const [activeCategory, setActiveCategory] = useState(
    workshopCategories[0]?.id || '',
  )

  const categories: CategoryInfo[] = workshopCategories.map((cat) => ({
    id: cat.id,
    label: cat.label,
  }))

  // Categories with workshops (for cards section)
  const categoriesWithWorkshops = workshopCategories.filter(
    (cat) => cat.workshops.length > 0,
  )

  // The "Vores Tilgang" methodology category (empty workshops)
  const methodologyCategory = workshopCategories.find(
    (cat) => cat.workshops.length === 0,
  )

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
    <div ref={ref} className="section-haubjerg-workshops">
      <SplitLayout
        missionTitle="FRA METODE TIL MENING"
        missionBody="Metodiske vaerktoejer der goer deltagerne i stand til at fortaelle med autenticitet."
        categoryTitle="Metoder"
        categories={categories}
        activeCategory={activeCategory}
        onCategoryClick={(id) => setActiveCategory(id)}
      >
        <div className="px-8 lg:px-14 pb-28">
          {/* Header */}
          <div className="mb-14 lg:mb-20 pt-4">
            <span
              className="text-[11px] tracking-[0.12em] text-white/20"
              style={{ fontFamily: FONT_MONO }}
            >
              Resultater af Workshops / Metodisk
            </span>
          </div>

          {/* Mobile category pills */}
          <div className="lg:hidden flex flex-wrap gap-3 mb-14">
            {workshopCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  sectionRefs.current[cat.id]?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  })
                }}
                className={`text-[10px] tracking-[0.12em] uppercase px-4 py-2 border rounded-full transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'text-white border-white/30'
                    : 'text-white/25 border-white/[0.06] hover:border-white/15'
                }`}
                style={{ fontFamily: FONT_MONO }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Workshop category sections */}
          <div className="space-y-28 lg:space-y-36">
            {categoriesWithWorkshops.map((category) => (
              <div
                key={category.id}
                ref={(el) => {
                  sectionRefs.current[category.id] = el
                }}
                data-category-id={category.id}
                className="scroll-mt-24"
              >
                {/* Category header: label + divider + count */}
                <div className="flex items-center gap-4 mb-12">
                  <span
                    className="text-[10px] tracking-[0.15em] uppercase text-white/25 shrink-0"
                    style={{ fontFamily: FONT_MONO }}
                  >
                    {category.label}
                  </span>
                  <div className="w-full h-px bg-white/[0.06]" />
                  <span
                    className="text-[10px] tracking-[0.15em] text-white/15 shrink-0"
                    style={{ fontFamily: FONT_MONO }}
                  >
                    {String(category.workshops.length).padStart(2, '0')}
                  </span>
                </div>

                {/* Workshop cards */}
                <div className="space-y-20">
                  {category.workshops.map((workshop) => (
                    <div key={workshop.id} className="group">
                      {/* Image */}
                      <div className="overflow-hidden relative aspect-[16/10] mb-8">
                        <ImageWithFallback
                          src={workshop.image}
                          alt={workshop.title}
                          className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-[filter] duration-1000"
                        />
                      </div>

                      {/* Card content */}
                      <div className="flex flex-col gap-4">
                        {/* Large number */}
                        <span
                          className="text-white/[0.06] leading-none"
                          style={{
                            fontFamily: FONT_HEADING,
                            fontSize: '3rem',
                            fontWeight: 700,
                          }}
                        >
                          {workshop.number}
                        </span>

                        {/* Subtitle */}
                        <span
                          className="text-white/20 uppercase tracking-[0.15em]"
                          style={{
                            fontFamily: FONT_MONO,
                            fontSize: '11px',
                          }}
                        >
                          {workshop.subtitle}
                        </span>

                        {/* Title */}
                        <h3
                          className="text-white tracking-[-0.02em]"
                          style={{
                            fontFamily: FONT_HEADING,
                            fontSize: 'clamp(1.4rem, 2.5vw, 1.8rem)',
                            fontWeight: 700,
                            lineHeight: 1.15,
                          }}
                        >
                          {workshop.title}
                        </h3>

                        {/* Description */}
                        <p
                          className="text-white/30 max-w-lg"
                          style={{
                            fontFamily: FONT_BODY,
                            fontSize: '14px',
                            lineHeight: 1.85,
                            fontWeight: 300,
                          }}
                        >
                          {workshop.description}
                        </p>

                        {/* Outcome tags */}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {workshop.outcomes.map((outcome) => (
                            <span
                              key={outcome}
                              className="text-white/30 border border-white/[0.08] rounded-full px-3 py-1 uppercase tracking-[0.12em]"
                              style={{
                                fontFamily: FONT_MONO,
                                fontSize: '10px',
                              }}
                            >
                              {outcome}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Methodology section: "Vores Tilgang" */}
            {methodologyCategory && (
              <div
                ref={(el) => {
                  sectionRefs.current[methodologyCategory.id] = el
                }}
                data-category-id={methodologyCategory.id}
                className="scroll-mt-24"
              >
                {/* Section header */}
                <div className="flex items-center gap-4 mb-12">
                  <span
                    className="text-[10px] tracking-[0.15em] uppercase text-white/25 shrink-0"
                    style={{ fontFamily: FONT_MONO }}
                  >
                    {methodologyCategory.label}
                  </span>
                  <div className="w-full h-px bg-white/[0.06]" />
                </div>

                {/* 3-column grid of methodology steps */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
                  {methodologySteps.map((step) => (
                    <div key={step.label} className="flex flex-col gap-4">
                      <ArrowRightIcon className="text-white/20" />
                      <h4
                        className="text-white tracking-[-0.01em]"
                        style={{
                          fontFamily: FONT_HEADING,
                          fontSize: '16px',
                          fontWeight: 600,
                          lineHeight: 1.3,
                        }}
                      >
                        {step.label}
                      </h4>
                      <p
                        className="text-white/30"
                        style={{
                          fontFamily: FONT_BODY,
                          fontSize: '13px',
                          lineHeight: 1.75,
                          fontWeight: 300,
                        }}
                      >
                        {step.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </SplitLayout>
    </div>
  )
})
