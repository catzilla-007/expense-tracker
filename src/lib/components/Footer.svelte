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
      {log}<br />
    {/each}
</pre>
</footer>

<style>
  footer {
    text-align: left;
    border-top: 1px solid yellow;
    color: #d4d1d1;
    height: 10em;
    overflow-y: scroll;
  }

  pre {
    white-space: normal;
  }
</style>
