<template>
  <div class="pf">
    <h4 class="pf__title">Performers</h4>

    <!-- All performers (RB + added) -->
    <div v-for="(group, gi) in performerGroups" :key="gi" class="pf__section">
      <p v-if="group.label" class="pf__section-label">{{ group.label }}</p>
      <div
        v-for="performer in group.items"
        :key="performer.id"
        class="pf__row"
      >
        <div class="pf__name">
          <span v-if="performer.isFromRB || readonly" class="pf__name-text">{{ performer.name }}</span>
          <input
            v-else
            :value="performer.name"
            type="text"
            placeholder="Performer name"
            class="pf__input"
            @input="updateName(performer.id, ($event.target as HTMLInputElement).value)"
          />
        </div>
        <div class="pf__type">
          <button
            class="pf__type-pill"
            :class="{ 'pf__type-pill--active': performer.performerType === 'featured' }"
            :disabled="readonly"
            @click="!readonly && toggleType(performer.id, 'featured')"
          >Featured</button>
          <button
            class="pf__type-pill"
            :class="{ 'pf__type-pill--active': performer.performerType === 'non-featured' }"
            :disabled="readonly"
            @click="!readonly && toggleType(performer.id, 'non-featured')"
          >Non-Featured</button>
        </div>
        <div class="pf__role">
          <CustomDropdown
            v-if="!readonly"
            :model-value="performer.role"
            :options="[]"
            :groups="pplGroups"
            :searchable="true"
            placeholder="Select role"
            @update:model-value="(val) => updateRole(performer.id, val)"
          />
          <span v-else class="pf__role-text">{{ performer.role || '—' }}</span>
        </div>
        <button
          v-if="!performer.isFromRB && !readonly"
          class="pf__remove"
          @click="removePerformer(performer.id)"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Add button (only in edit mode) -->
    <button v-if="!readonly" class="pf__add" @click="addPerformer">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7" fill="var(--brand-primary)"/>
        <path d="M8 5V11M5 8H11" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      Add performer
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, withDefaults } from 'vue'
import type { Performer, PerformerType } from '../../types'
import { PPL_PERFORMER_ROLES } from '../../types'
import CustomDropdown from './CustomDropdown.vue'

const props = withDefaults(defineProps<{
  performers: Performer[]
  readonly?: boolean
}>(), {
  readonly: false,
})

const emit = defineEmits<{
  update: [performers: Performer[]]
}>()

// Map PPL role groups for the dropdown
const pplGroups = PPL_PERFORMER_ROLES.map(g => ({
  label: g.label,
  options: g.roles,
}))

const rbPerformers = computed(() => props.performers.filter(p => p.isFromRB))
const addedPerformers = computed(() => props.performers.filter(p => !p.isFromRB))

// Group performers for display
const performerGroups = computed(() => {
  const groups: { label: string; items: Performer[] }[] = []
  if (rbPerformers.value.length > 0) {
    groups.push({ label: 'From your release', items: rbPerformers.value })
  }
  if (addedPerformers.value.length > 0) {
    groups.push({ label: rbPerformers.value.length > 0 ? 'Added' : '', items: addedPerformers.value })
  }
  // If no performers at all (shouldn't happen but just in case)
  if (groups.length === 0 && props.performers.length > 0) {
    groups.push({ label: '', items: props.performers })
  }
  return groups
})

const emitUpdate = (updated: Performer[]) => {
  emit('update', updated)
}

const toggleType = (id: string, type: PerformerType) => {
  const updated = props.performers.map(p =>
    p.id === id ? { ...p, performerType: type } : p
  )
  emitUpdate(updated)
}

const updateRole = (id: string, role: string) => {
  const updated = props.performers.map(p =>
    p.id === id ? { ...p, role } : p
  )
  emitUpdate(updated)
}

const updateName = (id: string, name: string) => {
  const updated = props.performers.map(p =>
    p.id === id ? { ...p, name } : p
  )
  emitUpdate(updated)
}

const addPerformer = () => {
  const newPerformer: Performer = {
    id: `p${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    name: '',
    performerType: 'non-featured',
    role: '',
    isFromRB: false,
  }
  emitUpdate([...props.performers, newPerformer])
}

const removePerformer = (id: string) => {
  emitUpdate(props.performers.filter(p => p.id !== id))
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.pf {
  &__title {
    font-family: $font-poppins;
    font-size: $text-h4;
    font-weight: 700;
    color: var(--blue);
    margin-bottom: 1rem;
  }

  &__section {
    margin-bottom: 1rem;
  }

  &__section-label {
    font-family: $font-satoshi;
    font-size: $text-xs;
    font-weight: 600;
    color: var(--ditto-grey);
    margin-bottom: 0.5rem;
  }

  &__row {
    display: grid;
    grid-template-columns: 1fr auto 1fr auto;
    gap: 0.75rem;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--faded-grey);

    &:last-child { border-bottom: 0; }

    @media (max-width: #{$breakpoint-sm - 1px}) {
      grid-template-columns: 1fr;
      gap: 0.5rem;
    }
  }

  &__name-text {
    font-family: $font-satoshi;
    font-size: $text-sm;
    font-weight: 500;
    color: var(--blue);
  }

  &__input {
    width: 100%;
    font-family: $font-satoshi;
    font-size: $text-sm;
    color: var(--blue);
    border: none;
    border-bottom: 1px solid var(--faded-grey);
    padding-bottom: 0.25rem;
    background: transparent;

    &::placeholder { color: var(--brand-inactive); }
    &:focus {
      outline: none;
      border-color: var(--brand-primary);
    }
  }

  &__type {
    display: flex;
    gap: 0.25rem;
  }

  &__type-pill {
    padding: 0.25rem 0.625rem;
    border: 1px solid var(--faded-grey);
    border-radius: $radius-button;
    font-size: $text-xs;
    font-weight: 500;
    font-family: $font-satoshi;
    color: var(--ditto-grey);
    background: #fff;
    cursor: pointer;
    transition: all 0.15s;

    &--active {
      border-color: var(--brand-primary);
      color: var(--brand-primary);
      background: rgba($color-brand-primary, 0.05);
    }

    &:disabled {
      cursor: default;
      opacity: 0.7;
    }
  }

  &__role {
    min-width: 10rem;
  }

  &__role-text {
    font-family: $font-satoshi;
    font-size: $text-sm;
    color: var(--ditto-grey);
  }

  &__remove {
    padding: 0.375rem;
    color: var(--error);
    transition: opacity 0.15s;

    &:hover { opacity: 0.7; }
  }

  &__add {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.75rem;
    font-family: $font-satoshi;
    font-size: $text-sm;
    font-weight: 500;
    color: var(--ditto-grey);
    cursor: pointer;
    padding: 0.5rem 1rem;
    border: 1px solid var(--faded-grey);
    border-radius: $radius-button;
    background: transparent;
    transition: border-color 0.15s, color 0.15s;

    &:hover {
      border-color: var(--brand-primary);
      color: var(--brand-primary);
    }
  }
}
</style>
