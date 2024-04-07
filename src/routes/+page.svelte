<script lang="ts">
  import { onMount } from 'svelte';
  import { initializeCacheSync } from '$lib/api/sync';
  import { initializeOnlineChecker } from '$lib/online-checker';
  import { initializeDb } from '$lib/api/idb';
  import ExpenseForm from '$lib/components/ExpenseForm.svelte';

  onMount(async () => {
    initializeOnlineChecker();
    await initializeDb();
    setTimeout(initializeCacheSync, 2000);
  });
</script>

<svelte:head>
  <title>Expense Tracker</title>
  <meta name="description" content="Track your expense" />
</svelte:head>

<ExpenseForm />
