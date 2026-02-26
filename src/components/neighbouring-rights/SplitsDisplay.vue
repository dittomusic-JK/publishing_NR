<template>
  <div class="sd">
    <h4 class="sd__title">Splits</h4>

    <!-- Share bar -->
    <div class="sd__bar">
      <div
        v-for="(entry, i) in splits"
        :key="i"
        class="sd__segment"
        :style="{ width: `${entry.share}%`, backgroundColor: segmentColors[i % segmentColors.length] }"
      />
    </div>

    <!-- Legend rows -->
    <div class="sd__legend">
      <div v-for="(entry, i) in splits" :key="i" class="sd__entry">
        <span class="sd__dot" :style="{ backgroundColor: segmentColors[i % segmentColors.length] }" />
        <span class="sd__name">{{ entry.name }}</span>
        <span class="sd__share">{{ entry.share }}%</span>
        <span class="sd__status" :class="`sd__status--${entry.status}`">{{ entry.status }}</span>
      </div>
    </div>

    <!-- Info note -->
    <p class="sd__note">
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" class="sd__note-icon">
        <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.5"/>
        <path d="M8 7V11M8 5.5V5.51" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      These splits mirror your sound recording splits and cannot be edited here.
    </p>
  </div>
</template>

<script setup lang="ts">
import type { SplitEntry } from '../../types'

defineProps<{
  splits: SplitEntry[]
}>()

const segmentColors = [
  '#7C3AED', // purple
  '#06B6D4', // cyan
  '#F59E0B', // amber
  '#10B981', // emerald
  '#EF4444', // red
  '#3B82F6', // blue
]
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.sd {
  &__title {
    font-family: $font-poppins;
    font-size: $text-h4;
    font-weight: 700;
    color: var(--blue);
    margin-bottom: 1rem;
  }

  &__bar {
    display: flex;
    height: 0.5rem;
    border-radius: $radius-button;
    overflow: hidden;
    background: var(--light-grey);
    margin-bottom: 0.75rem;
  }

  &__segment {
    height: 100%;
    transition: width 0.3s ease;

    &:first-child { border-radius: $radius-button 0 0 $radius-button; }
    &:last-child { border-radius: 0 $radius-button $radius-button 0; }
    &:only-child { border-radius: $radius-button; }
  }

  &__legend {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  &__entry {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    flex-shrink: 0;
  }

  &__name {
    font-family: $font-satoshi;
    font-size: $text-sm;
    font-weight: 500;
    color: var(--blue);
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__share {
    font-family: $font-satoshi;
    font-size: $text-sm;
    font-weight: 600;
    color: var(--blue);
    flex-shrink: 0;
  }

  &__status {
    font-family: $font-satoshi;
    font-size: $text-xs;
    font-weight: 500;
    text-transform: capitalize;
    flex-shrink: 0;

    &--active { color: var(--success); }
    &--pending { color: $color-amber-500; }
    &--rejected { color: var(--error); }
  }

  &__note {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    margin-top: 1rem;
    padding: 0.75rem;
    background: var(--lighter-grey);
    border-radius: $radius-lg;
    font-family: $font-satoshi;
    font-size: $text-xs;
    color: var(--ditto-grey);
    line-height: 1.4;
  }

  &__note-icon {
    flex-shrink: 0;
    margin-top: 0.0625rem;
  }
}
</style>
