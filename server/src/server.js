import app from "./app.js";
import https from "https";
import { loadPlanetsData } from "./models/planets.model.js";
import { mongoConnect } from "./services/mongo.js";
import { loadLaunchesData } from "./models/launches.model.js";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const PORT = process.env.PORT || 5000;

const server = https.createServer({
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem')
}, app);


async function startServer() {
    await mongoConnect();
    await loadPlanetsData();
    await loadLaunchesData();

    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

startServer();
