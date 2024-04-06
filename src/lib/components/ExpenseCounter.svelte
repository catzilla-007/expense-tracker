<script lang="ts">
  import { onMount } from 'svelte';
  import NoteIcon from './NoteIcon.svelte';
  import { getExpenseCount } from '$lib/api/idb';
  // make all the logic parts here
  // get the number of caches in indexdb

  let count: number;
  onMount(async () => {
    count = await getExpenseCount();
  });
</script>

<NoteIcon {count} />
