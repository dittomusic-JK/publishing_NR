<template>
  <div ref="dropdownRef" class="dropdown">
    <div
      @click="hasOptions ? (isOpen = !isOpen) : undefined"
      class="dropdown__trigger"
      :class="triggerModifier"
    >
      <span class="dropdown__value" :class="{ 'dropdown__value--placeholder': !modelValue }">
        {{ modelValue || placeholder }}
      </span>
      <div class="dropdown__indicators">
        <svg
          v-if="hasOptions"
          class="dropdown__chevron"
          :class="{ 'dropdown__chevron--rotated': isOpen }"
          width="12" height="12" viewBox="0 0 12 12" fill="none"
        >
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </div>
    <div v-if="isOpen" class="dropdown__menu">
      <div v-if="searchable" class="dropdown__search">
        <input
          ref="searchInputRef"
          v-model="searchQuery"
          type="text"
          placeholder="Search..."
          class="dropdown__search-input"
          @click.stop
        />
      </div>
      <div class="dropdown__list">
        <template v-if="filteredGroups && filteredGroups.length > 0">
          <div v-for="group in filteredGroups" :key="group.label" class="dropdown__group">
            <div class="dropdown__group-label">{{ group.label }}</div>
            <div
              v-for="option in group.options"
              :key="option"
              @click="selectOption(option)"
              class="dropdown__option"
              :class="{ 'dropdown__option--selected': option === modelValue }"
            >
              {{ option }}
            </div>
          </div>
        </template>
        <template v-else-if="!groups || groups.length === 0">
          <div
            v-for="option in filteredOptions"
            :key="option"
            @click="selectOption(option)"
            class="dropdown__option"
            :class="{ 'dropdown__option--selected': option === modelValue }"
          >
            {{ option }}
          </div>
        </template>
        <div v-if="searchQuery && filteredOptions.length === 0 && filteredGroups.length === 0" class="dropdown__empty">
          No results for "{{ searchQuery }}"
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'

export interface DropdownGroup {
  label: string
  options: string[]
}

const props = withDefaults(defineProps<{
  modelValue: string
  options: string[]
  placeholder?: string
  groups?: DropdownGroup[]
  searchable?: boolean
}>(), {
  placeholder: 'Select...',
  searchable: false,
})

const triggerModifier = computed(() => {
  if (isOpen.value) return 'dropdown__trigger--open'
  return ''
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const hasOptions = computed(() => props.options.length > 0 || (props.groups?.length ?? 0) > 0)

const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const searchInputRef = ref<HTMLInputElement | null>(null)
const searchQuery = ref('')

// Focus search input when opening
watch(isOpen, (val) => {
  if (val && props.searchable) {
    searchQuery.value = ''
    nextTick(() => searchInputRef.value?.focus())
  }
})

// Filter options by search query
const filteredOptions = computed(() => {
  if (!searchQuery.value) return props.options
  const q = searchQuery.value.toLowerCase()
  return props.options.filter(o => o.toLowerCase().includes(q))
})

// Filter groups by search query (hide empty groups)
const filteredGroups = computed(() => {
  if (!props.groups) return []
  if (!searchQuery.value) return props.groups
  const q = searchQuery.value.toLowerCase()
  return props.groups
    .map(g => ({ label: g.label, options: g.options.filter(o => o.toLowerCase().includes(q)) }))
    .filter(g => g.options.length > 0)
})

const selectOption = (option: string) => {
  emit('update:modelValue', option)
  isOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;

.dropdown {
  position: relative;

  &__trigger {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem;
    background: #fff;
    border-radius: $radius-lg;
    border: 1px solid var(--faded-grey);
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
      border-color: var(--brand-primary);
    }

    &--open {
      border-color: var(--brand-primary);
    }
  }

  &__value {
    font-size: $text-sm;
    font-family: $font-satoshi;
    color: var(--blue);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-right: 0.5rem;

    &--placeholder {
      color: var(--ditto-grey);
    }
  }

  &__indicators {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  &__chevron {
    color: var(--ditto-grey);
    transition: transform 0.2s ease;

    &--rotated {
      transform: rotate(180deg);
    }
  }

  &__menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 0.25rem;
    background: #fff;
    border-radius: $radius-lg;
    border: 1px solid var(--faded-grey);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
    z-index: 50;
    display: flex;
    flex-direction: column;
    max-height: 280px;
  }

  &__search {
    padding: 0.5rem 0.75rem;
    border-bottom: 1px solid var(--faded-grey);
    flex-shrink: 0;
  }

  &__search-input {
    width: 100%;
    font-size: $text-sm;
    font-family: $font-satoshi;
    color: var(--blue);
    border: none;
    background: transparent;
    outline: none;

    &::placeholder { color: var(--ditto-grey); }
  }

  &__list {
    overflow-y: auto;
    flex: 1;
  }

  &__empty {
    padding: 0.75rem;
    font-size: $text-xs;
    font-family: $font-satoshi;
    color: var(--ditto-grey);
    text-align: center;
  }

  &__group-label {
    padding: 0.5rem 0.75rem 0.25rem;
    font-size: $text-xs;
    font-family: $font-satoshi;
    color: var(--ditto-grey);
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  &__option {
    padding: 0.625rem 0.75rem;
    font-size: $text-sm;
    font-family: $font-satoshi;
    cursor: pointer;
    transition: background-color 0.1s ease, color 0.1s ease;
    color: var(--blue);

    &:hover {
      background: var(--lighter-grey);
    }

    &--selected {
      background: rgba($color-brand-primary, 0.1);
      color: var(--brand-primary);
    }
  }
}
</style>
