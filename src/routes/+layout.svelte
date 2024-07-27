<script>
  import './styles.css';

  import { page } from '$app/stores';
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';
</script>

<div class="app">
  {#if $page.route.id !== '/install'}
    <Header />
  {/if}
  <main>
    <slot />
  </main>
  {#if $page.route.id !== '/install'}
    <Footer />
  {/if}
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
    padding: 1em;
    width: 100%;
    margin: 0 auto;
    box-sizing: border-box;
  }
</style>
