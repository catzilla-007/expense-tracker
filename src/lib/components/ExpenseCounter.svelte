<script lang="ts">
  import { onMount } from 'svelte';
  import NoteIcon from './NoteIcon.svelte';
  import { debug } from '$lib/debugger';

  let count: number;
  onMount(async (): Promise<any> => {
    count = 0;

    const bc = new BroadcastChannel('expense-count');

    bc.onmessage = (event) => {
      debug(event.data);
    };

    return () => {
      bc.close();
    };
  });
</script>

<NoteIcon {count} />
