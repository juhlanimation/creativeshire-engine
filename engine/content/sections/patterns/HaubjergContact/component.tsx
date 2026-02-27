/**
 * HaubjergContact — Contact page (Kontakt).
 *
 * Contact info + form wrapped in SplitLayout with no categories.
 */

import { forwardRef, useState } from 'react'
import type { WidgetBaseProps } from '../../../../content/widgets/types'
import { SplitLayout } from '../../../../presets/haubjerg/components/SplitLayout'

const FONT_MONO = "'Space Mono', monospace"
const FONT_BODY = "'DM Sans', sans-serif"

/* Inline SVG icons replacing lucide-react */
const MailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/50"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
)
const PhoneIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/50"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
)
const MapPinIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/50"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
)
const InstagramIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/50"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
)

const contactItems = [
  { icon: MailIcon, text: 'hej@studiodokumentar.dk' },
  { icon: PhoneIcon, text: '+45 12 34 56 78' },
  { icon: MapPinIcon, text: 'Koebenhavn, Danmark' },
  { icon: InstagramIcon, text: '@studiodokumentar' },
]

export interface HaubjergContactComponentProps extends WidgetBaseProps {}

export const HaubjergContactComponent = forwardRef<
  HTMLDivElement,
  HaubjergContactComponentProps
>(function HaubjergContactComponent(_props, ref) {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
    setFormData({ name: '', email: '', message: '' })
  }

  return (
    <div ref={ref} className="section-haubjerg-contact">
      <SplitLayout
        missionTitle="LAD OS SKABE"
        missionBody="Vi er altid aabne for nye samarbejder og ideer."
      >
        <div className="px-8 lg:px-14 pb-28">
          <div className="mb-14 lg:mb-20 pt-4">
            <span
              className="text-[11px] tracking-[0.12em] text-white/20"
              style={{ fontFamily: FONT_MONO }}
            >
              Kontakt
            </span>
          </div>

          <div className="max-w-lg">
            {/* Contact Info */}
            <div className="space-y-7 mb-20">
              {contactItems.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-5">
                  <Icon />
                  <span
                    className="text-white/80"
                    style={{
                      fontFamily: FONT_BODY,
                      fontSize: '15px',
                      fontWeight: 300,
                    }}
                  >
                    {text}
                  </span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-white/20 mb-16" />

            {/* Contact Form */}
            <div>
              <span
                className="text-[11px] tracking-[0.15em] uppercase text-white block mb-10"
                style={{ fontFamily: FONT_MONO }}
              >
                Send en besked
              </span>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    className="text-[10px] tracking-[0.12em] text-white/60 block mb-3"
                    style={{ fontFamily: FONT_MONO }}
                  >
                    Navn
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full bg-white/[0.05] border border-white/30 rounded-none px-5 py-4 text-white outline-none focus:border-white transition-colors placeholder:text-white/35"
                    style={{ fontFamily: FONT_BODY, fontSize: '15px', fontWeight: 300 }}
                    placeholder="Dit navn"
                    required
                  />
                </div>

                <div>
                  <label
                    className="text-[10px] tracking-[0.12em] text-white/60 block mb-3"
                    style={{ fontFamily: FONT_MONO }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full bg-white/[0.05] border border-white/30 rounded-none px-5 py-4 text-white outline-none focus:border-white transition-colors placeholder:text-white/35"
                    style={{ fontFamily: FONT_BODY, fontSize: '15px', fontWeight: 300 }}
                    placeholder="din@email.dk"
                    required
                  />
                </div>

                <div>
                  <label
                    className="text-[10px] tracking-[0.12em] text-white/60 block mb-3"
                    style={{ fontFamily: FONT_MONO }}
                  >
                    Besked
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    rows={5}
                    className="w-full bg-white/[0.05] border border-white/30 rounded-none px-5 py-4 text-white outline-none focus:border-white transition-colors resize-none placeholder:text-white/35"
                    style={{ fontFamily: FONT_BODY, fontSize: '15px', fontWeight: 300 }}
                    placeholder="Fortael os om dit projekt..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full text-[11px] tracking-[0.15em] uppercase bg-white/20 hover:bg-white/30 text-white py-4 transition-colors group mt-2 flex items-center justify-center gap-3"
                  style={{ fontFamily: FONT_MONO }}
                >
                  {submitted ? 'Tak for din besked' : 'Send Besked'}
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  >
                    <path d="M7 7h10v10" />
                    <path d="M7 17 17 7" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      </SplitLayout>
    </div>
  )
})
