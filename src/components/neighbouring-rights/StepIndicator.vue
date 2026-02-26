<template>
  <div class="si">
    <button
      class="si__step"
      :class="{
        'si__step--active': currentStep === 'pick-release',
        'si__step--completed': currentStep === 'register-tracks'
      }"
      @click="$emit('goToStep', 'pick-release')"
    >
      <span class="si__number" :class="{ 'si__number--completed': currentStep === 'register-tracks' }">
        <template v-if="currentStep === 'register-tracks'">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </template>
        <template v-else>1</template>
      </span>
      <span class="si__label" :class="{ 'si__label--active': currentStep === 'pick-release' }">Pick a Release</span>
    </button>

    <button
      class="si__step"
      :class="{ 'si__step--active': currentStep === 'register-tracks' }"
      :disabled="currentStep === 'pick-release'"
    >
      <span class="si__number" :class="{ 'si__number--active': currentStep === 'register-tracks' }">2</span>
      <span class="si__label" :class="{ 'si__label--active': currentStep === 'register-tracks' }">Register Tracks</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { WizardStep } from '../../types'

defineProps<{
  currentStep: WizardStep
}>()

defineEmits<{
  goToStep: [step: WizardStep]
}>()
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.si {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;

  &__step {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    cursor: pointer;

    &--completed { cursor: pointer; }

    &:disabled {
      cursor: default;
      opacity: 0.6;
    }
  }

  &__number {
    width: 2rem;
    height: 2rem;
    border-radius: 9999px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: $text-sm;
    font-weight: 600;
    font-family: $font-satoshi;
    border: 2px solid var(--faded-grey);
    color: var(--ditto-grey);
    transition: all 0.2s;

    &--active {
      background: var(--brand-primary);
      border-color: var(--brand-primary);
      color: #fff;
    }

    &--completed {
      background: #fff;
      border-color: var(--ditto-grey);
      color: var(--ditto-grey);
    }
  }

  &__label {
    font-size: $text-sm;
    font-weight: 500;
    font-family: $font-satoshi;
    color: var(--ditto-grey);
    transition: color 0.15s;

    &--active {
      color: var(--blue);
      font-weight: 600;
    }
  }
}
</style>
