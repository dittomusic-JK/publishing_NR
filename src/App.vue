<template>
  <div class="app">
    <nav class="app__nav">
      <div class="app__nav-inner">
        <a href="#" class="app__logo">
          <svg width="80" height="24" viewBox="0 0 80 24" fill="none">
            <text x="0" y="20" font-family="Poppins, sans-serif" font-weight="700" font-size="20" fill="#111">DITTO</text>
          </svg>
        </a>
        <div class="app__links">
          <a href="#" class="app__link">Artists</a>
          <a href="#" class="app__link">Music</a>
          <a href="#" class="app__link">Videos</a>
          <a href="#" class="app__link">Royalties</a>
          <a href="#" class="app__link">Analytics</a>
          <a href="#" class="app__link">Promotion</a>
          <a href="#" class="app__link app__link--active">Publishing</a>
        </div>
      </div>
    </nav>
    <div class="app__subnav">
      <div class="app__subnav-inner">
        <a href="#" class="app__sublink">Overview</a>
        <a href="#" class="app__sublink">My Works</a>
        <a href="#" class="app__sublink">Sync Opportunities</a>
        <a href="#" class="app__sublink">Co-writers</a>
        <a href="#" class="app__sublink app__sublink--active">Neighbouring Rights</a>
      </div>
    </div>
    <main class="app__main">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
@use '@/styles/variables' as *;
@use '@/styles/mixins' as *;

.app {
  min-height: 100vh;
  background: #fff;

  &__nav {
    background: #fff;
    border-bottom: 1px solid var(--faded-grey);
    padding: 0 2rem;
  }

  &__nav-inner {
    max-width: 72rem;
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: 2rem;
    height: 3.5rem;
  }

  &__logo {
    flex-shrink: 0;
  }

  &__links {
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  &__link {
    padding: 0.5rem 0.75rem;
    font-size: $text-sm;
    font-weight: 500;
    font-family: $font-satoshi;
    color: var(--blue);
    text-decoration: none;
    transition: color 0.15s;

    &:hover { color: var(--brand-primary); }

    &--active {
      color: var(--brand-primary);
      border-bottom: 2px solid var(--brand-primary);
      padding-bottom: calc(0.5rem - 2px);
    }
  }

  &__subnav {
    background: #fff;
    border-bottom: 1px solid var(--faded-grey);
    padding: 0 2rem;
  }

  &__subnav-inner {
    max-width: 72rem;
    margin: 0 auto;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    height: 3rem;
  }

  &__sublink {
    padding: 0.375rem 0.75rem;
    font-size: $text-sm;
    font-weight: 500;
    font-family: $font-satoshi;
    color: var(--ditto-grey);
    text-decoration: none;
    transition: color 0.15s;

    &:hover { color: var(--blue); }

    &--active {
      color: var(--blue);
      font-weight: 600;
    }
  }

  &__main {
    max-width: 72rem;
    margin: 0 auto;
    padding: 2rem;
  }
}
</style>
