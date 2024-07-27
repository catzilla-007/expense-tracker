<script>
  import { logs } from '$lib/store/logs';
  import { onMount } from 'svelte';

  onMount(() => {
    const bc = new BroadcastChannel('sw-logger');

    bc.onmessage = (event) => {
      logs.update((l) => [...l, event.data]);

      return () => {
        bc.close();
      };
    };
  });
</script>

<footer>
  <pre>
    {#each $logs as log}
      <div>{log}</div>
    {/each}
</pre>
</footer>

<style>
  footer {
    text-align: left;
    color: var(--color-text-log);
    height: 10em;
    font-size: 0.8rem;
    overflow-y: scroll;
  }

  pre {
    white-space: normal;
  }
</style>
