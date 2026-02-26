<template>
  <button
    class="sc"
    :class="{ 'sc--selected': isSelected }"
    @click="$emit('toggle')"
  >
    <img :src="society.logo" :alt="society.name" class="sc__logo" />
    <div class="sc__info">
      <span class="sc__name">{{ society.name }}</span>
      <a :href="society.infoUrl" class="sc__link" target="_blank" @click.stop>More info</a>
    </div>
    <div class="sc__check" :class="{ 'sc__check--active': isSelected }">
      <svg v-if="isSelected" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M4 8L7 11L12 5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
  </button>
</template>

<script setup lang="ts">
import type { Society } from '../../types'

defineProps<{
  society: Society
  isSelected: boolean
}>()

defineEmits<{
  toggle: []
}>()
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.sc {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--faded-grey);
  border-radius: $radius-lg;
  background: #fff;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
  text-align: left;

  &:hover { border-color: var(--brand-primary); }

  &--selected {
    border-color: var(--brand-primary);
    background: rgba($color-brand-primary, 0.02);
  }

  &__logo {
    width: 2rem;
    height: 2rem;
    border-radius: 0.375rem;
    object-fit: contain;
    flex-shrink: 0;
  }

  &__info {
    flex: 1;
    min-width: 0;
  }

  &__name {
    display: block;
    font-family: $font-satoshi;
    font-size: $text-xs;
    font-weight: 600;
    color: var(--blue);
    line-height: 1.3;
  }

  &__link {
    font-family: $font-satoshi;
    font-size: 0.6875rem;
    color: var(--brand-primary);
    text-decoration: none;

    &:hover { text-decoration: underline; }
  }

  &__check {
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 9999px;
    border: 1.5px solid var(--faded-grey);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.15s;

    &--active {
      background: var(--brand-primary);
      border-color: var(--brand-primary);
    }
  }
}
</style>
