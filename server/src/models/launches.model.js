import mongoose from 'mongoose';
import launches from './launches.mongo.js';
import planets from './planets.mongo.js';
import axios from 'axios';


const launch = {
	flightNumber: 100, //flight_number
	mission: 'Kepler Exploration X', //name
	rocket: 'Explorer IS1', //rocket.name
	launchDate: new Date('December 27, 2024'), //data_local
	target: 'Kepler-442 b', //not applicable
	customer: ['ZTM', 'NASA'], //payload.customers
	upcoming: true, //upcoming
	success: true, //success
};

// launches.set(launch.flightNumber, launch); // mapping the number of launch to the launch itself\

async function saveLaunch(launch) {
	const planet = await planets.findOne({
		keplerName: launch.target,
	});

	if (!planet) {
		throw new Error('No matching planet found');
	}

	try {
		await launches.findOneAndUpdate(
			{
				flightNumber: launch.flightNumber,
			},
			launch,
			{
				upsert: true,
			}
		);
	} catch (err) {
		console.error(`Could not save launch ${err}`);
	}
}

async function loadLaunchesData() {
	console.log('Loading launches data...');
	const response = await axios.post('https://api.spacexdata.com/v4/launches/query', {
		query: {},
		options: {
			pagination: false,
			populate: [
				{ path: 'rocket', select: { name: 1 } },
				{ path: 'payload', select: { customers: 1 } },
			],
		},
	});
	const launchDocs = response.data.docs
	// console.log(launchDocs)
	for (const launchDoc of launchDocs) {
		const payloads = launchDoc['payload']
		const customers = payloads.flatMap((payload) => payload['customers'])
		const launch = {
			flightNumber: launchDoc['flight_number'],
			mission: launchDoc['name'],
			rocket: launchDoc['rocket']['name'],
			launchDate: launchDoc['date_local'],
			upcoming: launchDoc['upcoming'],
			success: launchDoc['success'],
			customers: customers,
		}
		// console.log(launch.flightNumber, launch.mission)
	}
}

saveLaunch(launch);

async function existsLaunchWithId(id) {
	return await launches.findOne({
		flightNumber: id,
	});
}

async function getAllLaunches() {
	return await launches.find({}, { id: 0 });
}

async function getLatestFlightNuber() {
	const latestLaunch = await launches.findOne().sort('-flightNumber');

	if (!latestLaunch) {
		return 0;
	}

	return latestLaunch.flightNumber;
}

async function scheduleNewLaunch(launch) {
	const latestFlightNumber = await getLatestFlightNuber();
	const newLaunch = Object.assign(launch, {
		success: true,
		upcoming: true,
		customers: ['majk'],
		flightNumber: latestFlightNumber + 1,
	});

	await saveLaunch(newLaunch);
	return newLaunch;
}

async function abortLaunch(id) {
	const aborted = await launches.updateOne({
		flightNumber: id,
	}, {
		upcoming: false,
		success: false
	});
	// console.log(aborted)
	return aborted.acknowledged ===true && aborted.modifiedCount ===1
}

export {
	launches,
	getAllLaunches,
	scheduleNewLaunch,
	existsLaunchWithId,
	abortLaunch,
	loadLaunchesData,
};
