<script lang="ts">
  import { formatDate } from '$lib/date';
  import { addExpense } from '$lib/expense';
  import Card from './Card.svelte';

  let date: string = formatDate(new Date());
  let name: string = '';
  let price: string = '';
  let description: string = '';

  $: disabled = name.length === 0 || price.length === 0;

  function handleRecordClick() {
    const priceNum = parseFloat(price);

    const expense = { name, price: priceNum, description, date };

    addExpense(expense, () => {
      name = '';
      price = '';
      description = '';
    });
  }
</script>

<Card>
  <input type="date" bind:value={date} placeholder="select date" />
  <input type="number" bind:value={price} placeholder="0.00" min="0" step=".01" />
  <input type="text" bind:value={name} placeholder="name" />
  <input type="text" bind:value={description} placeholder="description" />

  <button on:click={handleRecordClick} {disabled}>Record</button>
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
