<script>
  import { isOnline } from '$lib/store/is-online';
  import OnlineIcon from './OnlineIcon.svelte';
  import ExpenseCounter from './ExpenseCounter.svelte';
</script>

<header>
  <span class="header-left">
    <OnlineIcon online={$isOnline} />
    {$isOnline ? 'Online' : 'Offline'}
  </span>
  <span class="header-center">Expense Tracker</span>
  <span class="header-right"><ExpenseCounter /></span>
</header>

<style>
  header {
    display: flex;
    flex-direction: row;
    height: 3rem;
    background-color: var(--color-surface);
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
    align-items: flex-end;
  }
</style>
