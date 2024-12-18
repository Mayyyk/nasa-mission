import app from "./app.js";
import http from "http";
import { loadPlanetsData } from "./models/planets.model.js";

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

await loadPlanetsData();

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
