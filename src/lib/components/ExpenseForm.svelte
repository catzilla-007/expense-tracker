<script lang="ts">
  import { formatDate } from '$lib/date';
  import { addExpense } from '$lib/expense';

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

<input type="date" bind:value={date} placeholder="select date" />
<input type="number" bind:value={price} placeholder="0.00" min="0" step=".01" />
<input type="text" bind:value={name} placeholder="name" />
<input type="text" bind:value={description} placeholder="description" />

<button on:click={handleRecordClick} {disabled}>Record</button>

<style>
  input {
    height: 3rem;
    font-size: 2rem;
    text-align: center;
    margin-bottom: 1rem;
    border-radius: 0.3rem;
    border: none;
    background-color: var(--color-bg-3);
    color: var(--color-text);
  }

  ::placeholder {
    color: var(--color-text);
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
    background-color: var(--color-bg-2);
    color: var(--color-text-2);
    border-color: light-dark(#94edfd67, #020e0d4d);
  }

  button:disabled {
    background-color: var(--color-bg-3);
    border-color: light-dark(#94edfd67, #020e0d4d);
  }

  button:active {
    background-color: #041b30;
  }
</style>
