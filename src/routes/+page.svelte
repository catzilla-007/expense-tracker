<script lang="ts">
  import { onMount } from 'svelte';
  import { requestSyncExpense } from '#lib/api/broadcast.ts';
  import { initializeOnlineChecker } from '#lib/online-checker.ts';
  import ExpenseForm from '#lib/components/ExpenseForm.svelte';

  onMount(() => {
    const stopOnlineChecker = initializeOnlineChecker();
    requestSyncExpense();

    return () => {
      stopOnlineChecker();
    };
  });
</script>

<ExpenseForm />
