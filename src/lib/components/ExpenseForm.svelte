<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { formatDate } from '#lib/date.ts';
  import { addExpense } from '#lib/expense.ts';
  import { sheetSettings, settingsLoaded } from '#lib/store/sheet-settings.ts';
  import { settingsDialogOpen } from '#lib/store/settings-dialog.ts';
  import Card from './Card.svelte';

  let date = $state(formatDate(new Date()));
  onMount(() => {
    date = formatDate(new Date());
  });
  let name = $state('');
  let price = $state<number | undefined>(undefined);
  let description = $state('');
  let saving = $state(false);
  let error = $state('');
  let notice = $state('');
  let submitted = $state(false);
  const amountError = $derived(
    submitted && (price === undefined || !Number.isFinite(price) || price < 0)
      ? 'Enter an amount of zero or more.'
      : submitted &&
          price !== undefined &&
          Math.abs(price * 100 - Math.round(price * 100)) > 0.000001
        ? 'Use no more than two decimal places.'
        : ''
  );
  const nameError = $derived(submitted && !name.trim() ? 'Enter an expense name.' : '');
  const dateError = $derived(submitted && !date ? 'Choose a date.' : '');

  async function saveExpense(event: SubmitEvent) {
    event.preventDefault();
    if (saving) return;
    submitted = true;
    notice = '';
    error = '';
    if (amountError || nameError || dateError || price === undefined) {
      const form = event.currentTarget as HTMLFormElement;
      await tick();
      form.querySelector<HTMLInputElement>('[aria-invalid="true"]')?.focus();
      return;
    }
    const expense = { name: name.trim(), price, description: description.trim(), date };
    saving = true;
    try {
      await addExpense(expense);
      notice = `${expense.name} saved on this device.`;
      name = '';
      price = undefined;
      description = '';
      submitted = false;
    } catch (cause) {
      error = cause instanceof Error ? cause.message : 'Unable to save expense.';
    } finally {
      saving = false;
    }
  }
</script>

{#if $settingsLoaded && !$sheetSettings.url}
  <aside class="setup">
    <p>Expenses stay on this device until you connect your spreadsheet.</p>
    <button type="button" onclick={() => settingsDialogOpen.set(true)}>Connect Google Sheets</button
    >
  </aside>
{/if}
<Card>
  <h1>New expense</h1>
  <form onsubmit={saveExpense} novalidate aria-busy={saving}>
    <div class="field">
      <label for="amount">Amount <span class="currency-name">PHP</span></label>
      <div class="amount-wrap">
        <span aria-hidden="true">₱</span>
        <input
          id="amount"
          class="amount"
          type="number"
          inputmode="decimal"
          bind:value={price}
          disabled={saving}
          placeholder="0.00"
          min="0"
          step="0.01"
          required
          aria-invalid={Boolean(amountError)}
          aria-describedby={amountError ? 'amount-error' : undefined}
        />
      </div>
      {#if amountError}<p id="amount-error" class="field-error">{amountError}</p>{/if}
    </div>
    <div class="field">
      <label for="expense-name">Expense name</label>
      <input
        id="expense-name"
        type="text"
        bind:value={name}
        disabled={saving}
        placeholder="e.g. Lunch"
        required
        aria-invalid={Boolean(nameError)}
        aria-describedby={nameError ? 'name-error' : undefined}
      />
      {#if nameError}<p id="name-error" class="field-error">{nameError}</p>{/if}
    </div>
    <div class="field">
      <label for="expense-date">Date</label>
      <input
        id="expense-date"
        type="date"
        bind:value={date}
        disabled={saving}
        required
        aria-invalid={Boolean(dateError)}
        aria-describedby={dateError ? 'date-error' : undefined}
      />
      {#if dateError}<p id="date-error" class="field-error">{dateError}</p>{/if}
    </div>
    <div class="field">
      <label for="expense-notes">Notes <span class="optional">(optional)</span></label>
      <input
        id="expense-notes"
        type="text"
        bind:value={description}
        disabled={saving}
        placeholder="Add any details"
      />
    </div>
    {#if error}<p role="alert" class="field-error">{error}</p>{/if}
    <p class="confirmation" role="status" aria-atomic="true">{notice}</p>
    <button class="primary save" type="submit" disabled={saving}>
      {saving ? 'Saving…' : 'Save expense'}
    </button>
  </form>
</Card>

<style>
  h1 {
    margin: 0 0 1.5rem;
    font-size: 1.3rem;
  }
  .field {
    margin-bottom: 1.25rem;
  }
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }
  .optional,
  .currency-name {
    color: var(--color-text-muted);
    font-weight: 400;
  }
  .currency-name {
    float: right;
    font-size: 0.875rem;
  }
  .amount-wrap {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding-left: 1rem;
    border: 1px solid var(--color-border);
    border-radius: 0.75rem;
    background: var(--color-bg-1);
  }
  .amount-wrap > span {
    font-size: 1.75rem;
    color: var(--color-text-muted);
  }
  .amount {
    min-width: 0;
    border: 0;
    font-size: 2.5rem;
    font-weight: 600;
    background: transparent;
  }
  .amount::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  .save {
    width: 100%;
    min-height: 52px;
  }
  .confirmation {
    color: var(--color-success);
    margin: 0;
  }
  .confirmation:not(:empty) {
    margin-bottom: 1rem;
  }
  .setup {
    padding: 1rem;
    margin-bottom: 1rem;
    border: 1px solid var(--color-border);
    border-radius: 0.75rem;
    background: var(--color-surface);
  }
  .setup p {
    margin: 0 0 0.75rem;
    color: var(--color-text-muted);
  }
</style>
