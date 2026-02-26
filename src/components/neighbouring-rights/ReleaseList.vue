<template>
  <div class="rl">
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

    <!-- List -->
    <div class="rl__list">
      <div
        v-for="release in releases"
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
          <p class="rl__artist">{{ release.artist }}</p>
        </div>

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
  &__filters {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    justify-content: flex-end;
    margin-bottom: 1.5rem;
  }

  &__filter-label {
    font-family: $font-satoshi;
    font-size: $text-sm;
    color: var(--ditto-grey);
  }

  &__filter-dropdown {
    min-width: 10rem;
  }

  &__list {
    border-radius: $radius-card;
    overflow: hidden;
    background: #fff;
  }

  &__row {
    display: grid;
    grid-template-columns: auto 1fr auto auto auto;
    gap: 1rem;
    align-items: center;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--faded-grey);
    cursor: pointer;
    transition: background 0.15s;

    &:last-child { border-bottom: 0; }
    &:hover { background: var(--lighter-grey); }
  }

  &__artwork {
    width: 3rem;
    height: 3rem;
    border-radius: $radius-lg;
    object-fit: cover;
    flex-shrink: 0;

    @include sm {
      width: 3.5rem;
      height: 3.5rem;
    }
  }

  &__info {
    min-width: 0;
  }

  &__title {
    font-size: $text-sm;
    font-weight: 700;
    color: var(--blue);
    font-family: $font-poppins;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    @include sm { font-size: $text-body; }
  }

  &__artist {
    font-size: $text-xs;
    color: var(--ditto-grey);
    font-family: $font-satoshi;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__type-badge {
    padding: 0.125rem 0.5rem;
    border-radius: $radius-button;
    background: var(--lighter-grey);
    font-size: $text-xs;
    font-weight: 600;
    font-family: $font-satoshi;
    color: var(--ditto-grey);
    white-space: nowrap;
  }

  &__progress {
    display: none;

    @include sm {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-shrink: 0;
    }
  }

  &__progress-text { text-align: right; }

  &__progress-num {
    font-size: $text-sm;
    font-weight: 600;
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
  }

  &__ring {
    transform: rotate(-90deg);
  }

  &__ring-fg {
    transition: stroke-dashoffset 0.5s ease;
  }

  &__select-btn {
    padding: 0.375rem 0.75rem;
    border: 1px solid rgba($color-brand-primary, 0.4);
    border-radius: $radius-button;
    font-size: $text-xs;
    font-weight: 500;
    font-family: $font-satoshi;
    color: var(--brand-primary);
    transition: border-color 0.15s, background 0.15s;

    &:hover {
      border-color: var(--brand-primary);
      background: rgba($color-brand-primary, 0.05);
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
