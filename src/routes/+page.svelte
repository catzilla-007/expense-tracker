<script lang="ts">
  import { onMount } from 'svelte';
  import { requestSyncExpense, initializeDbConnect, swBroadcast } from '$lib/api/broadcast';
  import { initializeOnlineChecker } from '$lib/online-checker';
  import ExpenseForm from '$lib/components/ExpenseForm.svelte';

  onMount(() => {
    initializeOnlineChecker();
    initializeDbConnect();
    setTimeout(requestSyncExpense, 3000);

    return () => {
      swBroadcast.close();
    };
  });
</script>

<svelte:head>
  <title>Expense Tracker</title>
  <meta name="description" content="Track your expense" />
</svelte:head>

<ExpenseForm />
