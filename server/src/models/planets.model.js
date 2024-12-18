import fs from "fs";
import { parse } from "csv-parse";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const habitablePlanets = [];

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
		.on('data', (data) => {
			if (isHabitablePlanet(data)) {
				habitablePlanets.push(data);
			}
		})
        .on('error', (err) => {
            console.log(err)
            reject(err);
        })
        .on('end', () => {
            console.log(habitablePlanets.map((planet) => {
                return planet["kepler_name"]
        }));
        console.log(`${habitablePlanets.length} habitable planets found`)
        resolve();
        });
    });
}


// parse();


export { habitablePlanets, loadPlanetsData };