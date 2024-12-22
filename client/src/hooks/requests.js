const API_URL = 'http://localhost:5000/v1';

async function httpGetPlanets() {
	const returnedPlanets = await fetch(`${API_URL}planets`);
	return await returnedPlanets.json();
}

async function httpGetLaunches() {
	const response = await fetch(`${API_URL}launches`);
	const fetchedLaunches = await response.json();
	return fetchedLaunches.sort((a, b) => a.flightNumber - b.flightNumber);
}

async function httpSubmitLaunch(launch) {
	try {
		const response = await fetch(`${API_URL}launches`, {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
		},
			body: JSON.stringify(launch),
		});
		return response;
	} catch (error) {
		console.error(error);
		return { ok: false };
	}
}

async function httpAbortLaunch(id) {
	try {
		const response = await fetch(`${API_URL}launches/${id}`, {
			method: 'delete',
		});
		return response;
	} catch (error) {
		console.error(error);
		return { ok: false };
	}
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
