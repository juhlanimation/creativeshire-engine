/**
 * Sample content for Prism preset preview.
 * Used in development mode when previewing the preset without platform data.
 *
 * Provides demo data to resolve binding expressions in the page template.
 * Values sourced from reference portfolio site.
 *
 * Media paths reference /videos/bishoy-gendi/ and /images/bishoy-gendi/
 * (copied from the source portfolio's public/ folder).
 */

const VIDEO_BASE = '/videos/bishoy-gendi'
const IMAGE_BASE = '/images/bishoy-gendi'
const POSTER_BASE = '/images/bishoy-gendi/posters'

export const prismSampleContent = {
  head: {
    title: 'Bishoy Gendi | Character Animator',
    description: 'Senior character animator based in London, UK. 16 years of experience in animation.',
  },

  contact: {
    email: 'bishoygendi@yahoo.co.uk',
    instagram: 'https://instagram.com/bishoygendi',
    linkedin: 'https://linkedin.com/in/bishoygendi',
    displayName: 'Bishoy Gendi',
  },

  showreel: {
    videoSrc: `${VIDEO_BASE}/sample-showreel.webm`,
    videoPoster: `${POSTER_BASE}/showreel.jpg`,
    posterTime: 3,
  },

  about: {
    label: 'HEY, I AM',
    videoSrc: `${VIDEO_BASE}/sample-showreel.webm`,
    name: 'Bishoy Gendi',
    title: 'Senior Character Animator',
    location: 'London, UK',
    bio: "With 16 years as a character animator, animation lead, and supervisor, I've had the privilege of bringing stories to life for some amazing projects with talented people. Feel free to explore my contributions.",
  },

  azukiElementals: {
    backgroundColor: '#C03540',
    accentColor: 'accent',
    logo: {
      src: `${IMAGE_BASE}/Azuki_logo.png`,
      alt: 'Azuki',
      width: 300,
      filter: 'brightness(0) invert(1)',
    },
    mainVideo: {
      src: `${VIDEO_BASE}/azuki-elementals/azuki-reel-vimeo.webm`,
      poster: `${POSTER_BASE}/azuki-reel-vimeo.jpg`,
      posterTime: 4,
    },
    projects: [
      {
        thumbnail: `${VIDEO_BASE}/azuki-elementals/azuki-reel-vimeo.webm`,
        title: 'Azuki Reel',
        video: `${VIDEO_BASE}/azuki-elementals/azuki-reel-vimeo.webm`,
        year: '2024',
        studio: 'Crossroad',
        role: 'Character Animator',
        posterTime: 4,
      },
      {
        thumbnail: `${VIDEO_BASE}/azuki-elementals/proof-of-skate.webm`,
        title: 'Proof of Skate',
        video: `${VIDEO_BASE}/azuki-elementals/proof-of-skate.webm`,
        year: '2022',
        studio: 'Juhl Animation',
        role: 'Character Animator',
        posterTime: 3,
      },
      {
        thumbnail: `${VIDEO_BASE}/azuki-elementals/azukimoser.webm`,
        title: 'H. Moser & Cie',
        video: `${VIDEO_BASE}/azuki-elementals/azukimoser.webm`,
        year: '2025',
        studio: 'Crossroad',
        role: 'Character Animator',
        posterTime: 5,
      },
      {
        thumbnail: `${VIDEO_BASE}/azuki-elementals/animecoin.webm`,
        title: 'AnimeCoin',
        video: `${VIDEO_BASE}/azuki-elementals/animecoin.webm`,
        year: '2025',
        studio: 'Crossroad',
        role: 'Character Animator',
        posterTime: 2,
      },
    ],
  },

  boyMoleFoxHorse: {
    backgroundColor: '#FAF6ED',
    logo: {
      src: `${IMAGE_BASE}/the-boy-mole-fox-horse-logo.webp`,
      alt: 'The Boy, the Mole, the Fox and the Horse',
      width: 300,
    },
    studio: 'WellHello Productions',
    role: 'Character Animator',
    videoSrc: `${VIDEO_BASE}/the-boy-mole-fox-horse/reel.webm`,
    videoPoster: `${POSTER_BASE}/bmfh-reel.jpg`,
    posterTime: 5,
    shots: [
      { frame: 275, videoSrc: `${VIDEO_BASE}/the-boy-mole-fox-horse/275.webm` },
      { frame: 300, videoSrc: `${VIDEO_BASE}/the-boy-mole-fox-horse/300.webm` },
      { frame: 310, videoSrc: `${VIDEO_BASE}/the-boy-mole-fox-horse/310.webm` },
      { frame: 330, videoSrc: `${VIDEO_BASE}/the-boy-mole-fox-horse/330.webm` },
      { frame: 490, videoSrc: `${VIDEO_BASE}/the-boy-mole-fox-horse/490.webm` },
      { frame: 500, videoSrc: `${VIDEO_BASE}/the-boy-mole-fox-horse/500.webm` },
      { frame: 510, videoSrc: `${VIDEO_BASE}/the-boy-mole-fox-horse/510.webm` },
      { frame: 520, videoSrc: `${VIDEO_BASE}/the-boy-mole-fox-horse/520.webm` },
    ],
  },

  the21: {
    backgroundColor: '#FDF9F0',
    logo: {
      src: `${IMAGE_BASE}/The21_Logo_Green.webp`,
      alt: 'The 21',
      width: 120,
    },
    beforeVideo: `${VIDEO_BASE}/the21/seq1-tiedown.webm`,
    afterVideo: `${VIDEO_BASE}/the21/seq1-reel.webm`,
    beforeLabel: 'Tie-down',
    afterLabel: 'Final',
    description: 'The 21 is a short animated film shaped by neo-Coptic iconography, produced in collaboration with the global Coptic Community by a team of 70+ artists from more than 24 countries.',
  },

  clashRoyale: {
    backgroundColor: '#000000',
    logo: {
      src: `${IMAGE_BASE}/Supercell-logo-alpha.webp`,
      alt: 'Supercell',
      width: 200,
    },
    videos: [
      {
        src: `${VIDEO_BASE}/clash-royale/bigboi-green.webm`,
        title: 'BigBoi Green',
        aspectRatio: '9/16',
        column: 'left',
      },
      {
        src: `${VIDEO_BASE}/clash-royale/goblin-machine.webm`,
        title: 'Goblin Machine',
        aspectRatio: '9/16',
        column: 'left',
      },
      {
        src: `${VIDEO_BASE}/clash-royale/dagger-duchess.webm`,
        title: 'Dagger Duchess',
        aspectRatio: '16/9',
        column: 'right',
      },
      {
        src: `${VIDEO_BASE}/clash-royale/rune-giant.webm`,
        title: 'Rune Giant',
        aspectRatio: '16/9',
        column: 'right',
      },
    ],
  },

  riotGames: {
    backgroundColor: '#0B0A0A',
    logo: {
      src: `${IMAGE_BASE}/Riot_Games_2022.svg.png`,
      alt: 'Riot Games',
      width: 120,
    },
    videos: [
      {
        thumbnailSrc: `${VIDEO_BASE}/riot-games/legends-of-runeterra.webm`,
        thumbnailAlt: 'Legends of Runeterra',
        videoSrc: `${VIDEO_BASE}/riot-games/legends-of-runeterra.webm`,
        title: 'Legends of Runeterra',
      },
      {
        thumbnailSrc: `${VIDEO_BASE}/riot-games/lol-crcr.webm`,
        thumbnailAlt: 'LOL x Clash Royale',
        videoSrc: `${VIDEO_BASE}/riot-games/lol-crcr.webm`,
        title: 'LOL x Clash Royale',
      },
      {
        thumbnailSrc: `${VIDEO_BASE}/riot-games/star-guardian.webm`,
        thumbnailAlt: 'Star Guardian',
        videoSrc: `${VIDEO_BASE}/riot-games/star-guardian.webm`,
        title: 'Star Guardian',
      },
    ],
  },

  projectsILike: {
    backgroundColor: '#000000',
    defaultTab: 'ldr',
    tabs: [
      {
        id: 'ldr',
        label: 'Love, Death & Robots',
        videos: [
          { src: `${VIDEO_BASE}/projects-i-like/ldr-ice-colony.webm`, title: 'Colony Sequence' },
          { src: `${VIDEO_BASE}/projects-i-like/ldr-ice-dolphin.webm`, title: 'Dolphin Run' },
          { src: `${VIDEO_BASE}/projects-i-like/ldr-ice-rule.webm`, title: 'Rule Sequence' },
        ],
      },
      {
        id: 'diablo',
        label: 'Diablo IV x Berserk',
        videos: [
          { src: `${VIDEO_BASE}/projects-i-like/diablo-reel-1.webm`, title: 'Fight Sequence' },
          { src: `${VIDEO_BASE}/projects-i-like/diablo-reel-2.webm`, title: 'Breakdown' },
          { src: `${VIDEO_BASE}/projects-i-like/diablo-reel-3.webm`, title: 'Final Edit' },
        ],
      },
      {
        id: 'patw',
        label: 'Peter and the Wolf',
        videos: [
          { src: `${VIDEO_BASE}/projects-i-like/patw-panning.webm`, title: 'Panning Shot' },
          { src: `${VIDEO_BASE}/projects-i-like/patw-reel.webm`, title: 'Main Reel' },
          { src: `${VIDEO_BASE}/projects-i-like/patw-scene200.webm`, title: 'Scene 200' },
        ],
      },
      {
        id: 'mms',
        label: "Marvel's Midnight Suns",
        videos: [
          { src: `${VIDEO_BASE}/projects-i-like/mms-hunter.webm`, title: 'Hunter' },
          { src: `${VIDEO_BASE}/projects-i-like/mms-majik.webm`, title: 'Majik' },
          { src: `${VIDEO_BASE}/projects-i-like/mms-nico.webm`, title: 'Nico Sequence' },
        ],
      },
      {
        id: 'bapbap',
        label: 'Bapbap',
        videos: [
          { src: `${VIDEO_BASE}/projects-i-like/bapbap-seq1.webm`, title: 'Sequence 1' },
          { src: `${VIDEO_BASE}/projects-i-like/bapbap-seq2.webm`, title: 'Sequence 2' },
          { src: `${VIDEO_BASE}/projects-i-like/bapbap-seq3.webm`, title: 'Sequence 3' },
        ],
      },
      {
        id: 'chobani',
        label: 'Chobani',
        videos: [
          { src: `${VIDEO_BASE}/projects-i-like/chobani-kitchen.webm`, title: 'Kitchen Scene' },
          { src: `${VIDEO_BASE}/projects-i-like/chobani-hug.webm`, title: 'Hug Scene' },
          { src: `${VIDEO_BASE}/projects-i-like/chobani-proud.webm`, title: 'Proud Moment' },
        ],
      },
      {
        id: 'other',
        label: 'Other Projects',
        videos: [
          { src: `${VIDEO_BASE}/projects-i-like/hm-bbcwinter.webm`, title: 'BBC Winter Olympics' },
          { src: `${VIDEO_BASE}/projects-i-like/hm-envar.webm`, title: 'Envar' },
          { src: `${VIDEO_BASE}/projects-i-like/hm-feralchild.webm`, title: 'Life360 (Feral Child)' },
          { src: `${VIDEO_BASE}/projects-i-like/hm-hayday.webm`, title: 'Hay Day' },
          { src: `${VIDEO_BASE}/projects-i-like/hm-ninjagaiden.webm`, title: 'Ninja Gaiden' },
          { src: `${VIDEO_BASE}/projects-i-like/hm-overwatch.webm`, title: 'Overwatch' },
          { src: `${VIDEO_BASE}/projects-i-like/hm-redbullkumite.webm`, title: 'Red Bull Kumite' },
          { src: `${VIDEO_BASE}/projects-i-like/hm-samsung.webm`, title: 'Samsung' },
          { src: `${VIDEO_BASE}/projects-i-like/hm-savagexfenty.webm`, title: 'Savage x Fenty' },
          { src: `${VIDEO_BASE}/projects-i-like/hm-uaepavilion.webm`, title: 'UAE Pavilion Expo 2020' },
        ],
      },
    ],
    externalLink: {
      url: 'https://instagram.com/bishoygendi',
      label: 'See more on Instagram',
    },
  },
}
