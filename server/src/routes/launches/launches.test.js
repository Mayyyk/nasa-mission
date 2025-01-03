import request from 'supertest';
import app from '../../app.js';
import { mongoConnect, mongoDisconnect } from '../../services/mongo.js';
import { loadPlanetsData } from '../../models/planets.model.js';
import { jest } from '@jest/globals';

describe('Launches API', () => {
	beforeAll(async () => {
		await mongoConnect();
		await loadPlanetsData();
	});

	afterAll(async () => {
		await mongoDisconnect();
	});

	describe('Test GET /launches', () => {
		test('It should respond with 200', async () => {
			const response = await request(app)
				.get('/v1/launches')
				.set('Authorization', 'Bearer test-token')
				.expect('Content-Type', /json/)
				.expect(200);
		});
	});

	// describe('Test POST /launch', () => {
	// 	const completeLaunchData = {
	// 		mission: 'USS Enterprise',
	// 		rocket: 'NCC 1701-D',
	// 		target: 'Kepler-1652 b',
	// 		launchDate: 'January 4, 2028',
	// 	};

	// 	const launchDataWithoutDate = {
	// 		mission: 'USS Enterprise',
	// 		rocket: 'NCC 1701-D',
	// 		target: 'Kepler-1652 b',
	// 	};

	// 	const launchDataWithInvalidDate = {
	// 		mission: 'USS Enterprise',
	// 		rocket: 'NCC 1701-D',
	// 		target: 'Kepler-1652 b',
	// 		launchDate: 'zoot',
	// 	};

	// 	test('It should respond with 201 created', async () => {
	// 		const response = await request(app)
	// 			.post('/v1/launches')
	// 			.set('Authorization', 'Bearer test-token')
	// 			.send(completeLaunchData)
	// 			.expect('Content-Type', /json/)
	// 			.expect(201);

	// 		const requestDate = new Date(completeLaunchData.launchDate).valueOf();
	// 		const responseDate = new Date(response.body.launchDate).valueOf();
	// 		expect(responseDate).toBe(requestDate);

	// 		expect(response.body).toMatchObject({
	// 			mission: completeLaunchData.mission,
	// 			rocket: completeLaunchData.rocket,
	// 			target: completeLaunchData.target,
	// 		});
	// 	});

	// 	test('It should catch missing required properties', async () => {
	// 		const response = await request(app)
	// 			.post('/v1/launches')
	// 			.set('Authorization', 'Bearer test-token')
	// 			.send(launchDataWithoutDate)
	// 			.expect('Content-Type', /json/)
	// 			.expect(400);

	// 		expect(response.body).toStrictEqual({
	// 			error: 'Missing required launch property',
	// 		});
	// 	});

	// 	test('It should catch invalid dates', async () => {
	// 		const response = await request(app)
	// 			.post('/v1/launches')
	// 			.set('Authorization', 'Bearer test-token')
	// 			.send(launchDataWithInvalidDate)
	// 			.expect('Content-Type', /json/)
	// 			.expect(400);

	// 		expect(response.body).toStrictEqual({
	// 			error: 'Invalid launch date',
	// 		});
	// 	});
	// });
});
