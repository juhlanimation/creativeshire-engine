/**
 * HaubjergPeople — Ambassadoer (people) page.
 *
 * Grid of people grouped by category with circular avatars,
 * wrapped in SplitLayout with category nav on the left panel.
 * Clicking a person opens the SplitLayout person detail panel.
 */

import { forwardRef, useEffect, useRef, useState } from 'react'
import type { WidgetBaseProps } from '../../../../content/widgets/types'
import {
  SplitLayout,
  type CategoryInfo,
  type SelectedPersonData,
} from '../../../../presets/haubjerg/components/SplitLayout'
import { ImageWithFallback } from '../../../../presets/haubjerg/components/ImageWithFallback'
import { peopleCategories } from '../../../../presets/haubjerg/data/people-data'

const FONT_HEADING = "'DM Sans', sans-serif"
const FONT_MONO = "'Space Mono', monospace"
const FONT_BODY = "'DM Sans', sans-serif"

export interface HaubjergPeopleComponentProps extends WidgetBaseProps {}

export const HaubjergPeopleComponent = forwardRef<HTMLDivElement, HaubjergPeopleComponentProps>(
  function HaubjergPeopleComponent(_props, ref) {
    const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})
    const [activeCategory, setActiveCategory] = useState(
      peopleCategories[0]?.id || '',
    )
    const [selectedPerson, setSelectedPerson] = useState<SelectedPersonData | null>(null)

    const categories: CategoryInfo[] = peopleCategories.map((cat) => ({
      id: cat.id,
      label: cat.label,
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
      <div ref={ref} className="section-haubjerg-people">
        <SplitLayout
          missionTitle="MENNESKER I CENTRUM"
          missionBody="Ambassadoererne er kernen. Deres perspektiver driver dybere forstaelse."
          categoryTitle="Grupper"
          categories={categories}
          activeCategory={activeCategory}
          onCategoryClick={(id) => setActiveCategory(id)}
          selectedPerson={selectedPerson}
          onPersonClose={() => setSelectedPerson(null)}
        >
          <div className="px-8 lg:px-14 pb-28">
            {/* Header breadcrumb */}
            <div className="mb-14 lg:mb-20 pt-4">
              <span
                className="text-[11px] tracking-[0.12em] text-white/20"
                style={{ fontFamily: FONT_MONO }}
              >
                Netvaerk / Mennesker
              </span>
            </div>

            {/* Mobile category pills */}
            <div className="lg:hidden flex flex-wrap gap-3 mb-14">
              {peopleCategories.map((cat) => (
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

            {/* Category sections */}
            <div className="space-y-24 lg:space-y-32">
              {peopleCategories.map((cat) => (
                <div
                  key={cat.id}
                  ref={(el) => {
                    sectionRefs.current[cat.id] = el
                  }}
                  data-category-id={cat.id}
                  className="scroll-mt-24"
                >
                  {/* Section header: label + count */}
                  <div className="flex items-center gap-4 mb-10">
                    <h3
                      className="text-[13px] tracking-[0.1em] uppercase text-white/60"
                      style={{ fontFamily: FONT_MONO, fontWeight: 500 }}
                    >
                      {cat.label}
                    </h3>
                    <div className="flex-1 h-px bg-white/[0.06]" />
                    <span
                      className="text-[11px] tracking-[0.15em] text-white/20"
                      style={{ fontFamily: FONT_MONO }}
                    >
                      {String(cat.people.length).padStart(2, '0')}
                    </span>
                  </div>

                  {/* People grid: circular avatars */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-10">
                    {cat.people.map((person) => {
                      const isSelected = selectedPerson?.id === person.id

                      return (
                        <button
                          key={person.id}
                          onClick={() =>
                            setSelectedPerson(
                              isSelected
                                ? null
                                : {
                                    id: person.id,
                                    name: person.name,
                                    title: person.title,
                                    image: person.image,
                                    bio: person.bio,
                                    category: cat.label,
                                  },
                            )
                          }
                          className="group flex flex-col items-center text-center cursor-pointer"
                        >
                          {/* Avatar */}
                          <div
                            className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden mb-4 transition-all duration-500 ${
                              isSelected
                                ? 'ring-2 ring-white/30 ring-offset-2 ring-offset-[#0a0a0a]'
                                : ''
                            }`}
                          >
                            <ImageWithFallback
                              src={person.image}
                              alt={person.name}
                              className={`w-full h-full object-cover transition-all duration-500 ${
                                isSelected
                                  ? 'grayscale-0 scale-105'
                                  : 'grayscale group-hover:grayscale-0 group-hover:scale-105'
                              }`}
                            />
                          </div>

                          {/* Name */}
                          <span
                            className={`text-[13px] tracking-[-0.01em] mb-1 transition-colors duration-300 ${
                              isSelected
                                ? 'text-white'
                                : 'text-white/60 group-hover:text-white'
                            }`}
                            style={{
                              fontFamily: FONT_HEADING,
                              fontWeight: 600,
                            }}
                          >
                            {person.name}
                          </span>

                          {/* Title */}
                          <span
                            className={`text-[11px] tracking-[0.04em] transition-colors duration-300 ${
                              isSelected
                                ? 'text-white/40'
                                : 'text-white/25 group-hover:text-white/40'
                            }`}
                            style={{
                              fontFamily: FONT_BODY,
                              fontWeight: 400,
                            }}
                          >
                            {person.title}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SplitLayout>
      </div>
    )
  },
)
