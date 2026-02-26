export type WizardStep = 'pick-release' | 'register-tracks'

export type ReleaseType = 'Album' | 'Single' | 'EP'

export interface Society {
  id: string
  name: string
  logo: string
  infoUrl: string
}

// Performer types for neighbouring rights
export type PerformerType = 'featured' | 'non-featured'

export interface Performer {
  id: string
  name: string
  performerType: PerformerType
  role: string
  isFromRB: boolean // Pre-populated from Release Builder
}

// Read-only split entry (mirrors sound recording splits)
export type SplitStatus = 'active' | 'pending' | 'rejected'

export interface SplitEntry {
  name: string
  share: number
  status: SplitStatus
}

// Track registration status
export type RegistrationStatus = 'draft' | 'submitted' | 'registered' | 'rejected'

export interface Track {
  id: string
  number: number
  title: string
  artist: string
  artistLink?: string
  length: string
  isrc: string
  selectedSocieties: string[]
  performers: Performer[]
  splits: SplitEntry[]
  registrationStatus: RegistrationStatus
  autoSubmitNewSocieties: boolean
}

export interface Release {
  id: string
  title: string
  artwork: string
  artist: string
  artistLink?: string
  type: ReleaseType
  tracks: Track[]
}

// ─── PPL Performer Roles (grouped by category from PPL PDF) ───

export interface RoleGroup {
  label: string
  roles: string[]
}

export const PPL_PERFORMER_ROLES: RoleGroup[] = [
  {
    label: 'Vocals',
    roles: [
      'Actor', 'Alto (Voice)', 'Backing Vocals', 'Baritone (Voice)',
      'Bass-Baritone (Voice)', 'Bass (Voice)', 'Beat Box (Vocal)',
      'Caller', 'Cantor', 'Chanting', 'Contralto (Voice)',
      'Counter-Tenor (Voice)', 'Falsetto (Voice)', 'Haute-Contre (Voice)',
      'Humming', 'MC', 'Mezzo-Contralto (Voice)', 'Mezzo-Soprano (Voice)',
      'Mouth Music', 'Narrator', 'Rapper', 'Reciter',
      'Soprano (Voice)', 'Spoken Word', 'Storyteller',
      'Tenor (Voice)', 'Treble (Voice)', 'Vocal Effects',
      'Worship Leader', 'Yodelling',
    ],
  },
  {
    label: 'Guitar',
    roles: [
      'Acoustic Bass Guitar', 'Acoustic Guitar', 'Autoharp',
      'Baglama', 'Balalaika', 'Banjo', 'Bass Guitar',
      'Bouzouki', 'Charango', 'Dobro',
      'Electric Bass Guitar', 'Electric Guitar', 'Electric Sitar',
      'Fretless Bass Guitar', 'Fretless Guitar', 'Guitar Synthesizer',
      'Guitarron', 'Harp Guitar', 'Hawaiian Guitar',
      'Mandolin', 'Sitar', 'Ukulele',
    ],
  },
  {
    label: 'Keyboards',
    roles: [
      'Celeste', 'Clavichord', 'Clavinet', 'Electric Keyboard',
      'Electric Organ', 'Electric Piano', 'Fortepiano',
      'Hammond Organ', 'Harmonium', 'Harpsichord',
      'Mellotron', 'Melodica', 'Ondes Martenot', 'Organ',
      'Piano', 'Player Piano', 'Spinet', 'Stylophone',
      'Synthesizer', 'Toy Piano', 'Wurlitzer Organ',
    ],
  },
  {
    label: 'Brass',
    roles: [
      'Alphorn', 'Alto Horn', 'Alto Trombone', 'Bass Trombone',
      'Bass Trumpet', 'Bass Tuba', 'Bugle', 'Cornet',
      'Euphonium', 'Flugelhorn', 'French Horn', 'Horn',
      'Piccolo Trumpet', 'Sousaphone', 'Tenor Horn',
      'Trombone', 'Trumpet', 'Trumpet (Eflat)', 'Tuba',
      'Valve Trombone',
    ],
  },
  {
    label: 'Wind Instruments',
    roles: [
      'Accordion', 'Alto Clarinet', 'Alto Flute', 'Alto Recorder',
      'Alto Saxophone', 'Bagpipes', 'Baritone Saxophone',
      'Bass Clarinet', 'Bass Flute', 'Bass Recorder', 'Bass Saxophone',
      'Bassoon', 'Clarinet', 'Concertina', 'Cor Anglais',
      'Didjeridu', 'Double Bassoon', 'Fife', 'Flute',
      'Harmonica', 'Oboe', 'Ocarina', 'Panpipes',
      'Piano Accordion', 'Piccolo', 'Recorder', 'Saxophone',
      'Shakuhachi', 'Soprano Saxophone', 'Tenor Saxophone',
      'Tin Whistle', 'Whistle', 'Wooden Flute',
    ],
  },
  {
    label: 'String Instruments',
    roles: [
      'Arpeggione', 'Bandura', 'Bass Viol', 'Cello',
      'Cimbalom', 'Double Bass', 'Dulcimer',
      'Electric Cello', 'Electric Fiddle', 'Electric Harp',
      'Electric Upright Bass', 'Electric Viola', 'Electric Violin',
      'Fiddle', 'Hammered Dulcimer', 'Harp',
      'Koto', 'Lyre', 'Viola', 'Violin', 'Zither',
    ],
  },
  {
    label: 'Percussion',
    roles: [
      'Bass Drum', 'Bass Marimba', 'Bells', 'Bongos',
      'Cabasa', 'Castanets', 'Claves', 'Congas', 'Cowbell',
      'Cymbals', 'Djembe', 'Drum Machine', 'Drums',
      'Electronic Drums', 'Finger Cymbals', 'Glockenspiel',
      'Gong', 'Hi-Hat', 'Kalimba', 'Maracas',
      'Marimba', 'Mbira', 'Percussion', 'Shaker',
      'Snare Drum', 'Steel Drum', 'Tabla', 'Tambourine',
      'Timbales', 'Timpani', 'Tom-Tom', 'Triangle',
      'Tubular Bells', 'Vibraphone', 'Woodblock',
      'Xylophone',
    ],
  },
  {
    label: 'Electronics',
    roles: [
      'Beat Box', 'DJ', 'DJ (Scratcher)', 'Emulator',
      'Programmer', 'Sampler', 'Theremin', 'Vocoder',
    ],
  },
  {
    label: 'Miscellaneous',
    roles: [
      'Accompanist', 'Chapman Stick', 'Dance',
      'One-Man Band', 'Sampled Performer', 'Sound Effects',
      'Tap Dancer', 'Unidentified Payable Role', 'Whistling',
    ],
  },
  {
    label: 'Non-Payable Roles',
    roles: [
      'Arranger', 'DJ (Mixer)', 'Engineer', 'Engineer (Vocal)',
      'Executive Producer', 'Mixer', 'Producer',
      'Producer (Rhythm Track)', 'Producer (Vocal)',
      'Remaster Engineer', 'Remaster Producer',
      'Remix Engineer', 'Remixer', 'Sound Director',
    ],
  },
  {
    label: 'Studio Producer',
    roles: ['Eligible Studio Producer'],
  },
]

// Flat list of all roles for search
export const ALL_PPL_ROLES: string[] = PPL_PERFORMER_ROLES.flatMap(g => g.roles)
