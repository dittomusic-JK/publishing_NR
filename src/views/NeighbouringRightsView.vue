<template>
  <div class="nr">
    <h1 class="nr__title">
      Neighbouring Rights <strong>Registration</strong>
    </h1>
    <p class="nr__subtitle">
      Register your sound recordings with collection societies worldwide. We'll handle the claims and collect neighbouring rights royalties on your behalf.
    </p>

    <StepIndicator
      :current-step="currentStep"
      @go-to-step="handleGoToStep"
    />

    <!-- Step 1: Pick a Release -->
    <template v-if="currentStep === 'pick-release'">
      <ReleaseList
        :releases="filteredReleases"
        :selected-release-id="selectedRelease?.id ?? null"
        :artist-filter="artistFilter"
        :type-filter="typeFilter"
        :artists="uniqueArtists"
        :types="uniqueTypes"
        @select="handleSelectRelease"
        @update:artist-filter="artistFilter = $event"
        @update:type-filter="typeFilter = $event"
      />
    </template>

    <!-- Step 2: Register Tracks -->
    <template v-if="currentStep === 'register-tracks' && selectedRelease">
      <div class="nr__step-header">
        <h2 class="nr__step-title">Choose which <strong>tracks to register</strong></h2>
      </div>

      <SelectedRelease :release="selectedRelease" />

      <TracklistTable
        :tracks="selectedRelease.tracks"
        :societies="societies"
        :expanded-track-id="expandedTrackId"
        @toggle-track="toggleTrack"
        @toggle-society="handleToggleSociety"
        @select-all-societies="handleSelectAllSocieties"
        @update-performers="handleUpdatePerformers"
        @register-track="handleRegisterTrack"
        @toggle-auto-submit="handleToggleAutoSubmit"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Release, Society, WizardStep, Performer } from '../types'
import StepIndicator from '../components/neighbouring-rights/StepIndicator.vue'
import ReleaseList from '../components/neighbouring-rights/ReleaseList.vue'
import SelectedRelease from '../components/neighbouring-rights/SelectedRelease.vue'
import TracklistTable from '../components/neighbouring-rights/TracklistTable.vue'

const currentStep = ref<WizardStep>('pick-release')
const selectedRelease = ref<Release | null>(null)
const expandedTrackId = ref<string | null>(null)
const artistFilter = ref('')
const typeFilter = ref('')

// Societies data
const societies: Society[] = [
  { id: 'ppl', name: 'PPL', logo: '/images/societies/ppl.svg', infoUrl: 'https://www.ppluk.com' },
  { id: 'soundexchange', name: 'SoundExchange', logo: '/images/societies/sound-exchange.svg', infoUrl: 'https://www.soundexchange.com' },
  { id: 'ppca', name: 'PPCA', logo: '/images/societies/ppca.svg', infoUrl: 'https://www.ppca.com.au' },
  { id: 'sampra', name: 'Sampra', logo: '/images/societies/sampra.svg', infoUrl: 'https://www.sampra.org.za' },
]

// Helper: create default performers from track artist (simulates RB data)
const makeDefaultPerformers = (artist: string): Performer[] => [
  { id: `rb_${artist.replace(/\s/g, '_').toLowerCase()}`, name: artist, performerType: 'featured', role: '', isFromRB: true },
]

// Helper: default splits (mirrors sound recording)
const makeDefaultSplits = (artist: string) => [
  { name: artist, share: 100, status: 'active' as const },
]

// Mock releases with performers, splits, registrationStatus
const releases = ref<Release[]>([
  {
    id: 'r1',
    title: 'Music for Train Journeys',
    artwork: 'https://picsum.photos/seed/train/400/400',
    artist: 'Paul Landry',
    artistLink: '#',
    type: 'Album',
    tracks: [
      { id: 't1', number: 1, title: 'Morning Express', artist: 'Paul Landry', length: '03:42', isrc: 'GX53U2633901', selectedSocieties: ['ppl'], performers: makeDefaultPerformers('Paul Landry'), splits: makeDefaultSplits('Paul Landry'), registrationStatus: 'registered', autoSubmitNewSocieties: false },
      { id: 't2', number: 2, title: 'Through the Valley', artist: 'Paul Landry', length: '04:15', isrc: 'GX53U2633902', selectedSocieties: [], performers: makeDefaultPerformers('Paul Landry'), splits: makeDefaultSplits('Paul Landry'), registrationStatus: 'draft', autoSubmitNewSocieties: false },
      { id: 't3', number: 3, title: 'Station Platform', artist: 'Paul Landry', length: '02:58', isrc: 'GX53U2633903', selectedSocieties: ['ppl', 'ppca'], performers: makeDefaultPerformers('Paul Landry'), splits: makeDefaultSplits('Paul Landry'), registrationStatus: 'submitted', autoSubmitNewSocieties: false },
      { id: 't4', number: 4, title: 'Distant Horizons', artist: 'Paul Landry', length: '05:01', isrc: 'GX53U2633904', selectedSocieties: [], performers: makeDefaultPerformers('Paul Landry'), splits: makeDefaultSplits('Paul Landry'), registrationStatus: 'draft', autoSubmitNewSocieties: false },
    ]
  },
  {
    id: 'r2',
    title: 'Nirvana on Olympus Mons',
    artwork: 'https://picsum.photos/seed/olympus/400/400',
    artist: 'Paul Landry',
    artistLink: '#',
    type: 'Album',
    tracks: [
      { id: 't5', number: 1, title: 'Ascent', artist: 'Paul Landry', length: '06:12', isrc: 'GX53U2633905', selectedSocieties: [], performers: makeDefaultPerformers('Paul Landry'), splits: makeDefaultSplits('Paul Landry'), registrationStatus: 'draft', autoSubmitNewSocieties: false },
      { id: 't6', number: 2, title: 'Crater Lake', artist: 'Paul Landry', length: '04:33', isrc: 'GX53U2633906', selectedSocieties: [], performers: makeDefaultPerformers('Paul Landry'), splits: makeDefaultSplits('Paul Landry'), registrationStatus: 'draft', autoSubmitNewSocieties: false },
      { id: 't7', number: 3, title: 'Solar Wind', artist: 'Paul Landry', length: '05:20', isrc: 'GX53U2633907', selectedSocieties: [], performers: makeDefaultPerformers('Paul Landry'), splits: makeDefaultSplits('Paul Landry'), registrationStatus: 'draft', autoSubmitNewSocieties: false },
    ]
  },
  {
    id: 'r3',
    title: 'Believe in You (Radio Edit)',
    artwork: 'https://picsum.photos/seed/believe/400/400',
    artist: 'Epicus',
    artistLink: '#',
    type: 'Single',
    tracks: [
      { id: 't8', number: 1, title: 'Believe in You (Radio Edit)', artist: 'Epicus', length: '03:28', isrc: 'GX53U2633908', selectedSocieties: [], performers: makeDefaultPerformers('Epicus'), splits: [{ name: 'Epicus', share: 60, status: 'active' as const }, { name: 'DJ Koda', share: 40, status: 'pending' as const }], registrationStatus: 'draft', autoSubmitNewSocieties: false },
    ]
  },
  {
    id: 'r4',
    title: 'Alpha Omega',
    artwork: 'https://picsum.photos/seed/alpha/400/400',
    artist: 'Paul Landry',
    artistLink: '#',
    type: 'Album',
    tracks: [
      { id: 't9', number: 1, title: 'Alpha', artist: 'Paul Landry', length: '04:10', isrc: 'GX53U2633909', selectedSocieties: [], performers: makeDefaultPerformers('Paul Landry'), splits: makeDefaultSplits('Paul Landry'), registrationStatus: 'draft', autoSubmitNewSocieties: false },
      { id: 't10', number: 2, title: 'Between Worlds', artist: 'Paul Landry', length: '03:55', isrc: 'GX53U2633910', selectedSocieties: [], performers: makeDefaultPerformers('Paul Landry'), splits: makeDefaultSplits('Paul Landry'), registrationStatus: 'draft', autoSubmitNewSocieties: false },
      { id: 't11', number: 3, title: 'Omega', artist: 'Paul Landry', length: '05:45', isrc: 'GX53U2633911', selectedSocieties: [], performers: makeDefaultPerformers('Paul Landry'), splits: makeDefaultSplits('Paul Landry'), registrationStatus: 'draft', autoSubmitNewSocieties: false },
    ]
  },
  {
    id: 'r5',
    title: 'Last Day Out',
    artwork: 'https://picsum.photos/seed/lastday/400/400',
    artist: 'Little Torment',
    artistLink: '#',
    type: 'EP',
    tracks: [
      { id: 't12', number: 1, title: 'Last Day Out', artist: 'Little Torment', artistLink: '#', length: '01:41', isrc: 'GX53U2633910', selectedSocieties: [], performers: makeDefaultPerformers('Little Torment'), splits: makeDefaultSplits('Little Torment'), registrationStatus: 'draft', autoSubmitNewSocieties: false },
      { id: 't13', number: 2, title: 'Nightfall', artist: 'Little Torment', length: '02:55', isrc: 'GX53U2633912', selectedSocieties: [], performers: makeDefaultPerformers('Little Torment'), splits: makeDefaultSplits('Little Torment'), registrationStatus: 'draft', autoSubmitNewSocieties: false },
      { id: 't14', number: 3, title: 'Echoes', artist: 'Little Torment', length: '03:10', isrc: 'GX53U2633913', selectedSocieties: [], performers: makeDefaultPerformers('Little Torment'), splits: makeDefaultSplits('Little Torment'), registrationStatus: 'draft', autoSubmitNewSocieties: false },
    ]
  },
])

// Filters
const uniqueArtists = computed(() => [...new Set(releases.value.map(r => r.artist))])
const uniqueTypes = computed(() => [...new Set(releases.value.map(r => r.type))])

const filteredReleases = computed(() => {
  return releases.value.filter(r => {
    if (artistFilter.value && r.artist !== artistFilter.value) return false
    if (typeFilter.value && r.type !== typeFilter.value) return false
    return true
  })
})

// Handlers
const handleSelectRelease = (release: Release) => {
  selectedRelease.value = release
  currentStep.value = 'register-tracks'
  expandedTrackId.value = null
}

const handleGoToStep = (step: WizardStep) => {
  if (step === 'pick-release') {
    currentStep.value = 'pick-release'
  }
}

const toggleTrack = (trackId: string) => {
  expandedTrackId.value = expandedTrackId.value === trackId ? null : trackId
}

const handleToggleSociety = (trackId: string, societyId: string) => {
  if (!selectedRelease.value) return
  const track = selectedRelease.value.tracks.find(t => t.id === trackId)
  if (!track) return

  const idx = track.selectedSocieties.indexOf(societyId)
  if (idx > -1) {
    track.selectedSocieties.splice(idx, 1)
  } else {
    track.selectedSocieties.push(societyId)
  }
}

const handleUpdatePerformers = (trackId: string, performers: Performer[]) => {
  if (!selectedRelease.value) return
  const track = selectedRelease.value.tracks.find(t => t.id === trackId)
  if (track) {
    track.performers = performers
  }
}

const handleSelectAllSocieties = (trackId: string, selectAll: boolean) => {
  if (!selectedRelease.value) return
  const track = selectedRelease.value.tracks.find(t => t.id === trackId)
  if (!track) return
  track.selectedSocieties = selectAll ? societies.map(s => s.id) : []
}

const handleToggleAutoSubmit = (trackId: string) => {
  if (!selectedRelease.value) return
  const track = selectedRelease.value.tracks.find(t => t.id === trackId)
  if (track) {
    track.autoSubmitNewSocieties = !track.autoSubmitNewSocieties
  }
}

const handleRegisterTrack = (trackId: string) => {
  if (!selectedRelease.value) return
  const track = selectedRelease.value.tracks.find(t => t.id === trackId)
  if (track) {
    track.registrationStatus = 'submitted'
    expandedTrackId.value = null
  }
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.nr {
  &__title {
    font-family: $font-poppins;
    font-size: $text-h1;
    font-weight: 400;
    color: var(--blue);
    margin-bottom: 2rem;
    line-height: 1.2;

    strong { font-weight: 700; }
  }

  &__subtitle {
    font-family: $font-satoshi;
    font-size: $text-body;
    color: var(--ditto-grey);
    margin-bottom: 2rem;
    max-width: 40rem;
    line-height: 1.6;
  }

  &__step-header {
    margin-bottom: 1.5rem;
  }

  &__step-title {
    font-family: $font-poppins;
    font-size: $text-h2;
    font-weight: 400;
    color: var(--blue);
    margin-bottom: 0.25rem;
    line-height: 1.3;

    strong { font-weight: 700; }
  }

  &__step-desc {
    font-family: $font-satoshi;
    font-size: $text-body;
    color: var(--ditto-grey);
  }
}
</style>
