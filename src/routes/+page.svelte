<script lang="ts">
  import { onMount } from 'svelte';
  import { requestSyncExpense, initializeDbConnect } from '#lib/api/broadcast.ts';
  import { initializeOnlineChecker } from '#lib/online-checker.ts';
  import ExpenseForm from '#lib/components/ExpenseForm.svelte';

  onMount(() => {
    const stopOnlineChecker = initializeOnlineChecker();
    initializeDbConnect();
    const syncTimeout = setTimeout(requestSyncExpense, 3000);

    return () => {
      clearTimeout(syncTimeout);
      stopOnlineChecker();
    };
  });
</script>

<ExpenseForm />
