<script>
  /* maybe make sure that the slots for left/center/right
     can be used outside the header component,
     need to use multiple <slot /> for this one
  */
  import { isOnline } from '$lib/store/is-online';
  import OnlineIcon from './OnlineIcon.svelte';
</script>

<header>
  <span class="header-left">
    <OnlineIcon online={$isOnline} />
    {$isOnline ? 'Online' : 'Offline'}
  </span>
  <span class="header-center">Expense Tracker</span>
  <span class="header-right">Expenses...</span>
</header>

<style>
  header {
    display: flex;
    flex-direction: row;
    height: 3rem;
    background-color: var(--color-bg-2);
    color: var(--color-text-2);
    font-size: 1.1em;
  }

  .header-left {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  .header-center {
    display: flex;
    flex-grow: 1;
    align-items: center;
    justify-content: center;
  }

  .header-right {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
</style>
