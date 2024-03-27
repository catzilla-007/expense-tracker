<script lang="ts">
	import { addExpense } from '$lib/api/sheets';

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

		addExpense(name, priceNum, description, sanitizeDateRequest(date))
			.then(() => {
				console.log('expense added');
			})
			.catch(() => {
				console.log('expense add failed');
			})
			.finally(() => {
				name = '';
				price = '';
				description = '';
			});

		// experimental

		if (!navigator.serviceWorker) return;

		console.log('navigator is ok');
		navigator.serviceWorker.ready.then((registration) => {
			console.log('no registration active');
			if (!registration.active) return;
			console.log('registration active is ok');
			registration.active.postMessage({ name: 'test' });
		});
	}
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
