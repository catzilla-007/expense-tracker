<script lang="ts">
  import './styles.css';

  import { page } from '$app/state';
  import type { Snippet } from 'svelte';
  import Header from '#lib/components/Header.svelte';

  let { children }: { children: Snippet } = $props();
</script>

<div class="app">
  {#if page.route.id !== '/install'}
    <Header />
  {/if}
  <main>
    {@render children()}
  </main>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    min-height: 100svh;
  }

  main {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    padding: 1rem 1rem calc(1.5rem + env(safe-area-inset-bottom));
    max-width: 36rem;
    width: 100%;
    margin: 0 auto;
    box-sizing: border-box;
  }
</style>
