/**
 * Sample content for Loft preset preview.
 * Used in development mode when previewing the preset without platform data.
 *
 * Provides demo data to resolve binding expressions in the page template.
 * Values sourced from the Port12 coworking space reference site.
 *
 * Media paths reference /images/port-12/ and /videos/port-12/
 */

const IMAGE_BASE = '/images/port-12'
const VIDEO_BASE = '/videos/port-12'

// SVG icon strings for pricing feature indicators
const CHECK_SVG = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5L6.5 12L13 4"/></svg>'
const CROSS_SVG = '<svg viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="4" r="1.5"/><rect x="3" y="7" width="10" height="2" rx="1"/><circle cx="8" cy="12" r="1.5"/></svg>'
const PLUS_SVG = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8 3V13M3 8H13"/></svg>'

export const loftSampleContent = {
  header: {
    brandName: 'PORT12',
  },

  hero: {
    title: 'PORT12',
    tagline: 'DRØM • DEL • SKAB',
    videoSrc: `${VIDEO_BASE}/showreel.webm`,
    loopStartTime: 3.4,
    textRevealTime: 3.2,
    scrollIndicatorText: '(SCROLL)',
  },

  about: {
    text: 'Port12 er et kontorfællesskab, men vi er sgu mere fællesskab end vi er kontor.\n\nGodt nok sidder vi meget på vores flade og hakker i tastaturerne, men vi går mere op i at spille hinanden gode ved at dele: viden, erfaring, opgaver og inspiration.\n\nDet er dén energi, du tapper ind i hos Port12 i Ry. Kom forbi og smag kaffen!',
    images: [
      { src: `${IMAGE_BASE}/1.webp`, alt: 'Port12 workspace' },
      { src: `${IMAGE_BASE}/2.webp`, alt: 'Port12 entrance' },
      { src: `${IMAGE_BASE}/3.webp`, alt: 'Port12 members' },
      { src: `${IMAGE_BASE}/4.webp`, alt: 'Port12 collaboration' },
    ],
  },

  team: {
    labelText: 'Vi er',
    members: [
      { name: 'Rune Svenningsen', videoSrc: `${VIDEO_BASE}/RS_Port12_Showreel_2.webm`, portfolioUrl: 'https://runesvenningsen.dk' },
      { name: 'Maria Tranberg', videoSrc: `${VIDEO_BASE}/MARIAT.webm`, portfolioUrl: 'https://mariatranberg.com' },
      { name: 'Nicolaj Larsson', videoSrc: `${VIDEO_BASE}/NL_Port12_Showreel_v2.webm`, portfolioUrl: 'https://ccccccc.tv' },
      { name: 'Tor Birk Trads', videoSrc: `${VIDEO_BASE}/TorBirkTrads2.webm`, portfolioUrl: 'https://www.torbirktrads.dk' },
      { name: 'Alex Morgan', videoSrc: `${VIDEO_BASE}/BJ_Port12_Showreel_v1.webm`, portfolioUrl: 'https://example.com' },
      { name: 'Maria Kjær', videoSrc: `${VIDEO_BASE}/StrejfStudio_Showreel_2025_v3.webm`, portfolioUrl: 'https://www.linkedin.com/in/maria-kjær-nørgaard/' },
    ],
  },

  pricing: {
    priceSubtitle: 'ex moms / måned',
    flex: {
      name: 'FLEX',
      price: '1.300 DKK',
      description: 'Frihed og fleksibilitet.\nBetal kun for adgang, ikke for plads.',
      illustration: `${IMAGE_BASE}/FLEX_Illustration_2.webp`,
      features: [
        { name: 'Fri adgang 24/7', icon: CHECK_SVG },
        { name: 'Egen nøgle', icon: CHECK_SVG },
        { name: 'Wi-Fi (1000 Mbit)', icon: CHECK_SVG },
        { name: 'Printer & scanner', icon: CHECK_SVG },
        { name: 'Bord & stol', icon: CHECK_SVG },
        { name: 'Mødelokale', icon: CHECK_SVG },
        { name: 'Egen fast plads', icon: CROSS_SVG },
        { name: 'Reol plads', icon: CROSS_SVG },
        { name: 'Tilkøb kaffe', icon: PLUS_SVG },
      ],
    },
    allIn: {
      name: 'ALL-IN',
      price: '2.000 DKK',
      description: 'Dit second home.\nFast plads uden krav om at rydde op.',
      illustration: `${IMAGE_BASE}/ALL-IN_Illustration_3.webp`,
      features: [
        { name: 'Fri adgang 24/7', icon: CHECK_SVG },
        { name: 'Egen nøgle', icon: CHECK_SVG },
        { name: 'Wi-Fi (1000 Mbit)', icon: CHECK_SVG },
        { name: 'Printer & scanner', icon: CHECK_SVG },
        { name: 'Bord & stol', icon: CHECK_SVG },
        { name: 'Mødelokale', icon: CHECK_SVG },
        { name: 'Egen fast plads', icon: CHECK_SVG },
        { name: 'Reol plads', icon: CHECK_SVG },
        { name: 'Tilkøb kaffe', icon: PLUS_SVG },
      ],
    },
  },

  contact: {
    title: 'KONTAKT OS',
    lines: ['Hiv fat hvis du har spørgsmål.', 'Eller kom og mød os.', 'Vi bider ikke. Tværtimod.'],
    email: 'info@port12.dk',
    illustration: `${IMAGE_BASE}/kontakt-illustration.webp`,
  },

  nav: {
    links: [
      { href: '#om', label: 'Om' },
      { href: '#medlemmer', label: 'Medlemmer' },
      { href: '#medlemskab', label: 'Medlemskab' },
    ],
  },

  footer: {
    brandName: 'PORT12',
    copyright: 'Copyright © All rights reserved.',
    navLinks: [
      { href: '#om', label: 'OM PORT12' },
      { href: '#medlemmer', label: 'MEDLEMMER' },
      { href: '#medlemskab', label: 'MEDLEMSKAB' },
    ],
    email: 'info@port12.dk',
    phone: '+4531378089',
    phoneDisplay: '31378089',
    address: 'Kløftehøj 3 / 8680 Ry',
  },
}
