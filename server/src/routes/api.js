import express from 'express';
import planetsRouter from './planets/planets.router.js';
import launchesRouter from './launches/launches.router.js';

const api = express.Router();

api.use('/v1/planets', planetsRouter);
api.use('/v1/launches', launchesRouter);

export default api;
