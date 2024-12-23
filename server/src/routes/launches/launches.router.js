import express from 'express';
import {
	httpGetAllLaunches,
	httpCreateNewLaunch,
	httpAbortLaunch,
} from './launches.controller.js';
import { checkAuth } from '../auth/auth.middleware.js';

const launchesRouter = express.Router();

launchesRouter.get('/', httpGetAllLaunches);
launchesRouter.post('/', checkAuth, httpCreateNewLaunch);
launchesRouter.delete('/:id', checkAuth, httpAbortLaunch);

export default launchesRouter;
