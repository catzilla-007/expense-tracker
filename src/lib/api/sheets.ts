export async function addExpense(
	name: string,
	price: number,
	description: string,
	date: string
): Promise<Response> {
	const url =
		'https://script.google.com/macros/s/AKfycbyIexJBnFFBoJD1EZHGpFS1BunDg2NZJrHDY3LovTcstwk4oahYMziwMzoO6rVf18fwsw/exec';

	const params = new URLSearchParams({
		name,
		price: `${price}`,
		description,
		date
	});

	return await fetch(url + '?' + params, {
		method: 'GET'
	});
}
