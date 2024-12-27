import request from 'supertest';
import jest from 'jest';
import app from '../../app.js';
import { mongoConnect, mongoDisconnect } from '../../services/mongo.js';

describe('Launches API', () => {
	// jest environment
	beforeAll(async () => {
		await mongoConnect();
	});

	afterAll(async () => {
		await mongoDisconnect();
	});

	describe('Test GET /launches', () => {
		test('It should respond with 200', async () => {
			const response = await request(app)
				.get('/v1/launches/')
				.expect('Content-Type', /json/)
				.expect(200);
		});
	});

	describe('Test POST /launch', () => {
		const completeLaunchData = {
			mission: 'USS Enterprise',
			rocket: 'NCC 1701-D',
			target: 'Kepler-1652 b',
			launchDate: 'January 4, 2028',
		};

		const launchDataWithoutDate = {
			mission: 'USS Enterprise',
			rocket: 'NCC 1701-D',
			target: 'Kepler-1652 b',
		};

		const launchDataWithInvalidDate = {
			mission: 'USS Enterprise',
			rocket: 'NCC 1701-D',
			target: 'Kepler-1652 b',
			launchDate: 'zoot',
		};

		// describe('Launches API', () => {
		// 	beforeAll(() => {
		// 		// Mock the auth middleware
		// 		jest.mock('../../middleware/auth.middleware', () => ({
		// 			checkAuth: (req, res, next) => {
		// 				req.isAuthenticated = () => true; // Mock isAuthenticated to always return true
		// 				next();
		// 			},
		// 		}));
				
		// 		describe('Launches API', () => {
		// 			test('It should respond with 201', async () => {
		// 				const response = await request(app)
		// 					.post('/v1/launches')
		// 					.send(completeLaunchData)
		// 					.expect('Content-Type', /json/)
		// 					.expect(201);
				
		// 				// Additional assertions
		// 			});
				
		// 			test('It should catch missing required properties', async () => {
		// 				const response = await request(app)
		// 					.post('/v1/launches')
		// 					.send(launchDataWithoutDate)
		// 					.expect('Content-Type', /json/)
		// 					.expect(400);
				
		// 				// Additional assertions
		// 			});
				
		// 			test('It should catch invalid dates', async () => {
		// 				const response = await request(app)
		// 					.post('/v1/launches')
		// 					.send(launchDataWithInvalidDate)
		// 					.expect('Content-Type', /json/)
		// 					.expect(400);
				
		// 				// Additional assertions
		// 			});
		// 		})
		// });
	});
});
