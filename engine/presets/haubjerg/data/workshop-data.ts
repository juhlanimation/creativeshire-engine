export interface Workshop {
  id: number
  number: string
  title: string
  subtitle: string
  description: string
  outcomes: string[]
  image: string
}

export interface WorkshopCategory {
  id: string
  label: string
  workshops: Workshop[]
}

export const workshopCategories: WorkshopCategory[] = [
  {
    id: 'grundlaeggende',
    label: 'Grundlaeggende',
    workshops: [
      {
        id: 1,
        number: '01',
        title: 'Visuel Dokumentationsmetode',
        subtitle: 'Grundlaeggende tilgang',
        description:
          'En struktureret metode til at planlaegge, udfore og reflektere over dokumentarisk arbejde. Deltagerne laerer at identificere kernefortaellinger og omsaette dem til visuelle narrativer.',
        outcomes: ['Fortaellingskort', 'Billedredigering', 'Etisk rammevaerk'],
        image:
          'https://images.unsplash.com/photo-1690192435015-319c1d5065b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZXRob2RvbG9neSUyMGRlc2lnbiUyMHRoaW5raW5nJTIwd2hpdGVib2FyZHxlbnwxfHx8fDE3NzE5MjYwNDV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      },
    ],
  },
  {
    id: 'deltagende',
    label: 'Deltagende Praksis',
    workshops: [
      {
        id: 2,
        number: '02',
        title: 'Community Storytelling',
        subtitle: 'Deltagende praksis',
        description:
          'Workshops der traener lokale faellesskaber i at dokumentere deres egen virkelighed. Metoden kombinerer fotografi, interview og kollektiv refleksion.',
        outcomes: ['Deltagende fotografi', 'Interviewteknik', 'Faellesskabsudstilling'],
        image:
          'https://images.unsplash.com/photo-1758522275018-2751894b49c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmVhdGl2ZSUyMHdvcmtzaG9wJTIwY29sbGFib3JhdGlvbiUyMGFydHxlbnwxfHx8fDE3NzE5MjYwNDN8MA&ixlib=rb-4.1.0&q=80&w=1080',
      },
    ],
  },
  {
    id: 'etik',
    label: 'Etik & Ansvar',
    workshops: [
      {
        id: 3,
        number: '03',
        title: 'Etisk Formidling',
        subtitle: 'Ansvarlig dokumentation',
        description:
          'Et metodisk vaerktoej til at navigere de etiske udfordringer i dokumentarisk arbejde. Fokus paa samtykke, repraesentation og magtforhold.',
        outcomes: ['Etisk tjekliste', 'Case-analyser', 'Samtykkeskabeloner'],
        image:
          'https://images.unsplash.com/photo-1712903911017-7c10a3c4b3e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3Jrc2hvcCUyMHJlc3VsdHMlMjBwcmVzZW50YXRpb24lMjBib2FyZHxlbnwxfHx8fDE3NzE5MjYwNDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      },
    ],
  },
  {
    id: 'tvaermedial',
    label: 'Tvaermedial',
    workshops: [
      {
        id: 4,
        number: '04',
        title: 'Tvaermedial Fortaelling',
        subtitle: 'Integration af medier',
        description:
          'Metoden integrerer fotografi, video, lyd og tekst i sammenhaengende fortaellinger der rammer bredt og dybt paa tvaers af platforme.',
        outcomes: ['Mediemix-strategi', 'Platformtilpasning', 'Publikumsanalyse'],
        image:
          'https://images.unsplash.com/photo-1770481334229-01d135a7f791?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG90b2pvdXJuYWxpc20lMjBzb2NpYWwlMjBkb2N1bWVudGFyeXxlbnwxfHx8fDE3NzE5MjYwNDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      },
    ],
  },
  {
    id: 'tilgang',
    label: 'Vores Tilgang',
    workshops: [],
  },
]

export const methodologySteps = [
  { label: 'Forberedelse', desc: 'Research, kontekstanalyse og etisk planlaegning' },
  { label: 'Udfoerelse', desc: 'Feltarbejde, dokumentation og deltagende processer' },
  { label: 'Refleksion', desc: 'Evaluering, formidling og videndeling' },
]
