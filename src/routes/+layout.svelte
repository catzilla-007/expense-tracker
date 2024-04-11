<script>
  import { page } from '$app/stores';
  import './styles.css';
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';

  console.log($page.route.id === '/install');
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
    min-height: 100vh;
  }

  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    width: 100%;
    margin: 0 auto;
    box-sizing: border-box;
  }
</style>
