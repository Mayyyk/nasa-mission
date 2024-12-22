import app from "./app.js";
import http from "http";
import { loadPlanetsData } from "./models/planets.model.js";
import { mongoConnect } from "./services/mongo.js";
import { loadLaunchesData } from "./models/launches.model.js";

const PORT = process.env.PORT || 5000;


const server = http.createServer(app);


async function startServer() {
    await mongoConnect();
    await loadPlanetsData();
    await loadLaunchesData();

    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

startServer();
