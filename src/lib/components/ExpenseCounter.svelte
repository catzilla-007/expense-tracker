<script lang="ts">
  import { onMount } from 'svelte';
  import NoteIcon from './NoteIcon.svelte';
  import { debug } from '#lib/debugger.ts';
  import { requestExpenseCount } from '#lib/api/broadcast.ts';

  let count = $state(0);
  onMount(() => {
    const bc = new BroadcastChannel('expense-count');
    requestExpenseCount();

    bc.onmessage = (event) => {
      debug(`expense count received ${event.data}`);
      count = event.data;
    };

    return () => {
      bc.close();
    };
  });
</script>

<NoteIcon {count} />
