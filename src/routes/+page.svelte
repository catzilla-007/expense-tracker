<script lang="ts">
  import { onMount } from 'svelte';
  import { registerSync } from '$lib/api/sync';

  let date: string = formatDate(new Date());
  let name: string = '';
  let price: string = '';
  let description: string = '';

  function formatDate(date: Date): string {
    const parsedDate: Array<string> = date.toLocaleDateString().split('/');
    return `${parsedDate[2]}-${parsedDate[0].padStart(2, '0')}-${parsedDate[1].padStart(2, '0')}`;
  }

  function sanitizeDateRequest(date: string) {
    const parsedDate: Array<string> = date.split('-');
    return `${parsedDate[1]}/${parsedDate[2]}/${parsedDate[0]}`;
  }

  function handleRecordClick() {
    const priceNum = parseFloat(price);

    if (!navigator.serviceWorker) return;

    navigator.serviceWorker.ready
      .then((registration) => {
        if (!registration.active) return;
        const payload = {
          name,
          price: priceNum,
          description,
          date: sanitizeDateRequest(date)
        };
        registration.active.postMessage(payload);
      })
      .catch((error) => {
        console.error('some error happened', error);
      })
      .finally(() => {
        name = '';
        price = '';
        description = '';
      });
  }

  onMount(() => {
    registerSync();
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
    height: 4rem;
    font-size: 2rem;
    text-align: center;
    margin-bottom: 1rem;
    border-radius: 1rem;
  }

  input[type='date'] {
    text-align: center;
  }

  input[type='date']::-webkit-date-and-time-value {
    text-align: center;
  }

  button {
    height: 4rem;
    font-size: 2rem;
    border-radius: 1rem;
  }
</style>
