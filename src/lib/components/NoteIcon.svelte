<script lang="ts">
  import noteIcon from '#lib/images/notes.svg';
  let { count = 0 }: { count?: number } = $props();
</script>

<span>
  {#if count > 0}
    <span class="count">{count}</span>
  {/if}
  <img src={noteIcon} alt="expenses" />
</span>

<style>
  img {
    margin-right: 0.5em;
  }

  .count {
    z-index: 2;
    position: relative;
    padding: 1px 3px 1px 3px;
    bottom: 15px;
    left: 40px;
    background-color: red;
    border-radius: 50%;
    color: white;
  }
</style>
