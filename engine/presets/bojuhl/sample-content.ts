/**
 * Sample content for Bojuhl preset preview.
 * Used in development mode when previewing the preset without platform data.
 *
 * This provides demo data to resolve binding expressions.
 * Values sourced from actual site data (site/data/, site/config.ts, site/pages/home.ts).
 */

// Public test video for development (~1.5MB, loads fast for canPlay)
const TEST_VIDEO_URL = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'

export const bojuhlSampleContent = {
  intro: {
    maskText: 'BO JUHL',
  },

  head: {
    title: 'Bo Juhl | Executive Producer & Editor',
    description: 'Executive Producer leading animated films and campaigns for Riot Games, Netflix, Supercell, Amazon, and LEGO.',
  },

  hero: {
    introText: "I'm Bo Juhl",
    roles: ['EXECUTIVE PRODUCER', 'PRODUCER', 'EDITOR'],
    videoSrc: '/videos/frontpage/frontpage.webm',
    scrollIndicatorText: '(SCROLL)',
  },

  about: {
    bioParagraphs: [
      'Over the past decade, I\'ve led animated films and campaigns for Riot Games, Netflix, Supercell, Amazon, and LEGO - first at Sun Creature, now through my own studio, <a href="https://crossroad.studio" target="_blank" rel="noopener">Crossroad</a>.',
      'I was one of the original founders of Sun Creature and spent more than a decade helping shape its growth - guiding dozens of productions and working with hundreds of artists as the studio evolved from a small team to a large international company. I stepped away from the studio in early 2024 to pursue new paths.',
      'Today, <a href="https://crossroad.studio" target="_blank" rel="noopener">Crossroad</a> is a remote-first setup rooted in collaboration and craft. I also take on freelance and consultancy work - always excited to dive in and make strong work with good people.',
    ].join('\n\n'),
    signature: 'Bo Juhl',
    photoSrc: '/images/profile-highres.webp',
    photoAlt: 'Bo Juhl - Executive Producer & Editor',
    clientLogos: [
      { name: 'Netflix', src: '/clients/netflix-alpha.webp', alt: 'Netflix logo', height: 72 },
      { name: 'Amazon Studios', src: '/clients/AMZN_STUDIOS - alpha.webp', alt: 'Amazon Studios logo', height: 48 },
      { name: 'Cartoon Network', src: '/clients/cartoon-network-logo-alpha.webp', alt: 'Cartoon Network logo', height: 48 },
      { name: 'Riot Games', src: '/clients/riot-games-logo.webp', alt: 'Riot Games logo', height: 48 },
      { name: 'EA Games', src: '/clients/EA Games - alpha.webp', alt: 'EA Games logo', height: 58 },
      { name: 'Ubisoft', src: '/clients/ubisoft-black-and-white-alpha.webp', alt: 'Ubisoft logo', height: 58 },
      { name: '2K Games', src: '/clients/2K - Games.webp', alt: '2K Games logo', height: 48 },
      { name: 'Supercell', src: '/clients/Supercell-logo-alpha.webp', alt: 'Supercell logo', height: 48 },
      { name: 'Respawn Entertainment', src: '/clients/respawn-entertainment.webp', alt: 'Respawn Entertainment logo', height: 58 },
      { name: 'Azuki', src: '/clients/azuki-alpha.webp', alt: 'Azuki logo', height: 48 },
    ],
  },

  projects: {
    featured: [
      {
        id: 'elements-of-time',
        title: 'ELEMENTS OF TIME',
        description: "The film brings to life the Elementals' four domains, blending anime-inspired storytelling with the timeless craft of Swiss watchmaking.",
        role: 'Executive Producer, Producer',
        year: '2025',
        client: 'AZUKI',
        studio: 'CROSSROAD STUDIO',
        thumbnailSrc: '/images/01-elements-of-time/thumbnail.webp',
        thumbnailAlt: 'Elements of Time thumbnail',
        videoSrc: '/videos/01-elements-of-time/hover.webm',
        videoUrl: TEST_VIDEO_URL,
      },
      {
        id: 'tower-reveal',
        title: 'TOWER REVEAL',
        description: 'A two-film campaign announcing Tower Troops, a new card type that introduces a fresh defensive strategy to Clash Royale. The spots positioned Tower Troops as a significant evolution of the Clash Royale meta.',
        role: 'Executive Producer',
        year: '2024',
        client: 'SUPERCELL',
        studio: 'SUN CREATURE',
        thumbnailSrc: '/images/02-tower-reveal/thumbnail.webp',
        thumbnailAlt: 'Tower Reveal thumbnail',
        videoSrc: '/videos/02-tower-reveal/hover.webm',
        videoUrl: TEST_VIDEO_URL,
      },
      {
        id: 'arcane-season-2',
        title: 'ARCANE SEASON 2',
        description: 'The highly anticipated continuation of the groundbreaking animated series. A visually stunning exploration of the conflict between Piltover and Zaun, pushing the boundaries of animation storytelling.',
        role: 'Executive Producer',
        year: '2024',
        client: 'RIOT GAMES',
        studio: 'FORTICHE',
        thumbnailSrc: '/images/01-elements-of-time/thumbnail.webp',
        thumbnailAlt: 'Arcane Season 2 thumbnail',
        videoSrc: '/videos/01-elements-of-time/hover.webm',
        videoUrl: TEST_VIDEO_URL,
      },
    ],
    other: [
      {
        id: 'genshin-impact',
        title: 'SCENERY AND SENTIMENT',
        year: '2023',
        role: 'Executive Producer',
        client: 'HOYOVERSE',
        studio: 'SUN CREATURE',
        thumbnailSrc: '/images/other-projects/genshin-impact-thumbnail.webp',
        thumbnailAlt: 'Genshin Impact thumbnail',
        videoSrc: '/videos/other-projects/genshin-impact-hover.webm',
        videoUrl: TEST_VIDEO_URL,
      },
      {
        id: 'its-on',
        title: "IT'S ON!",
        year: '2018',
        role: 'Executive Producer, Editor',
        client: 'RIOT GAMES',
        studio: 'SUN CREATURE',
        thumbnailSrc: '/images/other-projects/its-on-thumbnail.webp',
        thumbnailAlt: "It's On thumbnail",
        videoSrc: '/videos/other-projects/its-on-hover.webm',
        videoUrl: TEST_VIDEO_URL,
      },
      {
        id: 'marvel-midnight-sun',
        title: 'MARVEL MIDNIGHT SUN',
        year: '2022',
        role: 'Executive Producer',
        client: '2K GAMES',
        studio: 'SUN CREATURE',
        thumbnailSrc: '/images/other-projects/marvel-thumbnail.webp',
        thumbnailAlt: 'Marvel Midnight Sun thumbnail',
        videoSrc: '/videos/other-projects/marvel-hover.webm',
        videoUrl: TEST_VIDEO_URL,
      },
      {
        id: 'ninjago-legacy',
        title: 'NINJAGO LEGACY',
        year: '2021',
        role: 'Executive Producer',
        client: 'LEGO',
        studio: 'SUN CREATURE',
        thumbnailSrc: '/images/other-projects/ninjago-thumbnail.webp',
        thumbnailAlt: 'Ninjago Legacy thumbnail',
        videoSrc: '/videos/other-projects/ninjago-hover.webm',
        videoUrl: TEST_VIDEO_URL,
      },
      {
        id: 'the-goblin-queen',
        title: 'THE GOBLIN QUEEN',
        year: '2024',
        role: 'Executive Producer',
        client: 'SUPERCELL',
        studio: 'SUN CREATURE',
        thumbnailSrc: '/images/other-projects/the-goblin-queen-thumbnail.webp',
        thumbnailAlt: 'The Goblin Queen thumbnail',
        videoSrc: '/videos/other-projects/the-goblin-queen-hover.webm',
        videoUrl: TEST_VIDEO_URL,
      },
    ],
    otherHeading: 'OTHER SELECTED PROJECTS',
    yearRange: '2018-2024',
  },

  footer: {
    navLinks: [
      { label: 'HOME', href: '#hero' },
      { label: 'ABOUT', href: '#about' },
      { label: 'PROJECTS', href: '#projects' },
    ],
    contactHeading: 'GET IN TOUCH',
    email: 'hello@bojuhl.com',
    linkedinUrl: 'https://linkedin.com/in/bojuhl',
    studioHeading: 'FIND MY STUDIO',
    studioUrl: 'https://crossroadstudio.com',
    studioUrlLabel: 'crossroadstudio.com',
    studioEmail: 'hello@crossroadstudio.com',
    studioSocials: [
      { platform: 'linkedin', url: 'https://linkedin.com/company/crossroadstudio' },
      { platform: 'instagram', url: 'https://instagram.com/crossroadstudio' },
    ],
    copyright: 'Copyright \u00a9 Bo Juhl / All rights reserved',
  },

  contact: {
    promptText: 'How can I help you?',
    email: 'hello@bojuhl.com',
  },
}
