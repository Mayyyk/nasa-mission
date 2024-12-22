import fs from "fs";
import { parse } from "csv-parse";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import planets from "./planets.mongo.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isHabitablePlanet = (planet) => {
	return (
		planet['koi_disposition'] === 'CONFIRMED' &&
		planet['koi_insol'] > 0.36 &&
		planet['koi_insol'] < 1.11 &&
		planet['koi_prad'] < 1.6
	);
};


function loadPlanetsData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '..', '..', 'src', 'models', 'kepler_data.csv'))
        .pipe(
            parse({
			comment: '#',
			columns: true,
		}))
		.on('data', async (data) => {
			if (isHabitablePlanet(data)) { //insert + update = upsert
                await savePlanet(data)
			}
		})
        .on('error', (err) => {
            console.log(err)
            reject(err);
        })
        .on('end', async () => {
            const countPlanetsFound = (await getAllPlanets()).length;
            console.log(`${countPlanetsFound} habitable planets found`)
            resolve();
        });
    });
}

async function getAllPlanets() {
    return await planets.find({},{keplerName: 1, _id: 0});
}

async function savePlanet (planet) {
try {
    await planets.updateOne({
        keplerName: planet.kepler_name, //matching the shape of the schema
    }, {
        keplerName: planet.kepler_name
    }, {
        upsert: true
    })
} catch (err) {
    console.error(`Could not save planet ${err}`)
}
}

export { loadPlanetsData, getAllPlanets };