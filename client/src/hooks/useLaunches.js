import { useCallback, useEffect, useState } from 'react';

import { httpGetLaunches, httpSubmitLaunch, httpAbortLaunch } from './requests';

function useLaunches(onSuccessSound, onAbortSound, onFailureSound) {
	const [launches, saveLaunches] = useState([]);
	const [isPendingLaunch, setPendingLaunch] = useState(false);

	const getLaunches = useCallback(async () => {
		const fetchedLaunches = await httpGetLaunches();
		saveLaunches(fetchedLaunches);
	}, []);

	useEffect(() => {
		getLaunches();
	}, [getLaunches]);

	const submitLaunch = useCallback(
		async (e) => {
			e.preventDefault();
			setPendingLaunch(true);
			const data = new FormData(e.target);
			const launchDate = new Date(data.get('launch-day'));
			const mission = data.get('mission-name');
			const rocket = data.get('rocket-name');
			const target = data.get('planets-selector');
			const response = await httpSubmitLaunch({
				launchDate,
				mission,
				rocket,
				target,
			});

			// TODO: Set success based on response.
			const success = response.ok;
			if (success) {
				getLaunches();
				setTimeout(() => {
					setPendingLaunch(false);
					onSuccessSound();
				}, 800);
			} else {
				onFailureSound();
			}
		},
		[getLaunches, onSuccessSound, onFailureSound]
	);

	const abortLaunch = useCallback(
		async (id) => {
			try {
				const response = await httpAbortLaunch(id);
				const success = response.ok;

				if (success) {
					await getLaunches(); // Wait for the launches to be fetched
					onAbortSound();
				} else {
					onFailureSound();
				}

				return success;
			} catch (err) {
				console.error(err);
				onFailureSound();
				return false;
			}
		},
		[getLaunches, onAbortSound, onFailureSound]
	);

	return {
		launches,
		isPendingLaunch,
		submitLaunch,
		abortLaunch,
	};
}

export default useLaunches;
