<script lang="ts">
  import { isOnline } from '#lib/store/is-online.ts';
  import { sheetSettings, settingsLoaded } from '#lib/store/sheet-settings.ts';
  import SheetSettings from './SheetSettings.svelte';

  const status = $derived(
    !$settingsLoaded && $sheetSettings.error
      ? 'Sync status unavailable · open Settings for details'
      : !$settingsLoaded
        ? 'Loading sync status…'
        : !$isOnline
          ? 'Offline · expenses saved on this device'
          : $sheetSettings.error
            ? 'Sync needs attention · expenses saved on this device'
            : !$sheetSettings.url
              ? 'Connect Google Sheets to sync expenses'
              : $sheetSettings.syncing
                ? 'Syncing expenses…'
                : $sheetSettings.count > 0
                  ? `${$sheetSettings.count} ${$sheetSettings.count === 1 ? 'expense' : 'expenses'} waiting to sync`
                  : 'All expenses synced'
  );
</script>

<header>
  <div class="toolbar">
    <span class="title">Expense Tracker</span>
    <SheetSettings />
  </div>
  <p class="sync-status" role="status">
    <span class="dot" class:offline={!$isOnline} aria-hidden="true"></span>
    {status}
  </p>
</header>

<style>
  header {
    width: 100%;
    max-width: 36rem;
    margin: 0 auto;
    padding: calc(0.75rem + env(safe-area-inset-top)) 1rem 0;
  }
  .toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }
  .title {
    font-size: 1.15rem;
    font-weight: 700;
  }
  .sync-status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0.5rem 0 0;
    color: var(--color-text-muted);
    font-size: 0.875rem;
  }
  .dot {
    width: 0.5rem;
    height: 0.5rem;
    flex-shrink: 0;
    border-radius: 50%;
    background: var(--color-text-primary);
  }
  .offline {
    background: var(--color-text-muted);
  }
</style>
