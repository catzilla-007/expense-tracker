<script lang="ts">

	let date: string = formatDate(new Date());
	let price: string = '';
	let description: string = '';

	// maybe put this in a utility file
	function formatDate(date: Date): string {
		const parsedDate: Array<string> = date.toLocaleDateString().split('/');
		return `${parsedDate[2]}-${parsedDate[0].padStart(2, '0')}-${parsedDate[1].padStart(2, '0')}`;
	}

	function handleRecordClick() {
		// add the values to indexDB
		console.log({ date, price, description });
		date = formatDate(new Date());
		price = '';
		description = '';
	}

</script>

<svelte:head>
	<title>Expense Tracker</title>
	<meta name="description" content="Track your expense" />
</svelte:head>

<div>
	<input type="date" bind:value={date} placeholder="select date"/>
	<input type="number" bind:value={price} placeholder="0.00" min="0" step=".01" />
	<input type="text" bind:value={description} placeholder="description" />

	<button on:click={handleRecordClick} >Record</button>
</div>

<style>

	input {
		width: 100%;
		text-align: center;
	}

	button {
		width: 100%;
	}
</style>
