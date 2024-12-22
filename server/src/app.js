import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import morgan from 'morgan';
import api from './routes/api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(
	cors({
		origin: 'http://localhost:3000',
	})
);

app.use(morgan('combined'));

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/v1', api); //versioning the api

app.get('/*', (req, res) => {
	// match all routes that are not matched above, so we can get also /history
	res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

export default app;
