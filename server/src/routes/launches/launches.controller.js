import {
	launches,
	scheduleNewLaunch,
	getAllLaunches,
	existsLaunchWithId,
	abortLaunch,
} from '../../models/launches.model.js';

async function httpGetAllLaunches(req, res) {
	return res.status(200).json(await getAllLaunches());
}

async function httpCreateNewLaunch(req, res) {
	const launch = req.body;

	// Check for missing required properties
	if (
		!launch.mission ||
		!launch.rocket ||
		!launch.target ||
		!launch.launchDate
	) {
		return res.status(400).json({
			error: 'Missing required launch property',
		});
	}

	// Check for invalid date
	launch.launchDate = new Date(launch.launchDate);
	if (isNaN(launch.launchDate)) {
		return res.status(400).json({
			error: 'Invalid launch date',
		});
	}

	try {
		const createdLaunch = await scheduleNewLaunch(launch);
		return res.status(201).json(createdLaunch);
	} catch (error) {
		return res.status(400).json({
			error: error.message,
		});
	}
}

async function httpAbortLaunch(req, res) {
	const id = Number(req.params.id);

	const exists = await existsLaunchWithId(id);
	if (!exists) {
		return res.status(404).json({ error: 'launch not found' });
	}

	const aborted = await abortLaunch(id);
	if (!aborted) {
		return res
			.status(400)
			.json({ error: 'launch not aborted, it was already aborted' });
	}
	return res.status(200).json({ ok: true });
}

export { httpGetAllLaunches, httpCreateNewLaunch, httpAbortLaunch };
