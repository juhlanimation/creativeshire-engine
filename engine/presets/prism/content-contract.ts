/**
 * Prism Preset Content Contract
 *
 * Thin aggregation: imports section content declarations and builds
 * the contract via buildContentContract(). Site-level fields (head,
 * contact, showreel, about) are declared inline since they don't
 * correspond to a reusable section pattern.
 */

import { buildContentContract } from '../content-utils'
import { content as galleryContent } from '../../content/sections/patterns/ProjectGallery/content'
import { content as showcaseContent } from '../../content/sections/patterns/ProjectShowcase/content'
import { content as compareContent } from '../../content/sections/patterns/ProjectCompare/content'
import { content as videoGridContent } from '../../content/sections/patterns/ProjectVideoGrid/content'
import { content as expandContent } from '../../content/sections/patterns/ProjectExpand/content'
import { content as tabsContent } from '../../content/sections/patterns/ProjectTabs/content'

export const prismContentContract = buildContentContract({
  // ── Site-level (not owned by a section pattern — inline) ──────────────
  head: {
    label: 'Head',
    description: 'Page metadata for SEO',
    contentFields: [
      { path: 'title', type: 'text', label: 'Page Title', required: true, default: 'Jordan Rivera | Character Animator' },
      { path: 'description', type: 'textarea', label: 'Meta Description', required: true, default: 'Senior character animator based in London, UK. 16 years of experience in animation.' },
    ],
    sampleContent: { title: 'Jordan Rivera | Character Animator', description: 'Senior character animator based in London, UK. 16 years of experience in animation.' },
  },
  contact: {
    label: 'Contact',
    description: 'Global contact info used across sections',
    contentFields: [
      { path: 'email', type: 'text', label: 'Email', required: true, placeholder: 'hello@example.com' },
      { path: 'instagram', type: 'text', label: 'Instagram URL', placeholder: 'https://instagram.com/username' },
      { path: 'linkedin', type: 'text', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/in/username' },
      { path: 'displayName', type: 'text', label: 'Display Name', default: 'Jordan Rivera' },
    ],
    sampleContent: { email: 'hello@example.com', instagram: 'https://instagram.com/example', linkedin: 'https://linkedin.com/in/example', displayName: 'Jordan Rivera' },
  },
  showreel: {
    label: 'Showreel',
    description: 'Fullscreen video showreel',
    contentFields: [
      { path: 'videoSrc', type: 'text', label: 'Showreel Video URL', required: true },
      { path: 'videoPoster', type: 'image', label: 'Showreel Poster' },
      { path: 'posterTime', type: 'number', label: 'Poster Frame Time (s)', default: 3 },
    ],
    sampleContent: { videoSrc: '/videos/sample/showreel.webm', videoPoster: '/images/sample/poster.jpg', posterTime: 3 },
  },
  about: {
    label: 'About',
    description: 'About card overlay on video',
    contentFields: [
      { path: 'label', type: 'text', label: 'About Label', default: 'HEY, I AM' },
      { path: 'videoSrc', type: 'text', label: 'Background Video URL' },
      { path: 'name', type: 'text', label: 'Full Name', required: true, default: 'Jordan Rivera' },
      { path: 'title', type: 'text', label: 'Professional Title', required: true, default: 'Senior Character Animator' },
      { path: 'location', type: 'text', label: 'Location', default: 'London, UK' },
      { path: 'bio', type: 'textarea', label: 'Biography (HTML)', required: true, default: 'With 16 years of experience in the animation industry, I have had the privilege of working on a diverse range of projects \u2014 from feature films and television series to commercials and video games.' },
    ],
    sampleContent: {
      label: 'HEY, I AM',
      videoSrc: '/videos/sample/showreel.webm',
      name: 'Jordan Rivera',
      title: 'Senior Character Animator',
      location: 'London, UK',
      bio: 'With 16 years of experience in the animation industry, I have had the privilege of working on a diverse range of projects.',
    },
  },

  // ── Section-level (imported from section content.ts, label overridden) ─
  azukiElementals: { ...galleryContent, label: 'Azuki Elementals' },
  boyMoleFoxHorse: { ...showcaseContent, label: 'Boy Mole Fox Horse' },
  the21: { ...compareContent, label: 'THE 21' },
  clashRoyale: { ...videoGridContent, label: 'Clash Royale' },
  riotGames: { ...expandContent, label: 'Riot Games' },
  projectsILike: { ...tabsContent, label: 'Projects I Like' },
})
