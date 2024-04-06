<script lang="ts">
  import { onMount } from 'svelte';
  import NoteIcon from './NoteIcon.svelte';
  import { getExpenseCount } from '$lib/api/idb';

  let count: number;
  onMount(async (): Promise<any> => {
    count = await getExpenseCount();

    const bc = new BroadcastChannel('expense-count');

    bc.onmessage = async () => {
      count = await getExpenseCount();
    };

    return () => {
      bc.close();
    };
  });
</script>

<NoteIcon {count} />
