<script lang="ts">
  import { onMount } from 'svelte';
  import { registerSync } from '$lib/api/sync';
  import { formatDate } from '$lib/date';
  import { addExpense } from '$lib/expense';
  import { initializeOnlineChecker } from '$lib/online-checker';

  let date: string = formatDate(new Date());
  let name: string = '';
  let price: string = '';
  let description: string = '';

  function handleRecordClick() {
    const priceNum = parseFloat(price);

    const expense = { name, price: priceNum, description, date };

    addExpense(expense, () => {
      name = '';
      price = '';
      description = '';
    });
  }

  onMount(() => {
    registerSync();
    initializeOnlineChecker();
  });
</script>

<svelte:head>
  <title>Expense Tracker</title>
  <meta name="description" content="Track your expense" />
</svelte:head>

<input type="date" bind:value={date} placeholder="select date" />
<input type="number" bind:value={price} placeholder="0.00" min="0" step=".01" />
<input type="text" bind:value={name} placeholder="name" />
<input type="text" bind:value={description} placeholder="description" />

<button on:click={handleRecordClick}>Record</button>

<style>
  input {
    height: 3rem;
    font-size: 2rem;
    text-align: center;
    margin-bottom: 1rem;
    border-radius: 0.3rem;
  }

  input[type='date'] {
    text-align: center;
  }

  input[type='date']::-webkit-date-and-time-value {
    text-align: center;
  }

  button {
    height: 3rem;
    font-size: 2rem;
    border-radius: 0.3rem;
  }
</style>
