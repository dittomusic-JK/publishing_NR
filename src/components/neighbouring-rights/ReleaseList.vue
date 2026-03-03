<template>
  <div class="rl">
    <div class="rl__toolbar">
      <h2 class="rl__section-title">Pick a <strong>release</strong></h2>
      <div class="rl__filters">
        <span class="rl__filter-label">Filter by:</span>
        <div class="rl__filter-dropdown">
        <CustomDropdown
          :model-value="artistFilter"
          :options="['', ...artists]"
          placeholder="Artist"
          @update:model-value="$emit('update:artistFilter', $event)"
        />
      </div>
      <div class="rl__filter-dropdown">
        <CustomDropdown
          :model-value="typeFilter"
          :options="['', ...types]"
          placeholder="Release Type"
          @update:model-value="$emit('update:typeFilter', $event)"
        />
        </div>
      </div>
    </div>

    <!-- Table header -->
    <div class="rl__header">
      <span class="rl__header-cell rl__header-cell--details">Details</span>
      <span class="rl__header-cell rl__header-cell--artist">Artist</span>
      <span class="rl__header-cell rl__header-cell--type">Type</span>
      <span class="rl__header-cell rl__header-cell--progress">Registration</span>
      <span class="rl__header-cell rl__header-cell--action"></span>
    </div>

    <!-- List -->
    <div class="rl__list">
      <div
        v-for="(release, index) in releases"
        :key="release.id"
        class="rl__row"
        role="button"
        tabindex="0"
        @click="$emit('select', release)"
        @keydown.enter.prevent="$emit('select', release)"
      >
        <img :src="release.artwork" :alt="release.title" class="rl__artwork" />

        <div class="rl__info">
          <h3 class="rl__title">{{ release.title }}</h3>
          <p class="rl__track-count">{{ release.tracks.length }} {{ release.tracks.length === 1 ? 'Track' : 'Tracks' }}</p>
        </div>

        <span class="rl__artist">{{ release.artist }}</span>

        <span class="rl__type-badge">{{ release.type }}</span>

        <div class="rl__progress">
          <div class="rl__progress-text">
            <p class="rl__progress-num">
              {{ registeredCount(release) }}<span class="rl__progress-total">/{{ release.tracks.length }}</span>
            </p>
            <p class="rl__progress-label">registered</p>
          </div>
          <svg width="36" height="36" viewBox="0 0 36 36" class="rl__ring">
            <circle cx="18" cy="18" r="14" fill="none" stroke="#EFEFFC" stroke-width="3" />
            <circle
              cx="18" cy="18" r="14" fill="none" stroke="#5f1fff" stroke-width="3"
              stroke-linecap="round"
              :stroke-dasharray="ringCircumference"
              :stroke-dashoffset="ringOffset(release)"
              class="rl__ring-fg"
            />
          </svg>
        </div>

        <button class="rl__select-btn" @click.stop="$emit('select', release)">
          Select
        </button>
      </div>
    </div>

    <p v-if="releases.length === 0" class="rl__empty">
      No releases match your filters.
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Release, ReleaseType } from '../../types'
import CustomDropdown from './CustomDropdown.vue'

const props = defineProps<{
  releases: Release[]
  artistFilter: string
  typeFilter: string
  artists: string[]
  types: ReleaseType[]
}>()

defineEmits<{
  select: [release: Release]
  'update:artistFilter': [value: string]
  'update:typeFilter': [value: string]
}>()

const ringCircumference = 2 * Math.PI * 14

const registeredCount = (release: Release): number => {
  return release.tracks.filter(t => t.registrationStatus !== 'draft').length
}

const ringOffset = (release: Release): number => {
  const total = release.tracks.length
  if (total === 0) return ringCircumference
  const progress = registeredCount(release) / total
  return ringCircumference * (1 - progress)
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.rl {
  &__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }

  &__section-title {
    font-family: $font-poppins;
    font-size: $text-h3;
    font-weight: 400;
    color: var(--blue);
    line-height: 1.3;

    strong { font-weight: 700; }
  }

  &__filters {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  &__filter-label {
    font-family: $font-satoshi;
    font-size: $text-sm;
    color: var(--ditto-grey);
  }

  &__filter-dropdown {
    min-width: 10rem;
  }

  // ── Table header ──
  &__header,
  &__row {
    display: grid;
    grid-template-columns: 4rem 1fr 9rem 5rem 7rem 5.5rem;
    gap: 1rem;
    align-items: center;
    padding: 0.625rem 1.25rem;
  }

  &__header {
    border-bottom: 1px solid var(--faded-grey);
  }

  &__header-cell {
    font-family: $font-satoshi;
    font-size: $text-xs;
    font-weight: 500;
    color: var(--ditto-grey);
    white-space: nowrap;

    &--details {
      grid-column: 1 / 3;
    }

    &--artist {
      text-align: left;
    }

    &--type {
      text-align: center;
    }

    &--progress {
      text-align: center;
    }

    &--action {
      text-align: center;
    }
  }

  &__list {
    background: #fff;
  }

  &__row {
    padding: 1.125rem 1.25rem;
    border-bottom: 1px solid var(--faded-grey);
    cursor: pointer;
    transition: background 0.15s;

    &:last-child { border-bottom: 0; }
    &:hover { background: var(--lighter-grey); }
  }

  &__artwork {
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 0.5rem;
    object-fit: cover;
    flex-shrink: 0;
  }

  &__info {
    min-width: 0;
  }

  &__title {
    font-size: $text-body;
    font-weight: 700;
    color: var(--blue);
    font-family: $font-satoshi;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 1.4;
  }

  &__track-count {
    font-size: $text-sm;
    font-weight: 500;
    color: var(--brand-primary);
    font-family: $font-satoshi;
    line-height: 1.4;
  }

  &__artist {
    font-size: $text-sm;
    font-weight: 500;
    color: var(--blue);
    font-family: $font-satoshi;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
    justify-self: start;
  }

  &__type-badge {
    padding: 0.25rem 0.625rem;
    border-radius: $radius-button;
    background: var(--lighter-grey);
    font-size: $text-xs;
    font-weight: 600;
    font-family: $font-satoshi;
    color: var(--ditto-grey);
    white-space: nowrap;
    text-align: center;
  }

  &__progress {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
    justify-content: center;
  }

  &__progress-text { text-align: right; }

  &__progress-num {
    font-size: $text-body;
    font-weight: 700;
    color: var(--blue);
    font-family: $font-satoshi;
  }

  &__progress-total {
    color: var(--ditto-grey);
    font-weight: 400;
  }

  &__progress-label {
    font-size: 10px;
    color: var(--ditto-grey);
    font-family: $font-satoshi;
    text-transform: lowercase;
  }

  &__ring {
    transform: rotate(-90deg);
  }

  &__ring-fg {
    transition: stroke-dashoffset 0.5s ease;
  }

  &__select-btn {
    padding: 0.375rem 1rem;
    border: 1px solid var(--faded-grey);
    border-radius: $radius-button;
    font-size: $text-sm;
    font-weight: 500;
    font-family: $font-satoshi;
    color: var(--ditto-grey);
    transition: border-color 0.15s, background 0.15s, color 0.15s;

    &:hover {
      border-color: var(--brand-primary);
      color: var(--brand-primary);
      background: rgba($color-brand-primary, 0.04);
    }
  }

  &__empty {
    text-align: center;
    padding: 3rem;
    font-family: $font-satoshi;
    font-size: $text-body;
    color: var(--ditto-grey);
  }
}
</style>
