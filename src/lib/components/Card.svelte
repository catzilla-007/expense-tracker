<script lang="ts">
  import type { Snippet } from 'svelte';
  let { children }: { children: Snippet } = $props();
</script>

<div>
  {@render children()}
</div>

<style>
  div {
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    padding: 1em;
    border-radius: 0.5em;
  }
</style>
