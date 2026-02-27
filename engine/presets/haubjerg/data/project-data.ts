export interface Project {
  id: number
  title: string
  description: string
  image: string
  hoverImage: string
  responsible: string
  layoutType: 1 | 2 | 3
  longDescription: string
  year: string
  duration: string
  medium: string
  status: string
  galleryImages: string[]
  keyFacts: { label: string; value: string }[]
}

export const projects: Project[] = [
  {
    id: 1,
    title: 'Skjulte Landskaber',
    description:
      'En visuel udforskning af de oversete steder i det danske landskab, hvor natur og industri moedes i uventede formationer.',
    responsible: 'Maria Jensen',
    image:
      'https://images.unsplash.com/photo-1763848843590-acd070c8b9ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N1bWVudGFyeSUyMHBob3RvZ3JhcGhlciUyMHdvcmtpbmclMjBmaWVsZHxlbnwxfHx8fDE3NzE5MjYwNDB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    hoverImage:
      'https://images.unsplash.com/photo-1765456409969-46e281681ada?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNvbGF0ZSUyMG5vcmRpYyUyMGxhbmRzY2FwZSUyMG1vb2R5fGVufDF8fHx8MTc3MTkyODYwOXww&ixlib=rb-4.1.0&q=80&w=1080',
    layoutType: 1,
    longDescription:
      'Skjulte Landskaber er et langsigtet fotografisk projekt der udforsker de oversete og glemte steder i det danske landskab. Gennem tre aars feltarbejde har Maria Jensen dokumenteret de steder hvor natur og industri moedes — forladte fabrikker overgroet af vegetation, kystlinjer formet af aartiers erosion, og infrastruktur der langsomt vender tilbage til naturen.\n\nProjektet stiller spoergsmaalstegn ved vores opfattelse af det \'naturlige\' landskab og inviterer beskueren til at se skoenheden i det uperfekte og det oversete. Hver lokation er besoeget gentagne gange over alle aarstider for at indfange den subtile transformation der finder sted.',
    year: '2024',
    duration: '36 maaneder',
    medium: 'Storformat fotografi',
    status: 'Igangvaerende',
    galleryImages: [
      'https://images.unsplash.com/photo-1560271249-7e63ea823896?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxub3JkaWMlMjBsYW5kc2NhcGUlMjBtb29keSUyMHdpbnRlcnxlbnwxfHx8fDE3NzE5MzI1ODR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1761432338207-ff3adabec211?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYmFuZG9uZWQlMjBpbmR1c3RyaWFsJTIwYnVpbGRpbmclMjBmb2d8ZW58MXx8fHwxNzcxOTMyNTg3fDA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    keyFacts: [
      { label: 'Lokationer', value: '47' },
      { label: 'Billeder', value: '2.400+' },
      { label: 'Udstillinger', value: '3' },
    ],
  },
  {
    id: 2,
    title: 'Stemmerne Fra Graensen',
    description:
      'Dokumentarisk journalistik der giver stemme til de mennesker der lever i krydsfeltet mellem kulturer og identiteter.',
    responsible: 'Anders Moeller',
    image:
      'https://images.unsplash.com/photo-1759659334772-c3a05b8178e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqb3VybmFsaXN0JTIwaW50ZXJ2aWV3JTIwZG9jdW1lbnRhcnl8ZW58MXx8fHwxNzcxOTI2MDQxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    hoverImage:
      'https://images.unsplash.com/photo-1763895971784-f7e00791cae3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3JkZXIlMjBjcm9zc2luZyUyMGRvY3VtZW50YXJ5JTIwZm9nZ3l8ZW58MXx8fHwxNzcxOTI4NjEwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    layoutType: 2,
    longDescription:
      'Stemmerne Fra Graensen er et dokumentarisk journalistikprojekt der udforsker livet i graenseomraader — baade fysiske og kulturelle. Anders Moeller har rejst langs Europas graenser for at moede de mennesker der lever mellem to verdener.\n\nGennem dybdegaaende interviews og portraetfotografi giver projektet stemme til dem der sjeldent hoeres i mainstream medier. Det handler om identitet, tilhoersforhold og de usynlige linjer der baade adskiller og forbinder os. Projektet er blevet praesenteret paa flere internationale dokumentarfestivaler.',
    year: '2023',
    duration: '18 maaneder',
    medium: 'Fotojournalistik & tekst',
    status: 'Afsluttet',
    galleryImages: [
      'https://images.unsplash.com/photo-1727627441735-144601730fb9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG90b2pvdXJuYWxpc20lMjByZWZ1Z2VlJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcxOTMyNTg1fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1653582910904-f197c5db5ac5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib3JkZXIlMjBjcm9zc2luZyUyMG1pZ3JhbnRzJTIwZG9jdW1lbnRhcnl8ZW58MXx8fHwxNzcxOTMyNTg4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    keyFacts: [
      { label: 'Interviews', value: '89' },
      { label: 'Lande', value: '7' },
      { label: 'Publikationer', value: '12' },
    ],
  },
  {
    id: 3,
    title: 'Fortaellinger I Bevaegelse',
    description:
      'Et multimedieproject der oversaetter komplekse samfundstemaer til tilgaengelige og engagerende visuelle fortaellinger.',
    responsible: 'Sofia Andersen',
    image:
      'https://images.unsplash.com/photo-1764428950627-50ee374e7a2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdG9yeXRlbGxpbmclMjB2aXN1YWwlMjBjb21tdW5pY2F0aW9ufGVufDF8fHx8MTc3MTkyNjA0Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    hoverImage:
      'https://images.unsplash.com/photo-1702532650709-6c9b4acec2f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9qZWN0aW9uJTIwc2NyZWVuJTIwZGFyayUyMGV4aGliaXRpb258ZW58MXx8fHwxNzcxOTI4NjExfDA&ixlib=rb-4.1.0&q=80&w=1080',
    layoutType: 3,
    longDescription:
      'Fortaellinger I Bevaegelse kombinerer video, fotografi og interaktive elementer for at goere komplekse samfundsudfordringer tilgaengelige for et bredt publikum. Sofia Andersen arbejder i krydsfeltet mellem kunst og journalistik.\n\nProjektet har produceret en raekke multimediale fortaellinger om emner som klimaforandringer, ulighed og mental sundhed — altid med fokus paa de personlige historier bag statistikkerne. Formatet er designet til at vaere fleksibelt og kan tilpasses alt fra galleriudstillinger til digitale platforme.',
    year: '2024',
    duration: '24 maaneder',
    medium: 'Multimedia & installation',
    status: 'Igangvaerende',
    galleryImages: [
      'https://images.unsplash.com/photo-1761641062457-bc8603350eb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aXN1YWwlMjBzdG9yeXRlbGxpbmclMjBleGhpYml0aW9uJTIwZGFya3xlbnwxfHx8fDE3NzE5MzI1ODV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1768655317930-23e7cd2d336e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnQlMjBnYWxsZXJ5JTIwcHJvamVjdGlvbiUyMGluc3RhbGxhdGlvbnxlbnwxfHx8fDE3NzE4OTQ1ODl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    keyFacts: [
      { label: 'Produktioner', value: '8' },
      { label: 'Visninger', value: '45.000+' },
      { label: 'Priser', value: '2' },
    ],
  },
  {
    id: 4,
    title: 'Faellesskabets Billeder',
    description:
      'Deltagende dokumentation hvor lokale faellesskaber selv bliver fotografer og fortaellere af deres egne historier.',
    responsible: 'Henrik Larsen',
    image:
      'https://images.unsplash.com/photo-1768796370577-c6e8b708b980?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b3Jrc2hvcCUyMGZhY2lsaXRhdGlvbiUyMGdyb3VwfGVufDF8fHx8MTc3MTkyNjA0MXww&ixlib=rb-4.1.0&q=80&w=1080',
    hoverImage:
      'https://images.unsplash.com/photo-1555069855-e580a9adbf43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjB3b3Jrc2hvcCUyMGNpcmNsZSUyMGRpc2N1c3Npb258ZW58MXx8fHwxNzcxOTI4NjEyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    layoutType: 1,
    longDescription:
      "Faellesskabets Billeder er et deltagende dokumentationsprojekt hvor Henrik Larsen faciliterer processer hvor lokale faellesskaber selv tager kontrol over deres visuelle fortaelling. Deltagerne faar kameraer, traening og stoette til at fotografere og fortaelle deres egne historier.\n\nProjektet udfordrer det traditionelle magtforhold mellem fotograf og subjekt ved at goere 'subjekterne' til aktive fortaellere. Resultatet er en raa og autentisk samling af billeder og historier der viser hverdagslivet fra indsiden — set med de oejne der kender det bedst.",
    year: '2023',
    duration: '12 maaneder',
    medium: 'Deltagende fotografi',
    status: 'Afsluttet',
    galleryImages: [
      'https://images.unsplash.com/photo-1758522275018-2751894b49c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjB3b3Jrc2hvcCUyMGNyZWF0aXZlJTIwY29sbGFib3JhdGlvbnxlbnwxfHx8fDE3NzE5MzI1ODZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1722316846910-3e20d7458112?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJ0aWNpcGF0b3J5JTIwYXJ0JTIwY29tbXVuaXR5JTIwbXVyYWx8ZW58MXx8fHwxNzcxOTMyNTg5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    keyFacts: [
      { label: 'Deltagere', value: '120+' },
      { label: 'Faellesskaber', value: '6' },
      { label: 'Udstillinger', value: '4' },
    ],
  },
  {
    id: 5,
    title: 'Byens Puls',
    description:
      'Et langtidsprojekt der dokumenterer hverdagslivet i danske byer gennem gadefotografi og portraetter.',
    responsible: 'Camilla Rask',
    image:
      'https://images.unsplash.com/photo-1762436933065-fe6d7f51d4f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N1bWVudGFyeSUyMHBob3RvZ3JhcGh5JTIwdXJiYW4lMjBzdHJlZXR8ZW58MXx8fHwxNzcxOTI2MDQzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    hoverImage:
      'https://images.unsplash.com/photo-1644545079315-ddb9d8534497?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXJrJTIwdXJiYW4lMjBuaWdodCUyMGNpdHklMjByYWlufGVufDF8fHx8MTc3MTkyODYxMHww&ixlib=rb-4.1.0&q=80&w=1080',
    layoutType: 2,
    longDescription:
      'Byens Puls er et igangvaerende gadefotografiprojekt der dokumenterer hverdagslivet i danske byer. Camilla Rask arbejder primaert om natten og i de tidlige morgentimer for at indfange byens skjulte rytmer og de mennesker der befolker gaderne naar resten sover.\n\nProjektet er baade poetisk og socialt bevidst — det viser byens skoenheder og dens skyggesider. Fra neonbelyste gaader til stille havneomraader skaber Rask et visuelt arkiv over det urbane Danmark i en tid med hastig forandring.',
    year: '2022',
    duration: 'Igangvaerende',
    medium: 'Gadefotografi',
    status: 'Igangvaerende',
    galleryImages: [
      'https://images.unsplash.com/photo-1742652336050-33587ce5a127?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1cmJhbiUyMHN0cmVldCUyMHBob3RvZ3JhcGh5JTIwbmlnaHQlMjBDb3BlbmhhZ2VufGVufDF8fHx8MTc3MTkzMjU4Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1602545165092-b666bf7ea3dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N1bWVudGFyeSUyMHBob3RvZ3JhcGh5JTIwYmVoaW5kJTIwc2NlbmVzfGVufDF8fHx8MTc3MTkzMjU4NHww&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    keyFacts: [
      { label: 'Byer', value: '12' },
      { label: 'Naetter', value: '200+' },
      { label: 'Serier', value: '15' },
    ],
  },
  {
    id: 6,
    title: 'Det Usynlige Baand',
    description:
      'En tvaermedial fortaelling om de usynlige forbindelser der holder smaa samfund sammen paa tvaers af generationer.',
    responsible: 'Lise Petersen',
    image:
      'https://images.unsplash.com/photo-1770481334229-01d135a7f791?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaG90b2pvdXJuYWxpc20lMjBzb2NpYWwlMjBkb2N1bWVudGFyeXxlbnwxfHx8fDE3NzE5MjYwNDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    hoverImage:
      'https://images.unsplash.com/photo-1764112781034-abf2307a3aba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwaGFuZHMlMjBjbG9zZSUyMHVwJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzcxOTI4NjExfDA&ixlib=rb-4.1.0&q=80&w=1080',
    layoutType: 3,
    longDescription:
      "Det Usynlige Baand er en tvaermedial dokumentarfortaelling der udforsker de usynlige forbindelser mellem generationer i smaa danske samfund. Lise Petersen har tilbragt et aar i tre forskellige landsbysamfund for at forstaa hvad der holder dem sammen.\n\nGennem portraetter, landskabsfotografi og lydoptagelser tegner projektet et billede af det sociale vaev der binder mennesker sammen — traditioner der foeres videre, viden der deles, og omsorg der gives uden at bede om noget til gengaeld. Det er en kaerlig men uskoenmalende fortaelling om det danske provinsliv.",
    year: '2024',
    duration: '14 maaneder',
    medium: 'Fotografi & lyd',
    status: 'Igangvaerende',
    galleryImages: [
      'https://images.unsplash.com/photo-1759405185422-29da4ef282f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGRlcmx5JTIwcnVyYWwlMjBwb3J0cmFpdCUyMGJsYWNrJTIwd2hpdGV8ZW58MXx8fHwxNzcxOTMyNTg2fDA&ixlib=rb-4.1.0&q=80&w=1080',
      'https://images.unsplash.com/photo-1759778341796-8451595fd102?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N1bWVudGFyeSUyMGZpbG0lMjBjYW1lcmElMjBjbG9zZSUyMHVwfGVufDF8fHx8MTc3MTkzMjU4OHww&ixlib=rb-4.1.0&q=80&w=1080',
    ],
    keyFacts: [
      { label: 'Samfund', value: '3' },
      { label: 'Portraetter', value: '78' },
      { label: 'Lydoptagelser', value: '40+' },
    ],
  },
]

export function getProjectById(id: number): Project | undefined {
  return projects.find((p) => p.id === id)
}
