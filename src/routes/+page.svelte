<script lang="ts">
	import { onMount } from "svelte";
	import { initializeDb, addExpense } from '$lib/db/indexDb';


	let date: string = formatDate(new Date());
	let name: string = '';
	let price: string = '';
	let description: string = '';

	// maybe put this in a utility file
	function formatDate(date: Date): string {
		const parsedDate: Array<string> = date.toLocaleDateString().split('/');
		return `${parsedDate[2]}-${parsedDate[0].padStart(2, '0')}-${parsedDate[1].padStart(2, '0')}`;
	}

	function handleRecordClick() {
		const priceNum = parseFloat(price);
		console.log({ date, priceNum, description, name });
		price = '';
		description = '';

		addExpense(name, priceNum, description, date);
	}

	onMount(() => {
		console.log('onmount');
		initializeDb();
	});

</script>

<svelte:head>
	<title>Expense Tracker</title>
	<meta name="description" content="Track your expense" />
</svelte:head>

<div class="main">
	<input type="date" bind:value={date} placeholder="select date"/>
	<input type="number" bind:value={price} placeholder="0.00" min="0" step=".01" />
	<input type="text" bind:value={name} placeholder="name" />
	<input type="text" bind:value={description} placeholder="description" />

	<button on:click={handleRecordClick} >Record</button>
</div>

<style>

	
</style>
