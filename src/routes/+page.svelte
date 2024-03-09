<script>
	let defaultDate = new Date();

	// TODO: make manifest.json for top level


	console.log(defaultDate.toLocaleDateString());
</script>

<svelte:head>
	<title>Expense Tracker</title>
	<meta name="description" content="Track your expense" />
</svelte:head>

<div>
	<input type="date" value={defaultDate} placeholder="select date"/>
	<input type="number" placeholder="set price" />
	<input type="text" placeholder="description" />

	<button>Record</button>
</div>

<style>

	input {
		width: 100%;
	}

	button {
		width: 100%;
	}
</style>
