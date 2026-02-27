export interface Person {
  id: number
  name: string
  title: string
  image: string
  bio: string
}

export interface PeopleCategory {
  id: string
  label: string
  people: Person[]
}

export const peopleCategories: PeopleCategory[] = [
  {
    id: 'ambassadoerer',
    label: 'Ambassadorer',
    people: [
      { id: 1, name: 'Maria Jensen', title: 'Dokumentarfotograf', bio: 'Maria har i over 15 aar dokumenteret menneskers hverdagsliv i konfliktzoner. Hendes arbejde er praeget af naerhed og respekt for de mennesker hun portraetterer.', image: 'https://images.unsplash.com/photo-1708737749033-aa9b7bd00507?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMGhlYWRzaG90JTIwb21hbW4lMjBuYXR1cmFsJTIwbGlnaHR8ZW58MXx8fHwxNzcxOTI2ODg5fDA&ixlib=rb-4.1.0&q=80&w=1080' },
      { id: 2, name: 'Anders Moeller', title: 'Journalist', bio: 'Anders specialiserer sig i undersoegende journalistik med fokus paa sociale uligheder i Skandinavien. Han har modtaget flere priser for sine reportager.', image: 'https://images.unsplash.com/photo-1769636929354-59165ba73c7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMGhlYWRzaG90JTIwbWFuJTIwc3R1ZGlvfGVufDF8fHx8MTc3MTkyNjg4OXww&ixlib=rb-4.1.0&q=80&w=1080' },
      { id: 3, name: 'Sofia Andersen', title: 'Visuel Kunstner', bio: 'Sofia arbejder i krydsfeltet mellem kunst og dokumentar. Hendes installationer udforsker identitet og tilhoersforhold gennem fotografi og lyd.', image: 'https://images.unsplash.com/photo-1608482623350-1cf63016c334?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHlvdW5nJTIwd29tYW4lMjBhcnRpc3R8ZW58MXx8fHwxNzcxOTI2MDQ0fDA&ixlib=rb-4.1.0&q=80&w=1080' },
      { id: 4, name: 'Henrik Larsen', title: 'Facilitator', bio: 'Henrik har 20 aars erfaring med at facilitere dialogprocesser i saarbare lokalsamfund. Hans tilgang bygger paa tillid og aktiv lytning.', image: 'https://images.unsplash.com/photo-1620705985487-468b3f7a7777?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMG9sZGVyJTIwbWFuJTIwZGlzdGluZ3Vpc2hlZHxlbnwxfHx8fDE3NzE5MjYwNDR8MA&ixlib=rb-4.1.0&q=80&w=1080' },
      { id: 5, name: 'Lise Petersen', title: 'Fotojournalist', bio: 'Lise kombinerer skarpt visuelt blik med dybdegaaende research. Hendes fotoreportager fra Mellemoesten har vaeret udstillet internationalt.', image: 'https://images.unsplash.com/photo-1655249481446-25d575f1c054?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHdvbWFuJTIwcHJvZmVzc2lvbmFsJTIwaGVhZHNob3R8ZW58MXx8fHwxNzcxODgyNzE3fDA&ixlib=rb-4.1.0&q=80&w=1080' },
      { id: 6, name: 'Thomas Berg', title: 'Forfatter', bio: 'Thomas skriver om mennesker paa kanten af samfundet. Hans seneste bog blev nomineret til Nordisk Raads Litteraturpris.', image: 'https://images.unsplash.com/photo-1627397370714-e19ace8b3e73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMGJlYXJkZWQlMjBtYW4lMjBvdXRkb29yfGVufDF8fHx8MTc3MTg3MDcyOHww&ixlib=rb-4.1.0&q=80&w=1080' },
    ],
  },
  {
    id: 'fotografer',
    label: 'Fotografer',
    people: [
      { id: 7, name: 'Camilla Rask', title: 'Landskabsfotograf', bio: 'Camilla indfanger den nordiske naturs raahed og skoenhed. Hendes langeksponerede landskaber er blevet til flere prisbeloennede fotoserier.', image: 'https://images.unsplash.com/photo-1762522921456-cdfe882d36c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHlvdW5nJTIwcHJvZmVzc2lvbmFsJTIwd29tYW4lMjBzbWlsaW5nfGVufDF8fHx8MTc3MTkyNjg5MXww&ixlib=rb-4.1.0&q=80&w=1080' },
      { id: 8, name: 'Mikkel Havn', title: 'Portraetfotograf', bio: 'Mikkel specialiserer sig i intime portraetter der afslorer menneskers indre liv. Han arbejder udelukkende med naturligt lys.', image: 'https://images.unsplash.com/photo-1620049644455-278ce458370f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMGNyZWF0aXZlJTIwZGlyZWN0b3IlMjBtYW58ZW58MXx8fHwxNzcxOTI2ODkxfDA&ixlib=rb-4.1.0&q=80&w=1080' },
      { id: 9, name: 'Nadia Skov', title: 'Dokumentarfotograf', bio: 'Nadia har fulgt flygtninge paa deres rejse gennem Europa. Hendes billedfortaellinger giver stemme til dem der sjaeldent hoeres.', image: 'https://images.unsplash.com/photo-1631882453346-e819e1b5f9bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHdvbWFuJTIwcGhvdG9ncmFwaGVyJTIwY2FtZXJhfGVufDF8fHx8MTc3MTkyNjg5M3ww&ixlib=rb-4.1.0&q=80&w=1080' },
      { id: 10, name: 'Emil Dahl', title: 'Gadefotograf', bio: 'Emil dokumenterer byens puls og rytme. Hans sort-hvide gadefotografier viser hverdagens poesi i koebenhavnske kvarterer.', image: 'https://images.unsplash.com/photo-1539618450343-13bc2c60ca45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMG1hbiUyMGFyY2hpdGVjdCUyMG1pbmltYWxpc3R8ZW58MXx8fHwxNzcxOTI2ODkzfDA&ixlib=rb-4.1.0&q=80&w=1080' },
    ],
  },
  {
    id: 'journalister',
    label: 'Journalister',
    people: [
      { id: 11, name: 'Ida Vinther', title: 'Undersoegende journalist', bio: 'Ida graever sig ned i systemfejl og strukturel uretfaerdighed. Hendes undersoegende journalistik har afsloeret flere skandaler.', image: 'https://images.unsplash.com/photo-1589729482945-ca6f3a235f7a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHdvbWFuJTIwY3VybHklMjBoYWlyJTIwc3R1ZGlvfGVufDF8fHx8MTc3MTkyNjg5MXww&ixlib=rb-4.1.0&q=80&w=1080' },
      { id: 12, name: 'Kasper Holm', title: 'Korrespondent', bio: 'Kasper har vaeret udlandskorrespondent i over et aartier. Hans rapportering fra konfliktomraader er baade modig og nuanceret.', image: 'https://images.unsplash.com/photo-1628619487942-01c58eed5c33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMG1hbiUyMGdsYXNzZXMlMjB0aG91Z2h0ZnVsfGVufDF8fHx8MTc3MTkyNjg5Mnww&ixlib=rb-4.1.0&q=80&w=1080' },
      { id: 13, name: 'Rikke Storm', title: 'Redaktoer', bio: 'Rikke leder redaktionelle teams med skarpt blik for fortaellingens kraft. Hun har redigeret flere prisbeloennede dokumentarserier.', image: 'https://images.unsplash.com/photo-1602566356438-dd36d35e989c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHdvbWFuJTIwam91cm5hbGlzdCUyMG1lZGlhfGVufDF8fHx8MTc3MTkyNjg5NHww&ixlib=rb-4.1.0&q=80&w=1080' },
    ],
  },
  {
    id: 'formidlere',
    label: 'Formidlere',
    people: [
      { id: 14, name: 'Maja Lund', title: 'Filmskaber', bio: 'Maja skaber dokumentarfilm der udfordrer publikums perspektiv. Hendes film er vist paa festivaler fra Koebenhavn til Sundance.', image: 'https://images.unsplash.com/photo-1643946618030-70719b427667?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHdvbWFuJTIwZG9jdW1lbnRhcnklMjBmaWxtbWFrZXJ8ZW58MXx8fHwxNzcxOTI2ODkzfDA&ixlib=rb-4.1.0&q=80&w=1080' },
      { id: 15, name: 'Jens Friis', title: 'Kurator', bio: 'Jens kuraterer udstillinger der forbinder dokumentarisk materiale med samtidskunst. Han tror paa at kunst kan skabe social forandring.', image: 'https://images.unsplash.com/photo-1574281570877-bd815ebb50a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMG1hbiUyMHRlYWNoZXIlMjBwcm9mZXNzb3J8ZW58MXx8fHwxNzcxOTI2ODk0fDA&ixlib=rb-4.1.0&q=80&w=1080' },
      { id: 16, name: 'Astrid Noer', title: 'Kommunikatoer', bio: "Astrid bygger bro mellem komplekse historier og et bredt publikum. Hendes kommunikationsstrategier har loftet flere NGO'ers synlighed.", image: 'https://images.unsplash.com/photo-1764179690227-af049306cd20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMHdvbWFuJTIwc2NhcmYlMjBlbGVnYW50fGVufDF8fHx8MTc3MTkyNjg5Mnww&ixlib=rb-4.1.0&q=80&w=1080' },
      { id: 17, name: 'Lars Bech', title: 'Foredragsholder', bio: 'Lars holder foredrag om visuel fortaelling og dens evne til at pavirke samfundsdebatten. Han er en erfaren formidler med baggrund i antropologi.', image: 'https://images.unsplash.com/photo-1734982640453-b0f9cd054197?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMG1hbiUyMG5vcmRpYyUyMHNjYW5kaW5hdmlhbnxlbnwxfHx8fDE3NzE5MjY4OTJ8MA&ixlib=rb-4.1.0&q=80&w=1080' },
      { id: 18, name: 'Freja Toft', title: 'Multimediedesigner', bio: 'Freja designer interaktive oplevelser der goer dokumentariske fortaellinger tilgaengelige for nye maalgrupper.', image: 'https://images.unsplash.com/photo-1758685848602-09e52ef9c7d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb3J0cmFpdCUyMG1hdHVyZSUyMHdvbWFuJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3MTkyNjg4OXww&ixlib=rb-4.1.0&q=80&w=1080' },
    ],
  },
]
