<script>
  import { logger } from '$lib/store/logger';

  async function getLog() {
    const response = await fetch('http://sw-log', { method: 'GET' });
    const swLogs = await response.json();
    logger.update((logs) => [...logs, ...swLogs]);
  }

  function clearLog() {
    logger.set([]);
  }
</script>

<footer>
  <button on:click={getLog}>get Log</button>
  <button on:click={clearLog}>Clear</button>
  <pre>
  {#each $logger as log}
      {log}<br />
    {/each}
</pre>
</footer>

<style>
  footer {
    text-align: left;
    border: 1px solid yellow;
    color: #d4d1d1;
    height: 10em;
    overflow-y: scroll;
  }
</style>
