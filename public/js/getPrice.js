const getPrice = {
	tl: async function () {
		const response = await fetch('https://api.frankfurter.app/latest?from=TRY&to=EUR');
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		const data = await response.json();
		return data;
	},
	irr: async function () {
		const response = await fetch('https://api.exchangerate.host/convert?from=IRR&to=EUR');
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}
		const data = await response.json();
		return data;
	},
}

export default getPrice;