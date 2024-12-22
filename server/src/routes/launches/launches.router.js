import express from "express";
import { httpGetAllLaunches, httpCreateNewLaunch, httpAbortLaunch } from "./launches.controller.js";

const launchesRouter = express.Router();

launchesRouter.get("/", httpGetAllLaunches);
launchesRouter.post("/", httpCreateNewLaunch);
launchesRouter.delete("/:id", httpAbortLaunch);

export default launchesRouter;

