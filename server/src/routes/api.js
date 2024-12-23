import express from 'express';
import launchesRouter from './launches/launches.router.js';
import planetsRouter from './planets/planets.router.js';

const api = express.Router();

api.use('/launches', launchesRouter);
api.use('/planets', planetsRouter);

export default api;
