<script lang="ts">
  import { formatDate } from '#lib/date.ts';
  import { addExpense } from '#lib/expense.ts';
  import Card from './Card.svelte';

  let date = $state(formatDate(new Date()));
  let name = $state('');
  let price = $state<number | null>(null);
  let description = $state('');

  const disabled = $derived(name.length === 0 || price === null);

  function handleRecordClick() {
    if (price === null) return;

    const expense = { name, price, description, date };

    addExpense(expense, () => {
      name = '';
      price = null;
      description = '';
    });
  }
</script>

<Card>
  <input type="date" bind:value={date} placeholder="select date" />
  <input type="number" bind:value={price} placeholder="0.00" min="0" step=".01" />
  <input type="text" bind:value={name} placeholder="name" />
  <input type="text" bind:value={description} placeholder="description" />

  <button onclick={handleRecordClick} {disabled}>Record</button>
</Card>

<style>
  input {
    height: 3rem;
    font-size: 1.5rem;
    text-align: center;
    margin-bottom: 1rem;
    border-radius: 0.3rem;
    border: none;
    background-color: var(--color-bg-1);
    color: var(--color-text);
    width: 100%;
  }

  ::placeholder {
    color: var(--color-text);
  }

  input[type='date'] {
    text-align: center;
  }

  input::-webkit-date-and-time-value {
    text-align: center;
  }

  input::-webkit-inner-spin-button {
    color: red;
  }

  input::-webkit-calendar-picker-indicator {
    display: none;
  }

  button {
    margin-top: 3rem;
    height: 3rem;
    font-size: 1.4rem;
    border-radius: 2rem;
    color: var(--color-text-primary);
    background-color: var(--color-bg-1);
    width: 100%;
  }

  button:disabled {
    background-color: var(--color-bg-disabled);
    color: var(--color-text-disabled);
  }
</style>
