import mongoose from 'mongoose';
import launches from './launches.mongo.js';
import planets from './planets.mongo.js';
import axios from 'axios';

// const launch = {
// 	flightNumber: 100, //flight_number
// 	mission: 'Kepler Exploration X', //name
// 	rocket: 'Explorer IS1', //rocket.name
// 	launchDate: new Date('December 27, 2024'), //data_local
// 	target: 'Kepler-442 b', //not applicable
// 	customer: ['ZTM', 'NASA'], //payload.customers
// 	upcoming: true, //upcoming
// 	success: true, //success
// };

// saveLaunch(launch);


async function saveLaunch(launch) {
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

async function populateLaunches() {
	console.log('Loading launches data...');
	const response = await axios.post(
		'https://api.spacexdata.com/v4/launches/query',
		{
			query: {},
			options: {
				pagination: false,
				populate: [
					{
						path: 'rocket',
						select: {
							name: 1,
						},
					},
					{
						path: 'payloads',
						select: {
							customers: 1,
						},
					},
				],
			},
		}
	);

	const launchDocs = response.data.docs;
	for (const launchDoc of launchDocs) {
		const payloads = launchDoc['payloads'] || [];
		const customers = payloads.flatMap((payload) => {
			return payload['customers'] || [];
		});
		
		const launch = {
			flightNumber: launchDoc['flight_number'],
			mission: launchDoc['name'],
			rocket: launchDoc['rocket']['name'],
			launchDate: launchDoc['date_local'],
			customers,
			upcoming: launchDoc['upcoming'],
			success: launchDoc['success'],
		};
		
		console.log(launch.flightNumber, launch.mission)
		await saveLaunch(launch);
	}

}


async function loadLaunchesData() {
	const firstLaunch = await findLaunch({
		flightNumber: 1,
		rocket: 'Falcon 1',
		mission: 'FalconSat',
	})
	if (firstLaunch) {
		console.log('Launch data already loaded');
	} else {
		await populateLaunches();
	}
}

async function findLaunch(filter) {
	return await launches.findOne(filter);
}



async function existsLaunchWithId(id) {
	return await findLaunch({
		flightNumber: id,
	});
}

async function getAllLaunches(skip, limit) {
	return await launches.find({}, { id: 0 }).sort({flightNumber: 1}).skip(skip).limit(limit);
}

async function getLatestFlightNuber() {
	const latestLaunch = await launches.findOne().sort('-flightNumber');

	if (!latestLaunch) {
		return 0;
	}

	return latestLaunch.flightNumber;
}

async function scheduleNewLaunch(launch) {
	const planet = await planets.findOne({
		keplerName: launch.target,
	});

	if (!planet) {
		throw new Error('No matching planet found, you cannot schedule a launch for this planet');
	}

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
	const aborted = await launches.updateOne(
		{
			flightNumber: id,
		},
		{
			upcoming: false,
			success: false,
		}
	);
	// console.log(aborted)
	return aborted.acknowledged === true && aborted.modifiedCount === 1;
}

export {
	launches,
	getAllLaunches,
	scheduleNewLaunch,
	existsLaunchWithId,
	abortLaunch,
	loadLaunchesData,
};
