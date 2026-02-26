<template>
  <div class="sr">
    <img :src="release.artwork" :alt="release.title" class="sr__artwork" />
    <div class="sr__info">
      <div class="sr__check">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="9" r="9" fill="#00e785"/>
          <path d="M5 9L8 12L13 6" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div>
        <h3 class="sr__title">{{ release.title }}</h3>
        <p class="sr__artist">
          Album by: <strong>{{ release.artist }}</strong>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Release } from '../../types'

defineProps<{
  release: Release
}>()
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.sr {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: var(--lighter-grey);
  border-radius: $radius-card;
  margin-bottom: 2rem;
  max-width: 24rem;

  @include sm {
    padding: 1rem;
    gap: 1rem;
  }

  &__artwork {
    width: 3.5rem;
    height: 3.5rem;
    border-radius: $radius-lg;
    object-fit: cover;
    flex-shrink: 0;

    @include sm {
      width: 4rem;
      height: 4rem;
    }
  }

  &__info {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
  }

  &__check {
    flex-shrink: 0;
    margin-top: 0.125rem;
  }

  &__title {
    font-family: $font-satoshi;
    font-size: $text-body;
    font-weight: 700;
    color: var(--blue);
    line-height: 1.3;
  }

  &__artist {
    font-family: $font-satoshi;
    font-size: $text-xs;
    color: var(--ditto-grey);

    strong {
      color: var(--brand-primary);
      font-weight: 700;
    }
  }
}
</style>
