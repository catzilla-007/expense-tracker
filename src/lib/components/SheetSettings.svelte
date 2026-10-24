<script lang="ts">
  import { onMount } from 'svelte';
  import settingsIcon from '#lib/images/settings.svg';
  import { settingsDialogOpen } from '#lib/store/settings-dialog.ts';
  import Footer from './Footer.svelte';
  import { workerRequest } from '#lib/api/broadcast.ts';
  import { sheetSettings, settingsLoaded } from '#lib/store/sheet-settings.ts';
  import { normalizeSheetUrl } from '#lib/sheet-url.js';

  let dialog: HTMLDialogElement;
  let returnFocus: HTMLElement | null = null;
  let url = $state('');
  let busy = $state(false);
  let error = $state('');
  let notice = $state('');
  let edited = false;
  const blocked = $derived(
    $sheetSettings.syncing || (Boolean($sheetSettings.url) && $sheetSettings.count > 0)
  );

  $effect(() => {
    if ($settingsDialogOpen && dialog && !dialog.open) void open();
  });

  function close() {
    settingsDialogOpen.set(false);
    returnFocus?.focus();
  }

  onMount(() => {
    const channel = new BroadcastChannel('sheet-settings');
    channel.onmessage = ({ data }) => {
      sheetSettings.set(data);
      settingsLoaded.set(true);
    };
    void workerRequest('get-settings')
      .then(() => settingsLoaded.set(true))
      .catch((cause: Error) => {
        error = cause.message;
        sheetSettings.update((state) => ({ ...state, error: cause.message }));
      });
    return () => channel.close();
  });

  async function open() {
    error = '';
    notice = '';
    url = $sheetSettings.url;
    edited = false;
    returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog.showModal();
    busy = true;
    try {
      const current = await workerRequest('get-settings');
      if (!edited) url = current.url;
      settingsLoaded.set(true);
    } catch (cause) {
      error = cause instanceof Error ? cause.message : 'Unable to load settings.';
    } finally {
      busy = false;
    }
  }

  async function save(value: string) {
    error = '';
    notice = '';
    busy = true;
    try {
      const normalized = normalizeSheetUrl(value);
      await workerRequest('save-settings', { url: normalized });
      url = normalized;
      notice = normalized ? 'Connection saved on this device.' : 'Connection cleared.';
    } catch (cause) {
      error = cause instanceof Error ? cause.message : 'Unable to save settings.';
    } finally {
      busy = false;
    }
  }

  async function sync() {
    busy = true;
    error = '';
    notice = '';
    try {
      await workerRequest('sync-expense');
    } catch (cause) {
      error = cause instanceof Error ? cause.message : 'Unable to sync.';
    } finally {
      busy = false;
    }
  }
</script>

<button
  class="gear"
  type="button"
  aria-label="Settings"
  onclick={() => settingsDialogOpen.set(true)}
>
  <span class="settings-icon" style:mask-image={`url("${settingsIcon}")`} aria-hidden="true"></span>
</button>

<dialog bind:this={dialog} aria-labelledby="settings-title" onclose={close}>
  <form
    onsubmit={(event) => {
      event.preventDefault();
      if (!busy && !blocked && $settingsLoaded) void save(url);
    }}
  >
    <div class="sheet-heading">
      <h2 id="settings-title">Google Sheets</h2>
      <button type="button" onclick={() => dialog.close()}>Close</button>
    </div>
    <p>Paste your deployed Google Apps Script web app URL, not the spreadsheet link.</p>
    <p>
      <a
        href="https://developers.google.com/apps-script/guides/web"
        target="_blank"
        rel="noreferrer">How to deploy an Apps Script web app</a
      >
    </p>
    <label for="sheet-url">Apps Script URL</label>
    <input
      id="sheet-url"
      type="url"
      autocomplete="off"
      spellcheck="false"
      bind:value={url}
      placeholder="https://script.google.com/macros/s/…/exec"
      oninput={() => (edited = true)}
      aria-describedby="settings-help"
    />
    <p id="settings-help">
      Use the deployed /exec URL without query parameters. Saving checks the URL format; it does not
      verify a spreadsheet write. This connection is saved only in this browser/device.
    </p>
    {#if !$sheetSettings.url && $sheetSettings.count > 0}
      <p>{$sheetSettings.count} pending expenses will sync to this connection after you save.</p>
    {/if}
    {#if blocked}
      <p>Sync pending expenses before changing or clearing the connection.</p>
    {/if}
    <p>Pending expenses: {$sheetSettings.count}{$sheetSettings.syncing ? ' · Syncing…' : ''}</p>
    {#if error || $sheetSettings.error}<p role="alert">{error || $sheetSettings.error}</p>{/if}
    {#if notice}<p role="status">{notice}</p>{/if}
    <button
      class="primary save-connection"
      type="submit"
      disabled={busy || blocked || !$settingsLoaded || !url.trim()}>Save connection</button
    >
    <div class="secondary-actions">
      <button
        type="button"
        onclick={sync}
        disabled={busy || $sheetSettings.syncing || !$sheetSettings.url}>Sync now</button
      >
    </div>
    <div class="clear-connection">
      <button
        type="button"
        onclick={() => save('')}
        disabled={busy || blocked || !$sheetSettings.url}>Clear connection</button
      >
    </div>
    <details>
      <summary>Diagnostics</summary>
      <Footer />
    </details>
  </form>
</dialog>

<style>
  .gear {
    display: grid;
    place-items: center;
    padding: 0;
  }
  .settings-icon {
    width: 24px;
    height: 24px;
    background: currentColor;
    mask-size: contain;
    mask-position: center;
    mask-repeat: no-repeat;
  }
  dialog {
    width: min(34rem, calc(100% - 2rem));
    max-height: calc(100dvh - 2rem);
    overflow: auto;
    border: 1px solid var(--color-border);
    border-radius: 1rem;
    background: var(--color-surface);
    color: var(--color-text);
    padding: 1.5rem;
  }
  dialog::backdrop {
    background: rgb(0 0 0 / 70%);
  }
  .sheet-heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  h2 {
    margin: 0;
    font-size: 1.25rem;
  }
  p {
    color: var(--color-text-muted);
  }
  p[role='alert'] {
    color: var(--color-error);
  }
  p[role='status'] {
    color: var(--color-success);
  }
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }
  .save-connection {
    width: 100%;
  }
  .secondary-actions {
    margin-top: 0.75rem;
  }
  .clear-connection {
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid var(--color-border);
  }
  .clear-connection button {
    color: var(--color-error);
  }
  details {
    margin-top: 1.5rem;
  }
  summary {
    min-height: 44px;
    padding: 0.65rem 0;
    cursor: pointer;
    color: var(--color-text-muted);
  }
  @media (max-width: 600px) {
    dialog {
      width: 100%;
      max-width: 100%;
      max-height: calc(100dvh - env(safe-area-inset-top) - 1rem);
      margin: auto 0 0;
      padding: 1.25rem 1rem calc(1.25rem + env(safe-area-inset-bottom));
      border-radius: 1.25rem 1.25rem 0 0;
    }
  }
</style>
