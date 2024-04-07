<script lang="ts">
  import { onMount } from 'svelte';
  import { initializeCacheSync } from '$lib/api/sync';
  import { initializeOnlineChecker } from '$lib/online-checker';
  import ExpenseForm from '$lib/components/ExpenseForm.svelte';

  onMount(() => {
    initializeOnlineChecker();

    const dbBc = new BroadcastChannel('db-connect');
    dbBc.postMessage('trigger');

    setTimeout(initializeCacheSync, 2000);

    return () => {
      dbBc.close();
    };
  });
</script>

<svelte:head>
  <title>Expense Tracker</title>
  <meta name="description" content="Track your expense" />
</svelte:head>

<ExpenseForm />
