<template>
  <div class="tl">
    <h3 class="tl__heading">Tracklist</h3>

    <!-- Table header -->
    <div class="tl__header">
      <span class="tl__th tl__th--num">#</span>
      <span class="tl__th tl__th--title">Title</span>
      <span class="tl__th tl__th--artist">Artist</span>
      <span class="tl__th tl__th--length">Length</span>
      <span class="tl__th tl__th--isrc">ISRC</span>
      <span class="tl__th tl__th--action">Status</span>
    </div>

    <!-- Track rows -->
    <div
      v-for="track in tracks"
      :key="track.id"
      class="tl__track"
      :class="{ 'tl__track--expanded': expandedTrackId === track.id }"
    >
      <!-- Track summary row (6 columns) -->
      <div
        class="tl__row"
        :class="{ 'tl__row--expanded': expandedTrackId === track.id }"
        role="button"
        tabindex="0"
        @click="$emit('toggleTrack', track.id)"
        @keydown.enter.prevent="$emit('toggleTrack', track.id)"
      >
        <span class="tl__num">{{ track.number }}</span>
        <span class="tl__title">{{ track.title }}</span>
        <span class="tl__artist">{{ track.artist }}</span>
        <span class="tl__length">{{ track.length }}</span>
        <span class="tl__isrc">{{ track.isrc }}</span>
        <div class="tl__action">
          <!-- Status pill (clickable to expand) -->
          <span
            v-if="track.registrationStatus !== 'draft'"
            class="tl__status-pill"
            :class="`tl__status-pill--${track.registrationStatus}`"
          >
            <span class="tl__status-dot" :class="`tl__status-dot--${track.registrationStatus}`" />
            {{ statusLabel(track.registrationStatus) }}
          </span>
          <button
            v-else
            class="tl__pill"
            :class="expandedTrackId === track.id ? 'tl__pill--close' : 'tl__pill--open'"
            @click.stop="$emit('toggleTrack', track.id)"
          >
            {{ expandedTrackId === track.id ? 'Close' : 'Register' }}
          </button>
        </div>
      </div>

      <!-- Expanded detail (2-column layout) -->
      <div v-if="expandedTrackId === track.id" class="tl__detail">
        <div class="tl__detail-grid">
          <!-- Left column: societies + performers -->
          <div class="tl__detail-left">
            <div class="tl__societies">
              <div class="tl__section-header">
                <div>
                  <h4 class="tl__section-title">Societies</h4>
                  <p class="tl__section-desc">
                    {{ isDraft(track) ? 'Select which societies to register with' : 'Registered with the following societies' }}
                  </p>
                </div>
                <button
                  class="tl__select-all"
                  @click="handleSelectAll(track)"
                >
                  {{ allSocietiesSelected(track) ? 'Deselect all' : 'Select all' }}
                </button>
              </div>
              <div class="tl__societies-grid">
                <SocietyCard
                  v-for="society in societies"
                  :key="society.id"
                  :society="society"
                  :is-selected="track.selectedSocieties.includes(society.id)"
                  @toggle="$emit('toggleSociety', track.id, society.id)"
                />
              </div>

              <!-- Auto-submit opt-in -->
              <label class="tl__auto-submit">
                <input
                  type="checkbox"
                  class="tl__auto-submit-check"
                  :checked="track.autoSubmitNewSocieties"
                  @change="$emit('toggleAutoSubmit', track.id)"
                />
                <span class="tl__auto-submit-label">Automatically register with new societies added in the future</span>
              </label>
            </div>

            <PerformerForm
              :performers="track.performers"
              :readonly="!isDraft(track)"
              @update="(performers) => $emit('updatePerformers', track.id, performers)"
            />
          </div>

          <!-- Right column: splits -->
          <div class="tl__detail-right">
            <SplitsDisplay :splits="track.splits" />
          </div>
        </div>

        <!-- Footer actions -->
        <div class="tl__register-row">
          <button
            v-if="isDraft(track)"
            class="tl__register-btn"
            :disabled="!canRegister(track)"
            @click="$emit('registerTrack', track.id)"
          >
            Register Track
          </button>
          <button
            v-else-if="hasNewSocieties(track)"
            class="tl__register-btn tl__register-btn--secondary"
            @click="$emit('registerTrack', track.id)"
          >
            Register with Additional Societies
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Track, Society, Performer, RegistrationStatus } from '../../types'
import SocietyCard from './SocietyCard.vue'
import PerformerForm from './PerformerForm.vue'
import SplitsDisplay from './SplitsDisplay.vue'

const props = defineProps<{
  tracks: Track[]
  societies: Society[]
  expandedTrackId: string | null
}>()

const emit = defineEmits<{
  toggleTrack: [trackId: string]
  toggleSociety: [trackId: string, societyId: string]
  selectAllSocieties: [trackId: string, selectAll: boolean]
  updatePerformers: [trackId: string, performers: Performer[]]
  registerTrack: [trackId: string]
  toggleAutoSubmit: [trackId: string]
}>()

const isDraft = (track: Track) => track.registrationStatus === 'draft'

const statusLabel = (status: RegistrationStatus): string => {
  switch (status) {
    case 'submitted': return 'Submitted'
    case 'registered': return 'Registered'
    case 'rejected': return 'Rejected'
    default: return ''
  }
}

const allSocietiesSelected = (track: Track): boolean => {
  return props.societies.every(s => track.selectedSocieties.includes(s.id))
}

const handleSelectAll = (track: Track) => {
  emit('selectAllSocieties', track.id, !allSocietiesSelected(track))
}

// For non-draft tracks: check if user has selected societies not yet submitted
const hasNewSocieties = (track: Track): boolean => {
  // In a real app you'd compare against originally-registered societies
  // For demo, just check if any societies are selected on a non-draft track
  return !isDraft(track) && track.selectedSocieties.length > 0
}

const canRegister = (track: Track): boolean => {
  if (track.selectedSocieties.length === 0) return false
  const hasValidPerformer = track.performers.some(p => p.name.trim() && p.role)
  return hasValidPerformer
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.tl {
  border-radius: $radius-card;
  overflow: hidden;
  background: #fff;

  &__heading {
    font-family: $font-poppins;
    font-size: $text-h3;
    font-weight: 700;
    color: var(--blue);
    margin-bottom: 1.5rem;
  }

  // ── Table header ──
  &__header {
    display: none;

    @include sm {
      display: grid;
      grid-template-columns: 2.5rem 1fr 1fr 4.5rem 7rem 7rem;
      gap: 0.75rem;
      align-items: center;
      padding: 0.625rem 1rem;
      background: var(--lighter-grey);
      border-bottom: 1px solid var(--faded-grey);
      border-radius: $radius-card $radius-card 0 0;
    }
  }

  &__th {
    font-size: $text-xs;
    font-family: $font-satoshi;
    font-weight: 500;
    color: var(--ditto-grey);

    &--num { text-align: center; }
    &--action { text-align: right; }
  }

  // ── Track wrapper ──
  &__track {
    border-bottom: 1px solid var(--faded-grey);

    &:last-child { border-bottom: 0; }

    &--expanded {
      box-shadow: inset 0 0 0 1px rgba($color-brand-primary, 0.25);
      border-radius: $radius-lg;
    }
  }

  // ── Row — 6-column grid ──
  &__row {
    display: grid;
    grid-template-columns: 2.5rem 1fr auto;
    gap: 0.75rem;
    align-items: center;
    padding: 1rem 1rem;
    cursor: pointer;
    transition: background 0.15s;

    @include sm {
      grid-template-columns: 2.5rem 1fr 1fr 4.5rem 7rem 7rem;
    }

    &:hover { background: var(--lighter-grey); }
    &--expanded { background: var(--lighter-grey); }
  }

  &__num {
    font-size: $text-body;
    font-weight: 600;
    color: var(--blue);
    font-family: $font-satoshi;
    width: 2rem;
    text-align: center;
  }

  &__title {
    font-size: $text-sm;
    font-weight: 500;
    color: var(--blue);
    font-family: $font-satoshi;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__artist {
    display: none;
    font-size: $text-sm;
    color: var(--ditto-grey);
    font-family: $font-satoshi;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    @include sm { display: block; }
  }

  &__length {
    display: none;
    font-size: $text-sm;
    color: var(--ditto-grey);
    font-family: $font-satoshi;

    @include sm { display: block; }
  }

  &__isrc {
    display: none;
    font-size: $text-xs;
    color: var(--ditto-grey);
    font-family: $font-satoshi;
    letter-spacing: 0.02em;

    @include sm { display: block; }
  }

  &__action {
    display: flex;
    justify-content: flex-end;
  }

  // ── Status pill ──
  &__status-pill {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.25rem 0.625rem;
    border-radius: $radius-button;
    font-size: $text-xs;
    font-weight: 500;
    font-family: $font-satoshi;

    &--submitted {
      background: $color-amber-50;
      color: $color-amber-800;
    }
    &--registered {
      background: rgba($color-success, 0.1);
      color: #006633;
    }
    &--rejected {
      background: rgba($color-error, 0.1);
      color: $color-error;
    }
  }

  &__status-dot {
    width: 0.375rem;
    height: 0.375rem;
    border-radius: 50%;

    &--submitted { background: $color-amber-500; }
    &--registered { background: $color-success; }
    &--rejected { background: $color-error; }
  }

  // ── Pill button ──
  &__pill {
    padding: 0.3125rem 0.75rem;
    border: 1px solid;
    border-radius: $radius-button;
    font-size: $text-xs;
    font-weight: 500;
    font-family: $font-satoshi;
    transition: border-color 0.15s, color 0.15s, background 0.15s;

    &--open {
      border-color: rgba($color-brand-primary, 0.4);
      color: var(--brand-primary);

      &:hover {
        border-color: var(--brand-primary);
        background: rgba($color-brand-primary, 0.05);
      }
    }

    &--close {
      border-color: var(--ditto-grey);
      color: var(--ditto-grey);
      background: #fff;
    }
  }

  // ── Expanded detail ──
  &__detail {
    padding: 0 1.5rem 1.5rem;
    border-top: 1px solid var(--faded-grey);
  }

  &__detail-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    padding-top: 1.5rem;

    @include md {
      grid-template-columns: 1fr 20rem;
    }
  }

  &__section-title {
    font-family: $font-poppins;
    font-size: $text-h4;
    font-weight: 700;
    color: var(--blue);
    margin-bottom: 0.25rem;
  }

  &__section-desc {
    font-family: $font-satoshi;
    font-size: $text-sm;
    color: var(--ditto-grey);
    margin-bottom: 1rem;
  }

  &__societies {
    margin-bottom: 2rem;
  }

  &__section-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  &__select-all {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border: 1px solid var(--faded-grey);
    border-radius: $radius-button;
    font-family: $font-satoshi;
    font-size: $text-sm;
    font-weight: 500;
    color: var(--ditto-grey);
    background: transparent;
    cursor: pointer;
    white-space: nowrap;
    transition: border-color 0.15s, color 0.15s;

    &:hover {
      border-color: var(--brand-primary);
      color: var(--brand-primary);
    }
  }

  &__societies-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  &__auto-submit {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
    cursor: pointer;
  }

  &__auto-submit-check {
    appearance: auto;
    -webkit-appearance: checkbox;
    width: 1rem;
    height: 1rem;
    accent-color: var(--brand-primary);
    cursor: pointer;
    flex-shrink: 0;
  }

  &__auto-submit-label {
    font-family: $font-satoshi;
    font-size: $text-xs;
    color: var(--ditto-grey);
    line-height: 1.3;
  }

  &__register-row {
    display: flex;
    justify-content: flex-end;
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid var(--faded-grey);
  }

  &__register-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border: 1px solid var(--faded-grey);
    border-radius: $radius-button;
    font-family: $font-satoshi;
    font-size: $text-sm;
    font-weight: 500;
    color: var(--ditto-grey);
    background: transparent;
    cursor: pointer;
    transition: border-color 0.15s, color 0.15s;

    &:hover {
      border-color: var(--brand-primary);
      color: var(--brand-primary);
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      &:hover { border-color: var(--faded-grey); color: var(--ditto-grey); }
    }

    &--secondary {
      border-color: var(--faded-grey);
      color: var(--ditto-grey);

      &:hover {
        border-color: var(--brand-primary);
        color: var(--brand-primary);
      }
    }
  }
}
</style>
